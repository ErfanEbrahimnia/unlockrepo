import type { ColumnType, GeneratedAlways, Selectable } from "kysely";

export interface UnlockTable {
  id: GeneratedAlways<string>;
  userId: string;
  githubConnectionId: string;
  merchantConnectionId: string;
  productId: string;
  repositoryId: string;
  updatedAt: ColumnType<Date, never, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Unlock = Selectable<UnlockTable>;
