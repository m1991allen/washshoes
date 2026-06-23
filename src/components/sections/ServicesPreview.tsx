import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { localizedPath } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";

export function ServicesPreview({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { servicesPreview, services, common } = dict;

  return (
    <section className="section bg-surface/40">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={servicesPreview.eyebrow}
            title={servicesPreview.title}
            subtitle={servicesPreview.subtitle}
          />
          <Reveal>
            <Link
              href={localizedPath(locale, "/services")}
              className="link-underline inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gold"
            >
              {common.viewAll}
              <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 80}>
              <ServiceCard service={service} locale={locale} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
