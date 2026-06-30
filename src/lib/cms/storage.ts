import "server-only";
import { randomUUID } from "crypto";
import { adminStorage } from "@/lib/firebase/admin";

const bucketName =
  process.env.FIREBASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

function extFor(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/avif") return "avif";
  return "jpg";
}

/**
 * Upload an image buffer to Cloud Storage and return a public, tokenless
 * download URL. Public read is granted by storage.rules; writes only happen
 * here, server-side, via the Admin SDK (which bypasses rules).
 *
 * Reused by case photos and (later) OG / hero images — vary `prefix`.
 */
export async function uploadPublicImage(
  buffer: Buffer,
  contentType: string,
  prefix = "uploads"
): Promise<string> {
  const path = `${prefix}/${randomUUID()}.${extFor(contentType)}`;
  const file = adminStorage().bucket(bucketName).file(path);
  await file.save(buffer, {
    contentType,
    resumable: false,
    metadata: { cacheControl: "public, max-age=31536000, immutable" },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    path
  )}?alt=media`;
}

/** Best-effort delete of an image previously returned by uploadPublicImage. */
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const m = url.match(/\/o\/([^?]+)/);
    if (!m) return;
    const path = decodeURIComponent(m[1]);
    await adminStorage().bucket(bucketName).file(path).delete({ ignoreNotFound: true });
  } catch {
    // orphaned files are harmless; never fail a save/delete over cleanup
  }
}
