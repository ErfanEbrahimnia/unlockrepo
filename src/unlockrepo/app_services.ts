import { db } from "@/database/client";
import { MerchantRepo } from "@/unlockrepo/merchant/merchant_repo";
import { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import { createUnlock } from "@/unlockrepo/unlock/unlock_service";
// import { UserRepo } from "@/unlockrepo/user/user_repo";
import { MerchantClientFactory } from "@/unlockrepo/merchant/merchant_client";
import { GithubClientFactory } from "@/unlockrepo/github/github_client";
import { getGithubRepositories } from "@/unlockrepo/github/github_service";
import { getMerchantProducts } from "@/unlockrepo/merchant/merchant_service";

export const createAppServices = () => {
  // const userRepo = new UserRepo(db);
  const unlockRepo = new UnlockRepo(db);
  const merchantRepo = new MerchantRepo(db);
  const merchantClientFactory = new MerchantClientFactory();
  const githubClientFactory = new GithubClientFactory();

  return {
    unlock: {
      repo: unlockRepo,
      createUnlock: createUnlock({
        unlockRepo,
        merchantRepo,
        merchantClientFactory,
        githubClientFactory,
      }),
    },
    github: {
      getGithubRepositories: getGithubRepositories({
        githubClientFactory,
      }),
    },
    merchant: {
      getMerchantProducts: getMerchantProducts({
        merchantClientFactory,
      }),
    },
  };
};
