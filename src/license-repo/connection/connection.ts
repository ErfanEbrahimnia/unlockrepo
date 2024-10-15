import { z } from "zod";
import { StrictMap } from "@/license-repo/utils/strict_map";
import { Encryptor } from "../utils/encryptor";

const typeSchema = z.union([
  z.literal("github"),
  z.literal("gumroad"),
  z.literal("lemonsqueezy"),
]);

export type ConnectionType = z.infer<typeof typeSchema>;

const schema = z.object({
  id: z.string().ulid(),
  connectionId: z.string().min(1),
  type: typeSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const deserializedConnectionSchema = schema.merge(
  z.object({
    tokens: z.preprocess(
      (value) => Encryptor.decryptJSON(String(value)),
      z.object({
        accessToken: z.string().min(1),
      })
    ),
  })
);

export type Connection = z.infer<typeof deserializedConnectionSchema>;

export const serializedConnectionSchema = schema.merge(
  z.object({
    tokens: z.preprocess((value) => Encryptor.encryptJSON(value), z.string()),
  })
);

function parse(params: unknown): Connection {
  return deserializedConnectionSchema.parse(params);
}

function parseMany(params: unknown): Connection[] {
  return z.array(deserializedConnectionSchema).parse(params);
}

function serialize(params: unknown) {
  return serializedConnectionSchema.parse(params);
}

function toStrictMap(connections: Connection[]) {
  return new StrictMap(
    connections.map((connection) => [connection.type, connection])
  );
}

export const Connection = {
  parse,
  parseMany,
  serialize,
  toStrictMap,
};
