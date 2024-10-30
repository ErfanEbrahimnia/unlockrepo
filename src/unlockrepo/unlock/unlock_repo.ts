import type { Database } from "@/database/client";
import type { Insertable } from "kysely";
import type { Unlock, UnlockTable } from "./unlock";

export class UnlockRepo {
  constructor(private db: Database) {}

  async create({
    userId,
    productId,
    repositoryId,
    githubConnectionId,
    merchantConnectionId,
  }: Insertable<UnlockTable>): Promise<Unlock> {
    return this.db
      .insertInto("unlocks")
      .values({
        userId,
        productId,
        repositoryId,
        githubConnectionId,
        merchantConnectionId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async find(id: string, userId: string): Promise<Unlock> {
    return this.db
      .selectFrom("unlocks")
      .selectAll()
      .where((eb) =>
        eb.and([eb("unlocks.id", "=", id), eb("userId", "=", userId)])
      )
      .executeTakeFirstOrThrow();
  }
}
