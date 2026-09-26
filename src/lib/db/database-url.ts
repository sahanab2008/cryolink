/** Runtime PostgreSQL URL (serverless / Vercel + Neon). Pooled URL first. */
export function resolveRuntimeDatabaseUrl(): string | undefined {
  const keys = [
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "DATABASE_URL",
    "POSTGRES_URL_NON_POOLING",
  ];
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.startsWith("postgres")) {
      return value;
    }
  }
  return process.env.DATABASE_URL;
}
