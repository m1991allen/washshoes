import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "RENU 後台",
  // The admin area must never be indexed.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant-TW">
      <body className="bg-base text-ink antialiased">{children}</body>
    </html>
  );
}
