"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Package, Boxes, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFieldConnectivity } from "@/stores/field-connectivity";

const items = [
  { href: "/field/home", label: "Home", icon: Home },
  { href: "/field/mission", label: "Mission", icon: MapPin },
  { href: "/field/equipment", label: "Gear", icon: Package },
  { href: "/field/inventory", label: "Supplies", icon: Boxes },
  { href: "/field/sync", label: "Sync", icon: CloudOff },
] as const;

export function FieldBottomNav() {
  const pathname = usePathname();
  const pendingCount = useFieldConnectivity((s) => s.pendingCount);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      aria-label="Field navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5 py-1.5 sm:gap-1 sm:py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-medium transition-colors sm:min-h-12 sm:gap-1 sm:px-1 sm:py-2 sm:text-xs",
                  active ? "bg-ice/15 text-ice" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                  {href === "/field/sync" && pendingCount > 0 ? (
                    <span
                      className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 font-mono text-[9px] text-text-primary"
                      aria-label={`${pendingCount} pending`}
                    >
                      {pendingCount}
                    </span>
                  ) : null}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
