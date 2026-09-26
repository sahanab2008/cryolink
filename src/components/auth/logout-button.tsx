"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  variant?: "default" | "secondary" | "outline" | "ghost" | "navy";
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function LogoutButton({ variant = "secondary", size = "sm", className }: LogoutButtonProps) {
  async function logout() {
    await signOut({ redirect: true, callbackUrl: "/" });
  }

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={logout}>
      <LogOut className="mr-2 h-4 w-4" aria-hidden />
      Log out
    </Button>
  );
}
