import { db } from "@/database/client";
import { MerchantRepo } from "@/unlockrepo/merchant/merchant_repo";
import { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import { createUnlock, deleteUnlock } from "@/unlockrepo/unlock/unlock_service";
import { UserRepo } from "@/unlockrepo/user/user_repo";
import { MerchantClientFactory } from "@/unlockrepo/merchant/merchant_client";
import { GithubClientFactory } from "@/unlockrepo/github/github_client";
import {
  getGithubRepositories,
  inviteCustomerToRepository,
} from "@/unlockrepo/github/github_service";
import {
  getMerchantProducts,
  processWebhook,
} from "@/unlockrepo/merchant/merchant_service";
import { createLogger } from "@/unlockrepo/logger";

export const createAppServices = () => {
  const logger = createLogger();
  const userRepo = new UserRepo(db);
  const unlockRepo = new UnlockRepo(db);
  const merchantRepo = new MerchantRepo(db);
  const merchantClientFactory = new MerchantClientFactory();
  const githubClientFactory = new GithubClientFactory();

  const github = {
    getGithubRepositories: getGithubRepositories({
      logger: logger.child({ scope: "getGithubRepositories" }),
      githubClientFactory,
    }),
    inviteCustomerToRepository: inviteCustomerToRepository({
      logger: logger.child({ scope: "inviteCustomerToRepository" }),
      githubClientFactory,
    }),
  };

  return {
    logger,
    github,
    unlock: {
      repo: unlockRepo,
      createUnlock: createUnlock({
        logger: logger.child({ scope: "createUnlock" }),
        unlockRepo,
        merchantRepo,
        merchantClientFactory,
        githubClientFactory,
      }),
      deleteUnlock: deleteUnlock({
        logger: logger.child({ scope: "deleteUnlock" }),
        unlockRepo,
        merchantRepo,
        merchantClientFactory,
      }),
    },
    merchant: {
      getMerchantProducts: getMerchantProducts({
        logger: logger.child({ scope: "getMerchantProducts" }),
        merchantClientFactory,
      }),
      processWebhook: processWebhook({
        logger: logger.child({ scope: "processWebhook" }),
        userRepo,
        unlockRepo,
        inviteCustomerToRepository: github.inviteCustomerToRepository,
      }),
    },
  };
};

export type Services = ReturnType<typeof createAppServices>;
