/**
 * 建立 / 更新第一位後台管理員。
 *
 * 前置：先在 .env.local 填好 FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL /
 *       FIREBASE_PRIVATE_KEY（服務帳戶金鑰），並在 Firebase Authentication
 *       啟用「電子郵件/密碼」。
 *
 * 用法：
 *   npm run seed:admin -- <email> <password> [顯示名稱] [角色 admin|editor]
 * 例：
 *   npm run seed:admin -- owner@renu.com "MyStrongPass123" "店長" admin
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [, , email, password, displayName = "管理員", role = "admin"] = process.argv;

if (!email || !password) {
  console.error(
    "用法: npm run seed:admin -- <email> <password> [顯示名稱] [角色 admin|editor]"
  );
  process.exit(1);
}
if (!["admin", "editor"].includes(role)) {
  console.error('角色只能是 "admin" 或 "editor"');
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "缺少 FIREBASE_* 環境變數。請先在 .env.local 填入服務帳戶金鑰（見 .env.example）。"
  );
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}
const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password, displayName });
  console.log("• 使用者已存在 → 已更新密碼與顯示名稱：", email);
} catch {
  user = await auth.createUser({ email, password, displayName });
  console.log("• 已建立使用者：", email);
}

await auth.setCustomUserClaims(user.uid, { role });
console.log(`• 已設定角色：role=${role}`);
console.log(`• uid=${user.uid}`);

// Firestore 寫入為非致命：就算資料庫還沒建立，帳號仍可正常建立/登入。
try {
  await db.collection("users").doc(user.uid).set(
    { uid: user.uid, email, displayName, role, createdAt: Date.now() },
    { merge: true }
  );
  console.log("• 已寫入 Firestore users 紀錄");
} catch (e) {
  console.warn("• （可略過）Firestore 尚未就緒，略過 users 紀錄寫入：", e.message);
}

console.log("\n✅ 完成！現在可用這組帳密登入 /admin/login");
process.exit(0);
