import type { Connection } from "@/license-repo/connection/connection";
import { GumroadClient } from "@/license-repo/gumroad/gumroad_client";
import type { MerchantClient } from "./merchant_client";

type ClientName = "gumroad" | "lemonsqueezy" | (string & {});

type CreateClient = (name: ClientName, accessToken: string) => MerchantClient;

export class MerchantService {
  private createClient: CreateClient;

  static createClient(name: ClientName, accessToken: string): MerchantClient {
    switch (name) {
      case "gumroad":
        return GumroadClient.create(accessToken);
      default:
        throw new Error(`Merchant with name ${name} is not defined`);
    }
  }

  constructor({ createClient }: { createClient: CreateClient }) {
    this.createClient = createClient;
  }

  async getUserProducts(merchantConnection: Connection) {
    return this.createClient(
      merchantConnection.type,
      merchantConnection.tokens.accessToken
    ).getProducts();
  }

  async getActiveWebhooks({
    name,
    merchantConnection,
  }: {
    name: "sale" | "refund";
    merchantConnection: Connection;
  }) {
    return this.createClient(
      merchantConnection.type,
      merchantConnection.tokens.accessToken
    ).getActiveWebhooks(name);
  }

  async createWebhook({
    name,
    merchantConnection,
  }: {
    name: "sale" | "refund";
    merchantConnection: Connection;
  }) {
    return this.createClient(
      merchantConnection.type,
      merchantConnection.tokens.accessToken
    ).createWebhook(name);
  }

  async deleteWebhook({
    webhookId,
    merchantConnection,
  }: {
    webhookId: string;
    merchantConnection: Connection;
  }) {
    return this.createClient(
      merchantConnection.type,
      merchantConnection.tokens.accessToken
    ).deleteWebhook(webhookId);
  }
}
