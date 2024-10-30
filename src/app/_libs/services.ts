import React from "react";
import { db } from "@/database/client";
import { MerchantRepo } from "@/unlockrepo/merchant/merchant_repo";
import { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import { createUnlock, deleteUnlock } from "@/unlockrepo/unlock/unlock_service";
import { UserRepo } from "@/unlockrepo/user/user_repo";
import { MerchantClientFactory } from "@/unlockrepo/merchant/merchant_client";
import { GithubClientFactory } from "@/unlockrepo/github/github_client";
import { getGithubRepositories } from "@/unlockrepo/github/github_service";
import { getMerchantProducts } from "@/unlockrepo/merchant/merchant_service";

export const createServices = React.cache(() => {
  const userRepo = new UserRepo(db);
  const unlockRepo = new UnlockRepo(db);
  const merchantRepo = new MerchantRepo(db);
  const merchantClientFactory = new MerchantClientFactory();
  const githubClientFactory = new GithubClientFactory();

  return {
    unlock: {
      createUnlock: createUnlock({
        userRepo,
        unlockRepo,
        merchantRepo,
        merchantClientFactory,
      }),
      deleteUnlock: deleteUnlock({
        userRepo,
        unlockRepo,
        merchantRepo,
        merchantClientFactory,
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
});
