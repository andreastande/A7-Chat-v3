"use client"

import { Image } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function ImagesItem() {
  const session = useSession()

  return (
    <SidebarMenuItem>
      {session ? (
        <SidebarMenuButton tooltip="Images" render={<Link href="/images" />}>
          <Image />
          Images
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip="Log in to view and edit your images"
          alwaysShowTooltip
          className="cursor-not-allowed opacity-50"
        >
          <Image />
          Images
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
