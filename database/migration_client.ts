import { loadEnvConfig } from "@next/env";
import { createKyselyClient, createLibSqlClient } from "./base_client";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error(
    `Can't run migrations. "DATABASE_URL" for database is undefined`
  );
}

const client = createLibSqlClient({
  url: process.env.DATABASE_URL,
});

export const db = createKyselyClient({
  client,
});
