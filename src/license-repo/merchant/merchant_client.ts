import type { Product } from "./product";

export interface MerchantClient {
  getProducts(): Promise<Product[]>;

  getActiveWebhooks(name: "sale" | "refund"): Promise<MerchantClientWebhook[]>;

  createWebhook(name: "sale" | "refund"): Promise<MerchantClientWebhook>;

  deleteWebhook(webhookId: string): Promise<void>;
}

type MerchantClientWebhook = {
  id: string;
  name: "sale" | "refund";
};
