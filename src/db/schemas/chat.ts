import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import type { UIMessage } from "@/types/ui-message"
import { user } from "./auth"

export const chat = pgTable(
  "chat",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text().notNull().default("Untitled"),
    modelId: text().notNull().default("openai/gpt-5.2"), // remove default?
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
    metadata: jsonb().$type<UIMessage["metadata"]>(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index("message_chatId_idx").on(table.chatId),
    index("message_chatId_createdAt_idx").on(table.chatId, table.createdAt),
  ],
)

export const favoriteModel = pgTable(
  "favorite_model",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    modelId: text().notNull(),
    order: integer().notNull().default(0),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.modelId] }),
    index("favorite_model_userId_idx").on(table.userId),
    index("favorite_model_userId_order_idx").on(table.userId, table.order),
  ],
)

export const attachmentUploadRateLimitWindow = pgTable(
  "attachment_upload_rate_limit_window",
  {
    scope: text().notNull(),
    subject: text().notNull(),
    windowStart: timestamp().notNull(),
    uploadCount: integer().notNull().default(0),
    totalBytes: integer().notNull().default(0),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.scope, table.subject, table.windowStart],
    }),
    index("attachment_upload_rate_limit_window_scope_subject_idx").on(table.scope, table.subject),
  ],
)

export type Chat = Omit<typeof chat.$inferSelect, "userId">
export type Message = typeof message.$inferSelect
