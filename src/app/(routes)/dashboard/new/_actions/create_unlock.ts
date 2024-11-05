"use server";

import { z } from "zod";
import { getSessionOrThrow } from "@/app/_libs/auth/session";
import { createAppServices } from "@/unlockrepo/app_services";
import { unlockCreateSchema } from "../schemas";
import { redirect } from "next/navigation";

export async function createUnlock(params: z.infer<typeof unlockCreateSchema>) {
  const { productId, repositoryId } = unlockCreateSchema.parse(params);

  const { user } = await getSessionOrThrow();
  const services = createAppServices();

  await services.unlock.createUnlock({
    user,
    productId,
    repositoryId,
    merchantName: "gumroad",
  });

  return redirect("/dashboard");
}
