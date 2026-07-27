/** 把 Firestore 內還指向「舊 Vercel Blob store」的圖片搬到目前的 store，並改寫 URL。
 *
 *  一次性遷移用。Blob URL 的網域含 store id（`<storeId>.public.blob.vercel-storage.com`），
 *  換 store 一定會換 URL，所以搬完必須同步改資料。
 *
 *  只需要**新** store 的 token：舊 store 是 public，圖片用 URL 就能直接抓。
 *  只搬 Firestore 真正引用到的圖 —— 沒被引用的孤兒檔案（換圖沒清掉的舊圖）不搬。
 *
 *  用法：
 *    node --env-file=.env.local scripts/migrate-blob-store.mjs           # 預演（不寫入）
 *    node --env-file=.env.local scripts/migrate-blob-store.mjs --apply   # 實際執行
 */
import { put } from "@vercel/blob";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apply = process.argv.includes("--apply");
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("缺少 BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

// token 格式為 vercel_blob_rw_<storeId>_<secret>；公開網域是 storeId 的小寫。
const currentHost = `${token.split("_")[3].toLowerCase()}.public.blob.vercel-storage.com`;
console.log(`模式：${apply ? "實際執行" : "預演（不寫入）"}`);
console.log(`目前 store：${currentHost}\n`);

// ---- 1. 連上 Firestore，找出所有指向「別的 store」的圖片 URL ----------------
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}
const db = getFirestore();

const BLOB_URL = /^https:\/\/([a-z0-9]+)\.public\.blob\.vercel-storage\.com\/(.+)$/;
/** 這個字串是不是「需要搬家」的舊 blob URL？ */
const isStale = (v) => typeof v === "string" && BLOB_URL.test(v) && !v.includes(currentHost);

/** 遞迴走訪 Firestore 文件資料，對每個字串呼叫 visit（可回傳新值）。 */
function walk(value, visit) {
  if (typeof value === "string") return visit(value);
  if (Array.isArray(value)) return value.map((v) => walk(v, visit));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, visit)]));
  }
  return value;
}

const docs = [];
const staleUrls = new Set();
for (const col of ["cases", "content", "settings", "seo"]) {
  const snap = await db.collection(col).get();
  for (const doc of snap.docs) {
    const found = [];
    walk(doc.data(), (s) => {
      if (isStale(s)) found.push(s);
      return s;
    });
    if (!found.length) continue;
    found.forEach((u) => staleUrls.add(u));
    docs.push({ ref: doc.ref, path: `${col}/${doc.id}`, count: found.length });
  }
}

if (!staleUrls.size) {
  console.log("沒有需要搬家的圖片，Firestore 內的 URL 都已指向目前的 store。");
  process.exit(0);
}
console.log(`需要搬家的圖片：${staleUrls.size} 張`);

// ---- 2. 抓下舊圖、寫進新 store ---------------------------------------------
/** 舊 URL → 新 URL */
const urlMap = new Map();
for (const oldUrl of staleUrls) {
  const pathname = oldUrl.match(BLOB_URL)[2];
  if (!apply) {
    console.log(`  · ${pathname}`);
    continue;
  }
  const res = await fetch(oldUrl);
  if (!res.ok) {
    console.log(`  ✗ 下載失敗 ${pathname}（${res.status}）`);
    continue;
  }
  const { url } = await put(pathname, Buffer.from(await res.arrayBuffer()), {
    access: "public",
    contentType: res.headers.get("content-type") || "image/jpeg",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    allowOverwrite: true,
    token,
  });
  urlMap.set(oldUrl, url);
  console.log(`  ✓ ${pathname}`);
}

// ---- 3. 改寫 Firestore 內的 URL --------------------------------------------
console.log("\nFirestore：");
for (const { ref, path, count } of docs) {
  console.log(`  ${apply ? "✓" : "·"} ${path} — ${count} 個 URL`);
  if (!apply) continue;
  const snap = await ref.get();
  await ref.set(walk(snap.data(), (s) => urlMap.get(s) ?? s));
}

console.log(`\n共 ${staleUrls.size} 張圖、${docs.length} 份文件`);
if (!apply) console.log("這是預演。確認無誤後加上 --apply 實際執行。");
process.exit(0);
