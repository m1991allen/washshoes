"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A thin gold progress bar pinned to the top of the viewport. It starts the
 * instant an internal link is clicked and completes once the new route is
 * committed, covering the gap between the click and the segment's loading.tsx
 * skeleton appearing. Zero dependencies — uses a capture-phase click listener
 * to detect navigation start and `usePathname` to detect navigation end.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [value, setValue] = useState(0); // 0–100
  const [active, setActive] = useState(false);

  const running = useRef(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (trickle.current) clearInterval(trickle.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (safety.current) clearTimeout(safety.current);
    trickle.current = hideTimer.current = safety.current = null;
  }

  function start() {
    if (running.current) return;
    running.current = true;
    clearTimers();
    setActive(true);
    setValue(8);
    // Ease toward 90% but never quite arrive until the route commits.
    trickle.current = setInterval(() => {
      setValue((v) => (v >= 90 ? v : v + (90 - v) * 0.12));
    }, 200);
    // Failsafe: if navigation never commits (e.g. blocked), don't hang forever.
    safety.current = setTimeout(finish, 8000);
  }

  function finish() {
    if (!running.current) return;
    running.current = false;
    clearTimers();
    setValue(100);
    hideTimer.current = setTimeout(() => {
      setActive(false);
      setValue(0);
    }, 280);
  }

  // Navigation start — a primary-button click on a same-origin, in-tab link.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element)?.closest?.("a");
      if (!link) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / hash only
      start();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Navigation end — the committed pathname changed. (No-op on first mount.)
  useEffect(() => {
    finish();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${value}%`,
          opacity: value >= 100 ? 0 : 1,
          boxShadow: "0 0 10px var(--color-gold), 0 0 3px var(--color-gold)",
        }}
      />
    </div>
  );
}
