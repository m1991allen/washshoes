import type { Metadata } from "next";
import { type Locale, defaultLocale, locales } from "@/i18n/config";
import { site } from "./site";

/**
 * SEO source of truth.
 *
 * Phase 2 (admin panel) will replace `getSeoEntry` with a lookup against a
 * database/CMS so the client can edit titles, descriptions and OG images per
 * page and per language from the dashboard. Pages call `buildMetadata()` and
 * never need to know where the data came from — only this file changes.
 */

export type PageKey =
  | "home"
  | "services"
  | "cases"
  | "about"
  | "faq"
  | "contact";

export interface SeoEntry {
  title: string;
  description: string;
  keywords?: string[];
  /** Absolute or root-relative URL to the social share image. */
  ogImage?: string;
}

/** Path (without locale prefix) for each page, used to build canonical URLs. */
export const pagePaths: Record<PageKey, string> = {
  home: "",
  services: "/services",
  cases: "/cases",
  about: "/about",
  faq: "/faq",
  contact: "/contact",
};

const seoConfig: Record<PageKey, Record<Locale, SeoEntry>> = {
  home: {
    zh: {
      title: "RENU 鞋包精緻護理 | 讓珍藏煥然如新",
      description:
        "RENU 提供專業洗鞋、精品洗包、改色翻新與鞋包修復服務。職人團隊依材質量身工法，深層清潔、去黃還白、結構修復，讓你的珍藏重獲新生。",
      keywords: ["洗鞋", "洗包", "精品包清潔", "球鞋清潔", "皮件改色", "鞋子修復", "包包修復", "桃園洗鞋"],
    },
    en: {
      title: "RENU Premium Shoe & Bag Care | Treasures Renewed",
      description:
        "RENU offers professional shoe cleaning, luxury bag care, recolouring and repair. A specialist team uses material-specific methods to deep clean, de-yellow and restore your treasures.",
      keywords: ["shoe cleaning", "bag cleaning", "luxury bag care", "sneaker cleaning", "leather recolour", "shoe repair", "bag repair", "Taoyuan"],
    },
  },
  services: {
    zh: {
      title: "服務項目",
      description: "完整鞋包護理服務：專業洗鞋、精品洗包、鞋類修復、包類修復、改色翻新與五金保養，依物件材質量身規劃方案。",
      keywords: ["洗鞋服務", "洗包服務", "皮件保養", "改色翻新", "五金除氧化"],
    },
    en: {
      title: "Services",
      description: "Complete shoe & bag care: shoe cleaning, bag cleaning, shoe repair, bag repair, recolouring and hardware care — tailored to each material.",
      keywords: ["shoe cleaning service", "bag cleaning service", "leather care", "recolour", "hardware de-oxidation"],
    },
  },
  cases: {
    zh: {
      title: "案例分享",
      description: "真實處理前後對比案例，涵蓋球鞋清潔、精品包保養、改色翻新與修復，見證職人工法的煥新成果。",
      keywords: ["洗鞋案例", "洗包案例", "改色案例", "鞋包修復前後對比"],
    },
    en: {
      title: "Case Studies",
      description: "Real before-and-after results across sneaker cleaning, luxury bag care, recolouring and repair — proof of our artisan craft.",
      keywords: ["shoe cleaning before after", "bag restoration", "recolour case study"],
    },
  },
  about: {
    zh: {
      title: "關於我們",
      description: "RENU 源自 Renew，師承傳統皮件職人，以實驗室般嚴謹的工法對待每一件珍藏。認識我們的故事、堅持與專業團隊。",
      keywords: ["RENU 關於我們", "鞋包護理職人", "皮件保養專家"],
    },
    en: {
      title: "About",
      description: "RENU stands for Renew. Trained under traditional leather artisans, we treat every treasure with laboratory rigour. Meet our story, values and team.",
      keywords: ["about RENU", "shoe bag care artisans", "leather care experts"],
    },
  },
  faq: {
    zh: {
      title: "常見問題",
      description: "服務工期、收送件方式、報價、保固與改色處理等常見問題解答，託付前先了解 RENU 的服務細節。",
      keywords: ["洗鞋常見問題", "洗包報價", "鞋包護理保固"],
    },
    en: {
      title: "FAQ",
      description: "Answers on turnaround, drop-off and delivery, pricing, guarantees and recolouring — everything to know before entrusting your piece to RENU.",
      keywords: ["shoe cleaning FAQ", "bag care pricing", "shoe bag care guarantee"],
    },
  },
  contact: {
    zh: {
      title: "聯絡我們",
      description: "歡迎透過 LINE、電話或預約表單聯繫 RENU。桃園市八德區義勇街 48 號，每日 11:30–20:30 為你服務。",
      keywords: ["RENU 聯絡", "桃園洗鞋預約", "洗包諮詢"],
    },
    en: {
      title: "Contact",
      description: "Reach RENU via LINE, phone or our booking form. No. 48, Yiyong St., Bade Dist., Taoyuan City — open daily 11:30–20:30.",
      keywords: ["contact RENU", "Taoyuan shoe cleaning booking", "bag care enquiry"],
    },
  },
};

export function getSeoEntry(locale: Locale, page: PageKey): SeoEntry {
  return seoConfig[page][locale] ?? seoConfig[page][defaultLocale];
}

const ogLocale: Record<Locale, string> = {
  zh: "zh_TW",
  en: "en_US",
};

/**
 * Build a full Next.js Metadata object for a localized page, including
 * canonical URL, hreflang alternates, Open Graph and Twitter cards.
 *
 * The social share image is supplied by the `opengraph-image` file convention
 * (see app/[locale]/opengraph-image.tsx). If an SeoEntry sets `ogImage`, it
 * overrides that — handy for per-page art directed from the Phase 2 admin.
 */
export function buildMetadata(locale: Locale, page: PageKey): Metadata {
  const entry = getSeoEntry(locale, page);
  const path = pagePaths[page];
  const canonical = `${site.url}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l === "zh" ? "zh-TW" : "en"] = `${site.url}/${l}${path}`;
  }
  languages["x-default"] = `${site.url}/${defaultLocale}${path}`;

  const ogImages = entry.ogImage
    ? [{ url: entry.ogImage, width: 1200, height: 630, alt: entry.title }]
    : undefined;

  return {
    title: page === "home" ? { absolute: entry.title } : entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: site.fullName,
      title: entry.title,
      description: entry.description,
      url: canonical,
      locale: ogLocale[locale],
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      ...(entry.ogImage ? { images: [entry.ogImage] } : {}),
    },
  };
}
