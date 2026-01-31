import { useChatActions } from "@ai-sdk-tools/store"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApiKeysStore } from "@/components/providers/api-keys-provider"
import { Button } from "@/components/ui/button"
import { useSelectedModelStore } from "./providers/selected-model-provider"

export function ErrorMessage({ error }: { error: Error }) {
  const pathname = usePathname()
  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const getActiveKeyPayload = useApiKeysStore((s) => s.getActiveKeyPayload)
  const { regenerate } = useChatActions()

  const isAPIKeyError = ["AI Gateway authentication failed", "API key missing"].some((msg) =>
    error.message.includes(msg),
  )

  return (
    <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4 dark:border-destructive/30 dark:bg-destructive/20">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="size-5" />
        <p>{isAPIKeyError ? "API key missing or invalid" : "Something went wrong"}</p>
      </div>
      {isAPIKeyError ? (
        <Button nativeButton={false} render={<Link href={`${pathname}?settings=api-keys`} />}>
          Configure API key
        </Button>
      ) : (
        <Button onClick={() => regenerate({ body: { modelId: selectedModelId, apiKey: getActiveKeyPayload() } })}>
          Retry
        </Button>
      )}
    </div>
  )
}
