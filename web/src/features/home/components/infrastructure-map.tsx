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
import { Braces, KeyRound, Route } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { openingPhaseReached, type OpeningPhase } from '../types'

const MODELS = [
  { id: 'openai', label: 'OpenAI', className: 'zzapi-node-openai' },
  { id: 'claude', label: 'Claude', className: 'zzapi-node-claude' },
  { id: 'gemini', label: 'Gemini', className: 'zzapi-node-gemini' },
  { id: 'qwen', label: 'Qwen', className: 'zzapi-node-qwen' },
] as const

type ModelId = (typeof MODELS)[number]['id']

interface InfrastructureMapProps {
  logo?: string
  openingPhase: OpeningPhase
}

export function InfrastructureMap(props: InfrastructureMapProps) {
  const { t } = useTranslation()
  const [hoveredModel, setHoveredModel] = useState<ModelId | null>(null)
  const [selectedModel, setSelectedModel] = useState<ModelId | null>(null)
  const activeModel = hoveredModel || selectedModel
  const controlsInteractive = openingPhaseReached(props.openingPhase, 'settle')

  return (
    <div
      className='home-infrastructure relative isolate size-full'
      data-active-model={activeModel || undefined}
      data-opening-phase={props.openingPhase}
    >
      <div aria-hidden className='home-infrastructure-depth absolute inset-0' />

      <div className='zzapi-network-meta absolute z-30 flex items-center gap-5'>
        <span className='zzapi-network-kicker'>{t('Model Network')}</span>
        <span className='zzapi-network-status'>
          <span className='zzapi-status-dot' />
          {t('Live Routing')}
        </span>
      </div>

      <svg
        aria-hidden
        className='zzapi-route-field absolute inset-0 size-full'
        viewBox='0 0 1000 620'
        preserveAspectRatio='none'
      >
        <defs>
          <linearGradient id='zzapi-route-in-gradient' x1='0' x2='1'>
            <stop
              offset='0'
              stopColor='var(--zzapi-route-idle)'
              stopOpacity='0'
            />
            <stop offset='0.36' stopColor='var(--zzapi-route-idle)' />
            <stop offset='1' stopColor='var(--zzapi-blue)' />
          </linearGradient>
          <linearGradient id='zzapi-route-out-gradient' x1='0' x2='1'>
            <stop offset='0' stopColor='var(--zzapi-blue)' />
            <stop
              offset='1'
              stopColor='var(--zzapi-route-idle)'
              stopOpacity='0.82'
            />
          </linearGradient>
        </defs>

        <g className='zzapi-route-topology zzapi-route-topology-desktop'>
          <path
            className='zzapi-route-axis'
            d='M 36 596 L 958 24'
            pathLength='1'
          />
          <path
            className='zzapi-route-input'
            d='M 96 516 C 300 484 486 404 660 310'
            pathLength='1'
          />
          <path
            className='zzapi-route-packet-trail'
            d='M 96 516 C 300 484 486 404 660 310'
            pathLength='1'
          />
          <path
            className='zzapi-route-packet-head'
            d='M 96 516 C 300 484 486 404 660 310'
            pathLength='1'
          />
          <path
            className='zzapi-model-route zzapi-route-openai'
            d='M 660 310 C 714 218 782 160 881 121'
            pathLength='1'
          />
          <path
            className='zzapi-model-route zzapi-route-claude'
            d='M 660 310 C 738 271 814 247 912 242'
            pathLength='1'
          />
          <path
            className='zzapi-model-route zzapi-route-gemini'
            d='M 660 310 C 740 336 810 368 895 404'
            pathLength='1'
          />
          <path
            className='zzapi-model-route zzapi-route-qwen'
            d='M 660 310 C 709 398 772 453 844 497'
            pathLength='1'
          />
          <g className='zzapi-route-calibration'>
            <line x1='690' y1='190' x2='700' y2='206' />
            <line x1='752' y1='252' x2='756' y2='270' />
            <line x1='696' y1='416' x2='706' y2='402' />
          </g>
          <circle
            className='zzapi-route-contact zzapi-contact-openai'
            cx='881'
            cy='121'
            r='4'
          />
          <circle
            className='zzapi-route-contact zzapi-contact-claude'
            cx='912'
            cy='242'
            r='4'
          />
          <circle
            className='zzapi-route-contact zzapi-contact-gemini'
            cx='895'
            cy='404'
            r='4'
          />
          <circle
            className='zzapi-route-contact zzapi-contact-qwen'
            cx='844'
            cy='497'
            r='4'
          />
        </g>
      </svg>

      <div className='zzapi-client-origin absolute z-20'>
        <span className='zzapi-client-icon'>
          <Braces aria-hidden />
        </span>
        <span>
          <strong>{t('Client')}</strong>
          <small>
            <KeyRound aria-hidden />
            {t('One Key')}
          </small>
        </span>
      </div>

      <div className='zzapi-gateway-core absolute z-20'>
        <span aria-hidden className='zzapi-core-orbit zzapi-core-orbit-one' />
        <span aria-hidden className='zzapi-core-orbit zzapi-core-orbit-two' />
        <div className='zzapi-core-mark relative' data-zzapi-core-anchor>
          <span aria-hidden className='zzapi-core-energy' />
          <img
            src={props.logo || '/landing-brand-core.png'}
            alt=''
            className='relative size-full object-contain'
          />
          <span
            aria-hidden
            className='zzapi-core-sheen'
            style={
              {
                '--zzapi-core-mask': `url(${props.logo || '/landing-brand-core.png'})`,
              } as CSSProperties
            }
          />
        </div>
        <div className='zzapi-core-lockup'>
          <strong data-zzapi-brand-anchor>zzapi</strong>
          <span>
            <Route aria-hidden />
            {t('Gateway Core')}
          </span>
        </div>
      </div>

      <div
        className='zzapi-model-controls contents'
        data-zzapi-model-controls
        inert={controlsInteractive ? undefined : true}
        aria-hidden={controlsInteractive ? undefined : true}
      >
        {MODELS.map((model) => (
          <button
            key={model.id}
            type='button'
            className={cn('zzapi-model-node absolute z-20', model.className)}
            tabIndex={controlsInteractive ? undefined : -1}
            aria-pressed={selectedModel === model.id}
            onClick={() =>
              setSelectedModel((current) =>
                current === model.id ? null : model.id
              )
            }
            onMouseEnter={() => setHoveredModel(model.id)}
            onMouseLeave={() => setHoveredModel(null)}
            onFocus={() => setHoveredModel(model.id)}
            onBlur={() => setHoveredModel(null)}
          >
            <span className='zzapi-node-dot' />
            {model.label}
          </button>
        ))}
        <div className='zzapi-model-aggregate absolute z-20'>
          {t('+{{count}} Models', { count: MODELS.length - 2 })}
        </div>
      </div>
    </div>
  )
}
