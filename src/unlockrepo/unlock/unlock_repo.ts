import type { Insertable } from "kysely";
import type { Database } from "@/database/client";
import type { Unlock, UnlockTable } from "./unlock";

export class UnlockRepo {
  constructor(private db: Database) {}

  async findOrCreate({
    userId,
    productId,
    productName,
    productURL,
    repositoryId,
    repositoryName,
    repositoryURL,
    githubConnectionId,
    merchantConnectionId,
  }: Insertable<UnlockTable>): Promise<[Unlock, boolean]> {
    return this.db.transaction().execute(async (trx) => {
      const foundUnlock = await trx
        .selectFrom("unlocks")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("unlocks.productId", "=", productId),
            eb("unlocks.repositoryId", "=", repositoryId),
            eb("unlocks.userId", "=", userId),
          ])
        )
        .executeTakeFirst();

      if (foundUnlock) return [foundUnlock, true];

      const newUnlock = await trx
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

      return [newUnlock, false];
    });
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

  async findById(id: string): Promise<Unlock> {
    return this.db
      .selectFrom("unlocks")
      .selectAll()
      .where("unlocks.id", "=", id)
      .executeTakeFirstOrThrow();
  }

  async findByUserId(userId: string): Promise<Unlock[]> {
    return this.db
      .selectFrom("unlocks")
      .selectAll()
      .where((eb) => eb.and([eb("unlocks.userId", "=", userId)]))
      .execute();
  }

  async findByProductId(productId: string, userId: string): Promise<Unlock> {
    return this.db
      .selectFrom("unlocks")
      .selectAll()
      .where((eb) =>
        eb.and([
          eb("unlocks.userId", "=", userId),
          eb("unlocks.productId", "=", productId),
        ])
      )
      .executeTakeFirstOrThrow();
  }

  async remove({
    id,
    userId,
    merchantConnectionId,
  }: {
    id: string;
    userId: string;
    merchantConnectionId: string;
  }) {
    return this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("unlocks")
        .where((eb) => eb.and([eb("id", "=", id), eb("userId", "=", userId)]))
        .executeTakeFirstOrThrow();

      return trx
        .selectFrom("unlocks")
        .select((eb) => eb.fn.count<number>("id").as("totalRemainingCount"))
        .where((eb) =>
          eb.and([
            eb("merchantConnectionId", "=", merchantConnectionId),
            eb("userId", "=", userId),
          ])
        )
        .executeTakeFirstOrThrow();
    });
  }
}
