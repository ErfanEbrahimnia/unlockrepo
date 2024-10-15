import { Octokit } from "octokit";
import { Repository } from "./repository";

export class GithubClient {
  private createClient(accessToken: string) {
    return new Octokit({ auth: accessToken });
  }

  async getRepos({ accessToken }: { accessToken: string }) {
    const { data } = await this.createClient(accessToken).request(
      "GET /user/repos",
      {
        per_page: 500,
        sort: "updated",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return Repository.parseMany(data);
  }

  async inviteToRepo({
    userName,
    repoName,
    ownerName,
    accessToken,
  }: {
    userName: string;
    repoName: string;
    ownerName: string;
    accessToken: string;
  }) {
    await this.createClient(accessToken).rest.repos.addCollaborator({
      username: userName,
      repo: repoName,
      owner: ownerName,
    });
  }
}
