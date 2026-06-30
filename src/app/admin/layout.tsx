import type { Metadata } from "next";
import "../globals.css";
import { RouteProgress } from "@/components/ui/RouteProgress";

export const metadata: Metadata = {
  title: "RENU 後台",
  // The admin area must never be indexed.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className="light">
      <body className="admin-scope bg-base text-ink antialiased">
        <RouteProgress />
        {children}
      </body>
    </html>
  );
}
