"use client"

import { ChevronsUpDown } from "lucide-react"
import { parseAsStringLiteral, useQueryState } from "nuqs"
import { SettingsDialog } from "@/app/(sidebar)/_components/dialogs/settings-dialog"
import { settingsPages } from "@/app/(sidebar)/_components/dialogs/settings-dialog/types"
import { useSession } from "@/components/providers/session-provider"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { FooterAvatar } from "./footer-avatar"
import { FooterMenuContent } from "./footer-menu-content"

export function AppSidebarFooter() {
  const session = useSession()
  const [settingsPage, setSettingsPage] = useQueryState("settings", parseAsStringLiteral(settingsPages))

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
            <FooterMenuContent isAuthenticated={!!session} onOpenSettings={() => setSettingsPage("general")} />
          </DropdownMenu>

          <SettingsDialog
            open={settingsPage !== null}
            onOpenChange={(open) => {
              if (!open) void setSettingsPage(null)
            }}
            activePage={settingsPage}
            setActivePage={setSettingsPage}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
