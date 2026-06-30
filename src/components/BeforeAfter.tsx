"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Frame } from "./Frame";

/**
 * Draggable before/after comparison.
 *
 * When `beforeImage`/`afterImage` are provided they render as real photos;
 * otherwise it falls back to the tone-treated placeholder (muted = before,
 * gold = after) so the layout still looks intentional.
 */
export function BeforeAfter({
  icon,
  beforeLabel,
  afterLabel,
  beforeImage,
  afterImage,
  className = "",
}: {
  icon?: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  beforeImage?: string;
  afterImage?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div
      ref={ref}
      className={`group relative cursor-ew-resize select-none overflow-hidden rounded-[var(--radius)] ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* After (full) */}
      <Frame
        tone="gold"
        icon={afterImage ? undefined : icon}
        label={afterLabel}
        className="aspect-[4/3] w-full"
      >
        {afterImage ? (
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            sizes={sizes}
            draggable={false}
            className="pointer-events-none select-none object-cover"
          />
        ) : undefined}
      </Frame>

      {/* Before (clipped to the left of the handle) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Frame
          tone="muted"
          icon={beforeImage ? undefined : icon}
          label={beforeLabel}
          className="aspect-[4/3] w-full"
        >
          {beforeImage ? (
            <Image
              src={beforeImage}
              alt={beforeLabel}
              fill
              sizes={sizes}
              draggable={false}
              className="pointer-events-none select-none object-cover"
            />
          ) : undefined}
        </Frame>
      </div>

      {/* Handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gold/80"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-base/70 text-gold backdrop-blur">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  );
}
