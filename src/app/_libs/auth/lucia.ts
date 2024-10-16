import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { pgPool } from "@/database/client";
import type { Schema } from "@/database/schema";
import { isProduction } from "@/config/env";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

const adapter = new NodePostgresAdapter(pgPool, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: isProduction(),
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Schema["users"];
  }
}
