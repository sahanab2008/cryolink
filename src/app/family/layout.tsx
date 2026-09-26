import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { CryoLinkLogo } from "@/components/brand/cryolink-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function FamilyLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "FAMILY_NOK") {
    redirect("/");
  }

  if (!session.nextOfKinForId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-text-secondary">
          Your account is not linked to an expedition member. Contact HQ to complete NOK registration.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg">
      <header className="flex items-center justify-between gap-2 border-b border-border/80 bg-surface/90 shell-main backdrop-blur-md max-lg:pt-[max(0.75rem,env(safe-area-inset-top))]">
        <CryoLinkLogo compact href="/family/status" />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="max-w-[6rem] truncate text-sm text-text-secondary sm:max-w-[10rem]">{session.name}</span>
          <LogoutButton />
          <ThemeToggle />
        </div>
      </header>
      <main className="shell-main">
        <div className="shell-content max-lg:max-w-full lg:max-w-xl">{children}</div>
      </main>
    </div>
  );
}
