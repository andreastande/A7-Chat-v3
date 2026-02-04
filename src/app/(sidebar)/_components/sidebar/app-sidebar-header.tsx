"use client"

import { useKeyboardKeys } from "@/hooks/use-keyboard-keys"
import { SidebarHeader, useSidebar, SidebarTrigger } from "../../../../components/ui/sidebar"
import { WithTooltip } from "../../../../components/ui/tooltip"

export function AppSidebarHeader() {
  const { open } = useSidebar()
  const { mod } = useKeyboardKeys()

  return (
    <SidebarHeader className="items-end">
      <WithTooltip
        content={
          <>
            {open ? "Close sidebar" : "Open sidebar"}
            <span className="ml-2 text-xs text-muted-foreground">{mod}B</span>
          </>
        }
        side="right"
        render={<SidebarTrigger />}
      />
    </SidebarHeader>
  )
}
