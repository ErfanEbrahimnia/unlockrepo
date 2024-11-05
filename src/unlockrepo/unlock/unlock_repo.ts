import type { Insertable } from "kysely";
import type { Database } from "@/database/client";
import type { Unlock, UnlockTable } from "./unlock";

export class UnlockRepo {
  constructor(private db: Database) {}

  async create({
    userId,
    productId,
    productName,
    productURL,
    repositoryId,
    repositoryName,
    repositoryURL,
    githubConnectionId,
    merchantConnectionId,
  }: Insertable<UnlockTable>): Promise<Unlock> {
    return this.db
      .insertInto("unlocks")
      .values({
        userId,
        productId,
        productName,
        productURL,
        repositoryId,
        repositoryName,
        repositoryURL,
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

  async findByUserId(userId: string): Promise<Unlock[]> {
    return this.db
      .selectFrom("unlocks")
      .selectAll()
      .where((eb) => eb.and([eb("unlocks.userId", "=", userId)]))
      .execute();
  }

  async remove(id: string, userId: string) {
    return this.db
      .deleteFrom("unlocks")
      .where((eb) =>
        eb.and([eb("unlocks.id", "=", id), eb("unlocks.userId", "=", userId)])
      )
      .executeTakeFirst();
  }
}
