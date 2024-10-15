import type { Database } from "@/database/client";

export class UserRepo {
  constructor(private db: Database) {}
}
