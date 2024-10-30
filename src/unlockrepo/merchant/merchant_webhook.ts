import type { ColumnType, GeneratedAlways, Selectable } from "kysely";

export type MerchantWebhookName = "sale" | "refund";

export interface MerchantWebhookTable {
  id: GeneratedAlways<string>;
  name: MerchantWebhookName;
  userId: string;
  unlockId: string;
  merchantConnectionId: string;
  merchantWebhookId: string;
  updatedAt: ColumnType<Date, never, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type MerchantWebhook = Selectable<MerchantWebhookTable>;
