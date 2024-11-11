import { z } from "zod";
import { Octokit } from "octokit";

export class GithubClientFactory {
  createClient(accessToken: string) {
    return new GithubClient({
      accessToken,
    });
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
      avatarURL: data.avatar_url,
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

    return data.map(({ id, name, html_url }) => ({
      id: String(id),
      name,
      url: html_url,
    }));
  }

  async getRepository(id: string): Promise<GithubRepository> {
    const { data } = await this.client.request("GET /repositories/:id", { id });

    const parsed = z
      .object({
        id: z.coerce.string(),
        name: z.string(),
        html_url: z.string().url(),
      })
      .parse(data);

    return {
      id: parsed.id,
      name: parsed.name,
      url: parsed.html_url,
    };
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
      permission: "pull",
    });
  }
}

export interface GithubRepository {
  id: string;
  name: string;
  url: string;
}
