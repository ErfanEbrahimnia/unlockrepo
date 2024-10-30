interface PurchasingPowerParityPrices {
  US: number;
  IN: number;
  EC: number;
}

interface RecurrencePrices {
  monthly: {
    price_cents: number;
    suggested_price_cents: number | null;
    purchasing_power_parity_prices: PurchasingPowerParityPrices;
  };
}

interface VariantOption {
  name: string;
  price_difference: number;
  purchasing_power_parity_prices: PurchasingPowerParityPrices;
  is_pay_what_you_want: boolean;
  recurrence_prices: RecurrencePrices | null;
}

interface Variant {
  title: string;
  options: VariantOption[];
}

interface Product {
  custom_permalink: string | null;
  custom_receipt: string | null;
  custom_summary: string;
  custom_fields: any[];
  customizable_price: number | null;
  description: string;
  deleted: boolean;
  max_purchase_count: number | null;
  name: string;
  preview_url: string | null;
  require_shipping: boolean;
  subscription_duration: number | null;
  published: boolean;
  url: string;
  id: string;
  price: number;
  purchasing_power_parity_prices: PurchasingPowerParityPrices;
  currency: string;
  short_url: string;
  thumbnail_url: string;
  tags: string[];
  formatted_price: string;
  file_info: Record<string, unknown>;
  sales_count: string;
  sales_usd_cents: string;
  is_tiered_membership: boolean;
  recurrences: string[] | null;
  variants: Variant[];
}

type UrlParams = {
  source_url: string;
  campaignid: string;
  userid: string;
  version: string;
};

type Variants = {
  size?: string;
  color?: string;
};

type CustomFields = {
  [key: string]: string; // dynamic fields, for example: {'name': 'john smith', 'spouse name': 'jane smith'}
};

type ShippingInformation = {
  [key: string]: any; // more specific details depending on what fields shipping info contains
};

type PaymentInstrumentDetails = {
  [key: string]: any; // similar to shipping info, assuming details might vary
};

type Webhook = {
  sale_id: string;
  sale_timestamp: string; // or Date if you will convert it
  order_number: number;
  seller_id: string;
  product_id: string;
  product_permalink: string;
  short_product_id: string;
  product_name: string;
  email: string;
  url_params: UrlParams;
  full_name?: string;
  purchaser_id?: string;
  subscription_id?: string;
  ip_country?: string;
  price: number; // in USD cents
  recurrence?: string; // 'monthly', 'yearly', etc
  variants?: Variants;
  offer_code?: string;
  test?: boolean;
  custom_fields?: CustomFields;
  shipping_information?: ShippingInformation;
  is_recurring_charge?: boolean;
  is_preorder_authorization?: boolean;
  license_key?: string;
  quantity: number;
  shipping_rate?: number; // in USD cents
  affiliate?: string;
  affiliate_credit_amount_cents?: number;
  is_gift_receiver_purchase?: boolean;
  gifter_email?: string;
  gift_price?: number; // in USD cents
  refunded: boolean;
  discover_fee_charged: boolean;
  can_contact?: boolean;
  referrer?: string;
  gumroad_fee: number; // in USD cents
  card?: PaymentInstrumentDetails;
};

type ResourceSubscription = {
  id: string;
  resource_name: string;
  post_url: string;
};

type DeletedResourceSubscription = {
  message: string;
};

type GumroadResponseMapped<T, N extends string> = {
  [key in N]: T;
};

export type GumroadResponse<T, N extends string> =
  | (GumroadResponseMapped<T, N> & {
      success: true;
      [key: string]: any;
    })
  | {
      success: false;
      message: string;
      [key: string]: any;
    };

export type GumroadProductResponse = GumroadResponse<Product[], "products">;

export type GumroadResourceSubscriptionResponse = GumroadResponse<
  ResourceSubscription,
  "resource_subscription"
>;

export type GumroadProduct = Product;

export type GumroadWebhook = Webhook;

export type GumroadDeletedResourceSubscriptionResponse = GumroadResponse<
  DeletedResourceSubscription,
  "message"
>;
