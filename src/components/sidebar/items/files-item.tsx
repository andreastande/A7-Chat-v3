import { FileText } from "lucide-react"
import Link from "next/link"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export default function FilesItem() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/files">
          <FileText />
          Files
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
