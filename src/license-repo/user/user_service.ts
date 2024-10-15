import type { UserRepo } from "./user_repo";

export class UserService {
  private userRepo: UserRepo;

  public constructor({ userRepo }: { userRepo: UserRepo }) {
    this.userRepo = userRepo;
  }
}
