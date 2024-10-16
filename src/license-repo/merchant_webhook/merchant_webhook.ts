import { z } from "zod";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1),
  userId: z.string().min(1),
  unlockId: z.string().min(1),
  merchantWebhookId: z.string().min(1),
  merchantConnectionId: z.string().min(1),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export type MerchantWebhook = z.infer<typeof schema>;

function parse(params: unknown): MerchantWebhook {
  return schema.parse(params);
}

function parseMany(params: unknown): MerchantWebhook[] {
  return z.array(schema).parse(params);
}

export const MerchantWebhook = {
  parse,
  parseMany,
};
