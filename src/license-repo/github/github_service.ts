import type { GithubClient } from "./github_client";
import type { Connection } from "@/license-repo/connection/connection";

export class GithubService {
  private githubClient: GithubClient;

  public constructor({ githubClient }: { githubClient: GithubClient }) {
    this.githubClient = githubClient;
  }

  async getUserRepositories({
    githubConnection,
  }: {
    githubConnection: Connection;
  }) {
    return this.githubClient.getRepos({
      accessToken: githubConnection.tokens.accessToken,
    });
  }
}
