import { z } from "zod";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Product = z.infer<typeof schema>;

function parse(params: unknown): Product {
  return schema.parse(params);
}

function parseMany(params: unknown): Product[] {
  return z.array(schema).parse(params);
}

export const Product = {
  parse,
  parseMany,
};
