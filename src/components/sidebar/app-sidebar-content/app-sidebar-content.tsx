import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/base-ui/sidebar"
import { ChatItem, FilesItem, HistoryItem, ImagesItem, ProjectsItem } from "./items"

export function AppSidebarContent() {
  return (
    <SidebarContent className="group-data-[state=collapsed]:cursor-e-resize group-data-[state=expanded]:cursor-w-resize">
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
