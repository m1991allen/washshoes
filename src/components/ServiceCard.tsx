import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/zh";
import { localizedPath, cn } from "@/lib/utils";
import { serviceIcons, ArrowUpRight, CheckIcon } from "./icons";

type Service = Dictionary["services"][number];

export function ServiceCard({
  service,
  locale,
  variant = "compact",
  includedLabel,
  className = "",
}: {
  service: Service;
  locale: Locale;
  variant?: "compact" | "full";
  includedLabel?: string;
  className?: string;
}) {
  const Icon = serviceIcons[service.id] ?? serviceIcons["shoe-cleaning"];

  if (variant === "full") {
    return (
      <div className={cn("card group flex flex-col p-7 md:p-8", className)} id={service.id}>
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-line text-gold transition-colors group-hover:border-gold/50">
            <Icon width={26} height={26} />
          </span>
          <span className="font-serif text-sm tracking-[0.2em] text-faint">
            {service.short}
          </span>
        </div>
        <h3 className="mt-6 font-serif text-2xl text-ink">{service.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{service.desc}</p>

        {includedLabel && (
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-faint">
            {includedLabel}
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-2">
          {service.items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted"
            >
              <CheckIcon width={13} height={13} className="text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Link
      href={localizedPath(locale, `/services#${service.id}`)}
      className={cn("card group flex flex-col p-7", className)}
    >
      <div className="flex items-center justify-between">
        <span className="grid h-13 w-13 place-items-center rounded-full border border-line p-3 text-gold transition-colors group-hover:border-gold/50">
          <Icon width={24} height={24} />
        </span>
        <ArrowUpRight
          width={20}
          height={20}
          className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
        />
      </div>
      <h3 className="mt-6 font-serif text-xl text-ink">{service.name}</h3>
      <p className="mt-2 text-sm text-faint">{service.short}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{service.desc}</p>
    </Link>
  );
}
