import { execSync } from "node:child_process";
import { resolvePostgresDatabaseUrl } from "./resolve-database-url.mjs";

execSync("node scripts/sync-prisma-provider.mjs", { stdio: "inherit" });
execSync("npx prisma generate", { stdio: "inherit" });

if (resolvePostgresDatabaseUrl()) {
  execSync("npx tsx scripts/vercel-prebuild.ts", { stdio: "inherit" });
} else {
  console.warn(
    "\n[vercel-build] ⚠ No database linked — site will build but login will fail until you:\n" +
      "  1. Project → Storage → Create Neon → Connect to this project\n" +
      "  2. Deployments → Redeploy\n"
  );
}

execSync("npx next build", { stdio: "inherit" });
