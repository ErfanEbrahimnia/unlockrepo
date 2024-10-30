import z from "zod";
import { env } from "@/config/env";
import { HTTPClient } from "@/unlockrepo/http_client";
import type { MerchantClient } from "@/unlockrepo/merchant/merchant_client";
import type { MerchantWebhookName } from "@/unlockrepo/merchant/merchant_webhook";
import type {
  GumroadDeletedResourceSubscriptionResponse,
  GumroadProductResponse,
  GumroadResourceSubscriptionResponse,
  GumroadResponse,
} from "./gumroad_respones";

export class GumroadClient implements MerchantClient {
  private httpClient: HTTPClient;

  private accessToken: string;

  public static create(accessToken: string) {
    return new GumroadClient({
      accessToken,
      httpClient: new HTTPClient({
        prefixURL: "https://api.gumroad.com/v2",
      }),
    });
  }

  constructor({
    httpClient,
    accessToken,
  }: {
    httpClient: HTTPClient;
    accessToken: string;
  }) {
    this.httpClient = httpClient;
    this.accessToken = accessToken;
  }

  public async getProducts() {
    const response = await this.httpClient.get<GumroadProductResponse>({
      url: `products/`,
      searchParams: { access_token: this.accessToken },
    });

    this.validateResponse(response);

    const { products } = z
      .object({
        products: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
      .parse(response);

    return products;
  }

  public async getActiveWebhooks(name: MerchantWebhookName) {
    const response =
      await this.httpClient.get<GumroadResourceSubscriptionResponse>({
        url: `resource_subscriptions/`,
        searchParams: {
          access_token: this.accessToken,
          resource_name: name,
        },
      });

    this.validateResponse(response);

    const { resource_subscriptions } = z
      .object({
        resource_subscriptions: z.array(
          z.object({
            id: z.string(),
            resource_name: z.union([z.literal("sale"), z.literal("refund")]),
          })
        ),
      })
      .parse(response);

    return resource_subscriptions.map((subscription) => ({
      id: subscription.id,
      name: subscription.resource_name,
    }));
  }

  public async createWebhook(name: MerchantWebhookName) {
    const response =
      await this.httpClient.put<GumroadResourceSubscriptionResponse>({
        url: "resource_subscriptions/",
        json: {
          access_token: this.accessToken,
          resource_name: name,
          post_url: new URL("/api/connections/gumroad/webhook", env.WEBHOOK_URL)
            .href,
        },
      });

    this.validateResponse(response);

    const { resource_subscription } = z
      .object({
        resource_subscription: z.object({
          id: z.string(),
          resource_name: z.union([z.literal("sale"), z.literal("refund")]),
        }),
      })
      .parse(response);

    return {
      id: resource_subscription.id,
      name: resource_subscription.resource_name,
    };
  }

  public async deleteWebhook(resourceId: string) {
    const response =
      await this.httpClient.delete<GumroadDeletedResourceSubscriptionResponse>({
        url: `resource_subscriptions/${resourceId}`,
        searchParams: { access_token: this.accessToken },
      });

    this.validateResponse(response);
  }

  private validateResponse(response: GumroadResponse<unknown, string>) {
    if (response.success) {
      return response;
    }
    throw new Error(response.message);
  }
}
