"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { HqSidebar } from "@/components/layout/hq-sidebar";

type HqNavContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const HqNavContext = createContext<HqNavContextValue | null>(null);

export function useHqNav() {
  const ctx = useContext(HqNavContext);
  if (!ctx) {
    return {
      open: false,
      toggle: () => {},
      close: () => {},
    };
  }
  return ctx;
}

export function HqNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <HqNavContext.Provider value={{ open, toggle, close }}>
      <div className="flex min-h-dvh bg-bg">
        <HqSidebar className="hidden lg:flex" />
        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
            aria-label="Close navigation"
            onClick={close}
          />
        ) : null}
        <HqSidebar
          className={[
            "fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
            open ? "translate-x-0" : "-translate-x-full pointer-events-none",
          ].join(" ")}
          onNavigate={close}
          aria-hidden={!open}
        />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </HqNavContext.Provider>
  );
}
