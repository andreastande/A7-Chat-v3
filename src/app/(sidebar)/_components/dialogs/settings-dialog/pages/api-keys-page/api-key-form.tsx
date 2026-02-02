"use client"

import { Controller, type UseFormReturn } from "react-hook-form"
import { SecretInput } from "@/app/(auth)/_components/secret-input"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { type ApiKeyFormValues, providerItems } from "./schema"

interface ApiKeyFormProps {
  form: UseFormReturn<ApiKeyFormValues>
  editingKeyId: string | null
  onSubmit: (data: ApiKeyFormValues) => Promise<void>
  onCancel: () => void
}

export function ApiKeyForm({ form, editingKeyId, onSubmit, onCancel }: ApiKeyFormProps) {
  const activeKeyId = useApiKeysStore((s) => s.activeKeyId)
  const isEditing = editingKeyId !== null
  const isActiveKey = isEditing && editingKeyId === activeKeyId

  return (
    <Card
      size="sm"
      className={cn("animate-in bg-muted/35 fade-in-0 zoom-in-95 dark:bg-background/20", isActiveKey && "ring-primary")}
    >
      <CardHeader>
        <CardTitle>{isEditing ? "Edit API key" : "Add API key"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the provider, name, or key." : "Choose between AI Gateway and OpenRouter."}
        </CardDescription>
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
                    items={providerItems}
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
                        {providerItems.map((item) => (
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
                  <SecretInput
                    {...field}
                    id="key"
                    aria-invalid={fieldState.invalid}
                    placeholder={form.watch("provider") === "openrouter" ? "sk-or-v1-..." : "vck_..."}
                    className="bg-popover dark:bg-input/30"
                  />
                  <FieldDescription>Your API key is encrypted and stored securely in your browser.</FieldDescription>
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
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
