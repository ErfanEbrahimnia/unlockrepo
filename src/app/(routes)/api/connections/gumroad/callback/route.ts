import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { ulid } from "ulid";
import { db } from "@/database/client";
import { gumroad } from "@/app/_libs/connections/gumroad";
import { getSessionOrThrow } from "@/app/_libs/auth/session";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("gumroad_oauth_state")?.value ?? null;
  const { user } = await getSessionOrThrow();

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await gumroad.validateAuthorizationCode(code);
    const gumroadUserResponse = await fetch(
      `https://gumroad.com/api/v2/user?access_token=${tokens.accessToken}`
    );
    const { user: gumroadUser, success }: GumroadUserResponse =
      await gumroadUserResponse.json();

    if (!success) {
      throw new Error("Failed to get Gumroad user");
    }

    const gumroadConnection = await db
      .selectFrom("userConnections")
      .selectAll()
      .where((eb) =>
        eb.and([
          eb("userConnections.type", "=", "gumroad"),
          eb("userId", "=", user.id),
          eb("userConnections.connectionId", "=", gumroadUser.id),
        ])
      )
      .executeTakeFirst();

    if (gumroadConnection) {
      throw new Error("Gumroad is already connected");
    }

    await db
      .insertInto("userConnections")
      .values({
        id: ulid(),
        userId: user.id,
        type: "gumroad",
        connectionId: gumroadUser.id,
        tokens: JSON.stringify({
          accessToken: tokens.accessToken,
        }),
      })
      .execute();

    return new Response(null, {
      status: 200,
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

interface GumroadUser {
  id: string;
  name: string;
  currency_type: string;
  bio: "Follow me for posts on what I am creating.";
  twitter_handle: string;
  user_id: string;
  url: string;
  links: string[];
  profile_url: string;
  email: string;
  display_name: string;
}

interface GumroadUserResponse {
  success: boolean;
  user: GumroadUser;
}
