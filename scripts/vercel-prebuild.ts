import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

/** Vercel + Neon often expose POSTGRES_* instead of DATABASE_URL */
function resolveDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
  ].filter((v): v is string => Boolean(v && v.startsWith("postgres")));
  return candidates[0];
}

/** db push needs a direct (non-pooled) connection on Neon */
function resolvePushUrl(fallback: string): string {
  const direct = [
    process.env.DIRECT_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
  ].find((v) => v && v.startsWith("postgres"));
  return direct ?? fallback;
}

/**
 * Runs on Vercel during `vercel-build`: apply schema and seed demo users when empty.
 */
async function main() {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      "[vercel-prebuild] No PostgreSQL URL found. In Vercel: Storage → Neon → link to project, then enable env vars for Production AND Build."
    );
    console.error(
      "[vercel-prebuild] Expect DATABASE_URL or POSTGRES_PRISMA_URL / POSTGRES_URL (starts with postgresql://)."
    );
    process.exit(1);
  }

  process.env.DATABASE_URL = databaseUrl;

  execSync("node scripts/sync-prisma-provider.mjs", { stdio: "inherit" });
  execSync("npx prisma generate", { stdio: "inherit" });

  const pushUrl = resolvePushUrl(databaseUrl);
  console.log("[vercel-prebuild] Running prisma db push…");
  try {
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: pushUrl },
    });
  } catch (err) {
    console.error("[vercel-prebuild] prisma db push failed. Use Neon direct URL as POSTGRES_URL_NON_POOLING if needed.");
    throw err;
  }

  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("[vercel-prebuild] Empty database — running seed…");
      execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    } else {
      console.log(`[vercel-prebuild] ${userCount} user(s) present — skipping seed.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[vercel-prebuild] failed:", err);
  process.exit(1);
});
