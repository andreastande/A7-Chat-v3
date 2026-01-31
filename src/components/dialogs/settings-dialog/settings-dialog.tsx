"use client"

import type { ComponentType } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AccountPage, ApiKeysPage, AppearancePage, GeneralPage, ModelsPage, UsagePage } from "./pages"
import { SettingsNav } from "./settings-nav"
import type { SettingsPage } from "./types"

const pages: Record<SettingsPage, ComponentType<{ className?: string }>> = {
  general: GeneralPage,
  appearance: AppearancePage,
  models: ModelsPage,
  "api-keys": ApiKeysPage,
  usage: UsagePage,
  account: AccountPage,
}

export function SettingsDialog({
  open,
  onOpenChange,
  activePage,
  setActivePage,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  activePage: SettingsPage | null
  setActivePage: (page: SettingsPage) => void
}) {
  const ActivePage = pages[activePage ?? "general"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex h-150 w-full max-w-170! gap-0 p-0">
        <SettingsNav activePage={activePage ?? "general"} setActivePage={setActivePage} />
        <ActivePage className="scrollbar-thin-transparent flex-1 overflow-y-auto p-3.5" />
      </DialogContent>
    </Dialog>
  )
}
