"use server";

import { z } from "zod";
import { getSessionOrThrow } from "@/app/_libs/auth/session";
import { createAppServices } from "@/unlockrepo/app_services";
import { revalidatePath } from "next/cache";

const unlockDeleteSchema = z.object({
  unlockId: z.string().min(1),
});

export async function deleteUnlock(params: z.infer<typeof unlockDeleteSchema>) {
  const { unlockId } = unlockDeleteSchema.parse(params);

  const { user } = await getSessionOrThrow();
  const services = createAppServices();

  await services.unlock.deleteUnlock({ user, unlockId });

  revalidatePath("/dashboard");
}
