import type { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import type { UserRepo } from "@/unlockrepo/user/user_repo";
import type { MerchantRepo } from "@/unlockrepo/merchant/merchant_repo";
import type {
  MerchantClientFactory,
  MerchantName,
} from "@/unlockrepo/merchant/merchant_client";
import { Connection } from "@/unlockrepo/user/connection";

export function createUnlock({
  userRepo,
  unlockRepo,
  merchantRepo,
  merchantClientFactory,
}: {
  userRepo: UserRepo;
  unlockRepo: UnlockRepo;
  merchantRepo: MerchantRepo;
  merchantClientFactory: MerchantClientFactory;
}) {
  return async ({
    userId,
    merchantName,
    productId,
    repositoryId,
  }: {
    userId: string;
    merchantName: MerchantName;
    productId: string;
    repositoryId: string;
  }) => {
    const user = await userRepo.findWithConnections(userId);
    const connectionsByType = Connection.toMapByType(user.connections);

    const githubConnection = connectionsByType.get("github");
    const merchantConnection = connectionsByType.get(merchantName);

    const merchantClient = merchantClientFactory.createClient(
      merchantName,
      merchantConnection.tokens.accessToken
    );

    const unlock = await unlockRepo.create({
      userId,
      productId,
      repositoryId,
      githubConnectionId: githubConnection.id,
      merchantConnectionId: merchantConnection.id,
    });

    const webhook = await merchantClient.createWebhook("sale");

    await merchantRepo.createWebhook({
      userId,
      unlockId: unlock.id,
      merchantConnectionId: merchantConnection.id,
      merchantWebhookId: webhook.id,
      name: webhook.name,
    });
  };
}

export function deleteUnlock({
  userRepo,
  unlockRepo,
  merchantRepo,
  merchantClientFactory,
}: {
  userRepo: UserRepo;
  unlockRepo: UnlockRepo;
  merchantRepo: MerchantRepo;
  merchantClientFactory: MerchantClientFactory;
}) {
  return async ({ unlockId, userId }: { unlockId: string; userId: string }) => {
    const user = await userRepo.findWithConnections(userId);
    const unlock = await unlockRepo.find(unlockId, userId);
    const connectionsById = Connection.toMapById(user.connections);
    const merchantConnection = connectionsById.get(unlock.merchantConnectionId);

    const merchantClient = merchantClientFactory.createClient(
      merchantConnection.name,
      merchantConnection.tokens.accessToken
    );

    const webhooks = await merchantRepo.findWebhooksByUnlockId({
      userId,
      unlockId,
    });

    const deletePromises = webhooks.map(async (webhook) => {
      await merchantClient.deleteWebhook(webhook.merchantWebhookId);
      await merchantRepo.deleteWebhook({
        userId,
        id: webhook.id,
      });
    });

    await Promise.allSettled(deletePromises);
  };
}
