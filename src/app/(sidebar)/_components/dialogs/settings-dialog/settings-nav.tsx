import type { LucideIcon } from "lucide-react"
import { Bot, ChartNoAxesColumn, Key, PaintBucket, Settings, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { SettingsPage } from "./types"

const settingsPages: { id: SettingsPage; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "appearance", label: "Appearance", icon: PaintBucket },
  { id: "models", label: "Models", icon: Bot },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "usage", label: "Usage", icon: ChartNoAxesColumn },
  { id: "account", label: "Account", icon: User },
]

export function SettingsNav({
  activePage,
  setActivePage,
}: {
  activePage: SettingsPage
  setActivePage: (page: SettingsPage) => void
}) {
  return (
    <div className="w-45 rounded-l-xl border-r border-border/60 bg-muted/35 p-1 dark:bg-background/20">
      <div className="h-12 pt-1 pl-1">
        <DialogClose render={<Button variant="ghost" size="icon" />}>
          <X />
        </DialogClose>
      </div>
      <div className="flex flex-col space-y-1">
        {settingsPages.map((page) => (
          <Button
            key={page.id}
            variant="ghost"
            className={cn(
              "justify-start font-normal",
              activePage === page.id && "bg-muted text-foreground dark:bg-muted/50",
            )}
            onClick={() => setActivePage(page.id)}
          >
            <page.icon />
            {page.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
