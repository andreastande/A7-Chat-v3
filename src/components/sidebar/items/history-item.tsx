"use client"

import { ChevronRight, History } from "lucide-react"
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

export function HistoryItem() {
  const session = useSession()

  return (
    <SidebarMenuItem>
      {session ? (
        <Collapsible>
          <SidebarMenuButton>
            <History />
            History
            <kbd className="*:kbd invisible absolute top-2 right-2 flex space-x-0.5 group-data-[state=expanded]:group-[:hover,:focus-visible]/menu-button:visible">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </kbd>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction
              className="left-1.5 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
              showOnHover
            >
              <ChevronRight />
            </SidebarMenuAction>
          </CollapsibleTrigger>
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
                <History />
                History
              </span>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">Log in to view your chat history</TooltipContent>
        </Tooltip>
      )}
    </SidebarMenuItem>
  )
}
