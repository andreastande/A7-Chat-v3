import { useChatActions } from "@ai-sdk-tools/store"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
    <>
      <Alert className="max-w-lg border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
        <AlertTriangle />
        <AlertTitle>{isAPIKeyError ? "API key missing or invalid" : "Something went wrong"}</AlertTitle>
        {isAPIKeyError ? (
          <AlertDescription>Configure an API key to continue chatting.</AlertDescription>
        ) : (
          <AlertDescription>An unexpected error occurred. Please try again.</AlertDescription>
        )}
        <AlertAction>
          {isAPIKeyError ? (
            <Button size="xs" nativeButton={false} render={<Link href={`${pathname}?settings=api-keys`} />}>
              Configure API key
            </Button>
          ) : (
            <Button onClick={() => regenerate({ body: { modelId: selectedModelId, apiKey: getActiveKeyPayload() } })}>
              Retry
            </Button>
          )}
        </AlertAction>
      </Alert>
    </>
  )
}
