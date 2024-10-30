import type { ColumnType, GeneratedAlways, Selectable } from "kysely";
import { User, type UserWithConnections } from "@/unlockrepo/user/user";
import { Connection } from "./connection";

export interface SessionTable {
  id: GeneratedAlways<string>;
  userId: string;
  expiresAt: Date;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Session = Selectable<SessionTable>;

export interface SessionWithRelations extends Session {
  user: UserWithConnections;
}

function marshalWithRelations(
  session: Session,
  user: User,
  connections: Connection[]
) {
  return {
    ...session,
    user: User.marshalWithConnections(user, connections),
  };
}

export const Session = {
  marshalWithRelations,
};
