import type { UnlockRepo } from "@/unlockrepo/unlock/unlock_repo";
import type { MerchantRepo } from "@/unlockrepo/merchant/merchant_repo";
import type {
  MerchantClientFactory,
  MerchantName,
} from "@/unlockrepo/merchant/merchant_client";
import { Connection } from "@/unlockrepo/user/connection";
import type { UserWithConnections } from "@/unlockrepo/user/user";
import type { GithubClientFactory } from "@/unlockrepo/github/github_client";

export function createUnlock({
  unlockRepo,
  merchantRepo,
  merchantClientFactory,
  githubClientFactory,
}: {
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

    await githubClient.getRepository(repositoryId);

    const [product, repository] = await Promise.all([
      merchantClient.getProduct(productId),
      githubClient.getRepository(repositoryId),
    ]);

    await unlockRepo.create({
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

    const webhookName = "sale";

    await merchantRepo.createWebhookOnce({
      userId: user.id,
      merchantConnectionId: merchantConnection.id,
      name: webhookName,
      // createWebhook: () => merchantClient.createWebhook(webhookName),
      createWebhook: () =>
        Promise.resolve({
          id: "123456",
          name: "sale",
        }),
    });
  };
}
