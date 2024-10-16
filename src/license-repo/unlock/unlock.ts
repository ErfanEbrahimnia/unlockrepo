import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export type Unlock = z.infer<typeof schema>;

function parse(params: unknown): Unlock {
  return schema.parse(params);
}

export const Unlock = {
  parse,
};
