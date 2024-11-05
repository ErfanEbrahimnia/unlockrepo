import { z } from "zod";

export const unlockCreateSchema = z.object({
  productId: z.string().min(1, { message: "Please select a product" }),
  repositoryId: z.string().min(1, { message: "Please select a repository" }),
});
