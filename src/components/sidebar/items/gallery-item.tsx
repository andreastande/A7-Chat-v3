import { Image } from "lucide-react"
import Link from "next/link"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export default function GalleryItem() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/gallery">
          <Image />
          Gallery
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
