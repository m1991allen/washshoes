/**
 * Client-side image helpers shared by the single-image uploader and the
 * batch uploader. Browser-only (uses FileReader / canvas) — import from
 * client components only.
 */

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

/** Downscale + recompress in the browser before upload (saves bandwidth + storage). */
export async function resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(new Error("讀取檔案失敗"));
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("圖片載入失敗"));
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("瀏覽器不支援圖片處理");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("圖片處理失敗");
  return blob;
}

/** Resize a file and upload it. Returns the public URL, or throws on failure. */
export async function uploadResizedImage(file: File, prefix: string): Promise<string> {
  const blob = await resizeImage(file);
  const fd = new FormData();
  fd.append("file", blob, "image.jpg");
  fd.append("prefix", prefix);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "上傳失敗");
  return data.url;
}
