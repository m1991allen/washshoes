import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Frame } from "@/components/Frame";
import { Counter } from "@/components/Counter";
import { CTA } from "@/components/sections/CTA";
import { ShoeRepairIcon } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(isLocale(locale) ? locale : "zh", "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "zh";
  const dict = await getDictionary(safeLocale);
  const page = dict.pages.about;

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.lead}
        locale={safeLocale}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.about}
      />

      {/* Story */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <Frame tone="gold" icon={<ShoeRepairIcon />} className="aspect-[4/5] w-full lg:sticky lg:top-28" />
          </Reveal>
          <div className="space-y-6">
            {page.story.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 70} className="text-base leading-loose text-muted md:text-lg">
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-surface/40 pt-0 md:pt-0">
        <div className="shell pt-20 md:pt-28">
          <Reveal>
            <span className="eyebrow is-centered mx-auto block w-fit">{page.valuesTitle}</span>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {page.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70} className="bg-base">
                <div className="h-full bg-base p-8">
                  <span className="font-serif text-2xl text-gold/70">0{i + 1}</span>
                  <h3 className="mt-5 font-serif text-xl text-ink">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="text-center font-serif text-2xl text-ink md:text-3xl">{page.statsTitle}</p>
            <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {page.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="gold-text font-serif text-5xl md:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 text-sm tracking-wide text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTA dict={dict} locale={safeLocale} />
    </>
  );
}
