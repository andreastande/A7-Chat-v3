"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpRightIcon, Edit, Key, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { PasswordInput } from "@/app/(auth)/_components/password-input"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { WithTooltip } from "@/components/ui/tooltip"
import {
  API_KEY_PROVIDER_LABELS,
  API_KEY_PROVIDERS,
  type ApiKeyProvider,
  type ApiKeyProviderLabel,
} from "@/lib/api-keys/types"
import { cn } from "@/lib/utils"

const apiKeySchema = z.object({
  provider: z.enum(API_KEY_PROVIDERS, { error: "Please choose a valid provider" }),
  name: z.string().min(1, { error: "Name is required" }),
  key: z.string().min(1, { error: "API key is required" }),
})

const items: { label: ApiKeyProviderLabel; value: ApiKeyProvider }[] = [
  { label: "AI Gateway", value: "ai-gateway" },
  { label: "OpenRouter", value: "openrouter" },
]

export function ApiKeysPage({ className }: { className?: string } = {}) {
  const session = useSession()
  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      provider: "ai-gateway",
      name: "",
      key: "",
    },
  })

  const keys = useApiKeysStore((s) => s.keys)
  const activeKeyId = useApiKeysStore((s) => s.activeKeyId)
  const anonymousKeysCount = useApiKeysStore((s) => s.anonymousKeysCount)
  const isInitialized = useApiKeysStore((s) => s.isInitialized)
  const addKey = useApiKeysStore((s) => s.addKey)
  const removeKey = useApiKeysStore((s) => s.removeKey)
  const setActiveKey = useApiKeysStore((s) => s.setActiveKey)
  const transferFromAnonymous = useApiKeysStore((s) => s.transferFromAnonymous)

  const [isAdding, setIsAdding] = useState(false)

  async function onSubmit(data: z.infer<typeof apiKeySchema>) {
    try {
      await addKey(data)
      setIsAdding(false)
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

      {keys.length === 0 && !isAdding ? (
        anonymousKeysCount > 0 && session ? (
          <Empty className="justify-start">
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
              <Button variant="outline" onClick={() => setIsAdding(true)}>
                Add new key
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Empty className="justify-start">
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
              <Button onClick={() => setIsAdding(true)}>Add API key</Button>
            </EmptyContent>
          </Empty>
        )
      ) : (
        <div className="space-y-6">
          {keys.length > 0 && (
            <RadioGroup value={activeKeyId} onValueChange={setActiveKey}>
              {keys.map((key) => (
                <FieldLabel key={key.id} htmlFor={key.id}>
                  <Field orientation="horizontal">
                    <FieldContent className="h-full justify-between">
                      <FieldTitle>{key.name}</FieldTitle>
                      <FieldDescription className="-translate-y-1.5">
                        {API_KEY_PROVIDER_LABELS[key.provider]}
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex h-full flex-col items-end gap-2">
                      <RadioGroupItem value={key.id} id={key.id} className="-translate-x-2" />
                      <div className="flex gap-px">
                        <WithTooltip
                          side="bottom"
                          content="Edit (soon)"
                          render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground" />}
                        >
                          <Edit />
                        </WithTooltip>
                        <WithTooltip
                          side="bottom"
                          content="Remove"
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeKey(key.id)}
                              className="text-muted-foreground"
                            />
                          }
                        >
                          <Trash2 />
                        </WithTooltip>
                      </div>
                    </div>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          )}
          {isAdding ? (
            <Card size="sm" className="bg-muted/35 dark:bg-background/20">
              <CardHeader>
                <CardTitle>Add API key</CardTitle>
                <CardDescription>Choose between AI Gateway and OpenRouter.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="provider"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="provider">Provider</FieldLabel>
                          <Select
                            items={items}
                            name={field.name}
                            defaultValue="ai-gateway"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="provider"
                              aria-invalid={fieldState.invalid}
                              className="bg-popover dark:bg-input/30"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent alignItemWithTrigger={false}>
                              <SelectGroup>
                                {items.map((item) => (
                                  <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="name">Name</FieldLabel>
                          <Input
                            {...field}
                            id="name"
                            type="text"
                            placeholder="e.g., Personal Key"
                            aria-invalid={fieldState.invalid}
                            className="bg-popover dark:bg-input/30"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="key"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="key">API key</FieldLabel>
                          <PasswordInput
                            {...field}
                            id="key"
                            aria-invalid={fieldState.invalid}
                            placeholder={form.watch("provider") === "openrouter" ? "sk-or-v1-..." : "vck_..."}
                            className="bg-popover dark:bg-input/30"
                          />
                          <FieldDescription>
                            Your API key is encrypted and stored securely in your browser.
                          </FieldDescription>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    {form.formState.errors.root?.serverError && (
                      <Field>
                        <FieldError errors={[form.formState.errors.root.serverError]} />
                      </Field>
                    )}
                    <Field orientation="horizontal">
                      <Button type="submit" disabled={form.formState.isSubmitting} focusableWhenDisabled>
                        {form.formState.isSubmitting && <Spinner />}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          form.reset()
                          setIsAdding(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={() => setIsAdding(true)}>
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
