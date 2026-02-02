"use client"

import { Key } from "lucide-react"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

interface EmptyApiKeysProps {
  onAddKey: () => void
}

export function EmptyApiKeys({ onAddKey }: EmptyApiKeysProps) {
  const session = useSession()
  const anonymousKeysCount = useApiKeysStore((s) => s.anonymousKeysCount)
  const transferFromAnonymous = useApiKeysStore((s) => s.transferFromAnonymous)

  return (
    <Empty className="justify-start">
      {anonymousKeysCount > 0 && session ? (
        <>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Key />
            </EmptyMedia>
            <EmptyTitle>Transfer your API keys</EmptyTitle>
            <EmptyDescription>
              We found {anonymousKeysCount} key{anonymousKeysCount !== 1 && "s"} from before you signed in.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button onClick={transferFromAnonymous}>Transfer keys</Button>
            <Button variant="outline" onClick={onAddKey}>
              Add new key
            </Button>
          </EmptyContent>
        </>
      ) : (
        <>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Key />
            </EmptyMedia>
            <EmptyTitle>No API keys</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t configured any API keys yet. Add an API key to start chatting.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button onClick={onAddKey}>Add API key</Button>
          </EmptyContent>
        </>
      )}
    </Empty>
  )
}
