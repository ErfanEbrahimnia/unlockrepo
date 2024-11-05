import { getSessionOrRedirect } from "@/app/_libs/auth/session";
import { NewUnlockForm } from "./new_unlock_form";
import { createAppServices } from "@/unlockrepo/app_services";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";

export default async function NewUnlockPage() {
  const { user } = await getSessionOrRedirect();

  const services = createAppServices();

  const repositoriesPromise = services.github.getGithubRepositories({ user });
  const productsPromise = services.merchant.getMerchantProducts({
    user,
    merchantName: "gumroad",
  });

  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Suspense fallback={<LoaderCircle className="animate-spin" />}>
        <NewUnlockForm
          repositoriesPromise={repositoriesPromise}
          productsPromise={productsPromise}
        />
      </Suspense>
    </div>
  );
}
