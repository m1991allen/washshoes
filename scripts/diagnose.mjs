/** 後台環境健檢：驗證服務帳戶金鑰、使用者/角色、Firestore 連線。
 *  用法：node --env-file=.env.local scripts/diagnose.mjs [email]
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const email = process.argv[2] || "allen.liu.05044@gmail.com";
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

console.log("projectId    :", projectId);
console.log("clientEmail  :", clientEmail);
console.log("privateKey   :", privateKey ? `present (${privateKey.slice(0, 27)}…)` : "MISSING");

if (!projectId || !clientEmail || !privateKey) {
  console.error("\n✗ 缺少 FIREBASE_* 環境變數");
  process.exit(1);
}

try {
  if (!getApps().length) initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  console.log("\n✓ Admin SDK 初始化成功（金鑰格式正確）");
} catch (e) {
  console.error("\n✗ Admin SDK 初始化失敗：", e.message);
  process.exit(1);
}

try {
  const u = await getAuth().getUserByEmail(email);
  console.log(`✓ 使用者存在：${email}  uid=${u.uid}  claims=${JSON.stringify(u.customClaims || {})}`);
} catch (e) {
  console.error(`✗ 找不到使用者 ${email}：`, e.errorInfo?.code || e.message);
}

try {
  const snap = await getFirestore().collection("seo").limit(1).get();
  console.log(`✓ Firestore 連線成功（seo 集合目前 ${snap.size} 筆）`);
} catch (e) {
  console.error("✗ Firestore 連線失敗：", e.message);
}

process.exit(0);
