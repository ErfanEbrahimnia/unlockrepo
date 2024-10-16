import type { ColumnType, GeneratedAlways } from "kysely";

interface BaseTable {
  updatedAt: ColumnType<Date, never, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
}

interface User extends BaseTable {
  id: GeneratedAlways<string>;
  username: string;
}

interface UserConnection extends BaseTable {
  id: GeneratedAlways<string>;
  userId: string;
  connectionId: string;
  type: "github" | "gumroad" | "lemonsqueezy";
  tokens: string;
}

interface Unlock extends BaseTable {
  id: GeneratedAlways<string>;
  userId: string;
  githubConnectionId: string;
  merchantConnectionId: string;
  productId: string;
  repositoryId: string;
}

interface MerchantWebhook extends BaseTable {
  id: GeneratedAlways<string>;
  name: string;
  userId: string;
  unlockId: string;
  merchantConnectionId: string;
  merchantWebhookId: string;
}

export interface Schema {
  users: User;
  userConnections: UserConnection;
  unlocks: Unlock;
  merchantWebhooks: MerchantWebhook;
}
