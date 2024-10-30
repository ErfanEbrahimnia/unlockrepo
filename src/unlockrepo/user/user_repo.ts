import type { NotNull } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import type { Database } from "@/database/client";
import { Encryptor } from "@/unlockrepo/utils/encryptor";
import { User, type UserWithConnections } from "./user";
import type { ConnectionName, ConnectionTokens } from "./connection";
import { Session, type SessionWithRelations } from "./session";

export class UserRepo {
  constructor(private db: Database) {}

  async createUserWithConnection({
    username,
    connectionId,
    connectionName,
    connectionTokens,
  }: {
    username: string;
    connectionId: string;
    connectionName: ConnectionName;
    connectionTokens: ConnectionTokens;
  }): Promise<UserWithConnections> {
    return this.db.transaction().execute(async (trx) => {
      const user = await trx
        .insertInto("users")
        .values({
          username,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const newConnection = await trx
        .insertInto("userConnections")
        .values({
          userId: user.id,
          name: connectionName,
          connectionId,
          tokens: Encryptor.encryptJSON(connectionTokens),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return {
        ...user,
        connections: [{ ...newConnection, tokens: connectionTokens }],
      };
    });
  }

  findByGithubId(githubId: string): Promise<User | undefined> {
    return this.db
      .selectFrom("users")
      .innerJoin("userConnections", "userConnections.userId", "users.id")
      .select([
        "users.id",
        "users.username",
        "users.createdAt",
        "users.updatedAt",
      ])
      .where((eb) =>
        eb.and([
          eb("userConnections.name", "=", "github"),
          eb("userConnections.connectionId", "=", githubId),
        ])
      )
      .executeTakeFirst();
  }

  async findSessionWithRelations(
    sessionId: string
  ): Promise<SessionWithRelations | undefined> {
    const result = await this.db
      .selectFrom("sessions")
      .selectAll()
      .select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("users")
            .selectAll()
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("userConnections")
                  .selectAll()
                  .whereRef("users.id", "=", "sessions.userId")
              ).as("connections")
            )
            .whereRef("users.id", "=", "sessions.userId")
        ).as("user")
      )
      .where("sessions.id", "=", sessionId)
      .$narrowType<{ user: NotNull }>()
      .executeTakeFirst();

    if (!result) return undefined;

    const { user: encryptedUserWithConnections, ...session } = result;
    const { connections, ...user } = encryptedUserWithConnections;

    return Session.marshalWithRelations(session, user, connections);
  }

  async findWithConnections(userId: string): Promise<UserWithConnections> {
    const { connections, ...user } = await this.db
      .selectFrom("users")
      .selectAll()
      .select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("userConnections")
            .selectAll()
            .whereRef("userConnections.userId", "=", "users.id")
        ).as("connections")
      )
      .where("users.id", "=", userId)
      .executeTakeFirstOrThrow();

    return User.marshalWithConnections(user, connections);
  }
}
