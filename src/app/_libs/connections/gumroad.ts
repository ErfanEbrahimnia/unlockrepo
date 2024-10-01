import type { OAuth2Provider } from "arctic";
import { OAuth2Client } from "oslo/oauth2";

export class Gumroad implements OAuth2Provider {
  private client: OAuth2Client;
  private clientSecret: string;

  constructor(
    clientId: string,
    clientSecret: string,
    options?: {
      redirectURI?: string;
    }
  ) {
    const authorizeEndpoint = "https://gumroad.com/oauth/authorize";
    const tokenEndpoint = "https://gumroad.com/oauth/token";

    this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
      redirectURI: options?.redirectURI,
    });
    this.clientSecret = clientSecret;
  }

  public async createAuthorizationURL(
    state: string,
    options?: {
      scopes?: string[];
    }
  ): Promise<URL> {
    return await this.client.createAuthorizationURL({
      state,
      scopes: options?.scopes ?? [],
    });
  }

  public async validateAuthorizationCode(code: string): Promise<GumroadTokens> {
    const result = await this.client.validateAuthorizationCode(code, {
      authenticateWith: "request_body",
      credentials: this.clientSecret,
    });
    const tokens: GumroadTokens = {
      accessToken: result.access_token,
    };
    return tokens;
  }
}

export interface GumroadTokens {
  accessToken: string;
}

export const gumroad = new Gumroad(
  process.env.GUMROAD_CLIENT_ID!,
  process.env.GUMROAD_CLIENT_SECRET!,
  { redirectURI: "http://localhost:3000/api/connections/gumroad/callback" }
);
