"use client"

import { type ComponentType, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AccountPage, ApiKeysPage, AppearancePage, GeneralPage, ModelsPage, UsagePage } from "./pages"
import { SettingsNav } from "./settings-nav"
import type { SettingsPage } from "./types"

const pageComponents: Record<SettingsPage, ComponentType> = {
  general: GeneralPage,
  appearance: AppearancePage,
  models: ModelsPage,
  "api-keys": ApiKeysPage,
  usage: UsagePage,
  account: AccountPage,
}

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activePage, setActivePage] = useState<SettingsPage>("general")
  const ActivePageComponent = pageComponents[activePage]

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={(open) => !open && setActivePage("general")}>
      <DialogContent showCloseButton={false} className="flex h-150 w-full max-w-170! gap-0 p-0">
        <SettingsNav activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1 p-1">
          <ActivePageComponent />
        </div>
      </DialogContent>
    </Dialog>
  )
}
