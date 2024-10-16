import { loadEnvConfig } from "@next/env";
import { createClient, createPool } from "./base_client";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error(
    `Can't run migrations. "DATABASE_URL" for database is undefined`
  );
}

export const db = createClient({
  pool: createPool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production",
  }),
});
