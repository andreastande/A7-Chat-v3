import "server-only"
import { and, eq, max } from "drizzle-orm"
import { db } from "@/db"
import { type Chat, chat, favoriteModel, message as messageTable } from "@/db/schemas/chat"
import { hydrateCanonicalAttachmentUrls } from "@/lib/attachments/server"
import type { UIMessage } from "@/types/ui-message"
import { requireAuth } from "./auth"

// =============================================================================
// Queries
// =============================================================================

/**
 * Get all chats for the current user, ordered by most recent.
 */
export async function getChats(): Promise<Chat[]> {
  const user = await requireAuth()

  return db.query.chat.findMany({
    where: eq(chat.userId, user.id),
    orderBy: (chat, { desc }) => desc(chat.updatedAt),
    columns: { userId: false },
  })
}

/**
 * Get a specific chat by ID.
 * Returns null if not found or not owned by user.
 */
export async function getChat(chatId: string): Promise<Chat | null> {
  const user = await requireAuth()

  const result = await db.query.chat.findFirst({
    where: and(eq(chat.id, chatId), eq(chat.userId, user.id)),
    columns: { userId: false },
  })

  return result ?? null
}

/**
 * Check if a chat is accessible to the current user.
 * Returns true if the chat doesn't exist (e.g., new chat not yet created) or belongs to the user.
 * Returns false only if the chat exists and belongs to another user.
 */
export async function isChatAccessible(chatId: string): Promise<boolean> {
  const user = await requireAuth()

  const [existing] = await db.select({ userId: chat.userId }).from(chat).where(eq(chat.id, chatId)).limit(1)

  return !existing || existing.userId === user.id
}

/**
 * Get all messages for a chat, ordered chronologically.
 * Verifies user owns the chat before returning messages.
 */
export async function getMessages(chatId: string): Promise<UIMessage[]> {
  const result = await getChatWithMessages(chatId)
  return result?.messages ?? []
}

/**
 * Get a chat with all its messages in a single query.
 */
export async function getChatWithMessages(chatId: string): Promise<(Chat & { messages: UIMessage[] }) | null> {
  const user = await requireAuth()

  const result = await db.query.chat.findFirst({
    where: and(eq(chat.id, chatId), eq(chat.userId, user.id)),
    columns: { userId: false },
    with: {
      messages: {
        orderBy: (messages, { asc }) => asc(messages.createdAt),
        columns: { chatId: false, createdAt: false },
      },
    },
  })

  if (!result) return null
  const hydratedMessages = await hydrateCanonicalAttachmentUrls(
    result.messages.map((m) => ({
      ...m,
      metadata: m.metadata ?? undefined,
    })),
    { userId: user.id },
  )

  return {
    ...result,
    messages: hydratedMessages,
  }
}

// =============================================================================
// Mutations
// =============================================================================

/**
 * Create a new chat for the current user.
 */
export async function createChat(chatId: string, modelId: string) {
  const user = await requireAuth()

  await db.insert(chat).values({
    id: chatId,
    userId: user.id,
    modelId,
  })
}

/**
 * Insert a message into a chat.
 * Verifies user owns the chat before inserting.
 */
export async function insertMessage(chatId: string, message: UIMessage) {
  const user = await requireAuth()

  // Verify ownership
  const [chatRecord] = await db
    .select({ id: chat.id })
    .from(chat)
    .where(and(eq(chat.id, chatId), eq(chat.userId, user.id)))
    .limit(1)

  if (!chatRecord) {
    throw new Error("Chat not found")
  }

  await db.insert(messageTable).values({
    chatId,
    ...message,
  })
}

/**
 * Insert multiple messages into a chat (batch insert).
 * Useful for saving both user message and AI response together.
 */
export async function insertMessages(chatId: string, messages: UIMessage[]) {
  const user = await requireAuth()

  // Verify ownership
  const [chatRecord] = await db
    .select({ id: chat.id })
    .from(chat)
    .where(and(eq(chat.id, chatId), eq(chat.userId, user.id)))
    .limit(1)

  if (!chatRecord) {
    throw new Error("Chat not found")
  }

  await db.insert(messageTable).values(messages.map((m) => ({ ...m, chatId })))
}

/**
 * Update chat title.
 */
export async function updateChatTitle(chatId: string, title: string) {
  const user = await requireAuth()

  await db
    .update(chat)
    .set({ title, updatedAt: chat.updatedAt })
    .where(and(eq(chat.id, chatId), eq(chat.userId, user.id)))
}

/**
 * Touch a chat to update its updatedAt timestamp.
 */
export async function touchChat(chatId: string) {
  const user = await requireAuth()

  await db
    .update(chat)
    .set({ updatedAt: new Date() })
    .where(and(eq(chat.id, chatId), eq(chat.userId, user.id)))
}

/**
 * Update chat model.
 */
export async function updateChatModel(chatId: string, modelId: string) {
  const user = await requireAuth()

  await db
    .update(chat)
    .set({ modelId, updatedAt: chat.updatedAt })
    .where(and(eq(chat.id, chatId), eq(chat.userId, user.id)))
}

/**
 * Delete a chat and all its messages (cascade).
 */
export async function deleteChat(chatId: string) {
  const user = await requireAuth()

  await db.delete(chat).where(and(eq(chat.id, chatId), eq(chat.userId, user.id)))
}

// =============================================================================
// Favorite Models
// =============================================================================

/**
 * Get all favorite model IDs for the current user.
 */
export async function getFavoriteModels() {
  const user = await requireAuth()

  const results = await db.query.favoriteModel.findMany({
    where: eq(favoriteModel.userId, user.id),
    orderBy: (favoriteModel, { asc }) => [asc(favoriteModel.order), asc(favoriteModel.createdAt)],
    columns: { modelId: true },
  })

  return results.map((r) => r.modelId)
}

/**
 * Add a model to the user's favorites.
 */
export async function addFavoriteModel(modelId: string) {
  const user = await requireAuth()

  // Get current max order
  const [result] = await db
    .select({ maxOrder: max(favoriteModel.order) })
    .from(favoriteModel)
    .where(eq(favoriteModel.userId, user.id))

  const newOrder = (result?.maxOrder ?? -1) + 1

  await db.insert(favoriteModel).values({ userId: user.id, modelId, order: newOrder }).onConflictDoNothing()
}

/**
 * Remove a model from the user's favorites.
 */
export async function removeFavoriteModel(modelId: string) {
  const user = await requireAuth()

  await db.delete(favoriteModel).where(and(eq(favoriteModel.userId, user.id), eq(favoriteModel.modelId, modelId)))
}

/**
 * Reorder favorite models for the current user.
 * Updates the order field for each model based on the new order.
 */
export async function reorderFavoriteModels(modelIds: string[]) {
  const user = await requireAuth()

  await db.transaction(async (tx) => {
    for (let i = 0; i < modelIds.length; i++) {
      await tx
        .update(favoriteModel)
        .set({ order: i })
        .where(and(eq(favoriteModel.userId, user.id), eq(favoriteModel.modelId, modelIds[i])))
    }
  })
}

const DEFAULT_FAVORITE_MODELS = [
  "openai/gpt-5.2",
  "anthropic/claude-sonnet-4.5",
  "google/gemini-3-flash",
  "zai/glm-4.7",
  "moonshotai/kimi-k2.5",
]

/**
 * Initialize default favorite models for a new user.
 * Called from auth hook on signup - no auth check needed.
 */
export async function initializeDefaultFavorites(userId: string) {
  await db
    .insert(favoriteModel)
    .values(DEFAULT_FAVORITE_MODELS.map((modelId, index) => ({ userId, modelId, order: index })))
}
