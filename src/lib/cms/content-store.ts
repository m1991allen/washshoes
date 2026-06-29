import "server-only";
import { adminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { COLLECTIONS, type ContentDoc } from "./types";
import type { PageKey } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

/**
 * Read every page's content overrides, keyed by page id. Returns {} when
 * Firebase isn't configured so callers (incl. the public site) never break.
 */
export async function getAllContentDocs(): Promise<Record<string, ContentDoc>> {
  if (!isAdminConfigured()) return {};
  const snap = await adminDb().collection(COLLECTIONS.content).get();
  const out: Record<string, ContentDoc> = {};
  snap.forEach((doc) => {
    out[doc.id] = doc.data() as ContentDoc;
  });
  return out;
}

/**
 * Replace one page+locale's content overrides. The editor always submits the
 * full set of fields for that page+locale, so we replace the whole locale map
 * (via `mergeFields`) — that way cleared fields disappear and fall back to the
 * static default, while the other locale on the same document is preserved.
 * Empty values are dropped before writing.
 */
export async function saveContentFields(
  page: PageKey,
  locale: Locale,
  fields: Record<string, string>
): Promise<void> {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    const t = v.trim();
    if (t) clean[k] = t;
  }

  await adminDb()
    .collection(COLLECTIONS.content)
    .doc(page)
    .set({ [locale]: clean }, { mergeFields: [locale] });
}
