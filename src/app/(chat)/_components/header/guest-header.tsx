"use client"

import { useMessageCount } from "@ai-sdk-tools/store"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GuestHeader() {
  const messageCount = useMessageCount()

  return (
    <div className="sticky top-0 z-10 flex justify-center p-2">
      {messageCount === 0 && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/features">Features</Link>
          </Button>
        </div>
      )}
      <div className="absolute right-4 flex gap-2">
        <Button size="sm" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button variant="outline" size="sm">
          <Link href="/signup">Sign up for free</Link>
        </Button>
      </div>
    </div>
  )
}
