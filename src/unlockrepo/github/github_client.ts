import { Octokit } from "octokit";

export class GithubClientFactory {
  createClient(accessToken: string) {
    return new GithubClient({ accessToken });
  }
}

export class GithubClient {
  private accessToken: string;

  private client: Octokit;

  constructor({ accessToken }: { accessToken: string }) {
    this.accessToken = accessToken;
    this.client = new Octokit({ auth: this.accessToken });
  }

  async getUser() {
    const { data } = await this.client.request("GET /user", {
      per_page: 500,
      sort: "updated",
      headers: {
        authorization: `Bearer ${this.accessToken}`,
      },
    });

    return {
      id: String(data.id),
      login: data.login,
    };
  }

  async getRepos(): Promise<GithubRepository[]> {
    const { data } = await this.client.request("GET /user/repos", {
      per_page: 500,
      sort: "updated",
      headers: {
        authorization: `Bearer ${this.accessToken}`,
      },
    });

    return data.map(({ id, name }) => ({
      id: String(id),
      name,
    }));
  }

  async inviteToRepo({
    userName,
    repoName,
    ownerName,
  }: {
    userName: string;
    repoName: string;
    ownerName: string;
  }) {
    await this.client.rest.repos.addCollaborator({
      username: userName,
      repo: repoName,
      owner: ownerName,
    });
  }
}

export interface GithubRepository {
  id: string;
  name: string;
}
