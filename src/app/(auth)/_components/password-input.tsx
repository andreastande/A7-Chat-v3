"use client"

import { Eye, EyeOff } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WithTooltip } from "@/components/ui/tooltip"

export function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="relative">
      <Input type={isRevealed ? "text" : "password"} className={`pr-10 ${className ?? ""}`} {...props} />
      <WithTooltip content={isRevealed ? "Hide password" : "Show password"} delayDuration={300} asChild>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsRevealed((v) => !v)}
          aria-label={isRevealed ? "Hide password" : "Show password"}
          className="-translate-y-1/2 absolute top-1/2 right-2 size-7"
        >
          {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </WithTooltip>
    </div>
  )
}
