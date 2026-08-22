/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const USAGE_BARS = [
  { id: '00', height: 42, accent: true },
  { id: '01', height: 58, accent: false },
  { id: '02', height: 49, accent: false },
  { id: '03', height: 72, accent: true },
  { id: '04', height: 66, accent: false },
  { id: '05', height: 88, accent: false },
  { id: '06', height: 64, accent: true },
  { id: '07', height: 78, accent: false },
  { id: '08', height: 94, accent: false },
  { id: '09', height: 71, accent: true },
]

export function FlexibleUsagePanel() {
  const { t } = useTranslation()

  return (
    <div className='home-v5-value-panel home-v5-demo-panel' data-panel='usage'>
      <div className='home-v5-demo-panel__topline'>
        <span>{t("Today's usage")}</span>
        <strong>¥ 3.47</strong>
      </div>
      <div
        className='home-v5-demo-panel__chart'
        role='img'
        aria-label={t('Usage demo chart')}
      >
        <div className='home-v5-demo-panel__grid' aria-hidden='true' />
        <div className='home-v5-demo-panel__bars' aria-hidden='true'>
          {USAGE_BARS.map((bar) => (
            <span
              key={bar.id}
              className={bar.accent ? 'is-accent' : undefined}
              style={{ height: `${bar.height}%` }}
            />
          ))}
        </div>
        <div className='home-v5-demo-panel__chart-caption'>
          <span>{t('Usage is visible')}</span>
          <span>{t('Fixed demonstration data')}</span>
        </div>
      </div>
      <div className='home-v5-demo-panel__metrics'>
        <span>
          {t('Input')} <strong>482K</strong>
        </span>
        <span>
          {t('Cache')} <strong>1.2M</strong>
        </span>
        <span>
          {t('Output')} <strong>86K</strong>
        </span>
      </div>
      <div className='home-v5-demo-panel__outcome'>
        <strong>{t('Pay as you use')}</strong>
        <span>
          <CircleDollarSign aria-hidden='true' />
          {t('No monthly commitment')}
        </span>
      </div>
    </div>
  )
}

export function StableAccessPanel() {
  const { t } = useTranslation()

  return (
    <div className='home-v5-value-panel home-v5-demo-panel' data-panel='access'>
      <div className='home-v5-demo-panel__topline'>
        <span>{t('Stable access path')}</span>
        <strong>24ms</strong>
      </div>
      <span className='home-v5-demo-panel__demo-label'>
        {t('Fixed demonstration data')}
      </span>
      <div className='home-v5-route-demo'>
        <div className='home-v5-route-demo__endpoint'>
          <span>{t('Your app')}</span>
          <small>API</small>
        </div>
        <div className='home-v5-route-demo__line' aria-hidden='true'>
          <i />
          <i />
          <i />
        </div>
        <div className='home-v5-route-demo__core'>
          <Sparkles aria-hidden='true' />
          <strong>zzapi</strong>
          <small>{t('Gateway core')}</small>
        </div>
        <div className='home-v5-route-demo__line' aria-hidden='true'>
          <i />
          <i />
        </div>
        <div className='home-v5-route-demo__endpoint'>
          <span>{t('Latest models')}</span>
          <small>24ms</small>
        </div>
      </div>
      <div className='home-v5-demo-panel__route-note'>
        <Clock3 aria-hidden='true' />
        <span>{t('One compatible route, stable service')}</span>
        <ArrowRight aria-hidden='true' />
      </div>
      <div className='home-v5-demo-panel__outcome'>
        <strong>{t('Stable direct access')}</strong>
        <span>
          <Check aria-hidden='true' />
          {t('Latest model coverage')}
        </span>
      </div>
    </div>
  )
}

export function RefundAssurancePanel() {
  const { t } = useTranslation()
  const steps = [
    t('Balance confirmed'),
    t('Original route returned'),
    t('Refund received'),
  ]

  return (
    <div className='home-v5-value-panel home-v5-demo-panel' data-panel='refund'>
      <div className='home-v5-demo-panel__topline'>
        <span>{t('Refund assurance')}</span>
        <strong>{t('Visible process')}</strong>
      </div>
      <span className='home-v5-demo-panel__demo-label'>
        {t('Fixed demonstration data')}
      </span>
      <div className='home-v5-refund-demo'>
        <div className='home-v5-refund-demo__shield'>
          <ShieldCheck aria-hidden='true' />
        </div>
        <ol>
          {steps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              <small>{index === 0 ? t('Ready') : t('Complete')}</small>
            </li>
          ))}
        </ol>
      </div>
      <div className='home-v5-demo-panel__outcome'>
        <strong>{t('No-worry refund assurance')}</strong>
        <span>
          <ShieldCheck aria-hidden='true' />
          {t('Clear from request to resolution')}
        </span>
      </div>
    </div>
  )
}
