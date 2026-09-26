import { redirect } from "next/navigation";
import { isUserRole } from "@/lib/auth/role-entry";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

/** Sign-up UI lives on /login with mode=signup (single auth screen per role). */
export default async function SignupPage({ searchParams }: PageProps) {
  const { role } = await searchParams;
  if (role && isUserRole(role)) {
    redirect(`/login?role=${role}&mode=signup`);
  }
  redirect("/");
}
