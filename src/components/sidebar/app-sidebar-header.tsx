"use client"

import { PanelLeft } from "lucide-react"
import { Button } from "../ui/button"
import { SidebarHeader, useSidebar } from "../ui/sidebar"

export default function AppSidebarHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarHeader className="items-end">
      <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
        <PanelLeft />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </SidebarHeader>
  )
}
