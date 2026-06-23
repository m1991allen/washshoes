import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { localizedPath } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { BeforeAfter } from "@/components/BeforeAfter";
import { serviceIcons, ArrowRight } from "@/components/icons";

export function CasesPreview({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { casesPreview } = dict;
  const cases = dict.pages.cases.items.slice(0, 3);

  return (
    <section className="section bg-surface/40">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={casesPreview.eyebrow}
            title={casesPreview.title}
            subtitle={casesPreview.subtitle}
          />
          <Reveal>
            <Link
              href={localizedPath(locale, "/cases")}
              className="link-underline inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gold"
            >
              {casesPreview.cta}
              <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => {
            const Icon = serviceIcons[c.category] ?? serviceIcons["shoe-cleaning"];
            return (
              <Reveal key={c.id} delay={i * 90}>
                <BeforeAfter
                  icon={<Icon />}
                  beforeLabel={casesPreview.before}
                  afterLabel={casesPreview.after}
                />
                <h3 className="mt-4 font-serif text-lg text-ink">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.desc}</p>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-faint md:text-left">
          {locale === "zh"
            ? "＊ 拖曳滑桿即可比較前後差異（示意圖，實際成果以委託物件為準）"
            : "* Drag the slider to compare before & after (illustrative placeholder)."}
        </p>
      </div>
    </section>
  );
}
