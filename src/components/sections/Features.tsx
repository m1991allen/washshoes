import type { Dictionary } from "@/i18n/dictionaries/zh";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function Features({ dict }: { dict: Dictionary }) {
  const { features } = dict;

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={features.eyebrow}
          title={features.title}
          align="center"
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 80}>
              <div className="group">
                <span className="font-serif text-2xl text-gold/70">
                  0{i + 1}
                </span>
                <div className="my-5 h-px w-full bg-line transition-colors group-hover:bg-line-strong" />
                <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
