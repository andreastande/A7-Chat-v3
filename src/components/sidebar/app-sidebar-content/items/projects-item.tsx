"use client"

import { ChevronRight, Folder, PlusIcon } from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/base-ui/collapsible"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/base-ui/sidebar"
import { useSession } from "@/components/providers/session-provider"

export function ProjectsItem() {
  const session = useSession()

  return (
    <SidebarMenuItem>
      {session ? (
        <Collapsible>
          <SidebarMenuButton render={<Link href="/projects" />}>
            <Folder />
            Projects
          </SidebarMenuButton>
          <CollapsibleTrigger
            render={
              <SidebarMenuAction
                className="left-1.5 bg-sidebar-accent text-sidebar-accent-foreground data-panel-open:rotate-90"
                showOnHover
              />
            }
          >
            <ChevronRight />
          </CollapsibleTrigger>
          <SidebarMenuAction showOnHover>
            <PlusIcon />
            <span className="sr-only">Add project</span>
          </SidebarMenuAction>
          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all duration-100 ease-out data-ending-style:h-0 data-starting-style:h-0">
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton render={<Link href="#" />}>Test</SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          tooltip="Log in to view your projects"
          alwaysShowTooltip
          className="cursor-not-allowed opacity-50"
        >
          <Folder />
          Projects
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
