"use client"

import { ChevronDown, Search, Star } from "lucide-react"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useModels } from "@/app/(chat)/_hooks/use-models"
import { useFavoriteModelsStore } from "@/components/providers/favorite-models-provider"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { WithTooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Model } from "./model"
import { ProviderLogo } from "./provider-logo"

export function ModelPicker() {
  const { models, providers, providerDisplayNames } = useModels()
  const favorites = useFavoriteModelsStore((s) => s.favorites)

  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<"favorites" | (string & {})>("favorites")

  useHotkeys("mod+slash, mod+7", () => setOpen((prev) => !prev), { preventDefault: true, enableOnFormTags: true })

  function getFilteredModels() {
    if (!models) return []

    if (input.trim()) {
      return models.filter((m) => m.name.toLowerCase().includes(input.trim().toLowerCase()))
    }

    if (selectedFilter === "favorites") {
      return models
        .filter((m) => favorites.includes(m.id))
        .sort((a, b) => favorites.indexOf(a.id) - favorites.indexOf(b.id))
    }

    return models.filter((m) => m.owned_by === selectedFilter)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open)
          setTimeout(() => {
            setInput("")
            setSelectedFilter("favorites")
          }, 150)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:data-[state=open]:bg-accent/50"
        >
          GPT 5.2
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex size-70 flex-col p-0">
        <div className="flex h-10 w-full items-center border-b">
          <Search className="mx-2.75 size-3.5 text-muted-foreground" />
          <input
            className="h-full w-full flex-1 pr-2.5 pl-2 text-sm outline-none"
            placeholder="Search models..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex min-h-0 flex-1">
          {!input.trim() && (
            <div className="scrollbar-none flex flex-col items-center gap-1 overflow-auto border-r p-1">
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
              {providers.map((p) => (
                <WithTooltip key={p} asChild content={providerDisplayNames[p] ?? p} side="left" delayDuration={500}>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setSelectedFilter(p)}
                    className={cn(selectedFilter === p && "bg-accent text-accent-foreground dark:bg-accent/50")}
                  >
                    <ProviderLogo provider={p} />
                  </Button>
                </WithTooltip>
              ))}
            </div>
          )}

          <div className="flex flex-1 flex-col space-y-1 overflow-auto p-1">
            {getFilteredModels().map((model) => (
              <Model
                key={model.id}
                model={model}
                showProviderLogo={selectedFilter === "favorites" || !!input.trim()}
                closeModelPicker={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
