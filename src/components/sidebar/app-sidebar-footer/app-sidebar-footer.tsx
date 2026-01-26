"use client"

import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Dialog } from "@/components/base-ui/dialog"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/base-ui/dropdown-menu"
import { useSession } from "@/components/providers/session-provider"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { FooterAvatar } from "./footer-avatar"
import { FooterMenuContent } from "./footer-menu-content"
import { SettingsDialog } from "./settings-dialog"

export function AppSidebarFooter() {
  const session = useSession()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <SidebarFooter className="cursor-default">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                />
              }
            >
              <FooterAvatar user={session?.user} />
              <span className="flex-1 truncate text-left text-sm">{session?.user.name ?? "Guest"}</span>
              <ChevronsUpDown className="ml-auto hidden size-4 group-[:hover,:focus-visible,[data-popup-open]]/menu-button:flex" />
            </DropdownMenuTrigger>
            <FooterMenuContent isAuthenticated={!!session} onOpenSettings={() => setSettingsOpen(true)} />
          </DropdownMenu>

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SettingsDialog />
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
