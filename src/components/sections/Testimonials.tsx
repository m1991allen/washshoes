import type { Dictionary } from "@/i18n/dictionaries/zh";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function Testimonials({ dict }: { dict: Dictionary }) {
  const { testimonials } = dict;

  return (
    <section className="section bg-surface/40">
      <div className="shell">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          align="center"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="card flex h-full flex-col p-8">
                <span className="font-serif text-5xl leading-none text-gold/40">
                  &ldquo;
                </span>
                <blockquote className="mt-3 flex-1 text-base leading-relaxed text-ink/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 border-t border-line pt-5">
                  <p className="font-serif text-base text-ink">{t.name}</p>
                  <p className="mt-1 text-xs tracking-wide text-gold">{t.meta}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
