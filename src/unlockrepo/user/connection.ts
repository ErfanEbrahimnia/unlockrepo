import type { ColumnType, GeneratedAlways, Selectable } from "kysely";
import { StrictMap } from "@/unlockrepo/utils/strict_map";
import { Encryptor } from "@/unlockrepo/utils/encryptor";
import { merchantConfig } from "@/config/merchant_config";

export type ConnectionName = "gumroad" | "lemonsqueezy" | "github";

export type ConnectionTokens = {
  accessToken: string;
};

export interface ConnectionTable<Tokens = string> {
  id: GeneratedAlways<string>;
  userId: string;
  tokens: Tokens;
  connectionId: string;
  name: ConnectionName;
  updatedAt: ColumnType<Date, never, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Connection<Tokens = string> = Selectable<ConnectionTable<Tokens>>;

function withDecryptedTokens(connection: Connection<string>) {
  if (typeof connection.tokens === "string") {
    const tokens = Encryptor.decryptJSON<ConnectionTokens>(
      String(connection.tokens)
    );

    return { ...connection, tokens };
  }

  throw new Error("Failed to decrypt connection tokens");
}

export function isMerchant(merchantIntegrations: string[]) {
  return (connection: Connection<ConnectionTokens>) => {
    return merchantIntegrations.includes(connection.name);
  };
}

function toMapById(connections: Connection<ConnectionTokens>[]) {
  return new StrictMap(
    connections.map((connection) => [connection.id, connection])
  );
}

function toMapByName(connections: Connection<ConnectionTokens>[]) {
  return new StrictMap(
    connections.map((connection) => [connection.name, connection])
  );
}

export const Connection = {
  toMapById,
  toMapByName,
  withDecryptedTokens,
  isMerchant: isMerchant(Object.keys(merchantConfig.merchantIntegrations)),
};
