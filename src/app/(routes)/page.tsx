import { getSession, invalidateSession } from "@/app/_libs/auth/session";

export default async function Home() {
  const { user } = await getSession();

  return (
    <div>
      <main>
        {user?.username}
        <br />
        <a href="/api/auth/github">Github</a>
        <br />
        {user && (
          <>
            <a href="/api/connections/gumroad">Gumroad</a>
            <form
              action={async () => {
                "use server";

                await invalidateSession();
              }}
            >
              <button type="submit">Logout</button>
            </form>
          </>
        )}
      </main>
      <footer></footer>
    </div>
  );
}
