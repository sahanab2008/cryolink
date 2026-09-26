import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

function resolvePostgresDatabaseUrl(): { url: string; source: string } | null {
  const keys = [
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL",
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
  ];
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.startsWith("postgres")) {
      return { url: value, source: key };
    }
  }
  return null;
}

/**
 * Vercel build: sync schema, push to Postgres, seed if empty.
 */
async function main() {
  const resolved = resolvePostgresDatabaseUrl();
  if (!resolved) {
    console.error(
      "[vercel-prebuild] Missing PostgreSQL URL. In Vercel → Storage → Neon → connect to project.\n" +
        "Expected one of: POSTGRES_URL_NON_POOLING, POSTGRES_URL, DATABASE_URL, POSTGRES_PRISMA_URL"
    );
    process.exit(1);
  }

  console.log(`[vercel-prebuild] Using ${resolved.source} for schema push`);

  const env = {
    ...process.env,
    DATABASE_URL: resolved.url,
  };

  execSync("node scripts/sync-prisma-provider.mjs", { stdio: "inherit", env });
  execSync("npx prisma generate", { stdio: "inherit", env });
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", env });

  const prisma = new PrismaClient({
    datasources: { db: { url: resolved.url } },
  });
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("[vercel-prebuild] Empty database — running seed…");
      execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env });
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
