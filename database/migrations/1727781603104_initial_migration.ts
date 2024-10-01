import type { Kysely } from "kysely";
import { Schema } from "../schema";

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("username", "varchar(255)", (col) => col.notNull())
    .addColumn("githubId", "varchar(255)", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("sessions")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar(255)", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("expiresAt", "datetime", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.dropTable("sessions");
  await db.schema.dropTable("users");
}
