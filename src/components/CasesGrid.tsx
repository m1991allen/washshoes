"use client";

import { useState } from "react";
import { BeforeAfter } from "./BeforeAfter";
import { serviceIcons } from "./icons";
import { cn } from "@/lib/utils";

type CaseItem = {
  id: string;
  category: string;
  title: string;
  desc: string;
  beforeImage?: string;
  afterImage?: string;
};
type Filter = { id: string; label: string };

export function CasesGrid({
  items,
  filters,
  beforeLabel,
  afterLabel,
}: {
  items: CaseItem[];
  filters: Filter[];
  beforeLabel: string;
  afterLabel: string;
}) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? items : items.filter((c) => c.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active === f.id
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-muted hover:border-line-strong hover:text-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const Icon = serviceIcons[c.category] ?? serviceIcons["shoe-cleaning"];
          return (
            <article key={c.id} className="animate-[fadeIn_.5s_ease]">
              <BeforeAfter
                icon={<Icon />}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                beforeImage={c.beforeImage}
                afterImage={c.afterImage}
              />
              <h3 className="mt-4 font-serif text-lg text-ink">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.desc}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
