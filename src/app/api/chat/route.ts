import { convertToModelMessages, generateId, streamText, type UIMessage } from "ai"
import { getMessages, insertMessage } from "@/dal/chat"

export async function POST(req: Request) {
  const { message, chatId }: { message: UIMessage; chatId: string } = await req.json()

  const dbMessages = await getMessages(chatId)
  const messages = [...dbMessages, message]

  await insertMessage({ chatId, ...message })

  const result = streamText({
    model: "openai/gpt-4o",
    messages: await convertToModelMessages(messages),
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
