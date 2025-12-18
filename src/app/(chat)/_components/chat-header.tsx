"use client"

import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"

export function ChatHeader() {
  const session = useSession()

  return (
    <>
      {session ? (
        <div>{null}</div>
      ) : (
        <div className="sticky top-0 z-10 flex items-center justify-center p-4">
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/features">Features</Link>
            </Button>
          </div>
          <div className="absolute right-4 flex gap-2">
            <Button asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="outline">
              <Link href="/signup">Sign up for free</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
