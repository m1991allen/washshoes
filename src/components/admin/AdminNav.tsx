"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; adminOnly?: boolean };

const ITEMS: Item[] = [
  { href: "/admin", label: "總覽" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/content", label: "內容" },
  { href: "/admin/cases", label: "案例" },
  { href: "/admin/users", label: "使用者", adminOnly: true },
];

export function AdminNav({ role }: { role: Role | null }) {
  const pathname = usePathname() || "";

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {ITEMS.filter((i) => !i.adminOnly || role === "admin").map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors",
            isActive(item.href) ? "bg-gold/15 text-gold" : "text-muted hover:text-ink",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
