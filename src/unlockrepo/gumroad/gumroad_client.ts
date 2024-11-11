import z from "zod";
import { env } from "@/config/env";
import { HTTPClient } from "@/unlockrepo/http_client";
import type { MerchantClient } from "@/unlockrepo/merchant/merchant_client";
import type { MerchantWebhookName } from "@/unlockrepo/merchant/merchant_webhook";
import { Encryptor } from "@/unlockrepo/utils/encryptor";

export class GumroadClient implements MerchantClient {
  private httpClient: HTTPClient;

  private accessToken: string;

  public static create({ accessToken }: { accessToken: string }) {
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
    const response = await this.httpClient.get<GumroadResponse>({
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
            short_url: z.string().url(),
          })
        ),
      })
      .parse(response);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      url: product.short_url,
    }));
  }

  public async getProduct(id: string) {
    const response = await this.httpClient.get<GumroadResponse>({
      url: `products/${id}`,
      searchParams: { access_token: this.accessToken },
    });

    this.validateResponse(response);

    const { product } = z
      .object({
        product: z.object({
          id: z.string(),
          name: z.string(),
          short_url: z.string().url(),
        }),
      })
      .parse(response);

    return {
      id: product.id,
      name: product.name,
      url: product.short_url,
    };
  }

  public async getActiveWebhooks(name: MerchantWebhookName) {
    const response = await this.httpClient.get<GumroadResponse>({
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

  public async createWebhook(name: MerchantWebhookName, unlockId: string) {
    const verification = Encryptor.encryptJSON({ unlockId });
    const webhookURL = new URL(
      "/api/connections/gumroad/webhook",
      env.WEBHOOK_URL
    ).href;
    const searchParams = new URLSearchParams({ verification });
    const webhookURLWithParams = `${webhookURL}?${searchParams.toString()}`;

    const response = await this.httpClient.put<GumroadResponse>({
      url: "resource_subscriptions/",
      json: {
        access_token: this.accessToken,
        resource_name: name,
        // The post_url has a limit of 231 characters
        post_url: webhookURLWithParams,
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
    const response = await this.httpClient.delete<GumroadResponse>({
      url: `resource_subscriptions/${resourceId}`,
      searchParams: { access_token: this.accessToken },
    });

    this.validateResponse(response);
  }

  private validateResponse(response: GumroadResponse) {
    if (response.success) {
      return response;
    }
    throw new Error(response.message);
  }
}

export type GumroadResponse =
  | {
      success: true;
      [key: string]: any;
    }
  | {
      success: false;
      message: string;
      [key: string]: any;
    };
