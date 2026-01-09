import { defineConfig } from "drizzle-kit"
import env from "./env.config"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL.replace(":6543", ":5432"),
  },
})
