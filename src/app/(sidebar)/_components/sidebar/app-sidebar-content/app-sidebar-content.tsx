import { cookies } from "next/headers"
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar"
import { ChatItem, FilesItem, HistoryItem, ImagesItem, ProjectsItem } from "./items"

export async function AppSidebarContent() {
  const cookieStore = await cookies()

  const historyOpen = (cookieStore.get("history_state")?.value ?? "true") === "true"
  const projectsOpen = (cookieStore.get("projects_state")?.value ?? "true") === "true"

  return (
    <SidebarContent className="group-data-[state=collapsed]:cursor-e-resize group-data-[state=expanded]:cursor-w-resize">
      <SidebarGroup className="cursor-default">
        <SidebarGroupContent>
          <SidebarMenu>
            <ChatItem />
            <ImagesItem />
            <FilesItem />
            <ProjectsItem defaultOpen={projectsOpen} />
            <HistoryItem defaultOpen={historyOpen} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
