import type { Database } from "@/database/client";
import { MerchantWebhook } from "./merchant_webhook";

export class MerchantWebhookRepo {
  public constructor(private db: Database) {}

  public async createWebhook({
    userId,
    unlockId,
    merchantWebhookId,
    name,
    merchantConnectionId,
  }: {
    userId: string;
    unlockId: string;
    merchantWebhookId: string;
    name: string;
    merchantConnectionId: string;
  }) {
    const webhookRecord = await this.db
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

    return MerchantWebhook.parse(webhookRecord);
  }

  async findWebhooksByUnlockId({
    userId,
    unlockId,
  }: {
    userId: string;
    unlockId: string;
  }) {
    const webhookRecords = await this.db
      .selectFrom("merchantWebhooks")
      .where((eb) =>
        eb.and({
          userId,
          unlockId,
        })
      )
      .selectAll()
      .execute();

    return MerchantWebhook.parseMany(webhookRecords);
  }

  async deleteWebhook({ id, userId }: { id: string; userId: string }) {
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
