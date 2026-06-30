/** 檢查 Cloud Storage bucket 是否存在 / 正確名稱。
 *  用法：node --env-file=.env.local scripts/check-storage.mjs
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}
const storage = getStorage();

const candidates = [
  process.env.FIREBASE_STORAGE_BUCKET,
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  `${projectId}.firebasestorage.app`,
  `${projectId}.appspot.com`,
].filter(Boolean);

console.log("專案：", projectId, "\n候選 bucket：");
for (const name of [...new Set(candidates)]) {
  try {
    const [exists] = await storage.bucket(name).exists();
    console.log(`  ${exists ? "✓ 存在  " : "✗ 不存在"}  ${name}`);
  } catch (e) {
    console.log(`  ✗ 錯誤   ${name}: ${e.message}`);
  }
}
process.exit(0);
