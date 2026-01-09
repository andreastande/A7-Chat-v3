"use server"

import { generateText } from "ai"
import { z } from "zod"
import {
  createChat as createChatDAL,
  deleteChat as deleteChatDAL,
  touchChat as touchChatDAL,
  updateChatTitle as updateChatTitleDAL,
} from "@/dal/chat"
import { authActionClient } from "@/lib/safe-action"

export const createChat = authActionClient
  .metadata({ errorMessage: "Failed to create chat" })
  .inputSchema(z.object({ chatId: z.string() }))
  .action(async ({ parsedInput: { chatId } }) => {
    await createChatDAL(chatId)
  })

export const updateChatTitle = authActionClient
  .metadata({ errorMessage: "Failed to rename chat" })
  .inputSchema(z.object({ chatId: z.string(), title: z.string() }))
  .action(async ({ parsedInput: { chatId, title } }) => {
    await updateChatTitleDAL(chatId, title)
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
  .inputSchema(z.object({ text: z.string() }))
  .action(async ({ parsedInput: { text } }) => {
    const { text: title } = await generateText({
      model: "openai/gpt-oss-120b",
      system: `
        You are a helpful assistant that writes concise, topic-specific chat titles 
        based on the user's first message. Limit to 2-5 words.
      `,
      prompt: text,
    })
    return title
  })
