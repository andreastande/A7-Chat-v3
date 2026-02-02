"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, ArrowUpRightIcon, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { WithTooltip } from "@/components/ui/tooltip"
import type { DecryptedApiKey } from "@/lib/api-keys/types"
import { cn } from "@/lib/utils"
import { ApiKey } from "./api-key"
import { ApiKeyForm } from "./api-key-form"
import { EmptyApiKeys } from "./empty-api-keys"
import { type ApiKeyFormValues, apiKeySchema } from "./schema"

export function ApiKeysPage({ className }: { className?: string } = {}) {
  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      provider: "ai-gateway",
      name: "",
      key: "",
    },
  })

  const keys = useApiKeysStore((s) => s.keys)
  const activeKeyId = useApiKeysStore((s) => s.activeKeyId)
  const isInitialized = useApiKeysStore((s) => s.isInitialized)
  const addKey = useApiKeysStore((s) => s.addKey)
  const updateKey = useApiKeysStore((s) => s.updateKey)

  const [editingKey, setEditingKey] = useState<DecryptedApiKey | "new" | null>(null)
  const isEditing = editingKey !== null && editingKey !== "new"

  useEffect(() => {
    if (isEditing) {
      form.reset({
        provider: editingKey.provider,
        name: editingKey.name,
        key: editingKey.key,
      })
    } else {
      form.reset({
        provider: "ai-gateway",
        name: "",
        key: "",
      })
    }
  }, [editingKey, isEditing, form])

  async function onSubmit(data: ApiKeyFormValues) {
    try {
      if (isEditing) {
        await updateKey(editingKey.id, data)
      } else {
        await addKey(data)
      }
      setEditingKey(null)
    } catch (e) {
      form.setError("root.serverError", { message: e instanceof Error ? e.message : "Unable to save API key" })
    }
  }

  if (!isInitialized) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Add your own API keys to chat with AI models. Keys are encrypted and stored locally in your browser.
        </p>
      </div>

      {keys.length === 0 && !editingKey ? (
        <EmptyApiKeys onAddKey={() => setEditingKey("new")} />
      ) : (
        <div className="space-y-4">
          {!activeKeyId && !editingKey && (
            <Alert className="w-fit border-amber-200 bg-amber-50 px-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <AlertTriangle />
              <AlertTitle>No active API key</AlertTitle>
              <AlertDescription>Select an API key below to start chatting.</AlertDescription>
            </Alert>
          )}
          {keys.map((key) =>
            isEditing && editingKey.id === key.id ? (
              <ApiKeyForm
                key={key.id}
                form={form}
                editingKeyId={key.id}
                onSubmit={onSubmit}
                onCancel={() => setEditingKey(null)}
              />
            ) : (
              <ApiKey key={key.id} apiKey={key} onEdit={() => setEditingKey(key)} />
            ),
          )}
          {editingKey === "new" ? (
            <ApiKeyForm form={form} editingKeyId={null} onSubmit={onSubmit} onCancel={() => setEditingKey(null)} />
          ) : (
            <Button onClick={() => setEditingKey("new")} disabled={isEditing}>
              <Plus />
              Add API key
            </Button>
          )}
        </div>
      )}

      <div className="mt-auto flex justify-end">
        <WithTooltip
          content="To be written"
          render={
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              render={<Link href="#" />}
              className="text-muted-foreground"
            />
          }
          sideOffset={0}
        >
          How we store your keys <ArrowUpRightIcon />
        </WithTooltip>
      </div>
    </div>
  )
}
