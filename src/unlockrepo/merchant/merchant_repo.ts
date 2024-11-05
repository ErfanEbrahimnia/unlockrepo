import type { Database } from "@/database/client";
import type { MerchantClientWebhook } from "./merchant_client";
import type { MerchantWebhook, MerchantWebhookName } from "./merchant_webhook";

export class MerchantRepo {
  public constructor(private db: Database) {}

  public async createWebhookOnce({
    userId,
    merchantConnectionId,
    name,
    createWebhook,
  }: {
    userId: string;
    merchantConnectionId: string;
    name: MerchantWebhookName;
    createWebhook: () => Promise<MerchantClientWebhook>;
  }): Promise<MerchantWebhook> {
    return this.db.transaction().execute(async (trx) => {
      const webhook = await trx
        .selectFrom("merchantWebhooks")
        .selectAll()
        .where((eb) =>
          eb.and([
            eb("userId", "=", userId),
            eb("name", "=", name),
            eb("merchantConnectionId", "=", merchantConnectionId),
          ])
        )
        .executeTakeFirst();

      if (webhook) {
        return webhook;
      }

      const clientWebhook = await createWebhook();

      return trx
        .insertInto("merchantWebhooks")
        .values({
          userId,
          merchantConnectionId,
          name,
          merchantWebhookId: clientWebhook.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });
  }

  async deleteWebhook({
    id,
    userId,
    name,
  }: {
    id: string;
    userId: string;
    name: MerchantWebhookName;
  }): Promise<void> {
    await this.db
      .deleteFrom("merchantWebhooks")
      .where((eb) =>
        eb.and({
          id,
          userId,
          name,
        })
      )
      .execute();
  }
}
