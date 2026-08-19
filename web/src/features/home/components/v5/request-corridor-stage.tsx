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
import {
  Box,
  KeyRound,
  MessageSquareReply,
  Route,
  UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { HomepageModelSignal } from '../../lib/homepage-v5-data'
import { SignalSpine } from './signal-spine'

interface RequestCorridorStageProps {
  model: HomepageModelSignal | null
}

export function RequestCorridorStage(props: RequestCorridorStageProps) {
  const { t } = useTranslation()
  const steps = [
    {
      id: 'client',
      title: t('Client'),
      description: t('Your application sends an authenticated request.'),
      icon: UserRound,
    },
    {
      id: 'gateway',
      title: t('zzapi Gateway'),
      description: t(
        'The gateway authenticates, validates, and applies policy.'
      ),
      icon: KeyRound,
    },
    {
      id: 'policy',
      title: t('Policy route'),
      description: t('Priority and weight rules choose an available route.'),
      icon: Route,
    },
    {
      id: 'model',
      title: t('Model'),
      description: t('The selected model processes the request.'),
      icon: Box,
    },
    {
      id: 'response',
      title: t('Response'),
      description: t('A compatible response returns to your application.'),
      icon: MessageSquareReply,
    },
  ]

  return (
    <section
      className='home-v5-stage home-v5-corridor'
      data-home-v5-stage='request-corridor'
      aria-labelledby='home-v5-corridor-title'
    >
      <SignalSpine node='ring' />
      <div className='home-v5-stage__intro'>
        <p className='home-v5-stage__eyebrow'>{t('Request corridor')}</p>
        <h2 id='home-v5-corridor-title'>{t('One observable path')}</h2>
        <p className='home-v5-stage__description'>
          {t(
            'Every request crosses explicit stages without changing your integration surface.'
          )}
        </p>
      </div>

      <ol className='home-v5-corridor__steps'>
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <li key={step.id} data-step={step.id}>
              <span aria-hidden='true' className='home-v5-corridor__node'>
                <Icon />
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {step.id === 'model' && props.model ? (
                  <span className='home-v5-corridor__model-id'>
                    {props.model.modelName}
                  </span>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
