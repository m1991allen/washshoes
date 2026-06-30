import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { localizedPath } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Frame } from "@/components/Frame";
import { BagCleanIcon, CheckIcon, ArrowRight } from "@/components/icons";

export function Intro({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { intro } = dict;

  return (
    <section className="section">
      <div className="shell grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <Frame tone="default" icon={<BagCleanIcon />} className="aspect-[5/4] w-full" />
          <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-line bg-surface/90 px-6 py-5 backdrop-blur md:block">
            <p className="font-serif text-4xl text-gold">8</p>
            <p className="mt-1 text-xs tracking-wide text-muted">
              {locale === "zh" ? "年職人經驗" : "Years of Craft"}
            </p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow">{intro.eyebrow}</span>
            <h2 className="heading mt-5 whitespace-pre-line text-ink">{intro.title}</h2>
          </Reveal>
          <div className="mt-6 space-y-4">
            {intro.paragraphs.map((p, i) => (
              <Reveal
                as="p"
                key={i}
                delay={i * 80}
                className="text-base leading-relaxed text-muted"
              >
                {p}
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {intro.points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-ink">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-gold">
                    <CheckIcon width={12} height={12} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={localizedPath(locale, "/about")}
              className="link-underline mt-9 inline-flex items-center gap-2 text-sm font-medium text-gold"
            >
              {intro.cta}
              <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
