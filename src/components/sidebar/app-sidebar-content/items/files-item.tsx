"use client"

import { FileText } from "lucide-react"
import Link from "next/link"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/base-ui/sidebar"
import { useSession } from "@/components/providers/session-provider"

export function FilesItem() {
  const session = useSession()

  return (
    <SidebarMenuItem>
      {session ? (
        <SidebarMenuButton tooltip="Files" render={<Link href="/files" />}>
          <FileText />
          Files
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip="Log in to view and chat with your files"
          alwaysShowTooltip
          className="cursor-not-allowed opacity-50"
        >
          <FileText />
          Files
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
