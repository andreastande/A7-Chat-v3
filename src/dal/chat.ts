import "server-only"
import { and, eq, max } from "drizzle-orm"
import { db } from "@/db"
import { type Chat, chat, favoriteModel, message as messageTable } from "@/db/schemas/chat"
import { isCanonicalStorageUrl, isUserOwnedAttachmentPath, parseCanonicalStorageUrl } from "@/lib/attachments"
import { supabaseServer } from "@/lib/supabase/server"
import type { UIMessage } from "@/types/ui-message"
import env from "~/env.config"
import { requireAuth } from "./auth"

async function hydrateMessageAttachmentUrls(messages: UIMessage[], userId: string) {
  const targets: Array<{ msgIdx: number; partIdx: number; canonicalUrl: string; path: string }> = []

  for (let mi = 0; mi < messages.length; mi++) {
    const parts = messages[mi].parts
    for (let pi = 0; pi < parts.length; pi++) {
      const part = parts[pi]
      if (part.type !== "file" || !isCanonicalStorageUrl(part.url)) continue

      const parsed = parseCanonicalStorageUrl(part.url)
      if (!parsed || parsed.bucket !== env.SUPABASE_STORAGE_BUCKET || !isUserOwnedAttachmentPath(parsed.path, userId)) {
        continue
      }

      targets.push({ msgIdx: mi, partIdx: pi, canonicalUrl: part.url, path: parsed.path })
    }
  }

  if (targets.length === 0) return messages

  const { data, error } = await supabaseServer.storage.from(env.SUPABASE_STORAGE_BUCKET).createSignedUrls(
    targets.map((t) => t.path),
    env.SUPABASE_SIGNED_URL_TTL_SECONDS,
  )

  if (error || !data) {
    console.error("Failed to batch sign attachment URLs", error)
    return messages
  }

  const signedUrlMap = new Map<string, string>()
  for (let i = 0; i < targets.length; i++) {
    const item = data[i]
    if (item?.error || !item?.signedUrl) continue
    signedUrlMap.set(`${targets[i].msgIdx}:${targets[i].partIdx}`, item.signedUrl)
  }

  return messages.map((message, mi) => ({
    ...message,
    parts: message.parts.map((part, pi) => {
      if (part.type !== "file") return part

      const signedUrl = signedUrlMap.get(`${mi}:${pi}`)
      if (!signedUrl) return part

      return {
        ...part,
        url: signedUrl,
        providerMetadata: {
          ...part.providerMetadata,
          attachment: { canonicalUrl: part.url },
        },
      }
    }),
  }))
}

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
  const hydratedMessages = await hydrateMessageAttachmentUrls(
    result.messages.map((m) => ({
      ...m,
      metadata: m.metadata ?? undefined,
    })),
    user.id,
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
