"use client"

import { ChevronsUpDown } from "lucide-react"
import { SettingsDialog } from "@/components/dialogs/settings-dialog"
import { useSession } from "@/components/providers/session-provider"
import { Dialog } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { FooterAvatar } from "./footer-avatar"
import { FooterMenuContent } from "./footer-menu-content"

export function AppSidebarFooter() {
  const session = useSession()

  return (
    <SidebarFooter className="cursor-default">
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog>
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
              <FooterMenuContent isAuthenticated={!!session} />
            </DropdownMenu>
            <SettingsDialog />
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
