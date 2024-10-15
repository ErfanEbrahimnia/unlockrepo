import type { MerchantWebhookService } from "@/license-repo/merchant_webhook/merchant_webhook_service";
import type { Connection } from "@/license-repo/connection/connection";
import type { UnlockRepo } from "./unlock_repo";

export class UnlockService {
  private unlockRepo: UnlockRepo;

  private merchantWebhookService: MerchantWebhookService;

  constructor({
    unlockRepo,
    merchantWebhookService,
  }: {
    unlockRepo: UnlockRepo;
    merchantWebhookService: MerchantWebhookService;
  }) {
    this.unlockRepo = unlockRepo;
    this.merchantWebhookService = merchantWebhookService;
  }

  async create({
    userId,
    productId,
    repositoryId,
    githubConnection,
    merchantConnection,
  }: {
    userId: string;
    productId: string;
    repositoryId: string;
    githubConnection: Connection;
    merchantConnection: Connection;
  }) {
    const unlock = await this.unlockRepo.createUnlock({
      userId,
      productId,
      repositoryId,
      githubConnectionId: githubConnection.id,
      merchantConnectionId: merchantConnection.id,
    });

    await this.merchantWebhookService.createSaleWebhook({
      userId,
      merchantConnection,
      unlockId: unlock.id,
    });
  }
}
