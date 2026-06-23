import type { Dictionary } from "@/i18n/dictionaries/zh";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function Process({ dict }: { dict: Dictionary }) {
  const { process } = dict;

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          subtitle={process.subtitle}
          align="center"
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {process.steps.map((step, i) => (
            <Reveal key={step.no} delay={i * 70} className="bg-base">
              <div className="group h-full bg-base p-7 transition-colors hover:bg-surface">
                <span className="font-serif text-3xl text-gold/80">{step.no}</span>
                <span className="mt-5 block h-px w-8 bg-line-strong transition-all duration-300 group-hover:w-12 group-hover:bg-gold" />
                <h3 className="mt-5 font-serif text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
