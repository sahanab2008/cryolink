"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function HqError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[hq]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-8 text-center sm:px-6">
      <h1 className="font-display text-xl font-semibold text-text-primary">HQ dashboard could not load</h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        This is usually a database connection on Vercel. Set a real Neon{" "}
        <span className="font-mono text-xs">DATABASE_URL</span> (or use Neon Storage integration), set{" "}
        <span className="font-mono text-xs">AUTH_URL</span> to your site URL, then redeploy so the build can run{" "}
        <span className="font-mono text-xs">prisma db push</span> and seed demo users.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-[10px] text-text-secondary">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
