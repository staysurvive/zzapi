/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import type { PerfSummaryAllData } from '@/features/performance-metrics/types'
import { replaceModelInPath } from '@/features/pricing/lib/model-helpers'
import type {
  PricingData,
  PricingModel,
  PricingVendor,
} from '@/features/pricing/types'
import { isHttpUrl, isSafeInternalUrl } from '@/lib/content-format'

export type HomepageDataState =
  | 'loading'
  | 'current'
  | 'last-known'
  | 'empty'
  | 'error'
  | 'auth-required'
  | 'disabled'

export type HomepagePricingMode =
  | 'usage-based'
  | 'per-request'
  | 'dynamic'
  | 'not-reported'

export type HomepageTrafficState =
  | 'observed'
  | 'no-recent-sample'
  | 'unavailable'

export type HomepageObservedMetrics = {
  /** Milliseconds, as reported by the 24-hour performance summary. */
  avgLatencyMs: number | null
  /** Percentage on a 0-100 scale, as reported by the backend. */
  successRate: number | null
  /** Output tokens per second, as reported by the backend. */
  avgTps: number | null
}

export type HomepageModelSignal = {
  modelName: string
  catalogVendor: string | null
  endpointType: string | null
  endpointMethod: string | null
  endpointPath: string | null
  pricingMode: HomepagePricingMode
  cachePricingReported: boolean
  groupRuleReported: boolean
  inputPricingReported: boolean
  outputPricingReported: boolean
  traffic: HomepageTrafficState
  observedMetrics: HomepageObservedMetrics | null
}

export type HomepageDataStateInput = {
  moduleEnabled: boolean
  requiresAuthentication: boolean
  isAuthenticated: boolean
  openingReady: boolean
  statusPending: boolean
  hasResolvedData: boolean
  itemCount: number
  hasError: boolean
}

type EndpointInfo = {
  type: string
  path: string | null
  method: string | null
}

function readNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function compareModelNames(left: string, right: string): number {
  const normalizedLeft = left.toLocaleLowerCase('en-US')
  const normalizedRight = right.toLocaleLowerCase('en-US')

  if (normalizedLeft < normalizedRight) return -1
  if (normalizedLeft > normalizedRight) return 1
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

function getCatalogVendor(
  model: PricingModel,
  vendors: Map<number, PricingVendor>
): string | null {
  const embeddedVendor = readNonEmptyString(model.vendor_name)
  if (embeddedVendor) return embeddedVendor

  if (!isFiniteNumber(model.vendor_id)) return null
  return readNonEmptyString(vendors.get(model.vendor_id)?.name)
}

function parseEndpointInfo(type: string, value: unknown): EndpointInfo | null {
  if (typeof value === 'string') {
    const path = readNonEmptyString(value)
    return path ? { type, path, method: null } : null
  }

  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const path = readNonEmptyString(record.path)
  if (!path) return null

  const method = readNonEmptyString(record.method)?.toUpperCase() ?? null
  return { type, path, method }
}

function getModelEndpoint(
  model: PricingModel,
  endpointMap: Record<string, unknown>
): EndpointInfo | null {
  if (!Array.isArray(model.supported_endpoint_types)) return null

  const endpointTypes = [...model.supported_endpoint_types].sort(
    (left, right) => {
      if (left === 'openai') return -1
      if (right === 'openai') return 1
      return 0
    }
  )

  for (const endpointType of endpointTypes) {
    const key = readNonEmptyString(endpointType)
    if (!key) continue

    const endpoint = parseEndpointInfo(key, endpointMap[key])
    if (!endpoint) continue

    return {
      type: endpoint.type,
      method: endpoint.method,
      path: endpoint.path
        ? replaceModelInPath(endpoint.path, model.model_name.trim())
        : null,
    }
  }

  return null
}

function getPricingMode(model: PricingModel): HomepagePricingMode {
  if (model.billing_mode === 'tiered_expr') return 'dynamic'
  if (model.quota_type === 1) return 'per-request'
  if (model.quota_type === 0) return 'usage-based'
  return 'not-reported'
}

function projectModel(
  model: PricingModel,
  vendors: Map<number, PricingVendor>,
  endpointMap: Record<string, unknown>
): HomepageModelSignal | null {
  const modelName = readNonEmptyString(model.model_name)
  if (!modelName) return null

  const endpoint = getModelEndpoint(model, endpointMap)
  const isUsageBased = model.quota_type === 0

  return {
    modelName,
    catalogVendor: getCatalogVendor(model, vendors),
    endpointType: endpoint?.type ?? null,
    endpointMethod: endpoint?.method ?? null,
    endpointPath: endpoint?.path ?? null,
    pricingMode: getPricingMode(model),
    cachePricingReported:
      isFiniteNumber(model.cache_ratio) ||
      isFiniteNumber(model.create_cache_ratio),
    groupRuleReported:
      Array.isArray(model.enable_groups) && model.enable_groups.length > 0,
    inputPricingReported: isUsageBased && isFiniteNumber(model.model_ratio),
    outputPricingReported:
      isUsageBased && isFiniteNumber(model.completion_ratio),
    traffic: 'unavailable',
    observedMetrics: null,
  }
}

/**
 * Project the public pricing response into the smallest truthful homepage
 * contract. The projection intentionally excludes capability, ownership,
 * request-count, growth and certification-like fields.
 */
export function projectHomepageCatalog(
  pricing: PricingData | null | undefined
): HomepageModelSignal[] {
  if (!pricing?.success || !Array.isArray(pricing.data)) return []

  const vendors = new Map<number, PricingVendor>()
  if (Array.isArray(pricing.vendors)) {
    for (const vendor of pricing.vendors) {
      if (isFiniteNumber(vendor.id)) vendors.set(vendor.id, vendor)
    }
  }

  const endpointMap =
    pricing.supported_endpoint && typeof pricing.supported_endpoint === 'object'
      ? (pricing.supported_endpoint as unknown as Record<string, unknown>)
      : {}

  const projected = pricing.data
    .map((model) => projectModel(model, vendors, endpointMap))
    .filter((model): model is HomepageModelSignal => model !== null)
    .sort((left, right) => compareModelNames(left.modelName, right.modelName))

  const uniqueModels: HomepageModelSignal[] = []
  const seenNames = new Set<string>()
  for (const model of projected) {
    if (seenNames.has(model.modelName)) continue
    seenNames.add(model.modelName)
    uniqueModels.push(model)
  }
  return uniqueModels
}

function projectMetric(value: unknown, minimum = 0, maximum?: number) {
  if (!isFiniteNumber(value) || value < minimum) return null
  if (maximum !== undefined && value > maximum) return null
  return value
}

/**
 * Attach only same-name performance summaries to current catalog models.
 * A summary record proves recent observation; request_count and the raw trend
 * array never cross this boundary into homepage data.
 */
export function attachHomepagePerformance(
  catalog: HomepageModelSignal[],
  performance: PerfSummaryAllData | null | undefined,
  performanceState: HomepageDataState
): HomepageModelSignal[] {
  const canUsePerformance =
    performanceState === 'current' ||
    performanceState === 'last-known' ||
    performanceState === 'empty'

  if (!canUsePerformance || !performance?.success) {
    return catalog.map((model) => ({
      ...model,
      traffic: 'unavailable',
      observedMetrics: null,
    }))
  }

  const summaries = Array.isArray(performance.data?.models)
    ? performance.data.models
    : []
  const metricsByModel = new Map(
    summaries
      .filter((summary) => readNonEmptyString(summary.model_name) !== null)
      .map((summary) => [summary.model_name.trim(), summary] as const)
  )

  return catalog.map((model) => {
    const summary = metricsByModel.get(model.modelName)
    if (!summary) {
      return {
        ...model,
        traffic: 'no-recent-sample',
        observedMetrics: null,
      }
    }

    return {
      ...model,
      traffic: 'observed',
      observedMetrics: {
        avgLatencyMs: projectMetric(summary.avg_latency_ms),
        successRate: projectMetric(summary.success_rate, 0, 100),
        avgTps: projectMetric(summary.avg_tps),
      },
    }
  })
}

export function resolveHomepageDataState(
  input: HomepageDataStateInput
): HomepageDataState {
  if (!input.moduleEnabled) return 'disabled'
  if (input.requiresAuthentication && !input.isAuthenticated) {
    return 'auth-required'
  }
  if (!input.openingReady || input.statusPending) return 'loading'
  if (input.hasError) {
    return input.hasResolvedData ? 'last-known' : 'error'
  }
  if (!input.hasResolvedData) return 'loading'
  return input.itemCount > 0 ? 'current' : 'empty'
}

export function readHomepageStatusString(
  status: Record<string, unknown> | null,
  key: string
): string | null {
  return readNonEmptyString(status?.[key])
}

export function resolveHomepageBaseUrl(
  status: Record<string, unknown> | null,
  deploymentOrigin?: string | null
): string {
  const configured = readHomepageStatusString(status, 'server_address')
  const candidate = configured ?? readNonEmptyString(deploymentOrigin)
  if (!candidate) return '<YOUR_BASE_URL>'

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '<YOUR_BASE_URL>'
    }
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return '<YOUR_BASE_URL>'
  }
}

export function resolveHomepageDocsLink(
  status: Record<string, unknown> | null
): string | null {
  const link = readHomepageStatusString(status, 'docs_link')
  if (!link) return null
  return isHttpUrl(link) || isSafeInternalUrl(link) ? link : null
}
