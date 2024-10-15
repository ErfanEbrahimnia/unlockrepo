import React from "react";
import { db } from "@/database/client";
import { UserService } from "@/license-repo/user/user_service";
import { MerchantWebhookService } from "@/license-repo/merchant_webhook/merchant_webhook_service";
import { MerchantWebhookRepo } from "@/license-repo/merchant_webhook/merchant_webhook_repo";
import { UserRepo } from "@/license-repo/user/user_repo";
import { UnlockService } from "@/license-repo/unlock/unlock_service";
import { UnlockRepo } from "@/license-repo/unlock/unlock_repo";
import { ConnectionService } from "@/license-repo/connection/connection_service";
import { ConnectionRepo } from "@/license-repo/connection/connection_repo";
import { GithubClient } from "@/license-repo/github/github_client";
import { GithubService } from "@/license-repo/github/github_service";
import { MerchantService } from "@/license-repo/merchant/merchant_service";

export const createServices = React.cache(() => {
  const githubClient = new GithubClient();

  const userService = new UserService({
    userRepo: new UserRepo(db),
  });

  const connectionService = new ConnectionService({
    connectionRepo: new ConnectionRepo(db),
  });

  const githubService = new GithubService({
    githubClient,
  });

  const merchantService = new MerchantService({
    createClient: MerchantService.createClient,
  });

  const merchantWebhookService = new MerchantWebhookService({
    merchantService,
    merchantWebhookRepo: new MerchantWebhookRepo(db),
  });

  const unlockService = new UnlockService({
    unlockRepo: new UnlockRepo(db),
    merchantWebhookService,
  });

  return {
    userService,
    unlockService,
    githubService,
    merchantService,
    connectionService,
  };
});
