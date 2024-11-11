import { sql, type Kysely } from "kysely";
import type { Schema } from "@/database/schema";

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("username", "text")
    .addColumn("avatarURL", "text")
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("sessions")
    .addColumn("id", "varchar(255)", (col) => col.primaryKey())
    .addColumn("userId", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();

  await db.schema
    .createTable("userConnections")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("connectionId", "varchar(255)", (col) => col.unique().notNull())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("tokens", "text")
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("unlocks")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("githubConnectionId", "uuid", (col) =>
      col.references("userConnections.id").onDelete("cascade").notNull()
    )
    .addColumn("merchantConnectionId", "uuid", (col) =>
      col.references("userConnections.id").onDelete("cascade").notNull()
    )
    .addColumn("productId", "varchar(255)", (col) => col.notNull())
    .addColumn("productName", "text", (col) => col.notNull())
    .addColumn("productURL", "text", (col) => col.notNull())
    .addColumn("repositoryId", "varchar(255)", (col) => col.notNull())
    .addColumn("repositoryName", "text", (col) => col.notNull())
    .addColumn("repositoryURL", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("merchantWebhooks")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("merchantConnectionId", "uuid", (col) =>
      col.references("userConnections.id").onDelete("cascade").notNull()
    )
    .addColumn("merchantWebhookId", "varchar(255)", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.dropTable("merchant_webhooks").ifExists().execute();
  await db.schema.dropTable("unlocks").ifExists().execute();
  await db.schema.dropTable("userConnections").ifExists().execute();
  await db.schema.dropTable("sessions").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();
}
