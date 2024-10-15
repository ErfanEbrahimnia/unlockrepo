import type { ColumnType } from "kysely";

interface BaseTable {
  updatedAt: ColumnType<Date, never, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
}

interface UserTable extends BaseTable {
  id: string;
  username: string;
}

interface SessionTable {
  id: string;
  userId: string;
  expiresAt: number;
  createdAt: ColumnType<Date, string | undefined, never>;
}

interface UserConnections extends BaseTable {
  id: string;
  userId: string;
  connectionId: string;
  type: "github" | "gumroad" | "lemonsqueezy";
  tokens: string;
}

interface Unlocks extends BaseTable {
  id: string;
  userId: string;
  githubConnectionId: string;
  merchantConnectionId: string;
  productId: string;
  repositoryId: string;
}

interface MerchantWebhooks extends BaseTable {
  id: string;
  name: string;
  userId: string;
  unlockId: string;
  merchantConnectionId: string;
  merchantWebhookId: string;
}

export interface Schema {
  users: UserTable;
  sessions: SessionTable;
  userConnections: UserConnections;
  unlocks: Unlocks;
  merchantWebhooks: MerchantWebhooks;
}
