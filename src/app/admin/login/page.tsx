"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase/client";

function mapError(err: unknown): string {
  const code =
    typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  switch (code) {
    case "auth/invalid-email":
      return "Email 格式不正確。";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "帳號或密碼錯誤。";
    case "auth/too-many-requests":
      return "嘗試次數過多，請稍後再試。";
    default:
      return err instanceof Error ? err.message : "登入失敗，請再試一次。";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isFirebaseConfigured()) {
      setError("Firebase 尚未設定，請檢查環境變數。");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(getClientAuth(), email, password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        await signOut(getClientAuth());
        throw new Error(data.error || "登入失敗");
      }
      router.push("/admin");
      router.refresh();
      // Keep the button in its loading state through the navigation. The admin
      // dashboard is a server component that takes a moment to render; resetting
      // `loading` here would flash the button back to "登入" and feel frozen.
    } catch (err) {
      setError(mapError(err));
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-gold/60";

  return (
    <main className="grid min-h-screen place-items-center bg-grain px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-serif text-3xl tracking-[0.14em] text-ink">RENU</span>
          <span className="ml-1 inline-block h-[6px] w-[6px] rounded-full bg-gold align-middle" />
          <p className="mt-3 text-sm text-muted">內容管理後台</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          <h1 className="font-serif text-xl text-ink">登入</h1>
          <p className="mt-1 text-xs text-faint">請使用管理員核發的帳號登入</p>

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-[0.14em] text-faint"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={field}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs uppercase tracking-[0.14em] text-faint"
              >
                密碼
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={field}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-6 w-full disabled:opacity-60"
          >
            {loading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden
                />
                登入中…
              </>
            ) : (
              "登入"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-faint">
          <a href="/" className="transition-colors hover:text-gold">
            ← 回到網站前台
          </a>
        </p>
      </div>
    </main>
  );
}
