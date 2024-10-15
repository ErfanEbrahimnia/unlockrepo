import type { MerchantWebhookRepo } from "./merchant_webhook_repo";
import type { MerchantService } from "@/license-repo/merchant/merchant_service";
import type { Connection } from "@/license-repo/connection/connection";

export class MerchantWebhookService {
  private merchantService: MerchantService;

  private merchantWebhookRepo: MerchantWebhookRepo;

  public constructor({
    merchantWebhookRepo,
    merchantService,
  }: {
    merchantWebhookRepo: MerchantWebhookRepo;
    merchantService: MerchantService;
  }) {
    this.merchantWebhookRepo = merchantWebhookRepo;
    this.merchantService = merchantService;
  }

  public async createSaleWebhook({
    userId,
    unlockId,
    merchantConnection,
  }: {
    userId: string;
    unlockId: string;
    merchantConnection: Connection;
  }) {
    const webhook = await this.merchantService.createWebhook({
      name: "sale",
      merchantConnection,
    });

    await this.merchantWebhookRepo.createWebhook({
      userId,
      unlockId,
      merchantConnectionId: merchantConnection.id,
      merchantWebhookId: webhook.id,
      name: "sale",
    });
  }

  public async deleteSalesWebhook({
    userId,
    unlockId,
    merchantConnection,
  }: {
    userId: string;
    unlockId: string;
    merchantConnection: Connection;
  }) {
    const webhooks = await this.merchantWebhookRepo.findWebhooksByUnlockId({
      userId,
      unlockId,
    });

    const deletePromises = webhooks.map(async (webhook) => {
      await this.merchantService.deleteWebhook({
        merchantConnection,
        webhookId: webhook.merchantWebhookId,
      });
      await this.merchantWebhookRepo.deleteWebhook({
        userId,
        id: webhook.id,
      });
    });

    await Promise.all(deletePromises);
  }
}
