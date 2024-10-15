import { ulid } from "ulid";
import type { Database } from "@/database/client";

export class UnlockRepo {
  constructor(private db: Database) {}

  async createUnlock({
    userId,
    productId,
    repositoryId,
    githubConnectionId,
    merchantConnectionId,
  }: {
    productId: string;
    repositoryId: string;
    userId: string;
    githubConnectionId: string;
    merchantConnectionId: string;
  }) {
    return this.db
      .insertInto("unlocks")
      .values({
        id: ulid(),
        userId,
        productId,
        repositoryId,
        githubConnectionId,
        merchantConnectionId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
