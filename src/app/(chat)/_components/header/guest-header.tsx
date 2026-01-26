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
          <Button variant="ghost" size="sm" render={<Link href="/about" />} nativeButton={false}>
            About
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/features" />} nativeButton={false}>
            Features
          </Button>
        </div>
      )}
      <div className="absolute right-4 flex gap-2">
        <Button size="sm" render={<Link href="/login" />} nativeButton={false}>
          Log in
        </Button>
        <Button variant="outline" size="sm" render={<Link href="/signup" />} nativeButton={false}>
          Sign up for free
        </Button>
      </div>
    </div>
  )
}
