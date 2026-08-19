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
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'

import type { PerfSummaryAllData } from '@/features/performance-metrics/types'
import type { PricingData } from '@/features/pricing/types'
import { useStatus } from '@/hooks/use-status'
import { api } from '@/lib/api'
import { getModuleAccessFromStatus } from '@/lib/nav-modules'

import {
  attachHomepagePerformance,
  type HomepageDataState,
  type HomepageModelSignal,
  projectHomepageCatalog,
  readHomepageStatusString,
  resolveHomepageBaseUrl,
  resolveHomepageDataState,
  resolveHomepageDocsLink,
} from '../lib/homepage-v5-data'
import type { OpeningPhase } from '../types'

const PERFORMANCE_WINDOW_HOURS = 24
const HOMEPAGE_DATA_STALE_TIME = 5 * 60 * 1000
const HOMEPAGE_DATA_GC_TIME = 30 * 60 * 1000

const SILENT_REQUEST_CONFIG = {
  skipAuthRefresh: true,
  skipBusinessError: true,
  skipErrorHandler: true,
} as const

export type UseHomepageV5DataInput = {
  isAuthenticated: boolean
  openingPhase: OpeningPhase
}

export type HomepageV5DataResult = {
  pricingState: HomepageDataState
  performanceState: HomepageDataState
  models: HomepageModelSignal[]
  catalogPreview: HomepageModelSignal[]
  remainingModelCount: number
  selectedModel: HomepageModelSignal | null
  selectedModelName: string | null
  onSelectModel: (modelName: string) => void
  baseUrl: string
  docsLink: string | null
  systemName: string | null
}

async function getHomepagePricing(): Promise<PricingData> {
  const response = await api.get<PricingData>(
    '/api/pricing',
    SILENT_REQUEST_CONFIG
  )
  if (response.data?.success !== true || !Array.isArray(response.data.data)) {
    throw new Error('Homepage catalog response was not successful')
  }
  return response.data
}

async function getHomepagePerformance(): Promise<PerfSummaryAllData> {
  const response = await api.get<PerfSummaryAllData>(
    '/api/perf-metrics/summary',
    {
      ...SILENT_REQUEST_CONFIG,
      params: { hours: PERFORMANCE_WINDOW_HOURS },
    }
  )
  if (
    response.data?.success !== true ||
    !Array.isArray(response.data.data?.models)
  ) {
    throw new Error('Homepage performance response was not successful')
  }
  return response.data
}

function getDeploymentOrigin(): string | null {
  if (typeof window === 'undefined') return null
  const origin = window.location?.origin
  return origin && origin !== 'null' ? origin : null
}

export function useHomepageV5Data(
  input: UseHomepageV5DataInput
): HomepageV5DataResult {
  const statusQuery = useStatus()
  const status = statusQuery.status as Record<string, unknown> | null
  const moduleAccess = useMemo(
    () => getModuleAccessFromStatus(status, 'pricing'),
    [status]
  )
  const openingReady = input.openingPhase === 'ambient'
  const statusPending = statusQuery.loading && status === null
  const accessAllowed =
    moduleAccess.enabled && (!moduleAccess.requireAuth || input.isAuthenticated)
  const queryEnabled = openingReady && !statusPending && accessAllowed

  const pricingQuery = useQuery({
    queryKey: ['homepage-v5', 'pricing'],
    queryFn: getHomepagePricing,
    enabled: queryEnabled,
    retry: false,
    staleTime: HOMEPAGE_DATA_STALE_TIME,
    gcTime: HOMEPAGE_DATA_GC_TIME,
  })
  const performanceQuery = useQuery({
    queryKey: ['homepage-v5', 'performance-summary', PERFORMANCE_WINDOW_HOURS],
    queryFn: getHomepagePerformance,
    enabled: queryEnabled,
    retry: false,
    staleTime: HOMEPAGE_DATA_STALE_TIME,
    gcTime: HOMEPAGE_DATA_GC_TIME,
  })

  const projectedCatalog = useMemo(
    () => projectHomepageCatalog(queryEnabled ? pricingQuery.data : null),
    [pricingQuery.data, queryEnabled]
  )
  const performanceCount = Array.isArray(performanceQuery.data?.data?.models)
    ? performanceQuery.data.data.models.length
    : 0

  const pricingState = resolveHomepageDataState({
    moduleEnabled: moduleAccess.enabled,
    requiresAuthentication: moduleAccess.requireAuth,
    isAuthenticated: input.isAuthenticated,
    openingReady,
    statusPending,
    hasResolvedData: queryEnabled && pricingQuery.data !== undefined,
    itemCount: projectedCatalog.length,
    hasError: queryEnabled && pricingQuery.error !== null,
  })
  const performanceState = resolveHomepageDataState({
    moduleEnabled: moduleAccess.enabled,
    requiresAuthentication: moduleAccess.requireAuth,
    isAuthenticated: input.isAuthenticated,
    openingReady,
    statusPending,
    hasResolvedData: queryEnabled && performanceQuery.data !== undefined,
    itemCount: performanceCount,
    hasError: queryEnabled && performanceQuery.error !== null,
  })
  const models = useMemo(
    () =>
      attachHomepagePerformance(
        projectedCatalog,
        queryEnabled ? performanceQuery.data : null,
        performanceState
      ),
    [performanceQuery.data, performanceState, projectedCatalog, queryEnabled]
  )

  const [requestedModelName, setRequestedModelName] = useState<string | null>(
    null
  )
  const selectedModelName = useMemo(() => {
    if (
      requestedModelName &&
      models.some((model) => model.modelName === requestedModelName)
    ) {
      return requestedModelName
    }
    return models[0]?.modelName ?? null
  }, [models, requestedModelName])
  const selectedModel = useMemo(
    () => models.find((model) => model.modelName === selectedModelName) ?? null,
    [models, selectedModelName]
  )
  const onSelectModel = useCallback(
    (modelName: string) => {
      if (models.some((model) => model.modelName === modelName)) {
        setRequestedModelName(modelName)
      }
    },
    [models]
  )

  return {
    pricingState,
    performanceState,
    models,
    catalogPreview: models.slice(0, 3),
    remainingModelCount: Math.max(models.length - 3, 0),
    selectedModel,
    selectedModelName,
    onSelectModel,
    baseUrl: resolveHomepageBaseUrl(status, getDeploymentOrigin()),
    docsLink: resolveHomepageDocsLink(status),
    systemName: readHomepageStatusString(status, 'system_name'),
  }
}
