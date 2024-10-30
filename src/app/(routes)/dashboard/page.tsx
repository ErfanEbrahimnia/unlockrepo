import { Suspense } from "react";
import {
  getSessionOrRedirect,
  invalidateSession,
} from "@/app/_libs/auth/session";
import { createServices } from "@/app/_libs/services";
import { DashboardView } from "./dashboard_view";
import { Connection } from "@/unlockrepo/user/connection";

export default async function Dashboard() {
  const { user } = await getSessionOrRedirect();

  const services = createServices();

  const repositoriesPromise = services.github.getGithubRepositories({ user });
  const productsPromise = Connection.toMapByType(user.connections).has(
    "gumroad"
  )
    ? services.merchant.getMerchantProducts({
        user,
        merchantName: "gumroad",
      })
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
