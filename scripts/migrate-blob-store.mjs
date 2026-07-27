/** 把圖片從舊的 Vercel Blob store 搬到新的，並改寫 Firestore 內引用的 URL。
 *
 *  一次性遷移用（舊 store: renu-images → 新 store: washshoes-blob）。
 *  Blob URL 的網域含 store id，換 store 一定會換 URL，所以搬完必須同步改資料。
 *
 *  用法：
 *    node --env-file=.env.local scripts/migrate-blob-store.mjs           # 預演（不寫入）
 *    node --env-file=.env.local scripts/migrate-blob-store.mjs --apply   # 實際執行
 *
 *  需要的環境變數：
 *    BLOB_OLD_TOKEN  舊 store 的 read-write token（沒設就用 BLOB_READ_WRITE_TOKEN）
 *    BLOB_NEW_TOKEN  新 store 的 read-write token
 *    FIREBASE_*      同 .env.local 既有設定
 */
import { list, put } from "@vercel/blob";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apply = process.argv.includes("--apply");
const oldToken = process.env.BLOB_OLD_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
const newToken = process.env.BLOB_NEW_TOKEN;

/** token 格式為 vercel_blob_rw_<storeId>_<secret>，取 storeId 做防呆。 */
const storeIdOf = (token) => token?.split("_")[3] ?? "";

if (!oldToken || !newToken) {
  console.error("缺少 BLOB_OLD_TOKEN 或 BLOB_NEW_TOKEN");
  process.exit(1);
}
if (storeIdOf(oldToken) === storeIdOf(newToken)) {
  console.error("新舊 token 指向同一個 store，不需要遷移");
  process.exit(1);
}

console.log(`模式：${apply ? "實際執行" : "預演（不寫入）"}`);
console.log(`舊 store：${storeIdOf(oldToken)}　→　新 store：${storeIdOf(newToken)}\n`);

// ---- 1. 複製 blob ----------------------------------------------------------
const { blobs } = await list({ token: oldToken, limit: 1000 });
console.log(`舊 store 共 ${blobs.length} 個檔案`);

/** 舊 URL → 新 URL */
const urlMap = new Map();
for (const blob of blobs) {
  if (apply) {
    const res = await fetch(blob.url);
    if (!res.ok) {
      console.log(`  ✗ 下載失敗 ${blob.pathname}（${res.status}）`);
      continue;
    }
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    const { url } = await put(blob.pathname, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      allowOverwrite: true,
      token: newToken,
    });
    urlMap.set(blob.url, url);
    console.log(`  ✓ ${blob.pathname}`);
  } else {
    urlMap.set(blob.url, `（新 URL，實際執行時產生）${blob.pathname}`);
    console.log(`  · ${blob.pathname}`);
  }
}

// ---- 2. 改寫 Firestore 內的 URL --------------------------------------------
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

/** 遞迴把資料裡所有命中的舊 URL 換成新 URL，回傳 [新值, 換了幾個]。 */
function rewrite(value) {
  if (typeof value === "string") {
    const mapped = urlMap.get(value);
    return mapped ? [mapped, 1] : [value, 0];
  }
  if (Array.isArray(value)) {
    let n = 0;
    const out = value.map((v) => {
      const [nv, c] = rewrite(v);
      n += c;
      return nv;
    });
    return [out, n];
  }
  if (value && typeof value === "object") {
    let n = 0;
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const [nv, c] = rewrite(v);
      n += c;
      out[k] = nv;
    }
    return [out, n];
  }
  return [value, 0];
}

console.log("\nFirestore：");
let totalRefs = 0;
for (const col of ["cases", "content", "settings", "seo"]) {
  const snap = await db.collection(col).get();
  for (const doc of snap.docs) {
    const [next, count] = rewrite(doc.data());
    if (!count) continue;
    totalRefs += count;
    console.log(`  ${apply ? "✓" : "·"} ${col}/${doc.id} — ${count} 個 URL`);
    if (apply) await doc.ref.set(next);
  }
}
console.log(`\n共 ${blobs.length} 個檔案、${totalRefs} 個 Firestore URL 參照`);
if (!apply) console.log("這是預演。確認無誤後加上 --apply 實際執行。");
process.exit(0);
