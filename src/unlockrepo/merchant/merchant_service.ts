import type {
  MerchantClientFactory,
  MerchantName,
} from "@/unlockrepo/merchant/merchant_client";
import type { UserWithConnections } from "@/unlockrepo/user/user";
import { Connection } from "@/unlockrepo/user/connection";

export function getMerchantProducts({
  merchantClientFactory,
}: {
  merchantClientFactory: MerchantClientFactory;
}) {
  return async ({
    user,
    merchantName,
  }: {
    user: UserWithConnections;
    merchantName: MerchantName;
  }) => {
    const connectionsByType = Connection.toMapByType(user.connections);
    const merchantConnection = connectionsByType.get(merchantName);
    const merchantClient = await merchantClientFactory.createClient(
      merchantName,
      merchantConnection.tokens.accessToken
    );

    return merchantClient.getProducts();
  };
}
