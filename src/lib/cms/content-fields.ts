/**
 * Content management — editable field map.
 *
 * Curated list of "main text" fields (single strings) per page that the admin
 * can override. Array-type content (service list, testimonials, process steps,
 * case items…) is intentionally out of scope for this version.
 *
 * Each field is addressed by a dot `path` into the static Dictionary; the admin
 * default/placeholder is read from that path, and the saved override is merged
 * back onto it in `getDictionary`. Firestore can't use dots in field names, so
 * overrides are stored under `fieldKey(path)` (dots → "__").
 */
import type { PageKey } from "@/lib/seo";

export interface ContentField {
  /** Dot-path into the Dictionary, e.g. "hero.subtitle". */
  path: string;
  /** Human label shown in the admin. */
  label: string;
  /** Render as a multi-line textarea instead of a single-line input. */
  multiline?: boolean;
  /** Optional sub-heading used to group fields in the editor. */
  group?: string;
}

/** Firestore-safe key for a dot-path (Firestore field names can't contain "."). */
export const fieldKey = (path: string): string => path.replace(/\./g, "__");

/** Read a nested string value from an object by dot-path (missing → ""). */
export function getByPath(obj: unknown, path: string): string {
  const v = path
    .split(".")
    .reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
  return typeof v === "string" ? v : "";
}

/** Write a string value into an object by dot-path (creates objects as needed). */
export function setByPath(obj: Record<string, unknown>, path: string, value: string): void {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

export const CONTENT_FIELDS: Record<PageKey, ContentField[]> = {
  home: [
    { group: "首頁主視覺", path: "hero.eyebrow", label: "標籤" },
    { group: "首頁主視覺", path: "hero.titleLine1", label: "主標題 第一行" },
    { group: "首頁主視覺", path: "hero.titleLine2", label: "主標題 第二行" },
    { group: "首頁主視覺", path: "hero.subtitle", label: "副標", multiline: true },
    { group: "首頁主視覺", path: "hero.ctaPrimary", label: "主要按鈕" },
    { group: "首頁主視覺", path: "hero.ctaSecondary", label: "次要按鈕" },

    { group: "品牌理念", path: "intro.eyebrow", label: "標籤" },
    { group: "品牌理念", path: "intro.title", label: "標題", multiline: true },
    { group: "品牌理念", path: "intro.cta", label: "按鈕" },

    { group: "服務預覽", path: "servicesPreview.eyebrow", label: "標籤" },
    { group: "服務預覽", path: "servicesPreview.title", label: "標題" },
    { group: "服務預覽", path: "servicesPreview.subtitle", label: "副標", multiline: true },

    { group: "服務流程", path: "process.eyebrow", label: "標籤" },
    { group: "服務流程", path: "process.title", label: "標題" },
    { group: "服務流程", path: "process.subtitle", label: "副標", multiline: true },

    { group: "案例預覽", path: "casesPreview.eyebrow", label: "標籤" },
    { group: "案例預覽", path: "casesPreview.title", label: "標題" },
    { group: "案例預覽", path: "casesPreview.subtitle", label: "副標", multiline: true },
    { group: "案例預覽", path: "casesPreview.cta", label: "按鈕" },

    { group: "特色", path: "features.eyebrow", label: "標籤" },
    { group: "特色", path: "features.title", label: "標題" },

    { group: "客戶見證", path: "testimonials.eyebrow", label: "標籤" },
    { group: "客戶見證", path: "testimonials.title", label: "標題" },

    { group: "結尾 CTA", path: "cta.title", label: "標題" },
    { group: "結尾 CTA", path: "cta.subtitle", label: "副標", multiline: true },
    { group: "結尾 CTA", path: "cta.primary", label: "主要按鈕" },
    { group: "結尾 CTA", path: "cta.secondary", label: "次要按鈕" },
  ],
  services: [
    { path: "pages.services.eyebrow", label: "標籤" },
    { path: "pages.services.title", label: "標題" },
    { path: "pages.services.subtitle", label: "副標", multiline: true },
    { path: "pages.services.includedTitle", label: "服務內容 小標" },
    { path: "pages.services.ctaTitle", label: "頁尾 CTA 標題" },
    { path: "pages.services.ctaText", label: "頁尾 CTA 說明", multiline: true },
  ],
  cases: [
    { path: "pages.cases.eyebrow", label: "標籤" },
    { path: "pages.cases.title", label: "標題" },
    { path: "pages.cases.subtitle", label: "副標", multiline: true },
    { path: "pages.cases.filterAll", label: "「全部」篩選文字" },
  ],
  about: [
    { path: "pages.about.eyebrow", label: "標籤" },
    { path: "pages.about.title", label: "標題" },
    { path: "pages.about.lead", label: "前言", multiline: true },
    { path: "pages.about.valuesTitle", label: "堅持 小標" },
    { path: "pages.about.statsTitle", label: "數據 小標" },
  ],
  faq: [
    { path: "pages.faq.eyebrow", label: "標籤" },
    { path: "pages.faq.title", label: "標題" },
    { path: "pages.faq.subtitle", label: "副標", multiline: true },
  ],
  contact: [
    { path: "pages.contact.eyebrow", label: "標籤" },
    { path: "pages.contact.title", label: "標題" },
    { path: "pages.contact.subtitle", label: "副標", multiline: true },
    { path: "pages.contact.infoTitle", label: "聯絡資訊 小標" },
    { path: "pages.contact.lineTitle", label: "LINE 區 標題" },
    { path: "pages.contact.lineText", label: "LINE 區 說明", multiline: true },
    { path: "pages.contact.formTitle", label: "表單 小標" },
  ],
};
