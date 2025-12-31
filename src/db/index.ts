import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import env from "~/env.config"
import * as auth from "./schemas/auth"
import * as chat from "./schemas/chat"
import * as relations from "./schemas/relations"

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(env.DATABASE_URL, { prepare: false })
export const db = drizzle(client, { casing: "snake_case", schema: { ...auth, ...chat, ...relations } })
