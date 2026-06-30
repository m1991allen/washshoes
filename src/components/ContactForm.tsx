"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon, ArrowRight } from "./icons";

type FormLabels = {
  name: string;
  namePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  service: string;
  servicePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  success: string;
  note: string;
};

export function ContactForm({
  labels,
  services,
}: {
  labels: FormLabels;
  services: { id: string; name: string }[];
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  // Phase 2: replace this with a POST to your booking/enquiry API endpoint.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-line bg-surface/60 p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
          <CheckIcon width={28} height={28} />
        </span>
        <p className="mt-6 max-w-sm font-serif text-xl text-ink">{labels.success}</p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-gold/60";
  const labelCls = "mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-faint";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="name">
            {labels.name}
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder={labels.namePlaceholder}
            className={field}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">
            {labels.phone}
          </label>
          <input
            id="phone"
            name="phone"
            required
            placeholder={labels.phonePlaceholder}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="email">
            {labels.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={labels.emailPlaceholder}
            className={field}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="service">
            {labels.service}
          </label>
          <select id="service" name="service" defaultValue="" className={field} required>
            <option value="" disabled>
              {labels.servicePlaceholder}
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="bg-base">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="message">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={labels.messagePlaceholder}
          className={`${field} resize-none`}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={status === "sending"}>
        {labels.submit}
        <ArrowRight width={18} height={18} />
      </button>
      <p className="text-center text-xs text-faint">{labels.note}</p>
    </form>
  );
}
