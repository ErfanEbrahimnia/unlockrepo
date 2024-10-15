import { z } from "zod";

const schema = z.object({
  id: z.string().ulid(),
});

export type Unlock = z.infer<typeof schema>;

function parse(params: unknown): Unlock {
  return schema.parse(params);
}

export const Unlock = {
  parse,
};
