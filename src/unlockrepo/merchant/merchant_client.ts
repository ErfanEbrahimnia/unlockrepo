import { GumroadClient } from "@/unlockrepo/gumroad/gumroad_client";
import type { MerchantWebhookName } from "./merchant_webhook";

export type MerchantName = "gumroad" | "lemonsqueezy";

export type MerchantClientWebhook = {
  id: string;
  name: MerchantWebhookName;
};

export interface MerchantProduct {
  id: string;
  name: string;
  url: string;
}

export interface MerchantClient {
  getProducts(): Promise<MerchantProduct[]>;

  getProduct(id: string): Promise<MerchantProduct>;

  getActiveWebhooks(
    name: MerchantWebhookName
  ): Promise<MerchantClientWebhook[]>;

  createWebhook(
    name: MerchantWebhookName,
    unlockId: string
  ): Promise<MerchantClientWebhook>;

  deleteWebhook(webhookId: string): Promise<void>;
}

export class MerchantClientFactory {
  constructor() {}

  createClient(
    name: MerchantName | (string & {}),
    accessToken: string
  ): MerchantClient {
    switch (name) {
      case "gumroad":
        return GumroadClient.create({
          accessToken,
        });
      default:
        throw new Error(`Merchant with name "${name}" is not defined`);
    }
  }
}
