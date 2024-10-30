import type { GithubClientFactory } from "@/unlockrepo/github/github_client";
import { Connection } from "@/unlockrepo/user/connection";
import type { UserWithConnections } from "@/unlockrepo/user/user";

export function getGithubRepositories({
  githubClientFactory,
}: {
  githubClientFactory: GithubClientFactory;
}) {
  return async ({ user }: { user: UserWithConnections }) => {
    const connectionsByType = Connection.toMapByType(user.connections);
    const githubConnection = connectionsByType.get("github");
    const githubClient = await githubClientFactory.createClient(
      githubConnection.tokens.accessToken
    );

    return githubClient.getRepos();
  };
}
