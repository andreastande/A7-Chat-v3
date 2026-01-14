import { convertToModelMessages, generateId, streamText, type UIMessage } from "ai"
import { getCurrentUser } from "@/dal/auth"
import { getChat, getMessages, insertMessage } from "@/dal/chat"
import { type Creator, getCreatorName, getModelName, isValidModelId } from "@/lib/models"

export async function POST(req: Request) {
  const { message, chatId, modelId }: { message: UIMessage; chatId: string; modelId: string } = await req.json()

  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 })
  if (!isValidModelId(modelId)) return new Response("Invalid model ID", { status: 400 })
  if (!(await getChat(chatId))) return new Response("Chat not found", { status: 404 })

  const dbMessages = await getMessages(chatId)
  const messages = [...dbMessages, message]

  await insertMessage({ chatId, ...message })

  const result = streamText({
    model: modelId,
    messages: await convertToModelMessages(messages),
    system: `If the user asks who you are, you are ${getModelName(modelId)} from ${getCreatorName(modelId.split("/")[0] as Creator)}.`,
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
