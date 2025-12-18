import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar"
import { AppSidebarFooter } from "./app-sidebar-footer"
import { AppSidebarHeader } from "./app-sidebar-header"
import { ChatItem } from "./items/chat-item"
import { FilesItem } from "./items/files-item"
import { HistoryItem } from "./items/history-item"
import { ImagesItem } from "./items/images-item"
import { ProjectsItem } from "./items/projects-item"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup className="cursor-default">
          <SidebarGroupContent>
            <SidebarMenu>
              <ChatItem />
              <ImagesItem />
              <FilesItem />
              <ProjectsItem />
              <HistoryItem />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  )
}
