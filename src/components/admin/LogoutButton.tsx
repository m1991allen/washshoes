"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await signOut(getClientAuth());
    } catch {
      // ignore — we clear the server session regardless
    }
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold hover:text-gold"
    >
      登出
    </button>
  );
}
