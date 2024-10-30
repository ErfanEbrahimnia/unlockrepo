import { GumroadClient } from "@/unlockrepo/gumroad/gumroad_client";
import type { MerchantWebhookName } from "./merchant_repo";

export type MerchantName = "gumroad" | "lemonsqueezy";

type MerchantClientWebhook = {
  id: string;
  name: MerchantWebhookName;
};

export interface MerchantProduct {
  id: string;
  name: string;
}

export interface MerchantClient {
  getProducts(): Promise<MerchantProduct[]>;

  getActiveWebhooks(
    name: MerchantWebhookName
  ): Promise<MerchantClientWebhook[]>;

  createWebhook(name: MerchantWebhookName): Promise<MerchantClientWebhook>;

  deleteWebhook(webhookId: string): Promise<void>;
}

export class MerchantClientFactory {
  createClient(name: MerchantName | (string & {}), accessToken: string) {
    switch (name) {
      case "gumroad":
        return GumroadClient.create(accessToken);
      default:
        throw new Error(`Merchant with name "${name}" is not defined`);
    }
  }
}
