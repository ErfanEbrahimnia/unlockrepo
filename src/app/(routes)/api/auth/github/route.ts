import { github } from "@/app/_libs/auth/lucia";
import { createAppServices } from "@/unlockrepo/app_services";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const services = createAppServices();
  const state = generateState();
  const url = await github.createAuthorizationURL(state, { scopes: ["repo"] });

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  services.logger.info("User signing in/up", {
    authorizationURL: url.toString(),
  });

  return Response.redirect(url);
}
