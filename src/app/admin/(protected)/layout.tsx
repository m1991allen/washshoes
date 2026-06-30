import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-5">
          <Link href="/admin" className="flex items-center gap-1.5">
            <span className="font-serif text-lg tracking-[0.12em] text-ink">RENU</span>
            <span className="h-[5px] w-[5px] rounded-full bg-gold" />
            <span className="ml-1 hidden text-xs text-faint sm:inline">後台</span>
          </Link>

          <div className="hidden flex-1 md:block">
            <AdminNav role={user.role} />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted lg:inline">
              {user.email}
              {user.role && (
                <span className="ml-2 rounded-full bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                  {user.role}
                </span>
              )}
            </span>
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold hover:text-gold sm:inline-block"
            >
              回前台 ↗
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="border-t border-line px-5 py-2 md:hidden">
          <AdminNav role={user.role} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
