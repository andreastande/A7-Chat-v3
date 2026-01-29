"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { API_KEY_CONFIGS, type ApiKeyProvider } from "@/lib/api-keys"
import { PasswordInput } from "@/app/(auth)/_components/password-input"

const apiKeySchema = z.object({
  key: z.string().min(1, { error: "API key is required." }),
})

interface ApiKeyFormProps {
  provider: ApiKeyProvider
  onSave: (key: string, userId: string) => Promise<void>
  onCancel: () => void
  initialKey?: string
}

export function ApiKeyForm({ provider, onSave, onCancel, initialKey }: ApiKeyFormProps) {
  const session = useSession()
  const config = API_KEY_CONFIGS[provider]

  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      key: initialKey ?? "",
    },
  })

  async function onSubmit(data: z.infer<typeof apiKeySchema>) {
    if (!session?.user?.id) {
      form.setError("root.serverError", { message: "You must be logged in to save an API key." })
      return
    }

    try {
      await onSave(data.key, session.user.id)
    } catch {
      form.setError("root.serverError", { message: "Failed to save API key. Please try again." })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="key"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="api-key">{config.label} API Key</FieldLabel>
              <PasswordInput
                {...field}
                id="api-key"
                placeholder={config.placeholder}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                {config.helpUrl ? (
                  <>
                    Get your key from the{" "}
                    <Link href={config.helpUrl} target="_blank" className="underline">
                      {config.label} dashboard
                    </Link>
                    .
                  </>
                ) : (
                  config.description
                )}
              </FieldDescription>
            </Field>
          )}
        />
        {form.formState.errors.root?.serverError && (
          <Field>
            <FieldError errors={[form.formState.errors.root.serverError]} />
          </Field>
        )}
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting} focusableWhenDisabled>
          {form.formState.isSubmitting && <Spinner />}
          Save Key
        </Button>
      </div>
    </form>
  )
}
