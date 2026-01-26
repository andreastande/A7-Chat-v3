import { Sidebar } from "@/components/ui/sidebar"
import { AppSidebarContent } from "./app-sidebar-content"
import { AppSidebarFooter } from "./app-sidebar-footer"
import { AppSidebarHeader } from "./app-sidebar-header"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
    </Sidebar>
  )
}
