import { ChatInput } from "./input/chat-input"

export function NewChat() {
  return (
    <div className="flex h-fit w-full justify-center px-8 pt-56">
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-2xl">What's on your mind today?</h1>
        <ChatInput className="mt-10" />
      </div>
    </div>
  )
}
