import { gumroad } from "@/app/_libs/connections/gumroad_provider";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
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

  return Response.redirect(url);
}
