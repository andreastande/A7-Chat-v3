"use client"

import { SidebarHeader, useSidebar, SidebarTrigger } from "../ui/sidebar"
import { WithTooltip } from "../ui/tooltip"

export function AppSidebarHeader() {
  const { open } = useSidebar()

  return (
    <SidebarHeader className="items-end">
      <WithTooltip
        content={
          <>
            {open ? "Close sidebar" : "Open sidebar"}
            <span className="ml-2 text-xs text-muted-foreground">⌘B</span>
          </>
        }
        side="right"
        render={<SidebarTrigger />}
      />
    </SidebarHeader>
  )
}
