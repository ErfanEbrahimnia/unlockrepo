import { generateState } from "arctic";
import { cookies } from "next/headers";
import { gumroad } from "@/app/_libs/connections/gumroad_provider";
import { createAppServices } from "@/unlockrepo/app_services";
import { getSessionOrThrow } from "@/app/_libs/auth/session";

export async function GET(): Promise<Response> {
  const services = createAppServices();
  const { user } = await getSessionOrThrow();
  const state = generateState();
  const url = await gumroad.createAuthorizationURL(state, {
    scopes: ["view_profile", "view_sales"],
  });

  cookies().set("gumroad_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  services.logger.info("Connecting to Gumroad", {
    userId: user.id,
    username: user.username,
    authorizationURL: url.toString(),
  });

  return Response.redirect(url);
}
