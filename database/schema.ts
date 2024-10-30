import type { MerchantWebhookTable } from "@/unlockrepo/merchant/merchant_webhook";
import type { SessionTable } from "@/unlockrepo/user/session";
import type { UnlockTable } from "@/unlockrepo/unlock/unlock";
import type { ConnectionTable } from "@/unlockrepo/user/connection";
import type { UserTable } from "@/unlockrepo/user/user";

export interface Schema {
  sessions: SessionTable;
  users: UserTable;
  userConnections: ConnectionTable;
  unlocks: UnlockTable;
  merchantWebhooks: MerchantWebhookTable;
}
