import type { UIMessage } from "ai"
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const chat = pgTable(
  "chat",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text().notNull().default("Untitled"),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("chat_userId_idx").on(table.userId),
    index("chat_userId_updatedAt_idx").on(table.userId, table.updatedAt),
  ],
)

export const message = pgTable(
  "message",
  {
    id: text().primaryKey(),
    chatId: text()
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    role: text().$type<UIMessage["role"]>().notNull(),
    parts: jsonb().$type<UIMessage["parts"]>().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index("message_chatId_idx").on(table.chatId),
    index("message_chatId_createdAt_idx").on(table.chatId, table.createdAt),
  ],
)

export type Chat = Omit<typeof chat.$inferSelect, "userId">
export type Message = typeof message.$inferSelect
