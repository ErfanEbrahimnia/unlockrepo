import { CamelCasePlugin, Kysely } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { createClient } from "@libsql/client";
import { Schema } from "./schema";

export const client = createClient({
  url: "file:database/local.db",
});

export const db = new Kysely<Schema>({
  dialect: new LibsqlDialect({ client }),
  plugins: [new CamelCasePlugin()],
});
