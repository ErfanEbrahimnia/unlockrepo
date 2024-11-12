import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    TOKEN_ENCRYPTION_KEY: z.string(),
    APP_URL: z.string().url(),
    WEBHOOK_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GUMROAD_CLIENT_ID: z.string().min(1),
    GUMROAD_CLIENT_SECRET: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY,
    APP_URL:
      process.env.APP_URL ??
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    WEBHOOK_URL:
      process.env.WEBHOOK_URL ??
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GUMROAD_CLIENT_ID: process.env.GUMROAD_CLIENT_ID,
    GUMROAD_CLIENT_SECRET: process.env.GUMROAD_CLIENT_SECRET,
  },
});

export const isProduction = () => process.env.NODE_ENV === "production";

export const isDev = () => process.env.NODE_ENV === "development";
