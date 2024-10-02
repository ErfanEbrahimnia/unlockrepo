import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session, User } from "lucia";
import { lucia } from "./lucia";

export const getSessionOrThrow = cache(async () => {
  const session = await getSession();

  if (!session.session || !session.user) {
    throw new Error("Unauthorized");
  }

  return session;
});

export const getSessionOrRedirect = cache(
  async (redirectPath: string = "/") => {
    const session = await getSession();

    if (!session.session || !session.user) {
      return redirect(redirectPath);
    }

    return session;
  }
);

export async function invalidateSession() {
  const { session } = await getSessionOrThrow();

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/");
}

export const getSession = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);

        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();

        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    return result;
  }
);
