import type { CaseDoc } from "./types";

/**
 * A case must be complete before it can go live on the public site.
 * Returns an error message, or null when it's OK to publish.
 * Shared by the server action (authoritative) and the admin UI (instant UX).
 */
export function validatePublish(input: CaseDoc): string | null {
  if (!input.published) return null;
  if (!input.beforeImage || !input.afterImage) {
    return "發佈前請先上傳「處理前」與「處理後」兩張圖片。";
  }
  if (!(input.title.zh ?? "").trim()) {
    return "發佈前請先填寫中文標題。";
  }
  return null;
}
