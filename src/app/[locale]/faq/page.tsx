import type { Metadata } from "next";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/lib/seo";
import { localizedPath } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { Accordion } from "@/components/Accordion";
import { ArrowRight, LineIcon } from "@/components/icons";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(isLocale(locale) ? locale : "zh", "faq");
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "zh";
  const dict = await getDictionary(safeLocale);
  const page = dict.pages.faq;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        locale={safeLocale}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.faq}
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Accordion items={page.items} />

          <aside className="lg:pl-6">
            <div className="sticky top-28 rounded-[var(--radius)] border border-line bg-surface/60 p-8">
              <h2 className="font-serif text-xl text-ink">
                {safeLocale === "zh" ? "還有其他問題？" : "Still have questions?"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {safeLocale === "zh"
                  ? "歡迎直接透過 LINE 或預約表單與我們聯繫，我們會盡快回覆。"
                  : "Reach out via LINE or the booking form and we'll reply as soon as we can."}
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <Link href={localizedPath(safeLocale, "/contact")} className="btn btn-primary">
                  {dict.common.contactUs}
                  <ArrowRight width={18} height={18} />
                </Link>
                <a
                  href={site.social.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <LineIcon width={18} height={18} />
                  {dict.common.lineConsult}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
