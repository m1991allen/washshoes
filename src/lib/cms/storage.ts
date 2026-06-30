import "server-only";
import { randomUUID } from "crypto";
import { put, del } from "@vercel/blob";

/**
 * Image storage backed by Vercel Blob (free tier, no Firebase Blaze required).
 *
 * Uploads run server-side from the upload route; reads are public URLs served
 * from Vercel's CDN. Requires BLOB_READ_WRITE_TOKEN in the environment (auto-
 * injected on Vercel once a Blob store is linked; set in .env.local for dev).
 */

function extFor(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/avif") return "avif";
  return "jpg";
}

export async function uploadPublicImage(
  buffer: Buffer,
  contentType: string,
  prefix = "uploads",
): Promise<string> {
  const path = `${prefix}/${randomUUID()}.${extFor(contentType)}`;
  const { url } = await put(path, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return url;
}

/** Best-effort delete of a previously uploaded image. */
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // orphaned blobs are harmless; never fail a save/delete over cleanup
  }
}
