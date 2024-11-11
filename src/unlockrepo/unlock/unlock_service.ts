import type { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import type { MerchantRepo } from "@/unlockrepo/merchant/merchant_repo";
import type {
  MerchantClientFactory,
  MerchantName,
} from "@/unlockrepo/merchant/merchant_client";
import { Connection } from "@/unlockrepo/user/connection";
import type { UserWithConnections } from "@/unlockrepo/user/user";
import type { GithubClientFactory } from "@/unlockrepo/github/github_client";
import type { Logger } from "@/unlockrepo/logger";
import { AppError } from "@/unlockrepo/errors";

export function createUnlock({
  logger,
  unlockRepo,
  merchantRepo,
  merchantClientFactory,
  githubClientFactory,
}: {
  logger: Logger;
  unlockRepo: UnlockRepo;
  merchantRepo: MerchantRepo;
  githubClientFactory: GithubClientFactory;
  merchantClientFactory: MerchantClientFactory;
}) {
  return async ({
    user,
    merchantName,
    productId,
    repositoryId,
  }: {
    user: UserWithConnections;
    merchantName: MerchantName;
    productId: string;
    repositoryId: string;
  }) => {
    const connectionsByName = Connection.toMapByName(user.connections);
    const githubConnection = connectionsByName.get("github");
    const merchantConnection = connectionsByName.get(merchantName);

    const merchantClient = merchantClientFactory.createClient(
      merchantName,
      merchantConnection.tokens.accessToken
    );

    const githubClient = githubClientFactory.createClient(
      githubConnection.tokens.accessToken
    );

    const [product, repository] = await Promise.all([
      merchantClient.getProduct(productId),
      githubClient.getRepository(repositoryId),
    ]);

    const [unlock, found] = await unlockRepo.findOrCreate({
      userId: user.id,
      productId,
      repositoryId,
      productName: product.name,
      productURL: product.url,
      repositoryName: repository.name,
      repositoryURL: repository.url,
      githubConnectionId: githubConnection.id,
      merchantConnectionId: merchantConnection.id,
    });

    if (found) {
      logger.debug("Unlock for this product and repo already exists", {
        userId: user.id,
        productId,
        repositoryId,
        productName: product.name,
        repositoryName: repository.name,
      });

      throw new AppError("There's already an Unlock for this repo");
    }

    const webhookName = "sale";

    await merchantRepo.createWebhookOnce({
      userId: user.id,
      merchantConnectionId: merchantConnection.id,
      name: webhookName,
      createWebhook: async () => {
        const webhook = await merchantClient.createWebhook(
          webhookName,
          unlock.id
        );

        logger.debug("Created webhook", {
          userId: user.id,
          merchantName,
          webhookId: webhook.id,
          webhookName: webhook.name,
        });

        return webhook;
      },
    });

    logger.info("Created unlock", {
      userId: user.id,
      merchantName,
      productId,
      repositoryId,
    });
  };
}

export function deleteUnlock({
  logger,
  unlockRepo,
  merchantRepo,
  merchantClientFactory,
}: {
  logger: Logger;
  unlockRepo: UnlockRepo;
  merchantRepo: MerchantRepo;
  merchantClientFactory: MerchantClientFactory;
}) {
  return async ({
    user,
    unlockId,
  }: {
    user: UserWithConnections;
    unlockId: string;
  }) => {
    const unlock = await unlockRepo.find(unlockId, user.id);

    const connectionsByName = Connection.toMapById(user.connections);
    const merchantConnection = connectionsByName.get(
      unlock.merchantConnectionId
    );

    const merchantClient = merchantClientFactory.createClient(
      merchantConnection.name,
      merchantConnection.tokens.accessToken
    );

    const { totalRemainingCount } = await unlockRepo.remove({
      id: unlock.id,
      userId: user.id,
      merchantConnectionId: unlock.merchantConnectionId,
    });

    logger.info("Deleted unlock", {
      userId: user.id,
      unlockId: unlock.id,
      totalRemainingUnlockCount: totalRemainingCount,
    });

    if (totalRemainingCount > 0) return;

    // cleanup webhooks
    const merchantWebhooks = await merchantRepo.findWebhooksByConnectionId(
      merchantConnection.id,
      user.id
    );

    const deleteWebhookPromise = merchantWebhooks.map(async (webhook) => {
      await merchantRepo.deleteWebhook(webhook.id, user.id);
      await merchantClient.deleteWebhook(webhook.merchantWebhookId);
    });

    await Promise.all(deleteWebhookPromise);

    logger.debug("No more remaining unlocks. Cleaned up webhooks", {
      userId: user.id,
      unlockId: unlock.id,
      deletedWebhookCount: merchantWebhooks.length,
    });
  };
}
