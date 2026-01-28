"use client"

import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { SettingsDialog } from "@/components/dialogs/settings-dialog"
import { useSession } from "@/components/providers/session-provider"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { FooterAvatar } from "./footer-avatar"
import { FooterMenuContent } from "./footer-menu-content"

export function AppSidebarFooter() {
  const session = useSession()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <SidebarFooter>
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
              <ChevronsUpDown className="invisible ml-auto group-[:hover,:focus-visible,[data-popup-open]]/menu-button:visible" />
            </DropdownMenuTrigger>
            <FooterMenuContent isAuthenticated={!!session} onOpenSettings={() => setSettingsOpen(true)} />
          </DropdownMenu>

          <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
