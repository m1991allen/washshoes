"use client";

import { cn } from "@/lib/utils";
import { SunIcon, MoonIcon } from "./icons";

/**
 * Light/dark theme toggle. The active theme is reflected by the `light` class
 * on <html> (set pre-paint by the inline script in the locale layout), so both
 * icons render and CSS decides which is visible — no hydration mismatch, no flash.
 */
export function ThemeToggle({ label, className = "" }: { label: string; className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("light") ? "dark" : "light";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode) — toggle still applies this session */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold",
        className,
      )}
    >
      <SunIcon width={18} height={18} className="theme-icon theme-icon--sun" />
      <MoonIcon width={18} height={18} className="theme-icon theme-icon--moon" />
    </button>
  );
}
