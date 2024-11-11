import type {
  MerchantClientFactory,
  MerchantName,
} from "@/unlockrepo/merchant/merchant_client";
import type { UserWithConnections } from "@/unlockrepo/user/user";
import { Connection } from "@/unlockrepo/user/connection";
import type { inviteCustomerToRepository } from "@/unlockrepo/github/github_service";
import { AppError } from "@/unlockrepo/errors";
import type { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import type { UserRepo } from "@/unlockrepo/user/user_repo";
import type { Logger } from "@/unlockrepo/logger";
import type { MerchantWebhookName } from "./merchant_webhook";

export function getMerchantProducts({
  logger,
  merchantClientFactory,
}: {
  logger: Logger;
  merchantClientFactory: MerchantClientFactory;
}) {
  return async ({
    user,
    merchantName,
  }: {
    user: UserWithConnections;
    merchantName: MerchantName;
  }) => {
    const connectionsByName = Connection.toMapByName(user.connections);
    const merchantConnection = connectionsByName.get(merchantName);
    const merchantClient = merchantClientFactory.createClient(
      merchantName,
      merchantConnection.tokens.accessToken
    );

    const products = await merchantClient.getProducts();

    logger.debug("Fetched user products", { userId: user.id, merchantName });

    return products;
  };
}

interface ProcessWebhookContext {
  logger: Logger;
  userRepo: UserRepo;
  unlockRepo: UnlockRepo;
  inviteCustomerToRepository: ReturnType<typeof inviteCustomerToRepository>;
}

export function processWebhook({
  logger,
  userRepo,
  unlockRepo,
  inviteCustomerToRepository,
}: ProcessWebhookContext) {
  return async ({
    unlockId,
    githubUsername,
    name,
  }: {
    unlockId: string;
    githubUsername: string;
    name: MerchantWebhookName;
  }) => {
    if (["sale"].includes(name) === false) {
      throw new AppError(`Resource "${name}" not implemented`);
    }

    const unlock = await unlockRepo.findById(unlockId);
    const user = await userRepo.findWithConnections(unlock.userId);

    await inviteCustomerToRepository({
      user,
      unlock,
      githubUsername,
    });

    logger.debug(`Processed webhook"`, {
      userId: user.id,
      unlockId,
      githubUsername,
      webhookName: name,
    });
  };
}
