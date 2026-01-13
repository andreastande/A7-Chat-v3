import type { ReactNode } from "react"
import { FavoriteModelsProvider } from "@/components/providers/favorite-models-provider"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { getFavoriteModels } from "@/dal/chat"

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const favoriteModels = await getFavoriteModels().catch(() => [])

  return (
    <>
      <AppSidebar />
      <div className="@container flex w-full flex-col">
        <FavoriteModelsProvider initialFavorites={favoriteModels}>{children}</FavoriteModelsProvider>
      </div>
    </>
  )
}
