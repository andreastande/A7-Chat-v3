"use client"

import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Dialog } from "@/components/base-ui/dialog"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/base-ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/base-ui/sidebar"
import { useSession } from "@/components/providers/session-provider"
import { FooterAvatar } from "./footer-avatar"
import { FooterMenuContent } from "./footer-menu-content"
import { SettingsDialog } from "./settings-dialog"

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

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SettingsDialog />
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
