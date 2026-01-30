import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { getSystemPrompt, isValidModelId } from "@/lib/models"

export async function POST(req: Request) {
  const { messages, modelId }: { messages: UIMessage[]; modelId: string } = await req.json()

  if (!isValidModelId(modelId)) return new Response("Invalid model ID", { status: 400 })

  const result = streamText({
    model: modelId,
    messages: await convertToModelMessages(messages),
    system: getSystemPrompt(modelId),
  })

  return result.toUIMessageStreamResponse()
}
