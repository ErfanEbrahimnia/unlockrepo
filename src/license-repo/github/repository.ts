import { z } from "zod";

const repositorySchema = z.object({
  id: z.coerce.string(),
  name: z.string().min(1),
});

export type Repository = z.infer<typeof repositorySchema>;

function parse(params: unknown): Repository {
  return repositorySchema.parse(params);
}

function parseMany(params: unknown): Repository[] {
  return z.array(repositorySchema).parse(params);
}

export const Repository = {
  parse,
  parseMany,
};
