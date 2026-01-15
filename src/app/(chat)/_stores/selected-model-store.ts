import { createStore } from "zustand"
import { updateChatModel } from "@/actions/chat"

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
      if (chatId) updateChatModel({ chatId, modelId }) // oxlint-disable-line
      document.cookie = `selectedModelId=${modelId}; path=/; max-age=${60 * 60 * 24 * 30}`
    },
  }))
}
