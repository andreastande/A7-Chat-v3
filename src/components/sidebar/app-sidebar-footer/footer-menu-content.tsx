"use client"

import { LogIn, LogOut, Settings, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth/client"
import { LearnMoreSubmenu } from "./learn-more-submenu"

export function FooterMenuContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter()

  return (
    <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
      <DialogTrigger asChild>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
      </DialogTrigger>

      <LearnMoreSubmenu />

      <DropdownMenuSeparator />
      {isAuthenticated ? (
        <DropdownMenuItem onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      ) : (
        <>
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogIn />
              Log in
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/signup">
              <UserPlus />
              Sign up for free
            </Link>
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  )
}
