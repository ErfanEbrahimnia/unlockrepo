"use server";

import { z } from "zod";
import { getSessionOrThrow } from "@/app/_libs/auth/session";
import { createServices } from "@/app/_libs/services";

const unlockCreateSchema = z.object({
  productId: z.string().min(1),
  repositoryId: z.string().min(1),
});

export async function createUnlock(params: z.infer<typeof unlockCreateSchema>) {
  const { productId, repositoryId } = unlockCreateSchema.parse(params);

  const { user } = await getSessionOrThrow();
  const services = createServices();

  await services.unlock.createUnlock({
    userId: user.id,
    merchantName: "gumroad",
    productId,
    repositoryId,
  });
}
