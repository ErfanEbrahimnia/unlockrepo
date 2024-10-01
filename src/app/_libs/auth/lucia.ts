import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { client } from "@/database/client";
import type { Schema } from "@/database/schema";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

const adapter = new LibSQLAdapter(client, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
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
