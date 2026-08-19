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
import { Box } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type {
  HomepageDataState,
  HomepageModelSignal,
} from '../../lib/homepage-v5-data'
import { SignalSpine } from './signal-spine'
import { StageState } from './stage-state'

interface ModelCatalogStageProps {
  state: HomepageDataState
  models: HomepageModelSignal[]
  remainingModelCount: number
  selectedModelName: string | null
  onSelectModel: (modelName: string) => void
}

export function ModelCatalogStage(props: ModelCatalogStageProps) {
  const { t } = useTranslation()
  let catalogStateLabel: string | null = null
  if (props.state === 'last-known') {
    catalogStateLabel = t('Last known catalog')
  } else if (props.state === 'current') {
    catalogStateLabel = t('Current catalog')
  }

  return (
    <section
      className='home-v5-stage home-v5-catalog'
      data-home-v5-stage='catalog'
      data-state={props.state}
      aria-labelledby='home-v5-catalog-title'
      aria-busy={props.state === 'loading'}
    >
      <SignalSpine branch='right' node='active' />
      <div className='home-v5-stage__intro'>
        <p className='home-v5-stage__eyebrow'>
          {t('Capability infrastructure')}
        </p>
        <span className='home-v5-stage__state' data-state={props.state}>
          {catalogStateLabel}
        </span>
        <h2 id='home-v5-catalog-title'>{t('Current model catalog')}</h2>
        <p className='home-v5-stage__description'>
          {t('Choose a published model without changing the integration path.')}
        </p>
      </div>

      <div className='home-v5-catalog__network'>
        {props.models.length > 0 ? (
          <>
            <span aria-hidden='true' className='home-v5-catalog__origin' />
            <div className='home-v5-catalog__models'>
              {props.models.map((model) => {
                const selected = model.modelName === props.selectedModelName
                return (
                  <button
                    key={model.modelName}
                    type='button'
                    className='home-v5-catalog__model'
                    aria-pressed={selected}
                    data-selected={selected ? 'true' : 'false'}
                    onClick={() => props.onSelectModel(model.modelName)}
                  >
                    <span
                      aria-hidden='true'
                      className='home-v5-catalog__route'
                    />
                    <Box aria-hidden='true' />
                    <span className='home-v5-catalog__model-copy'>
                      <strong>{model.modelName}</strong>
                      <span>
                        {model.catalogVendor
                          ? t('Catalog metadata: {{vendor}}', {
                              vendor: model.catalogVendor,
                            })
                          : t('Catalog metadata not reported')}
                      </span>
                    </span>
                  </button>
                )
              })}
              {props.remainingModelCount > 0 ? (
                <p className='home-v5-catalog__remaining'>
                  {t('+{{count}} current models', {
                    count: props.remainingModelCount,
                  })}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <StageState state={props.state} />
        )}
      </div>
    </section>
  )
}
