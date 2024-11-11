import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github, lucia } from "@/app/_libs/auth/lucia";
import { db } from "@/database/client";
import { GithubClient } from "@/unlockrepo/github/github_client";
import { UserRepo } from "@/unlockrepo/user/user_repo";
import { createAppServices } from "@/unlockrepo/app_services";

export async function GET(request: Request): Promise<Response> {
  const services = createAppServices();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const userRepo = new UserRepo(db);
    const githubClient = new GithubClient({ accessToken: tokens.accessToken });
    const githubUser = await githubClient.getUser();

    const existingUser = await userRepo.findByGithubId(githubUser.id);

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      services.logger.info("User exists. Created new session", {
        userId: existingUser.id,
        username: existingUser.username,
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const user = await userRepo.createUserWithConnection({
      username: githubUser.login,
      avatarURL: githubUser.avatarURL,
      connectionId: githubUser.id,
      connectionName: "github",
      connectionTokens: tokens,
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    services.logger.info("New user created", {
      userId: user.id,
      username: user.username,
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      services.logger.error("Signup failed", error);
    }

    // the specific error message depends on the provider
    if (error instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}
