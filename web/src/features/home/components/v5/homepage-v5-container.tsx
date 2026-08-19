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
import { useHomepageV5Data } from '../../hooks/use-homepage-v5-data'
import type { OpeningPhase } from '../../types'
import { HomepageV5 } from './homepage-v5'

interface HomepageV5ContainerProps {
  isAuthenticated: boolean
  openingPhase: OpeningPhase
}

export function HomepageV5Container(props: HomepageV5ContainerProps) {
  const homepage = useHomepageV5Data({
    isAuthenticated: props.isAuthenticated,
    openingPhase: props.openingPhase,
  })

  return (
    <HomepageV5
      isAuthenticated={props.isAuthenticated}
      openingPhase={props.openingPhase}
      pricingState={homepage.pricingState}
      performanceState={homepage.performanceState}
      catalogPreview={homepage.catalogPreview}
      remainingModelCount={homepage.remainingModelCount}
      selectedModel={homepage.selectedModel}
      selectedModelName={homepage.selectedModelName}
      onSelectModel={homepage.onSelectModel}
      baseUrl={homepage.baseUrl}
      docsLink={homepage.docsLink}
    />
  )
}
