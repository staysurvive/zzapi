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
  return (
    <div
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
