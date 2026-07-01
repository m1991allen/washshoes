import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import type { HomeHeroDoc } from "@/lib/cms/types";
import { localizedPath } from "@/lib/utils";
import { Frame } from "@/components/Frame";
import { Counter } from "@/components/Counter";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { ShoeCleanIcon, BagCleanIcon, ArrowRight } from "@/components/icons";

export function Hero({
  dict,
  locale,
  media,
}: {
  dict: Dictionary;
  locale: Locale;
  media?: HomeHeroDoc;
}) {
  const { hero } = dict;
  const images = (media?.images ?? []).filter(Boolean);
  const hasImages = images.length > 0;
  // Custom caption falls back to the brand tagline of the current locale.
  const caption = media?.caption?.[locale]?.trim() || dict.brand.tagline;

  return (
    <section className="bg-grain relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(200,168,106,0.18), transparent 70%)" }}
      />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="relative z-10">
          <span className="eyebrow reveal" data-visible="true">
            {hero.eyebrow}
          </span>
          <h1 className="display mt-6 font-serif text-ink">
            {hero.titleLine1}
            <br />
            <span className="gold-text italic">{hero.titleLine2}</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={localizedPath(locale, "/contact")} className="btn btn-primary">
              {hero.ctaPrimary}
              <ArrowRight width={18} height={18} />
            </Link>
            <Link href={localizedPath(locale, "/cases")} className="btn btn-outline">
              {hero.ctaSecondary}
            </Link>
          </div>

          {/* Stats */}
          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-3xl text-ink md:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-1 text-xs tracking-wide text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative">
          <Frame tone="gold" icon={<ShoeCleanIcon />} className="aspect-[4/5] w-full">
            {hasImages ? (
              <HeroVisual
                images={images}
                autoplay={media?.autoplay ?? true}
                intervalMs={media?.intervalMs}
              />
            ) : null}
          </Frame>
          {/* floating accent card */}
          <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-2xl border border-line bg-base/80 p-4 backdrop-blur-md sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold">
                <BagCleanIcon width={20} height={20} />
              </span>
              <div>
                <p className="whitespace-pre-wrap text-balance font-serif text-sm text-ink">
                  {caption}
                </p>
              </div>
            </div>
          </div>
          {/* corner ticks */}
          <span className="absolute -right-3 -top-3 h-10 w-10 border-r border-t border-gold/40" />
          <span className="absolute -bottom-3 right-10 h-10 w-10 border-b border-r border-gold/40" />
        </div>
      </div>
    </section>
  );
}
