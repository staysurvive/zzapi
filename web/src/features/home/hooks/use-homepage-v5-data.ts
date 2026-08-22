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
import { useCallback, useMemo, useState } from 'react'

import { useStatus } from '@/hooks/use-status'

import {
  HOMEPAGE_DEMO_MODELS,
  type HomepageDataState,
  type HomepageModelSignal,
  readHomepageStatusString,
  resolveHomepageBaseUrl,
  resolveHomepageDocsLink,
} from '../lib/homepage-v5-data'
import type { OpeningPhase } from '../types'

const EMPTY_HOMEPAGE_MODELS: HomepageModelSignal[] = []

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
  const openingReady = input.openingPhase === 'ambient'
  const demoState: HomepageDataState = openingReady ? 'demo' : 'loading'
  const pricingState = demoState
  const performanceState = demoState
  const models = openingReady ? HOMEPAGE_DEMO_MODELS : EMPTY_HOMEPAGE_MODELS

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
    catalogPreview: models,
    remainingModelCount: 0,
    selectedModel,
    selectedModelName,
    onSelectModel,
    baseUrl: resolveHomepageBaseUrl(status, getDeploymentOrigin()),
    docsLink: resolveHomepageDocsLink(status),
    systemName: readHomepageStatusString(status, 'system_name'),
  }
}
