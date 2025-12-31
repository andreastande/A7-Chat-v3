"use server"

import { z } from "zod"
import { createChat as createChatDAL, deleteChat as deleteChatDAL, updateChatTitle as updateChatTitleDAL } from "@/dal/chat"
import { authActionClient } from "@/lib/safe-action"

export const createChat = authActionClient
  .metadata({ errorMessage: "Failed to create chat" })
  .inputSchema(z.object({ id: z.string(), title: z.string().optional() }))
  .action(async ({ parsedInput: { id, title } }) => {
    await createChatDAL({ id, title })
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
