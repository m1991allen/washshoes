import "server-only";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, ROLES, type Role, type AdminUserView } from "./types";

function toRole(claims: Record<string, unknown> | undefined): Role | null {
  const r = claims?.role;
  return typeof r === "string" && (ROLES as readonly string[]).includes(r) ? (r as Role) : null;
}

/** Firestore mirror of the auth user — non-fatal (auth is the source of truth). */
async function mirror(uid: string, data: Record<string, unknown>): Promise<void> {
  try {
    await adminDb().collection(COLLECTIONS.users).doc(uid).set(data, { merge: true });
  } catch {
    /* Firestore unavailable — the account still exists in Auth */
  }
}

/** List every admin/editor account, newest first. */
export async function listAdminUsers(): Promise<AdminUserView[]> {
  const res = await adminAuth().listUsers(1000);
  return res.users
    .map<AdminUserView>((u) => ({
      uid: u.uid,
      email: u.email ?? "",
      displayName: u.displayName ?? "",
      role: toRole(u.customClaims),
      disabled: u.disabled,
      createdAt: u.metadata.creationTime ? Date.parse(u.metadata.creationTime) : null,
    }))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function createAdminUser(input: {
  email: string;
  password: string;
  displayName: string;
  role: Role;
}): Promise<void> {
  const auth = adminAuth();
  const user = await auth.createUser({
    email: input.email,
    password: input.password,
    displayName: input.displayName || undefined,
  });
  await auth.setCustomUserClaims(user.uid, { role: input.role });
  await mirror(user.uid, {
    uid: user.uid,
    email: input.email,
    displayName: input.displayName,
    role: input.role,
    disabled: false,
    createdAt: Date.now(),
  });
}

export async function setUserRole(uid: string, role: Role): Promise<void> {
  // setCustomUserClaims replaces all claims; role is the only one we use.
  await adminAuth().setCustomUserClaims(uid, { role });
  await mirror(uid, { role });
}

export async function setUserDisabled(uid: string, disabled: boolean): Promise<void> {
  await adminAuth().updateUser(uid, { disabled });
  await mirror(uid, { disabled });
}

export async function deleteAdminUser(uid: string): Promise<void> {
  await adminAuth().deleteUser(uid);
  try {
    await adminDb().collection(COLLECTIONS.users).doc(uid).delete();
  } catch {
    /* Firestore mirror cleanup is non-fatal */
  }
}
