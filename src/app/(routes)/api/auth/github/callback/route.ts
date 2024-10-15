import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { ulid } from "ulid";
import { github, lucia } from "@/app/_libs/auth/lucia";
import { db } from "@/database/client";
import { Encryptor } from "@/license-repo/utils/encryptor";

export async function GET(request: Request): Promise<Response> {
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
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await db
      .selectFrom("users")
      .innerJoin("userConnections", "userConnections.userId", "users.id")
      .select([
        "users.id",
        "users.username",
        "users.createdAt",
        "users.updatedAt",
      ])
      .where((eb) =>
        eb.and([
          eb("userConnections.type", "=", "github"),
          eb("userConnections.connectionId", "=", githubUser.id),
        ])
      )
      .executeTakeFirst();

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await db.transaction().execute(async (trx) => {
      const user = await trx
        .insertInto("users")
        .values({
          id: userId,
          username: githubUser.login,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("userConnections")
        .values({
          id: ulid(),
          userId: user.id,
          type: "github",
          connectionId: githubUser.id,
          tokens: Encryptor.encryptJSON({
            accessToken: tokens.accessToken,
          }),
        })
        .execute();
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (error) {
    console.error(error);

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

interface GitHubUser {
  id: string;
  login: string;
}
