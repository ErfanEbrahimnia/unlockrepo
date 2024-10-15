import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { createClient, type Client } from "@libsql/client";

export function createLibSqlClient({ url }: { url: string }) {
  return createClient({
    url,
  });
}

export function createKyselyClient<Schema = any>({
  client,
}: {
  client: Client;
}) {
  return new Kysely<Schema>({
    dialect: new LibsqlDialect({ client }),
    plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
  });
}
