"use client"

import "react-circular-progressbar/dist/styles.css"
import { useChatStatus, useMessageCount, useSelector } from "@ai-sdk-tools/store"
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { formatPrice, formatTokenAmount, getContextUsage, getCumulativeUsage } from "@/lib/models/usage"
import { getModel } from "@/lib/models/utils"
import { cn } from "@/lib/utils"
import type { MessageMetadata, UIMessage } from "@/types/ui-message"
import { useSelectedModelStore } from "../providers/selected-model-provider"

export function TokenUsage() {
  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const status = useChatStatus()
  const messageCount = useMessageCount()

  const lastAssistantMetadata: MessageMetadata | null = useSelector<UIMessage>(
    "last-assistant-metadata",
    (messages) => {
      const lastAssistantMsg = messages.findLast((m) => m.role === "assistant" && m.metadata)
      return lastAssistantMsg?.metadata ?? null
    },
    [status],
  )

  const allAssistantMetadatas: MessageMetadata[] = useSelector<UIMessage>(
    "all-assistant-metadatas",
    (messages) =>
      messages.reduce<MessageMetadata[]>((acc, m) => {
        if (m.role === "assistant" && m.metadata) acc.push(m.metadata)
        return acc
      }, []),
    [status],
  )

  if (messageCount === 0) return null

  const selectedModel = getModel(selectedModelId)
  const contextUsage =
    selectedModel && lastAssistantMetadata?.totalUsage
      ? getContextUsage(selectedModel, lastAssistantMetadata.totalUsage)
      : 0
  const isOverLimit = contextUsage >= 1

  const cumulative = getCumulativeUsage(allAssistantMetadatas)

  return (
    <HoverCard>
      <HoverCardTrigger render={<div className="group cursor-default p-2" />}>
        <CircularProgressbarWithChildren
          value={contextUsage}
          maxValue={1}
          strokeWidth={10}
          styles={{
            ...buildStyles({
              pathColor: isOverLimit ? "var(--destructive)" : "var(--primary)",
              trailColor: "var(--input)",
            }),
            root: { overflow: "visible" },
          }}
          className="size-4 group-hover:brightness-90 dark:group-hover:brightness-85"
        >
          {isOverLimit && <span className="text-[8px] leading-none font-bold text-destructive">!</span>}
        </CircularProgressbarWithChildren>
      </HoverCardTrigger>
      <HoverCardContent className="divide-y divide-border p-0 text-xs *:p-4">
        <div>
          <Progress
            value={contextUsage}
            max={1}
            format={{ style: "percent" }}
            className={cn("gap-1.5 *:text-xs", isOverLimit && "**:data-[slot=progress-indicator]:bg-destructive")}
          >
            <ProgressValue className={cn("ml-0 text-foreground", isOverLimit && "text-destructive")} />
            <ProgressLabel className="ml-auto text-muted-foreground">
              {formatTokenAmount(lastAssistantMetadata?.totalUsage?.totalTokens ?? 0)} /{" "}
              {selectedModel ? formatTokenAmount(selectedModel.maxContextTokens) : 0}
            </ProgressLabel>
          </Progress>
          {isOverLimit && (
            <p className="mt-2 text-destructive">
              Context window full. Start a new chat, or switch to a model with a larger context window.
            </p>
          )}
        </div>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex justify-between">
            <p>Input</p>
            <p>
              {formatTokenAmount(cumulative.noCacheTokens)}
              <span className="px-1.5">•</span>
              <span className="text-foreground">{formatPrice(cumulative.inputCost)}</span>
            </p>
          </div>
          <div className="flex justify-between">
            <p>Output</p>
            <p>
              {formatTokenAmount(cumulative.textTokens)}
              <span className="px-1.5">•</span>
              <span className="text-foreground">{formatPrice(cumulative.outputCost)}</span>
            </p>
          </div>
          <div className="flex justify-between">
            <p>Reasoning</p>
            <p>
              {formatTokenAmount(cumulative.reasoningTokens)}
              <span className="px-1.5">•</span>
              <span className="text-foreground">{formatPrice(cumulative.reasoningCost)}</span>
            </p>
          </div>
          <div className="flex justify-between">
            <p>Cached read</p>
            <p>
              {formatTokenAmount(cumulative.cacheReadTokens)}
              <span className="px-1.5">•</span>
              <span className="text-foreground">{formatPrice(cumulative.cacheReadCost)}</span>
            </p>
          </div>
        </div>
        <div className="rounded-b-lg bg-muted/50">
          <div className="flex justify-between text-muted-foreground">
            <p>Total</p>
            <p>
              {formatTokenAmount(cumulative.totalTokens)}
              <span className="px-1.5">•</span>
              <span className="text-foreground">{formatPrice(cumulative.totalCost)}</span>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
