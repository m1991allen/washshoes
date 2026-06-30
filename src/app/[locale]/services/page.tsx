import type { Metadata } from "next";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/lib/seo";
import { localizedPath } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { Process } from "@/components/sections/Process";
import { ArrowRight } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(isLocale(locale) ? locale : "zh", "services");
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "zh";
  const dict = await getDictionary(safeLocale);
  const page = dict.pages.services;

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        locale={safeLocale}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.services}
      />

      <section className="section">
        <div className="shell grid gap-5 md:grid-cols-2">
          {dict.services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 2) * 80}>
              <ServiceCard
                service={service}
                locale={safeLocale}
                variant="full"
                includedLabel={page.includedTitle}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <Process dict={dict} />

      <section className="section pt-0">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-[var(--radius)] border border-line bg-surface/60 p-8 text-center md:flex-row md:p-12 md:text-left">
              <div>
                <h2 className="font-serif text-2xl text-ink md:text-3xl">{page.ctaTitle}</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{page.ctaText}</p>
              </div>
              <Link
                href={localizedPath(safeLocale, "/contact")}
                className="btn btn-primary shrink-0"
              >
                {dict.common.bookNow}
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
