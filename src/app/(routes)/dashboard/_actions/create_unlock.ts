"use server";

import { getSessionOrThrow } from "@/app/_libs/auth/session";
import { createServices } from "@/app/_libs/services";
import { z } from "zod";

const createUnlockSchema = z.object({
  productId: z.string().min(1),
  repositoryId: z.string().min(1),
});

export async function createUnlock(params: z.infer<typeof createUnlockSchema>) {
  const { productId, repositoryId } = createUnlockSchema.parse(params);

  const { user } = await getSessionOrThrow();
  const { unlockService, connectionService } = createServices();

  const userConnections = await connectionService.findUserConnections(user.id);

  await unlockService.create({
    productId,
    repositoryId,
    userId: user.id,
    githubConnection: userConnections.get("github"),
    merchantConnection: userConnections.get("gumroad"),
  });
}
