export function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{desc}</p>
      <div className="mt-8 grid place-items-center rounded-[var(--radius)] border border-dashed border-line-strong bg-surface/40 px-6 py-20 text-center">
        <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs tracking-wide text-gold">
          建置中
        </span>
        <p className="mt-4 max-w-sm text-sm text-muted">此功能即將推出，正在開發中。</p>
      </div>
    </div>
  );
}
