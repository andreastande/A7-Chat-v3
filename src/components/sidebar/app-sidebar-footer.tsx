"use client"

import { SiGithub } from "@icons-pack/react-simple-icons"
import { ChevronsUpDown, ExternalLink, HatGlasses, Info, LogOut, ScrollText, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth/client"
import { useSession } from "../providers/session-provider"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

export function AppSidebarFooter() {
  const session = useSession()
  const router = useRouter()

  const initials = (session?.user.name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("")

  return (
    <SidebarFooter className="cursor-default">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={session ? "lg" : "default"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {session ? (
                  <>
                    <Avatar className="size-8 rounded-md group-data-[collapsible=icon]:group-[:hover,:focus,[data-state=open]]/menu-button:brightness-90">
                      <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                      <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-left text-sm font-medium">{session.user.name}</span>
                    <ChevronsUpDown className="ml-auto hidden size-4 group-[:hover,:focus-visible,[data-state=open]]/menu-button:flex" />
                  </>
                ) : (
                  <>
                    <Settings />
                    Settings
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Info />
                  Learn more
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {[
                      { href: "https://github.com/andreastande/A7-Chat-v3", icon: SiGithub, label: "GitHub" },
                      { href: "/privacy-policy", icon: HatGlasses, label: "Privacy policy", separator: true },
                      { href: "/terms-of-service", icon: ScrollText, label: "Terms of service" },
                    ].map(({ href, icon: Icon, label, separator }) => (
                      <div key={href}>
                        {separator && <DropdownMenuSeparator />}
                        <DropdownMenuItem className="group/item" asChild>
                          <Link href={href} target="_blank">
                            <Icon />
                            <span className="mr-4">{label}</span>
                            <ExternalLink className="invisible ml-auto group-[:hover,:focus-visible]/item:visible" />
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
