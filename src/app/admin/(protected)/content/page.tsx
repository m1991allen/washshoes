import { requireUser } from "@/lib/auth/session";
import { loadStaticDictionary } from "@/i18n/getDictionary";
import { getAllContentDocs } from "@/lib/cms/content-store";
import { getHomeHero } from "@/lib/cms/home-hero-store";
import { CONTENT_FIELDS, fieldKey, getByPath } from "@/lib/cms/content-fields";
import { pagePaths, type PageKey } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/config";
import { ContentEditor, type ContentPageData } from "@/components/admin/ContentEditor";
import type { Dictionary } from "@/i18n/dictionaries/zh";

export const dynamic = "force-dynamic";

const PAGE_LABELS: Record<PageKey, string> = {
  home: "首頁",
  services: "服務項目",
  cases: "案例分享",
  about: "關於我們",
  faq: "常見問題",
  contact: "聯絡我們",
};

export default async function ContentAdminPage() {
  await requireUser(["admin", "editor"]);

  const overrides = await getAllContentDocs();
  const homeHero = await getHomeHero();
  const dicts = {} as Record<Locale, Dictionary>;
  for (const loc of locales as readonly Locale[]) {
    dicts[loc] = await loadStaticDictionary(loc);
  }

  const pages: ContentPageData[] = (Object.keys(CONTENT_FIELDS) as PageKey[]).map((key) => {
    const localeData = {} as ContentPageData["locales"];
    for (const loc of locales as readonly Locale[]) {
      localeData[loc] = CONTENT_FIELDS[key].map((f) => ({
        key: fieldKey(f.path),
        label: f.label,
        multiline: !!f.multiline,
        group: f.group,
        default: getByPath(dicts[loc], f.path),
        override: overrides[key]?.[loc]?.[fieldKey(f.path)] ?? "",
      }));
    }
    return { key, label: PAGE_LABELS[key], path: pagePaths[key], locales: localeData };
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">內容管理</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        逐頁、逐語系編輯網站主要文字。欄位留白會自動套用內建預設值（即 placeholder
        顯示的內容）。儲存後前台頁面會自動更新。
      </p>
      <div className="mt-8">
        <ContentEditor
          pages={pages}
          homeHero={{
            initial: homeHero,
            captionDefaults: {
              zh: dicts.zh.brand.tagline,
              en: dicts.en.brand.tagline,
            },
          }}
        />
      </div>
    </div>
  );
}
