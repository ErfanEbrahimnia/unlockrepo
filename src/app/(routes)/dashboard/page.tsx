import { Suspense } from "react";
import {
  getSessionOrRedirect,
  invalidateSession,
} from "@/app/_libs/auth/session";
import { createServices } from "@/app/_libs/services";
import { DashboardView } from "./dashboard_view";

export default async function Dashboard() {
  const { user } = await getSessionOrRedirect();

  const { githubService, merchantService, connectionService } =
    createServices();

  const userConnections = await connectionService.findUserConnections(user.id);

  const repositoriesPromise = githubService.getUserRepositories({
    githubConnection: userConnections.get("github"),
  });

  const productsPromise = userConnections.has("gumroad")
    ? merchantService.getUserProducts(userConnections.get("gumroad"))
    : Promise.resolve([]);

  return (
    <div>
      <main>
        {user?.username}
        <br />
        <a href="/api/connections/gumroad">Gumroad</a>
        <form
          action={async () => {
            "use server";

            await invalidateSession();
          }}
        >
          <button type="submit">Logout</button>
        </form>
        <hr className="my-4" />
        <Suspense fallback={"loading"}>
          <DashboardView
            productsPromise={productsPromise}
            repositoriesPromise={repositoriesPromise}
          />
        </Suspense>
      </main>
      <footer></footer>
    </div>
  );
}
