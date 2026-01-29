"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"
import { useApiKeysStore } from "@/components/providers/api-keys-provider"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { API_KEY_CONFIGS, API_KEY_PROVIDERS, type ApiKeyProvider } from "@/lib/api-keys"
import { cn } from "@/lib/utils"
import { ApiKeyCard } from "./api-key-card"
import { ApiKeyForm } from "./api-key-form"

type EditState = { mode: "idle" } | { mode: "add"; provider: ApiKeyProvider } | { mode: "edit"; provider: ApiKeyProvider }

export function ApiKeysPage({ className }: { className?: string } = {}) {
  const session = useSession()
  const [editState, setEditState] = useState<EditState>({ mode: "idle" })

  const { configuredProviders, addKey, deleteKey, isInitialized } = useApiKeysStore(
    useShallow((s) => ({
      configuredProviders: s.configuredProviders,
      addKey: s.addKey,
      deleteKey: s.deleteKey,
      isInitialized: s.isInitialized,
    })),
  )

  const unconfiguredProviders = API_KEY_PROVIDERS.filter((p) => !configuredProviders.includes(p))

  async function handleSave(key: string, userId: string) {
    if (editState.mode === "idle") return

    await addKey(editState.provider, key, userId)
    toast.success(`${API_KEY_CONFIGS[editState.provider].label} key saved`)
    setEditState({ mode: "idle" })
  }

  async function handleDelete(provider: ApiKeyProvider) {
    await deleteKey(provider)
    toast.success(`${API_KEY_CONFIGS[provider].label} key deleted`)
  }

  if (!session?.user) {
    return (
      <div className={cn("flex flex-col", className)}>
        <h2 className="text-lg font-semibold">API Keys</h2>
        <p className="text-muted-foreground mt-1 text-sm">Please log in to manage your API keys.</p>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className={cn("flex flex-col", className)}>
        <h2 className="text-lg font-semibold">API Keys</h2>
        <p className="text-muted-foreground mt-1 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className="text-lg font-semibold">API Keys</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Your API keys are stored securely on this device and are never sent to our servers.
      </p>

      <div className="mt-6 space-y-4">
        {editState.mode !== "idle" ? (
          <div className="rounded-lg border p-4">
            <ApiKeyForm
              provider={editState.provider}
              onSave={handleSave}
              onCancel={() => setEditState({ mode: "idle" })}
            />
          </div>
        ) : (
          <>
            {configuredProviders.map((provider) => (
              <ApiKeyCard
                key={provider}
                provider={provider as ApiKeyProvider}
                onEdit={() => setEditState({ mode: "edit", provider: provider as ApiKeyProvider })}
                onDelete={() => handleDelete(provider as ApiKeyProvider)}
              />
            ))}

            {unconfiguredProviders.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditState({ mode: "add", provider: unconfiguredProviders[0]! })}
              >
                <Plus className="mr-2 size-4" />
                Add API Key
              </Button>
            )}

            {configuredProviders.length === 0 && unconfiguredProviders.length === 0 && (
              <p className="text-muted-foreground text-sm">All available providers have been configured.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
