import { toast } from "sonner"
import { createStore } from "zustand"
import { createChat, deleteChat, touchChat, updateChatTitle } from "@/actions/chat"
import type { Chat } from "@/db/schemas/chat"

type ChatListItem = Pick<Chat, "id" | "title" | "updatedAt">

type ChatHistoryState = {
  chats: ChatListItem[]
}

type ChatHistoryActions = {
  addChat: (id: string, modelId: string) => Promise<boolean>
  removeChat: (id: string) => Promise<boolean>
  renameChat: (id: string, title: string) => Promise<boolean>
  touchChat: (id: string) => Promise<boolean>
}

export type ChatHistoryStore = ChatHistoryState & ChatHistoryActions

export function createChatHistoryStore(initialChats: ChatListItem[]) {
  return createStore<ChatHistoryStore>((set, get) => {
    /** Persists via server action, rolls back to previousChats on error */
    async function persistOrRollback(
      serverAction: () => Promise<{ serverError?: string }>,
      previousChats: ChatListItem[],
    ): Promise<boolean> {
      try {
        const { serverError } = await serverAction()
        if (serverError) {
          toast.error(serverError)
          set({ chats: previousChats })
          return false
        }
        return true
      } catch {
        toast.error("An unexpected error occurred")
        set({ chats: previousChats })
        return false
      }
    }

    return {
      chats: initialChats,

      addChat: async (id, modelId) => {
        const previousChats = get().chats
        const newChat: ChatListItem = {
          id,
          title: "Untitled",
          updatedAt: new Date(),
        }
        set((state) => ({ chats: [newChat, ...state.chats] }))

        return persistOrRollback(() => createChat({ chatId: id, modelId }), previousChats)
      },

      removeChat: async (id) => {
        const previousChats = get().chats
        set((state) => ({ chats: state.chats.filter((c) => c.id !== id) }))

        return persistOrRollback(() => deleteChat({ chatId: id }), previousChats)
      },

      renameChat: async (id, title) => {
        const previousChats = get().chats
        set((state) => ({
          chats: state.chats.map((c) => (c.id === id ? { ...c, title } : c)),
        }))

        return persistOrRollback(() => updateChatTitle({ chatId: id, title }), previousChats)
      },

      touchChat: async (id) => {
        const previousChats = get().chats
        set((state) => {
          const chat = state.chats.find((c) => c.id === id)
          if (!chat) return state
          return {
            chats: [{ ...chat, updatedAt: new Date() }, ...state.chats.filter((c) => c.id !== id)],
          }
        })

        return persistOrRollback(() => touchChat({ chatId: id }), previousChats)
      },
    }
  })
}
