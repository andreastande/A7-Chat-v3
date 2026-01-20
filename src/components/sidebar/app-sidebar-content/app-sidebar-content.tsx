import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar"
import { ChatItem, FilesItem, HistoryItem, ImagesItem, ProjectsItem } from "./items"

export function AppSidebarContent() {
  return (
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
  )
}
