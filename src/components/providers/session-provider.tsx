"use client"

import { createContext, type ReactNode, useContext } from "react"
import { useClientSession } from "@/lib/auth/client"
import type { auth } from "@/lib/auth/server"

type Session = Awaited<ReturnType<typeof auth.api.getSession>>

const SessionContext = createContext<Session>(null)

export function SessionProvider({ session, children }: { session: Session; children: ReactNode }) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export function useSession() {
  const serverSession = useContext(SessionContext)
  const { data: clientSession, isPending } = useClientSession()

  // Use server session while client is loading, then switch to client session
  if (isPending) {
    return serverSession
  }
  return clientSession
}
