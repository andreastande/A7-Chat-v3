import "server-only"

import { headers } from "next/headers"
import { cache } from "react"
import { auth } from "@/lib/auth/server"

/**
 * Get the current authenticated user's session.
 * Cached per request to avoid duplicate auth checks.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  return session.user
})

/**
 * Get current user or throw if not authenticated.
 * Use in protected routes/actions where auth is required.
 */
export const requireAuth = cache(async () => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
})
