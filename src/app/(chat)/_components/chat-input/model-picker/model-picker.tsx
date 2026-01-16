"use client"

import { ChevronDown, Search, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useFavoriteModelsStore } from "@/app/(chat)/_components/providers/favorite-models-provider"
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
  const favorites = useFavoriteModelsStore((s) => s.favorites)
  const selectedModelId = useSelectedModelStore((s) => s.modelId)

  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<"favorites" | Creator>("favorites")

  useHotkeys("mod+slash, mod+7", () => setOpen((prev) => !prev), { preventDefault: true, enableOnFormTags: true })

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setInput("")
        setSelectedFilter("favorites")
      }, 150) // time it takes to close popover
    }
  }, [open])

  const modelsToShow = input.trim()
    ? allModels.filter((model) => model.name.toLowerCase().includes(input.toLowerCase().trim()))
    : selectedFilter === "favorites"
      ? favorites.flatMap((id) => allModels.find((m) => m.id === id) ?? [])
      : getModelsByCreator(selectedFilter)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="font-normal data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:data-[state=open]:bg-accent/50"
        >
          <CreatorLogo creator={selectedModelId.split("/")[0] as Creator} className="size-3" />
          {allModels.find((m) => m.id === selectedModelId)?.name}
          <ChevronDown className="ml-1.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex h-70 w-74 flex-col p-0">
        <div className="flex h-10 w-full items-center border-b">
          <Search className="mx-3.25 size-3.5 text-muted-foreground" />
          <input
            className="h-full w-full flex-1 pr-2.5 pl-1 text-sm outline-none"
            placeholder="Search models..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex min-h-0 flex-1">
          {!input.trim() && (
            <div tabIndex={-1} className="scrollbar-none flex flex-col items-center gap-1 overflow-auto border-r p-1">
              {favorites.length > 0 && (
                <>
                  <WithTooltip asChild content="Favorites" side="left" delayDuration={300}>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setSelectedFilter("favorites")}
                      className={cn(
                        selectedFilter === "favorites" && "bg-accent text-accent-foreground dark:bg-accent/50",
                      )}
                    >
                      <Star className="fill-yellow-400 text-yellow-400" />
                    </Button>
                  </WithTooltip>
                  <Separator className="w-4!" />
                </>
              )}
              {creatorIds.map((id) => (
                <WithTooltip key={id} asChild content={getCreatorName(id)} side="left" delayDuration={500}>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setSelectedFilter(id)}
                    className={cn(selectedFilter === id && "bg-accent text-accent-foreground dark:bg-accent/50")}
                  >
                    <CreatorLogo creator={id} />
                  </Button>
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
