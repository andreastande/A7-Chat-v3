"use client"

import { SiGithub } from "@icons-pack/react-simple-icons"
import { LogIn, LogOut, Settings, UserPlus } from "lucide-react"
import { ExternalLink, HatGlasses, Info, ScrollText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth/client"

export function FooterMenuContent({
  isAuthenticated,
  onOpenSettings,
}: {
  isAuthenticated: boolean
  onOpenSettings: () => void
}) {
  const router = useRouter()

  return (
    <DropdownMenuContent className="w-(--anchor-width) min-w-56 rounded-lg">
      <DropdownMenuItem onClick={onOpenSettings}>
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
            <DropdownMenuItem render={<Link href="https://github.com/andreastande/A7-Chat-v3" target="_blank" />}>
              <SiGithub />
              GitHub
              <DropdownMenuShortcut showOnFocus>
                <ExternalLink />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem render={<Link href="/privacy-policy" target="_blank" />}>
              <HatGlasses />
              Privacy policy
              <DropdownMenuShortcut showOnFocus>
                <ExternalLink />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem render={<Link href="/terms-of-service" target="_blank" />}>
              <ScrollText />
              Terms of service
              <DropdownMenuShortcut showOnFocus>
                <ExternalLink />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSeparator />
      {isAuthenticated ? (
        <DropdownMenuItem onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      ) : (
        <>
          <DropdownMenuItem render={<Link href="/login" />}>
            <LogIn />
            Log in
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/signup" />}>
            <UserPlus />
            Sign up for free
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  )
}
