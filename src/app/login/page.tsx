"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6">
      <Button onClick={() => authClient.signIn.social({ provider: "google" })}>Sign in with Google</Button>
      <Button onClick={() => authClient.signIn.social({ provider: "github" })}>Sign in with GitHub</Button>
    </main>
  )
}
