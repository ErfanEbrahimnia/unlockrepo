import z from "zod";
import { env } from "@/config/env";
import { HTTPClient } from "@/license-repo/http_client";
import type {
  GumroadProductResponse,
  GumroadResourceSubscriptionResponse,
  GumroadResponse,
} from "./gumroad_respones";
import type { MerchantClient } from "@/license-repo/merchant/merchant_client";

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

  public getProducts = () =>
    this.httpClient
      .get<GumroadProductResponse>({
        url: `products/`,
        searchParams: { access_token: this.accessToken },
      })
      .then((res) =>
        this.parseResponse(
          res,
          z.object({
            products: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              })
            ),
          })
        )
      )
      .then((res) => res.products);

  public getActiveWebhooks = (name: "sale" | "refund") =>
    this.httpClient
      .get<GumroadResourceSubscriptionResponse>({
        url: `resource_subscriptions/`,
        searchParams: {
          access_token: this.accessToken,
          resource_name: name,
        },
      })
      .then((res) =>
        this.parseResponse(
          res,
          z.object({
            resource_subscriptions: z.array(
              z.object({
                id: z.string(),
                resource_name: z.union([
                  z.literal("sale"),
                  z.literal("refund"),
                ]),
              })
            ),
          })
        )
      )
      .then(({ resource_subscriptions }) =>
        resource_subscriptions.map((subscription) => ({
          id: subscription.id,
          name: subscription.resource_name,
        }))
      );

  public createWebhook = (name: "sale" | "refund") =>
    this.httpClient
      .put<GumroadResourceSubscriptionResponse>({
        url: "resource_subscriptions/",
        json: {
          access_token: this.accessToken,
          resource_name: name,
          post_url: new URL("/api/connections/gumroad/webhook", env.WEBHOOK_URL)
            .href,
        },
      })
      .then((res) =>
        this.parseResponse(
          res,
          z.object({
            resource_subscription: z.object({
              id: z.string(),
              resource_name: z.union([z.literal("sale"), z.literal("refund")]),
            }),
          })
        )
      )
      .then(({ resource_subscription }) => ({
        id: resource_subscription.id,
        name: resource_subscription.resource_name,
      }));

  public deleteWebhook = async (resourceId: string) => {
    await this.httpClient.delete({
      url: `resource_subscriptions/${resourceId}`,
      searchParams: { access_token: this.accessToken },
    });
  };

  private parseResponse = <
    T extends GumroadResponse<unknown, string>,
    S extends z.AnyZodObject
  >(
    response: T,
    schema: S
  ): Promise<z.infer<S>> => {
    if (!response.success) {
      throw new Error(response.message);
    }

    return z
      .object({
        success: z.literal(true),
      })
      .merge(schema)
      .parseAsync(response);
  };
}
