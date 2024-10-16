import { env, isProduction } from "@/config/env";
import { createClient, createPool } from "./base_client";
import type { Schema } from "./schema";

export const pgPool = createPool({
  connectionString: env.DATABASE_URL,
  ssl: isProduction(),
});

export const db = createClient<Schema>({
  pool: pgPool,
});

export type Database = typeof db;
