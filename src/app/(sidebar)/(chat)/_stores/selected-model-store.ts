import { createStore } from "zustand"
import { updateChatModel } from "@/actions/chat"
import { setCookie } from "@/lib/cookies"

type SelectedModelState = {
  modelId: string
}

type SelectedModelActions = {
  setModelId: ({ chatId, modelId }: { chatId?: string; modelId: string }) => void
}

export type SelectedModelStore = SelectedModelState & SelectedModelActions

export function createSelectedModelStore(initialModelId: string) {
  return createStore<SelectedModelStore>((set) => ({
    modelId: initialModelId,
    setModelId: ({ chatId, modelId }) => {
      set({ modelId })
      setCookie("selectedModelId", modelId, 60 * 60 * 24 * 30)
      if (chatId) void updateChatModel({ chatId, modelId })
    },
  }))
}
