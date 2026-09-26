import type { UserRole } from "@prisma/client";
import { signIn } from "next-auth/react";
import { homePathForRole } from "@/lib/auth/permissions";

export async function signInWithCredentials(
  email: string,
  password: string,
  role: UserRole
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await signIn("credentials", {
    email,
    password,
    expectedRole: role,
    redirect: false,
  });

  if (result?.error) {
    if (result.error === "CredentialsSignin") {
      return { ok: false, error: "Invalid email or password for this role." };
    }
    return { ok: false, error: "Sign-in failed. Run npm run db:seed if using demo accounts." };
  }

  return { ok: true };
}

/** Full navigation so session cookie is applied and back-button cache is avoided */
export function redirectToRoleDashboard(role: UserRole) {
  window.location.assign(homePathForRole(role));
}
