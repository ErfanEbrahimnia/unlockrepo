import type { Database } from "@/database/client";

export class MerchantRepo {
  public constructor(private db: Database) {}

  public async createWebhook({
    userId,
    unlockId,
    merchantWebhookId,
    name,
    merchantConnectionId,
  }: Omit<
    MerchantWebhook,
    "id" | "createdAt" | "updatedAt"
  >): Promise<MerchantWebhook> {
    return this.db
      .insertInto("merchantWebhooks")
      .values({
        name,
        userId,
        unlockId,
        merchantWebhookId,
        merchantConnectionId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findWebhooksByUnlockId({
    userId,
    unlockId,
  }: {
    userId: string;
    unlockId: string;
  }): Promise<MerchantWebhook[]> {
    return this.db
      .selectFrom("merchantWebhooks")
      .where((eb) =>
        eb.and({
          userId,
          unlockId,
        })
      )
      .selectAll()
      .execute();
  }

  async deleteWebhook({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db
      .deleteFrom("merchantWebhooks")
      .where((eb) =>
        eb.and({
          id,
          userId,
        })
      )
      .execute();
  }
}

export type MerchantWebhookName = "sale" | "refund";

export interface MerchantWebhook {
  id: string;
  name: MerchantWebhookName;
  userId: string;
  unlockId: string;
  merchantWebhookId: string;
  merchantConnectionId: string;
  createdAt: Date;
  updatedAt: Date;
}
