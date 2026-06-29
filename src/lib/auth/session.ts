import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import type { Role } from "@/lib/cms/types";

export const SESSION_COOKIE = "session";
/** Session lifetime: 5 days (Firebase allows up to 14). */
export const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000;

export interface SessionUser {
  uid: string;
  email: string | null;
  name: string | null;
  role: Role | null;
}

/** Read + verify the session cookie. Returns null if missing/invalid. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth().verifySessionCookie(session, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: (decoded.name as string | undefined) ?? null,
      role: (decoded.role as Role | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Require an authenticated user (optionally with one of `roles`). Redirects to
 * the login page if unauthenticated, or to the dashboard with a denied flag if
 * the role is insufficient. Use at the top of protected server components.
 */
export async function requireUser(roles?: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (roles && (!user.role || !roles.includes(user.role))) {
    redirect("/admin?denied=1");
  }
  return user;
}
