import { SquarePen } from "lucide-react"
import Link from "next/link"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export default function ChatItem() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/">
          <SquarePen />
          Chat
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
