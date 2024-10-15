import { env } from "@/config/env";
import type { Schema } from "./schema";
import { createKyselyClient, createLibSqlClient } from "./base_client";

export const client = createLibSqlClient({
  url: env.DATABASE_URL,
});

export const db = createKyselyClient<Schema>({
  client,
});

export type Database = typeof db;
