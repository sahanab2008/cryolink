import { Suspense } from "react";
import { redirect } from "next/navigation";
import { RoleAuthScreen } from "@/components/auth/role-auth-screen";
import { auth } from "@/auth";
import { homePathForRole } from "@/lib/auth/permissions";
import { isUserRole } from "@/lib/auth/role-entry";
import type { UserRole } from "@prisma/client";

type PageProps = {
  searchParams: Promise<{ role?: string; mode?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();

  if (session?.user?.id && session.user.role) {
    const role = session.user.role as UserRole;
    if (!params.role || params.role === role) {
      redirect(homePathForRole(role));
    }
  }

  if (params.role && !isUserRole(params.role)) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="min-h-dvh bg-bg" />}>
      <RoleAuthScreen initialMode={params.mode === "signup" ? "signup" : "signin"} />
    </Suspense>
  );
}
