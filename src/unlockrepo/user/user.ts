import type { ColumnType, GeneratedAlways, Selectable } from "kysely";
import { Connection, type ConnectionTokens } from "./connection";

export interface UserTable {
  id: GeneratedAlways<string>;
  username: string;
  avatarURL: string;
  updatedAt: ColumnType<Date, never, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;

export interface UserWithConnections extends User {
  connections: Connection<ConnectionTokens>[];
}

function marshalWithConnections(user: User, connections: Connection<string>[]) {
  return {
    ...user,
    connections: connections.map((connection) =>
      Connection.withDecryptedTokens(connection)
    ),
  };
}

function getResizedAvatarURL(user: User, size: number = 100): string {
  const urlObj = new URL(user.avatarURL);

  urlObj.searchParams.set("size", size.toString());

  return urlObj.toString();
}

export const User = {
  marshalWithConnections,
  getResizedAvatarURL,
};
