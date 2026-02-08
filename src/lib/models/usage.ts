import type { LanguageModelUsage } from "ai"
import type { MessageMetadata } from "@/types/ui-message"
import type { Model, PriceTier } from "./types"
import { getModel } from "./utils"

/**
 * Resolve the cost per million tokens for a given token count.
 * For tiered pricing, selects the tier based on total input context size.
 */
function resolvePricePerMTok(pricing: number | PriceTier[], contextTokens: number) {
  if (typeof pricing === "number") return pricing

  for (const tier of pricing) {
    if (tier.upTo === undefined || contextTokens <= tier.upTo) {
      return tier.cost
    }
  }

  return pricing[pricing.length - 1].cost
}

export function getInputCost(model: Model, usage: LanguageModelUsage) {
  const rate = resolvePricePerMTok(model.pricing.input, usage.inputTokens ?? 0)
  return ((usage.inputTokenDetails.noCacheTokens ?? 0) / 1_000_000) * rate
}

export function getOutputCost(model: Model, usage: LanguageModelUsage) {
  const rate = resolvePricePerMTok(model.pricing.output, usage.inputTokens ?? 0)
  return ((usage.outputTokenDetails.textTokens ?? usage.outputTokens ?? 0) / 1_000_000) * rate
}

export function getReasoningCost(model: Model, usage: LanguageModelUsage) {
  const rate = resolvePricePerMTok(model.pricing.output, usage.inputTokens ?? 0)
  return ((usage.outputTokenDetails.reasoningTokens ?? 0) / 1_000_000) * rate
}

export function getCacheCost(model: Model, usage: LanguageModelUsage) {
  const inputTokens = usage.inputTokens ?? 0
  const readRate = resolvePricePerMTok(model.pricing.inputCacheRead ?? model.pricing.input, inputTokens)
  const writeRate = resolvePricePerMTok(model.pricing.inputCacheWrite ?? model.pricing.input, inputTokens)
  return (
    ((usage.inputTokenDetails.cacheReadTokens ?? 0) / 1_000_000) * readRate +
    ((usage.inputTokenDetails.cacheWriteTokens ?? 0) / 1_000_000) * writeRate
  )
}

export function getTotalCost(model: Model, usage: LanguageModelUsage) {
  return (
    getInputCost(model, usage) +
    getOutputCost(model, usage) +
    getReasoningCost(model, usage) +
    getCacheCost(model, usage)
  )
}

export function getContextUsage(model: Model, usage: LanguageModelUsage) {
  const totalTokens = (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0)
  return Math.min(totalTokens / model.maxContextTokens, 1)
}

export function formatTokenAmount(tokens: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(tokens)
}

export function formatPrice(price: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(price)
}

export type CumulativeUsage = {
  noCacheTokens: number
  cacheTokens: number
  textTokens: number
  reasoningTokens: number
  totalTokens: number
  inputCost: number
  outputCost: number
  reasoningCost: number
  cacheCost: number
  totalCost: number
}

export function getCumulativeUsage(metadatas: MessageMetadata[]): CumulativeUsage {
  const result: CumulativeUsage = {
    noCacheTokens: 0,
    cacheTokens: 0,
    textTokens: 0,
    reasoningTokens: 0,
    totalTokens: 0,
    inputCost: 0,
    outputCost: 0,
    reasoningCost: 0,
    cacheCost: 0,
    totalCost: 0,
  }

  for (const meta of metadatas) {
    const usage = meta.totalUsage
    if (!usage) continue

    result.noCacheTokens += usage.inputTokenDetails.noCacheTokens ?? 0
    result.cacheTokens +=
      (usage.inputTokenDetails.cacheReadTokens ?? 0) + (usage.inputTokenDetails.cacheWriteTokens ?? 0)
    result.textTokens += usage.outputTokenDetails.textTokens ?? usage.outputTokens ?? 0
    result.reasoningTokens += usage.outputTokenDetails.reasoningTokens ?? 0
    result.totalTokens += usage.totalTokens ?? 0

    const model = getModel(meta.modelId)
    if (model) {
      result.inputCost += getInputCost(model, usage)
      result.outputCost += getOutputCost(model, usage)
      result.reasoningCost += getReasoningCost(model, usage)
      result.cacheCost += getCacheCost(model, usage)
    }
  }

  result.totalCost = result.inputCost + result.outputCost + result.reasoningCost + result.cacheCost
  return result
}
