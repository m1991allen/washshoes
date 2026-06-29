import { requireUser } from "@/lib/auth/session";
import { getAllSeoDocs } from "@/lib/cms/seo-store";
import { getSeoEntry, pagePaths, type PageKey } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/config";
import { SeoEditor, type SeoPageData } from "@/components/admin/SeoEditor";

export const dynamic = "force-dynamic";

const PAGE_LABELS: Record<PageKey, string> = {
  home: "首頁",
  services: "服務項目",
  cases: "案例分享",
  about: "關於我們",
  faq: "常見問題",
  contact: "聯絡我們",
};

export default async function SeoAdminPage() {
  await requireUser(["admin", "editor"]);
  const overrides = await getAllSeoDocs();

  const pages: SeoPageData[] = (Object.keys(pagePaths) as PageKey[]).map((key) => {
    const localeData = {} as SeoPageData["locales"];
    for (const loc of locales as readonly Locale[]) {
      const def = getSeoEntry(loc, key);
      const ov = overrides[key]?.[loc] ?? {};
      localeData[loc] = {
        default: {
          title: def.title,
          description: def.description,
          keywords: def.keywords ?? [],
          ogImage: def.ogImage ?? "",
        },
        override: {
          title: ov.title ?? "",
          description: ov.description ?? "",
          keywords: ov.keywords ?? [],
          ogImage: ov.ogImage ?? "",
        },
      };
    }
    return { key, label: PAGE_LABELS[key], path: pagePaths[key], locales: localeData };
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">SEO 設定</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        逐頁、逐語系編輯搜尋引擎與社群分享用的標籤。欄位留白會自動套用內建預設值（即 placeholder 顯示的內容）。
      </p>
      <div className="mt-8">
        <SeoEditor pages={pages} />
      </div>
    </div>
  );
}
