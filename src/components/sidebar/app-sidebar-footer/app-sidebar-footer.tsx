"use client"

import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Dialog } from "@/components/base-ui/dialog"
import { useSession } from "@/components/providers/session-provider"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <FooterAvatar user={session?.user} />
                <span className="flex-1 truncate text-left text-sm">{session?.user.name ?? "Guest"}</span>
                <ChevronsUpDown className="ml-auto hidden size-4 group-[:hover,:focus-visible,[data-state=open]]/menu-button:flex" />
              </SidebarMenuButton>
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
