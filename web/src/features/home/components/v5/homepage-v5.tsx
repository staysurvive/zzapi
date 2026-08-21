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
import { useLayoutEffect, useRef } from 'react'

import type {
  HomepageDataState,
  HomepageModelSignal,
} from '../../lib/homepage-v5-data'
import type { OpeningPhase } from '../../types'
import { DeveloperIntegrationStage } from './developer-integration-stage'
import { HomepageV5Cta } from './homepage-v5-cta'
import { HomepageValueTabs } from './homepage-value-tabs'
import { ModelCatalogStage } from './model-catalog-stage'
import { ModelIdentityStage } from './model-identity-stage'
import { RequestCorridorStage } from './request-corridor-stage'

export interface HomepageV5Props {
  isAuthenticated: boolean
  openingPhase: OpeningPhase
  pricingState: HomepageDataState
  performanceState: HomepageDataState
  catalogPreview: HomepageModelSignal[]
  remainingModelCount: number
  selectedModel: HomepageModelSignal | null
  selectedModelName: string | null
  onSelectModel: (modelName: string) => void
  baseUrl: string
  docsLink: string | null
}

export function HomepageV5(props: HomepageV5Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || props.openingPhase !== 'ambient') return

    const stages = [
      ...root.querySelectorAll<HTMLElement>('[data-home-v5-stage]'),
    ]
    const revealAll = () => {
      for (const stage of stages) {
        delete stage.dataset.revealPending
        stage.dataset.revealed = 'true'
      }
    }
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const IntersectionObserverCtor = window.IntersectionObserver
    if (motionQuery?.matches || !IntersectionObserverCtor) {
      revealAll()
      return
    }

    for (const stage of stages) stage.dataset.revealPending = 'true'
    const observer = new IntersectionObserverCtor(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const stage = entry.target as HTMLElement
          delete stage.dataset.revealPending
          stage.dataset.revealed = 'true'
          observer.unobserve(stage)
        }
      },
      { rootMargin: '0px 0px -14% 0px', threshold: 0.08 }
    )
    for (const stage of stages) observer.observe(stage)

    const handleMotionPreference = () => {
      if (!motionQuery.matches) return
      observer.disconnect()
      revealAll()
    }
    motionQuery.addEventListener?.('change', handleMotionPreference)

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener?.('change', handleMotionPreference)
    }
  }, [props.openingPhase])

  return (
    <div
      ref={rootRef}
      className='home-v5'
      data-home-v5-narrative='true'
      data-opening-phase={props.openingPhase}
      data-motion-ready={props.openingPhase === 'ambient' ? 'true' : 'false'}
    >
      <ModelIdentityStage
        state={props.pricingState}
        model={props.selectedModel}
      />
      <RequestCorridorStage model={props.selectedModel} />
      <ModelCatalogStage
        state={props.pricingState}
        models={props.catalogPreview}
        remainingModelCount={props.remainingModelCount}
        selectedModelName={props.selectedModelName}
        onSelectModel={props.onSelectModel}
      />
      <DeveloperIntegrationStage
        baseUrl={props.baseUrl}
        model={props.selectedModel}
        state={props.pricingState}
      />
      <HomepageValueTabs
        pricingState={props.pricingState}
        performanceState={props.performanceState}
        model={props.selectedModel}
      />
      <HomepageV5Cta
        isAuthenticated={props.isAuthenticated}
        docsLink={props.docsLink}
      />
    </div>
  )
}
