"use server"

import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createGateway, generateText } from "ai"
import { z } from "zod"
import {
  addFavoriteModel as addFavoriteModelDAL,
  createChat as createChatDAL,
  deleteChat as deleteChatDAL,
  removeFavoriteModel as removeFavoriteModelDAL,
  touchChat as touchChatDAL,
  updateChatModel as updateChatModelDAL,
  updateChatTitle as updateChatTitleDAL,
} from "@/dal/chat"
import type { ApiKeyPayload } from "@/lib/api-keys/types"
import { authActionClient } from "@/lib/safe-action"

export const createChat = authActionClient
  .metadata({ errorMessage: "Failed to create chat" })
  .inputSchema(z.object({ chatId: z.string(), modelId: z.string() }))
  .action(async ({ parsedInput: { chatId, modelId } }) => {
    await createChatDAL(chatId, modelId)
  })

export const updateChatTitle = authActionClient
  .metadata({ errorMessage: "Failed to rename chat" })
  .inputSchema(z.object({ chatId: z.string(), title: z.string() }))
  .action(async ({ parsedInput: { chatId, title } }) => {
    await updateChatTitleDAL(chatId, title)
  })

export const updateChatModel = authActionClient
  .metadata({ errorMessage: "Failed to update chat model" })
  .inputSchema(z.object({ chatId: z.string(), modelId: z.string() }))
  .action(async ({ parsedInput: { chatId, modelId } }) => {
    await updateChatModelDAL(chatId, modelId)
  })

export const deleteChat = authActionClient
  .metadata({ errorMessage: "Failed to delete chat" })
  .inputSchema(z.object({ chatId: z.string() }))
  .action(async ({ parsedInput: { chatId } }) => {
    await deleteChatDAL(chatId)
  })

export const touchChat = authActionClient
  .metadata({ errorMessage: "Failed to touch chat" })
  .inputSchema(z.object({ chatId: z.string() }))
  .action(async ({ parsedInput: { chatId } }) => {
    await touchChatDAL(chatId)
  })

export const generateChatTitle = authActionClient
  .metadata({ errorMessage: "Failed to generate chat title" })
  .inputSchema(
    z.object({
      text: z.string(),
      apiKey: z
        .object({
          provider: z.enum(["ai-gateway", "openrouter"]),
          key: z.string(),
        })
        .nullable() satisfies z.ZodType<ApiKeyPayload | null>,
    }),
  )
  .action(async ({ parsedInput: { text, apiKey } }) => {
    if (!apiKey) throw new Error("API key required to generate title")

    const provider =
      apiKey.provider === "openrouter"
        ? createOpenRouter({ apiKey: apiKey.key })
        : createGateway({ apiKey: apiKey.key })

    const { text: title } = await generateText({
      model: provider("google/gemini-2.0-flash"),
      system: `
        You are a helpful assistant that writes concise, topic-specific chat titles
        based on the user's first message. Limit to 2-5 words.
      `,
      prompt: text,
    })
    return title
  })

export const addFavoriteModel = authActionClient
  .metadata({ errorMessage: "Failed to add favorite model" })
  .inputSchema(z.object({ modelId: z.string() }))
  .action(async ({ parsedInput: { modelId } }) => {
    await addFavoriteModelDAL(modelId)
  })

export const removeFavoriteModel = authActionClient
  .metadata({ errorMessage: "Failed to remove favorite model" })
  .inputSchema(z.object({ modelId: z.string() }))
  .action(async ({ parsedInput: { modelId } }) => {
    await removeFavoriteModelDAL(modelId)
  })
