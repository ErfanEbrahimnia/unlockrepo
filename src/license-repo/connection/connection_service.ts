import { Connection } from "./connection";
import type { ConnectionRepo } from "./connection_repo";

export class ConnectionService {
  private connectionRepo: ConnectionRepo;

  public constructor({ connectionRepo }: { connectionRepo: ConnectionRepo }) {
    this.connectionRepo = connectionRepo;
  }

  async findUserConnections(userId: string) {
    const connections = await this.connectionRepo.findUserConnections(userId);

    return Connection.toStrictMap(connections);
  }
}
