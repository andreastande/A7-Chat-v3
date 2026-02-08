// @ts-nocheck

// Verifies that model data in creators.ts (pricing, context window, max output tokens)
// matches the upstream API at https://ai-gateway.vercel.sh/v1/models.
// Run with: pnpm verify-models
import { allModels } from "../src/lib/models/creators"

const API_URL = "https://ai-gateway.vercel.sh/v1/models"
const MTok = 1_000_000

let errors = 0

function toMTok(perToken) {
  return parseFloat(perToken) * MTok
}

function approxEqual(a, b) {
  if (a === 0 && b === 0) return true
  return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)) < 1e-9
}

let currentModel = ""

function err(field, expected, got) {
  if (currentModel) {
    console.error(`[${currentModel}]`)
    currentModel = ""
  }
  console.error(`  MISMATCH ${field}: expected ${expected}, got ${got}`)
  errors++
}

function comparePricing(field, local, apiFlat, apiTiers) {
  if (typeof local === "number") {
    const expected = toMTok(apiFlat)
    if (!approxEqual(local, expected)) {
      err(field, expected, local)
    }
  } else {
    if (!apiTiers) {
      err(`${field} (tiers)`, "tiers from API", "no tiers in API response")
      return
    }
    if (local.length !== apiTiers.length) {
      err(`${field} tier count`, apiTiers.length, local.length)
      return
    }
    for (let i = 0; i < local.length; i++) {
      const localTier = local[i]
      const apiTier = apiTiers[i]
      const expectedCost = toMTok(apiTier.cost)
      if (!approxEqual(localTier.cost, expectedCost)) {
        err(`${field}[${i}].cost`, expectedCost, localTier.cost)
      }
      // API uses exclusive max, local uses inclusive upTo: max - 1 === upTo
      if (localTier.upTo !== undefined && apiTier.max !== undefined) {
        if (localTier.upTo !== apiTier.max - 1) {
          err(`${field}[${i}].upTo`, apiTier.max - 1, localTier.upTo)
        }
      } else if (localTier.upTo !== undefined && apiTier.max === undefined) {
        err(`${field}[${i}].upTo`, "undefined (last tier)", localTier.upTo)
      } else if (localTier.upTo === undefined && apiTier.max !== undefined) {
        err(`${field}[${i}].upTo`, apiTier.max - 1, "undefined")
      }
    }
  }
}

async function main() {
  const res = await fetch(API_URL)
  if (!res.ok) {
    console.error(`Failed to fetch API: ${res.status}`)
    process.exit(1)
  }

  const { data: apiModels } = await res.json()
  const apiMap = new Map(apiModels.map((m) => [m.id, m]))

  for (const model of allModels) {
    const api = apiMap.get(model.id)
    if (!api) {
      console.error(`[${model.id}] NOT FOUND in API`)
      errors++
      continue
    }

    currentModel = model.id

    if (model.maxContextTokens !== api.context_window) {
      err("maxContextTokens", api.context_window, model.maxContextTokens)
    }
    if (model.maxOutputTokens !== api.max_tokens) {
      err("maxOutputTokens", api.max_tokens, model.maxOutputTokens)
    }

    comparePricing("pricing.input", model.pricing.input, api.pricing.input, api.pricing.input_tiers)
    comparePricing("pricing.output", model.pricing.output, api.pricing.output, api.pricing.output_tiers)

    if (model.pricing.inputCacheRead !== undefined) {
      if (!api.pricing.input_cache_read) {
        err("pricing.inputCacheRead", "missing in API", JSON.stringify(model.pricing.inputCacheRead))
      } else {
        comparePricing(
          "pricing.inputCacheRead",
          model.pricing.inputCacheRead,
          api.pricing.input_cache_read,
          api.pricing.input_cache_read_tiers,
        )
      }
    } else if (api.pricing.input_cache_read) {
      err("pricing.inputCacheRead", `${toMTok(api.pricing.input_cache_read)} (from API)`, "missing locally")
    }

    if (model.pricing.inputCacheWrite !== undefined) {
      if (!api.pricing.input_cache_write) {
        err("pricing.inputCacheWrite", "missing in API", JSON.stringify(model.pricing.inputCacheWrite))
      } else {
        comparePricing(
          "pricing.inputCacheWrite",
          model.pricing.inputCacheWrite,
          api.pricing.input_cache_write,
          api.pricing.input_cache_write_tiers,
        )
      }
    } else if (api.pricing.input_cache_write) {
      err("pricing.inputCacheWrite", `${toMTok(api.pricing.input_cache_write)} (from API)`, "missing locally")
    }
  }

  if (errors > 0) {
    console.error(`\nFound ${errors} mismatch(es)`)
    process.exit(1)
  }
  console.log(`All ${allModels.length} models verified successfully`)
}

void main()
