import { PrismaClient } from "@prisma/client";
import { resolveRuntimeDatabaseUrl } from "@/lib/db/database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function prismaClientOptions() {
  const url = resolveRuntimeDatabaseUrl();
  const log = process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  if (url?.startsWith("postgres")) {
    return {
      log,
      datasources: { db: { url } },
    };
  }
  return { log };
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
