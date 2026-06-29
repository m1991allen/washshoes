import "server-only";
import { cache } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/zh";
import type { PageKey } from "@/lib/seo";
import { getAllContentDocs } from "@/lib/cms/content-store";
import { CONTENT_FIELDS, fieldKey, setByPath } from "@/lib/cms/content-fields";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  zh: () => import("./dictionaries/zh").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

/** The raw, static dictionary with no CMS overrides applied. */
export function loadStaticDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.zh)();
}

/**
 * The dictionary used by the public site: static defaults with any content
 * overrides from Firestore merged on top. Wrapped in `cache` so the Firestore
 * read happens at most once per request per locale. Any failure (missing env,
 * network) falls back to the static dictionary — the public site never breaks.
 */
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const base = await loadStaticDictionary(locale);
  try {
    const docs = await getAllContentDocs();
    if (Object.keys(docs).length === 0) return base;

    const merged = structuredClone(base) as Dictionary;
    for (const page of Object.keys(CONTENT_FIELDS) as PageKey[]) {
      const overrides = docs[page]?.[locale];
      if (!overrides) continue;
      for (const f of CONTENT_FIELDS[page]) {
        const value = overrides[fieldKey(f.path)];
        if (typeof value === "string" && value.length > 0) {
          setByPath(merged as unknown as Record<string, unknown>, f.path, value);
        }
      }
    }
    return merged;
  } catch {
    return base;
  }
});

export type { Dictionary };
