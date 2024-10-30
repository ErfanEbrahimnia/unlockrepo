import { Lucia, type DatabaseSession, type DatabaseUser } from "lucia";
import { GitHub } from "arctic";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { db, pgPool } from "@/database/client";
import { isProduction } from "@/config/env";
import { UserRepo } from "@/unlockrepo/user/user_repo";
import type { UserWithConnections } from "@/unlockrepo/user/user";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

class CustomAdapter extends NodePostgresAdapter {
  public async getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const userRepo = new UserRepo(db);

    const sessionWithRelations = await userRepo.findSessionWithRelations(
      sessionId
    );

    if (!sessionWithRelations) {
      return [null, null];
    }

    const { user, ...session } = sessionWithRelations;

    return [
      { ...session, attributes: {} },
      { id: user.id, attributes: user },
    ];
  }
}

const adapter = new CustomAdapter(pgPool, {
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
      ...attributes,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: UserWithConnections;
  }

  interface User extends UserWithConnections {
    id: string;
  }
}
