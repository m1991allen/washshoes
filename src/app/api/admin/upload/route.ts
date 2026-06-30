import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { uploadPublicImage } from "@/lib/cms/storage";

// firebase-admin requires the Node.js runtime.
export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB hard cap (client resizes well below this)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** POST multipart/form-data { file, prefix? } → { url }. Admin/editor only. */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "找不到檔案" }, { status: 400 });
  }
  const contentType = file.type || "image/jpeg";
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "僅接受 JPG / PNG / WebP 圖片" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "檔案過大（上限 8MB）" }, { status: 413 });
  }

  // Restrict prefix to a safe slug to avoid path traversal.
  const rawPrefix = String(form.get("prefix") ?? "uploads");
  const prefix = /^[a-z0-9/_-]+$/i.test(rawPrefix) ? rawPrefix : "uploads";

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadPublicImage(buffer, contentType, prefix);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "上傳失敗" },
      { status: 500 },
    );
  }
}
