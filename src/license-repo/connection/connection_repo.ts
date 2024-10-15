import type { Database } from "@/database/client";
import { Connection } from "./connection";

export class ConnectionRepo {
  constructor(private db: Database) {}

  async findUserConnections(userId: string) {
    const connectionRecords = await this.db
      .selectFrom("userConnections")
      .selectAll()
      .where("userId", "=", userId)
      .execute();

    return Connection.parseMany(connectionRecords);
  }
}
