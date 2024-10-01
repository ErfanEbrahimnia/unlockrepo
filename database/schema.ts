interface UserTable {
  id: string;
  username: string;
  githubId: string;
}

interface SessionTable {
  id: string;
  userId: string;
  expiresAt: number;
}

export interface Schema {
  users: UserTable;
  sessions: SessionTable;
}
