import { defineConfig } from "kysely-ctl";
import { db } from "./database/migration_client";

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "./database/migrations/",
  },
});
