import {
  CamelCasePlugin as KyselyCamelCase,
  Kysely,
  PostgresDialect,
  type CamelCasePluginOptions as KyselyCamelCasePluginOptions,
} from "kysely";
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
    plugins: [
      new CamelCasePlugin({
        specialCaseMap: {
          product_url: "productURL",
          repository_url: "repositoryURL",
        },
      }),
    ],
  });
}

interface CamelCasePluginOptions extends KyselyCamelCasePluginOptions {
  specialCaseMap?: Record<string, string>;
}

class CamelCasePlugin extends KyselyCamelCase {
  private specialCaseMap: Record<string, string> = {};

  constructor({ specialCaseMap, ...options }: CamelCasePluginOptions = {}) {
    super(options);

    this.specialCaseMap = specialCaseMap ?? {};
  }

  protected override camelCase(str: string): string {
    if (this.specialCaseMap[str]) {
      return this.specialCaseMap[str];
    }

    return super.camelCase(str);
  }
}
