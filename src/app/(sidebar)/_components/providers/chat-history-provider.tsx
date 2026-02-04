"use client"

import { createContext, type ReactNode, useContext, useState } from "react"
import { useStore } from "zustand"
import type { Chat } from "@/db/schemas/chat"
import { type ChatHistoryStore, createChatHistoryStore } from "../../_stores/chat-history-store"

type ChatHistoryStoreApi = ReturnType<typeof createChatHistoryStore>

const ChatHistoryContext = createContext<ChatHistoryStoreApi | null>(null)

export function ChatHistoryProvider({ children, initialChats }: { children: ReactNode; initialChats: Chat[] }) {
  const [store] = useState(() =>
    createChatHistoryStore(initialChats.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))),
  )
  return <ChatHistoryContext.Provider value={store}>{children}</ChatHistoryContext.Provider>
}

export function useChatHistoryStore<T>(selector: (state: ChatHistoryStore) => T): T {
  const store = useContext(ChatHistoryContext)
  if (!store) {
    throw new Error("useChatHistoryStore must be used within ChatHistoryProvider")
  }
  return useStore(store, selector)
}
