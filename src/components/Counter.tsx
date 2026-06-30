"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to a numeric target when scrolled into view. */
export function Counter({
  value,
  suffix = "",
  className = "",
}: {
  value: string;
  suffix?: string;
  className?: string;
}) {
  const target = Number(value.replace(/[^0-9.]/g, "")) || 0;
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const node = ref.current;
    if (!node || target === 0) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const duration = 1400;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const run = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      setDisplay(current.toLocaleString("en-US"));
      if (p < 1) raf = requestAnimationFrame(run);
      else setDisplay(value);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          raf = requestAnimationFrame(run);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [target, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
