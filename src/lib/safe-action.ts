import "server-only"

import { createSafeActionClient } from "next-safe-action"
import { headers } from "next/headers"
import { z } from "zod"
import { auth } from "@/lib/auth/server"

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      errorMessage: z.string(),
    })
  },
  handleServerError(_, { metadata }) {
    return metadata.errorMessage
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  return next({ ctx: { userId: session.user.id } })
})
