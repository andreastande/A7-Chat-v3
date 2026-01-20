"use client"

import { FileText } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function FilesItem() {
  const session = useSession()

  return (
    <SidebarMenuItem>
      {session ? (
        <SidebarMenuButton tooltip="Files" asChild>
          <Link href="/files">
            <FileText />
            Files
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip="Log in to view and chat with your files"
          tooltipHidden={false}
          className="cursor-not-allowed opacity-50"
        >
          <FileText />
          Files
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
