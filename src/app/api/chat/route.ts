import { convertToModelMessages, generateId, streamText, type UIMessage } from "ai"
import { getCurrentUser } from "@/dal/auth"
import { getChatWithMessages, insertMessage } from "@/dal/chat"
import { getSystemPrompt, isValidModelId } from "@/lib/models"

export async function POST(req: Request) {
  const { message, chatId, modelId }: { message: UIMessage; chatId: string; modelId: string } = await req.json()

  const [user, chat] = await Promise.all([getCurrentUser(), getChatWithMessages(chatId)])

  if (!user) return new Response("Unauthorized", { status: 401 })
  if (!isValidModelId(modelId)) return new Response("Invalid model ID", { status: 400 })
  if (!chat) return new Response("Chat not found", { status: 404 })

  const messages = [...chat.messages, message]
  await insertMessage({ chatId, ...message })

  const result = streamText({
    model: modelId,
    messages: await convertToModelMessages(messages),
    system: getSystemPrompt(modelId),
  })

  result.consumeStream()

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: async ({ responseMessage }) => {
      await insertMessage({ chatId, ...responseMessage })
    },
  })
}
