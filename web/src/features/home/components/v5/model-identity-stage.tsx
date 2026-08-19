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
import { Boxes, ChartNoAxesColumn, SquareTerminal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type {
  HomepageDataState,
  HomepageModelSignal,
} from '../../lib/homepage-v5-data'
import { SignalSpine } from './signal-spine'
import { StageState } from './stage-state'

interface ModelIdentityStageProps {
  state: HomepageDataState
  model: HomepageModelSignal | null
}

export function ModelIdentityStage(props: ModelIdentityStageProps) {
  const { t } = useTranslation()
  const endpoint = props.model?.endpointPath
    ? `${props.model.endpointMethod ?? ''} ${props.model.endpointPath}`.trim()
    : t('Not reported')

  let traffic = t('Not reported')
  if (props.model?.traffic === 'observed') {
    traffic = t('Observed')
  } else if (props.model?.traffic === 'no-recent-sample') {
    traffic = t('No recent sample')
  }

  let catalogStateLabel: string | null = null
  if (props.state === 'last-known') {
    catalogStateLabel = t('Last known catalog')
  } else if (props.state === 'current') {
    catalogStateLabel = t('Current catalog')
  }

  return (
    <section
      className='home-v5-stage home-v5-identity'
      data-home-v5-stage='identity'
      data-state={props.state}
      aria-labelledby='home-v5-identity-title'
      aria-busy={props.state === 'loading'}
    >
      <SignalSpine branch='right' node='active' />
      <div className='home-v5-stage__intro'>
        <p className='home-v5-stage__eyebrow'>{t('Model identity')}</p>
        <span className='home-v5-stage__state' data-state={props.state}>
          {catalogStateLabel}
        </span>
        <h2 id='home-v5-identity-title'>
          {t('From model identity to a real request')}
        </h2>
        <p className='home-v5-stage__description'>
          {t(
            'Read the configured identity, route, and recent observation before a request moves.'
          )}
        </p>
      </div>

      <div className='home-v5-identity__instrument'>
        {props.model ? (
          <>
            <div className='home-v5-identity__model'>
              <span aria-hidden='true' className='home-v5-identity__mark' />
              <p>{props.model.modelName}</p>
              <span>{t('Configured model ID')}</span>
            </div>
            <dl className='home-v5-signal-stack'>
              <div className='home-v5-signal-stack__item' data-signal='catalog'>
                <Boxes aria-hidden='true' />
                <dt>{t('Catalog metadata')}</dt>
                <dd>{props.model.catalogVendor ?? t('Not reported')}</dd>
              </div>
              <div
                className='home-v5-signal-stack__item'
                data-signal='endpoint'
              >
                <SquareTerminal aria-hidden='true' />
                <dt>{t('Endpoint')}</dt>
                <dd>{endpoint}</dd>
              </div>
              <div className='home-v5-signal-stack__item' data-signal='traffic'>
                <ChartNoAxesColumn aria-hidden='true' />
                <dt>{t('Recent traffic')}</dt>
                <dd>{traffic}</dd>
              </div>
            </dl>
          </>
        ) : (
          <StageState state={props.state} />
        )}
      </div>
    </section>
  )
}
