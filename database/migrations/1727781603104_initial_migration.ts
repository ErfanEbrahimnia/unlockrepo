import { sql, type Kysely } from "kysely";
import type { Schema } from "@/database/schema";

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("username", "varchar(255)", (col) => col.notNull())
    .addColumn("createdAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();

  await db.schema
    .createTable("sessions")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar(255)", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("expiresAt", "datetime", (col) => col.notNull())
    .addColumn("createdAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();

  await db.schema
    .createTable("userConnections")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar(255)", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("connectionId", "varchar(255)", (col) => col.unique().notNull())
    .addColumn("type", "varchar(255)", (col) => col.notNull())
    .addColumn("tokens", "text")
    .addColumn("createdAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();

  await db.schema
    .createTable("unlocks")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar(255)", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("github_connection_id", "varchar(255)", (col) =>
      col.references("user_connections.id").onDelete("cascade").notNull()
    )
    .addColumn("merchant_connection_id", "varchar(255)", (col) =>
      col.references("user_connections.id").onDelete("cascade").notNull()
    )
    .addColumn("product_id", "varchar(255)", (col) => col.notNull())
    .addColumn("repository_id", "varchar(255)", (col) => col.notNull())
    .addColumn("createdAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();

  await db.schema
    .createTable("merchant_webhooks")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar(255)", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("unlock_id", "varchar(255)", (col) =>
      col.references("unlocks.id").onDelete("cascade").notNull()
    )
    .addColumn("merchant_connection_id", "varchar(255)", (col) =>
      col.references("user_connections.id").onDelete("cascade").notNull()
    )
    .addColumn("merchant_webhook_id", "varchar(255)", (col) => col.notNull())
    .addColumn("createdAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.dropTable("merchant_webhooks");
  await db.schema.dropTable("unlocks");
  await db.schema.dropTable("userConnections");
  await db.schema.dropTable("sessions");
  await db.schema.dropTable("users");
}
