"use client"

import { Edit, Trash2 } from "lucide-react"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { WithTooltip } from "@/components/ui/tooltip"
import { API_KEY_PROVIDER_LABELS, type DecryptedApiKey } from "@/lib/api-keys/types"

interface ApiKeyProps {
  apiKey: DecryptedApiKey
  onEdit: () => void
}

export function ApiKey({ apiKey, onEdit }: ApiKeyProps) {
  const activeKeyId = useApiKeysStore((s) => s.activeKeyId)
  const setActiveKey = useApiKeysStore((s) => s.setActiveKey)
  const removeKey = useApiKeysStore((s) => s.removeKey)

  return (
    <RadioGroup value={activeKeyId} onValueChange={setActiveKey}>
      <FieldLabel htmlFor={apiKey.id}>
        <Field orientation="horizontal">
          <FieldContent className="h-full justify-between">
            <FieldTitle>{apiKey.name}</FieldTitle>
            <FieldDescription className="-translate-y-1.5">{API_KEY_PROVIDER_LABELS[apiKey.provider]}</FieldDescription>
          </FieldContent>
          <div className="flex h-full flex-col items-end gap-2">
            <RadioGroupItem value={apiKey.id} id={apiKey.id} className="-translate-x-2" />
            <div className="flex gap-px">
              <WithTooltip
                side="bottom"
                content="Edit"
                render={<Button variant="ghost" size="icon-sm" onClick={onEdit} className="text-muted-foreground" />}
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
                    onClick={() => removeKey(apiKey.id)}
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
    </RadioGroup>
  )
}
