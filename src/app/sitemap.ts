import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales } from "@/i18n/config";
import { pagePaths, type PageKey } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = Object.keys(pagePaths) as PageKey[];

  return locales.flatMap((locale) =>
    pages.map((page) => {
      const path = pagePaths[page];
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l === "zh" ? "zh-TW" : "en"] = `${site.url}/${l}${path}`;
      }
      return {
        url: `${site.url}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: page === "home" ? 1 : 0.7,
        alternates: { languages },
      };
    })
  );
}
