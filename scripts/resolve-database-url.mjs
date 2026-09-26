/** Pick a PostgreSQL URL from Vercel/Neon env (non-pooled preferred for db push). */
export function resolvePostgresDatabaseUrl() {
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
