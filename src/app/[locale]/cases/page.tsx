import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CasesGrid } from "@/components/CasesGrid";
import { CTA } from "@/components/sections/CTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(isLocale(locale) ? locale : "zh", "cases");
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "zh";
  const dict = await getDictionary(safeLocale);
  const page = dict.pages.cases;

  // Build filter tabs from the service categories actually present in the cases.
  const present = new Set(page.items.map((c) => c.category));
  const filters = [
    { id: "all", label: page.filterAll },
    ...dict.services
      .filter((s) => present.has(s.id))
      .map((s) => ({ id: s.id, label: s.name })),
  ];

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        locale={safeLocale}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.cases}
      />

      <section className="section">
        <div className="shell">
          <CasesGrid
            items={page.items}
            filters={filters}
            beforeLabel={page.before}
            afterLabel={page.after}
          />
          <p className="mt-10 text-xs text-faint">
            {safeLocale === "zh"
              ? "＊ 拖曳滑桿比較前後差異。圖為示意，實際成果以委託物件為準。"
              : "* Drag the slider to compare before & after. Images are illustrative placeholders."}
          </p>
        </div>
      </section>

      <CTA dict={dict} locale={safeLocale} />
    </>
  );
}
