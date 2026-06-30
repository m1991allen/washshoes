import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial media placeholder.
 *
 * Renders a refined gradient panel with a ghosted icon + optional label so the
 * site looks intentional before real photography is added. To use a real photo,
 * pass it as `children` (e.g. a next/image) — the gradient becomes its backdrop.
 */
export function Frame({
  icon,
  label,
  caption,
  tone = "default",
  className = "",
  children,
}: {
  icon?: ReactNode;
  label?: string;
  caption?: string;
  tone?: "default" | "gold" | "muted";
  className?: string;
  children?: ReactNode;
}) {
  const tones = {
    default: "from-surface-2 to-base [--glow:rgba(200,168,106,0.16)]",
    gold: "from-(--panel-gold-from) to-base [--glow:rgba(200,168,106,0.30)]",
    muted: "from-(--panel-muted-from) to-base [--glow:rgba(200,168,106,0.08)]",
  } as const;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius)] border border-line bg-gradient-to-br",
        tones[tone],
        className,
      )}
    >
      {/* glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 20%, var(--glow), transparent 55%)",
        }}
      />
      {/* grain / fine grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(var(--panel-grid) 1px, transparent 1px), linear-gradient(90deg, var(--panel-grid) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {children ? (
        children
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          {icon && (
            <div className="text-gold/30 [&_svg]:h-24 [&_svg]:w-24" aria-hidden>
              {icon}
            </div>
          )}
        </div>
      )}

      {label && (
        <span className="absolute left-4 top-4 rounded-full border border-line bg-base/60 px-3 py-1 text-xs tracking-wide text-white backdrop-blur">
          {label}
        </span>
      )}
      {caption && (
        <span className="absolute bottom-4 left-4 right-4 font-serif text-lg text-ink/90">
          {caption}
        </span>
      )}
    </div>
  );
}
