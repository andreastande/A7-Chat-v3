"use client"

import { ChevronRight, Folder, PlusIcon } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ProjectsItem() {
  const session = useSession()

  return (
    <SidebarMenuItem>
      {session ? (
        <Collapsible>
          <SidebarMenuButton asChild>
            <Link href="/projects">
              <Folder />
              Projects
            </Link>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction
              className="left-1.5 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
              showOnHover
            >
              <ChevronRight />
            </SidebarMenuAction>
          </CollapsibleTrigger>
          <SidebarMenuAction showOnHover>
            <PlusIcon />
            <span className="sr-only">Add project</span>
          </SidebarMenuAction>
          <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link href="#">Test</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild>
              <span className="cursor-not-allowed opacity-50">
                <Folder />
                Projects
              </span>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">Log in to view your projects</TooltipContent>
        </Tooltip>
      )}
    </SidebarMenuItem>
  )
}
