/** 從 FIREBASE_SERVICE_ACCOUNT_KEY 解析出 cert() 需要的欄位。
 *
 *  接受兩種格式：直接貼服務帳戶 JSON，或它的 base64 編碼。
 *  私鑰的換行由 JSON.parse 處理，不必自己 replace("\\n")。
 */
export function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    console.error(
      "✗ 缺少 FIREBASE_SERVICE_ACCOUNT_KEY。請先在 .env.local 填入（見 .env.example）。",
    );
    process.exit(1);
  }
  try {
    const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const { project_id, client_email, private_key } = JSON.parse(json);
    return { projectId: project_id, clientEmail: client_email, privateKey: private_key };
  } catch {
    console.error("✗ FIREBASE_SERVICE_ACCOUNT_KEY 格式錯誤：需要服務帳戶 JSON 或其 base64 編碼。");
    process.exit(1);
  }
}
