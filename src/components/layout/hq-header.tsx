"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { useHqNav } from "@/components/layout/hq-nav";
import { Button } from "@/components/ui/button";

type HqHeaderProps = {
  title: string;
  subtitle?: string;
  userName?: string;
};

export function HqHeader({ title, subtitle, userName }: HqHeaderProps) {
  const { toggle } = useHqNav();

  return (
    <header
      className="animate-rise-in flex flex-col gap-3 border-b border-border bg-surface/95 shell-main backdrop-blur-sm max-lg:pt-[max(0.75rem,env(safe-area-inset-top))] lg:flex-row lg:items-center lg:justify-between lg:gap-6"
    >
      <div className="flex min-w-0 items-start gap-3 lg:gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="layout-mobile-only mt-0.5 flex shrink-0"
          aria-label="Open HQ menu"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">CryoLink HQ</p>
          <h1
            className="mt-1 font-display font-semibold tracking-tight text-text-primary"
            style={{ fontSize: "var(--layout-page-title)" }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm leading-snug text-text-secondary lg:max-w-2xl lg:text-base">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 lg:ml-auto lg:gap-3">
        {userName ? (
          <p className="max-w-[9rem] truncate text-sm text-text-secondary max-lg:max-w-[12rem] lg:max-w-none">
            {userName}
          </p>
        ) : null}
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
