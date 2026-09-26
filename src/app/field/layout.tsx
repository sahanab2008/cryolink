import { FieldBottomNav } from "@/components/layout/field-bottom-nav";
import { FieldSyncProvider } from "@/components/field/field-sync-provider";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { CryoLinkLogo } from "@/components/brand/cryolink-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "CryoLink Field" },
};

export default async function FieldLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "FIELD_PERSONNEL") {
    redirect("/");
  }

  return (
    <FieldSyncProvider>
      <div className="flex min-h-dvh flex-col bg-bg pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between gap-2 border-b border-border/80 bg-surface/90 shell-main backdrop-blur-md max-lg:pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="min-w-0">
            <CryoLinkLogo compact href="/field/home" />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground lg:inline">
              {session.name}
            </span>
            <LogoutButton />
            <ThemeToggle />
          </div>
        </header>
        <main className="shell-main flex-1">
          <div className="shell-content max-lg:max-w-full lg:max-w-3xl">{children}</div>
        </main>
        <FieldBottomNav />
      </div>
    </FieldSyncProvider>
  );
}
