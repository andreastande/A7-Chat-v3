import { defineEnv } from "envin"
import * as z from "zod"

const env = defineEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    SUPABASE_URL: z.url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SUPABASE_STORAGE_BUCKET: z.string().min(1).default("chat-attachments"),
    SUPABASE_SIGNED_URL_TTL_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(60 * 60),
  },
  env: process.env,
})

export default env
