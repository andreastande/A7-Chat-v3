"use client"

import { SiGithub } from "@icons-pack/react-simple-icons"
import {
  Lightbulb,
  LogIn,
  LogOut,
  MonitorSmartphone,
  Moon,
  Settings,
  Sparkles,
  Sun,
  SunMoon,
  UserPlus,
  Zap,
} from "lucide-react"
import { ExternalLink, HatGlasses, Info, ScrollText } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  DropdownMenuCheckboxItem,
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
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuContent className="w-(--anchor-width) min-w-56 rounded-lg">
      <DropdownMenuItem onClick={onOpenSettings}>
        <Settings />
        Settings
      </DropdownMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <SunMoon />
          Theme
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuCheckboxItem checked={theme === "system"} onCheckedChange={() => setTheme("system")}>
              <MonitorSmartphone />
              System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={theme === "dark"} onCheckedChange={() => setTheme("dark")}>
              <Moon />
              Dark
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={theme === "light"} onCheckedChange={() => setTheme("light")}>
              <Sun />
              Light
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Info />
          Learn more
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuItem>
              <Zap />
              Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Lightbulb />
              Tips and tricks
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/features" />}>
              <Sparkles />
              Features
            </DropdownMenuItem>
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
        <DropdownMenuItem onClick={() => signOut()}>
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
