import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export function createPool({
  connectionString,
  ssl,
}: {
  connectionString: string;
  ssl?: boolean;
}) {
  return new Pool({
    connectionString,
    max: 1,
    ssl,
  });
}

export function createClient<DatabaseSchema = any>({ pool }: { pool: Pool }) {
  return new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      pool,
    }),
    plugins: [new CamelCasePlugin()],
  });
}
