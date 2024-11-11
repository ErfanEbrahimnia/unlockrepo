import { getSessionOrThrow, invalidateSession } from "@/app/_libs/auth/session";
import { createAppServices } from "@/unlockrepo/app_services";

export async function GET(): Promise<Response> {
  const services = createAppServices();

  const { user, session } = await getSessionOrThrow();
  await invalidateSession(session);

  services.logger.info("User signed out", {
    userId: user.id,
    username: user.username,
  });

  return Response.redirect("/");
}
