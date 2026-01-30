"use client"

import { ChevronDown, Search, Star } from "lucide-react"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useFavoriteModelsStore } from "@/app/(chat)/_components/providers/favorite-models-provider"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { WithTooltip } from "@/components/ui/tooltip"
import { allModels, type Creator, creatorIds, getCreatorName, getModelsByCreator } from "@/lib/models"
import { cn } from "@/lib/utils"
import { useSelectedModelStore } from "../../providers/selected-model-provider"
import { CreatorLogo } from "./creator-logo"
import { Model } from "./model"

export function ModelPicker() {
  const session = useSession()
  const favorites = useFavoriteModelsStore((s) => s.favorites)
  const selectedModelId = useSelectedModelStore((s) => s.modelId)

  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<"favorites" | Creator>(() =>
    session ? "favorites" : creatorIds[0],
  )

  useHotkeys("mod+slash, mod+7", () => setOpen((prev) => !prev), { preventDefault: true, enableOnFormTags: true })

  const modelsToShow = input.trim()
    ? allModels.filter((model) => model.name.toLowerCase().includes(input.toLowerCase().trim()))
    : selectedFilter === "favorites"
      ? favorites.flatMap((id) => allModels.find((m) => m.id === id) ?? [])
      : getModelsByCreator(selectedFilter)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setInput("")
          setSelectedFilter(session ? "favorites" : creatorIds[0])
        }
      }}
    >
      <PopoverTrigger render={<Button variant="ghost" size="sm" className="font-normal" />}>
        <CreatorLogo creator={selectedModelId.split("/")[0] as Creator} className="size-3" />
        {allModels.find((m) => m.id === selectedModelId)?.name}
        <ChevronDown className="ml-1.5 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="start" className="flex h-70 w-74 flex-col gap-0 p-0">
        <div className="flex h-10 w-full items-center border-b">
          <div className="flex h-full w-10 items-center justify-center">
            <Search className="size-3.5 text-muted-foreground" />
          </div>
          <input
            className="h-full flex-1 pr-1 pl-1.25 text-sm outline-none"
            placeholder="Search models..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex min-h-0 flex-1">
          {!input.trim() && (
            <div
              tabIndex={-1}
              className="no-scrollbar flex w-10 flex-col items-center space-y-1 overflow-auto border-r p-1"
            >
              {favorites.length > 0 && (
                <>
                  <WithTooltip
                    content="Favorites"
                    side="left"
                    delay={400}
                    render={
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setSelectedFilter("favorites")}
                        className={cn(selectedFilter === "favorites" && "bg-muted text-foreground dark:bg-muted/50")}
                      />
                    }
                  >
                    <Star className="fill-yellow-400 text-yellow-400" />
                  </WithTooltip>
                  <Separator className="w-4!" />
                </>
              )}
              {creatorIds.map((id) => (
                <WithTooltip
                  key={id}
                  content={getCreatorName(id)}
                  side="left"
                  delay={400}
                  render={
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setSelectedFilter(id)}
                      className={cn(selectedFilter === id && "bg-muted text-foreground dark:bg-muted/50")}
                    />
                  }
                >
                  <CreatorLogo creator={id} />
                </WithTooltip>
              ))}
            </div>
          )}

          <ul tabIndex={-1} className="flex flex-1 flex-col space-y-1 overflow-auto p-1">
            {modelsToShow.map((model) => (
              <li key={model.id}>
                <Model
                  model={model}
                  showCreatorLogo={selectedFilter === "favorites" || !!input.trim()}
                  closeModelPicker={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}
