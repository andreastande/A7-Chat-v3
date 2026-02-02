import type { ReactNode } from "react"
import { getFavoriteModels } from "@/dal/chat"
import { FavoriteModelsProvider } from "./_components/providers/favorite-models-provider"

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const favoriteModels = await getFavoriteModels().catch(() => [])

  return <FavoriteModelsProvider initialFavorites={favoriteModels}>{children}</FavoriteModelsProvider>
}
