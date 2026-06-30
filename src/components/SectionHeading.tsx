import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
  titleClassName = "heading",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && <span className={cn("eyebrow", centered && "is-centered")}>{eyebrow}</span>}
      <h2 className={cn("mt-5 whitespace-pre-line text-ink", titleClassName)}>{title}</h2>
      {subtitle && <p className="mt-5 text-base leading-relaxed text-muted">{subtitle}</p>}
    </Reveal>
  );
}
