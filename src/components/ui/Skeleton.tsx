import { cn } from "@/lib/utils";

/**
 * A single shimmering placeholder block. Shape (size / radius) is controlled
 * entirely by `className` — the `.skeleton` utility (globals.css) only supplies
 * the surface colour and the sweep animation.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}
