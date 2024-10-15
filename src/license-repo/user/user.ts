import { z } from "zod";
import {
  deserializedConnectionSchema,
  serializedConnectionSchema,
} from "@/license-repo/connection/connection";

export const User = {
  parse,
  parseWithConnections,
  serializeWithConnections,
};

const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

function parse(params: unknown): User {
  return userSchema.parse(params);
}

function parseWithConnections(params: unknown) {
  return withConnectionsDeserializedSchema.parse(params);
}

function serializeWithConnections(params: unknown) {
  return withConnectionsSerializedSchema.parse(params);
}

const withConnectionsDeserializedSchema = userSchema.merge(
  z.object({
    connections: z.array(deserializedConnectionSchema),
  })
);

const withConnectionsSerializedSchema = userSchema.merge(
  z.object({
    connections: z.array(serializedConnectionSchema),
  })
);

export type UserWithConnections = z.infer<
  typeof withConnectionsDeserializedSchema
>;
