import type { GithubClientFactory } from "@/unlockrepo/github/github_client";
import { Connection } from "@/unlockrepo/user/connection";
import type { UserWithConnections } from "@/unlockrepo/user/user";
import type { Unlock } from "@/unlockrepo/unlock/unlock";
import type { Logger } from "@/unlockrepo/logger";

export function getGithubRepositories({
  logger,
  githubClientFactory,
}: {
  logger: Logger;
  githubClientFactory: GithubClientFactory;
}) {
  return async ({ user }: { user: UserWithConnections }) => {
    const connectionsByName = Connection.toMapByName(user.connections);
    const githubConnection = connectionsByName.get("github");
    const githubClient = await githubClientFactory.createClient(
      githubConnection.tokens.accessToken
    );

    const repos = await githubClient.getRepos();

    logger.debug("Fetched repositories", {
      userId: user.id,
      repositoryCount: repos.length,
    });

    return repos;
  };
}

export function inviteCustomerToRepository({
  logger,
  githubClientFactory,
}: {
  logger: Logger;
  githubClientFactory: GithubClientFactory;
}) {
  return async ({
    user,
    unlock,
    githubUsername,
  }: {
    user: UserWithConnections;
    unlock: Unlock;
    githubUsername: string;
  }) => {
    const connectionsByName = Connection.toMapByName(user.connections);
    const githubConnection = connectionsByName.get("github");

    const githubClient = githubClientFactory.createClient(
      githubConnection.tokens.accessToken
    );

    await githubClient.inviteToRepo({
      ownerName: user.username,
      userName: githubUsername,
      repoName: unlock.repositoryName,
    });

    logger.info("Invited customer", {
      ownerId: user.id,
      ownerName: user.username,
      invitedUsername: githubUsername,
      repoName: unlock.repositoryName,
    });
  };
}
