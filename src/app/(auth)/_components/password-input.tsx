"use client"

import { Eye, EyeOff } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { WithTooltip } from "@/components/ui/tooltip"

export function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <InputGroup className={className}>
      <InputGroupInput {...props} type={isRevealed ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <WithTooltip
          animated
          content={isRevealed ? "Hide password" : "Show password"}
          render={
            <InputGroupButton
              aria-label={isRevealed ? "Hide password" : "Show password"}
              size="icon-xs"
              onClick={() => setIsRevealed((v) => !v)}
            />
          }
        >
          {isRevealed ? <EyeOff /> : <Eye />}
        </WithTooltip>
      </InputGroupAddon>
    </InputGroup>
  )
}
