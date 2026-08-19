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
  Activity,
  BadgeDollarSign,
  Braces,
  Database,
  FileInput,
  GitBranch,
  ListOrdered,
  RefreshCw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { toIntlLocale } from '@/i18n/languages'

import type {
  HomepageDataState,
  HomepageModelSignal,
} from '../../lib/homepage-v5-data'
import { StageState } from './stage-state'

interface ValuePanelProps {
  model: HomepageModelSignal | null
  state: HomepageDataState
}

export function UsageClarityPanel(props: ValuePanelProps) {
  const { t } = useTranslation()
  if (!props.model) {
    return <StageState state={props.state} />
  }

  const pricingModeLabels = {
    'usage-based': t('Usage based'),
    'per-request': t('Per request'),
    dynamic: t('Dynamic pricing'),
    'not-reported': t('Not reported'),
  }
  const signals = [
    {
      label: t('Input tokens'),
      reported: props.model.inputPricingReported,
      icon: FileInput,
    },
    {
      label: t('Cached input'),
      reported: props.model.cachePricingReported,
      icon: Database,
    },
    {
      label: t('Output tokens'),
      reported: props.model.outputPricingReported,
      icon: RefreshCw,
    },
    {
      label: t('Configured pricing'),
      reported: props.model.pricingMode !== 'not-reported',
      icon: BadgeDollarSign,
    },
    {
      label: t('Group rule'),
      reported: props.model.groupRuleReported,
      icon: Braces,
    },
  ]

  return (
    <div className='home-v5-value-panel' data-panel='usage'>
      <div className='home-v5-value-panel__header'>
        <p>{t('Configured pricing ledger')}</p>
        <h3>{props.model.modelName}</h3>
      </div>
      <dl className='home-v5-value-panel__signals'>
        {signals.map((signal) => {
          const Icon = signal.icon
          return (
            <div key={signal.label} data-reported={signal.reported}>
              <Icon aria-hidden='true' />
              <dt>{signal.label}</dt>
              <dd>{signal.reported ? t('Reported') : t('Not reported')}</dd>
            </div>
          )
        })}
      </dl>
      <div className='home-v5-value-panel__outcome'>
        <strong>{pricingModeLabels[props.model.pricingMode]}</strong>
        <span>
          <ShieldCheck aria-hidden='true' />
          {t('Traceable configuration')}
        </span>
      </div>
    </div>
  )
}

export function RoutingControlPanel() {
  const { t } = useTranslation()
  const mechanisms = [
    { label: t('Priority'), icon: ListOrdered },
    { label: t('Weight'), icon: SlidersHorizontal },
    { label: t('Policy-based routing'), icon: GitBranch },
    { label: t('Retry'), icon: RefreshCw },
  ]

  return (
    <div className='home-v5-value-panel' data-panel='routing'>
      <div className='home-v5-value-panel__header'>
        <p>{t('Routing mechanisms')}</p>
        <h3>{t('Policy remains explicit')}</h3>
      </div>
      <ol className='home-v5-value-panel__route'>
        {mechanisms.map((mechanism) => {
          const Icon = mechanism.icon
          return (
            <li key={mechanism.label}>
              <Icon aria-hidden='true' />
              <span>{mechanism.label}</span>
              <small>{t('Mechanism')}</small>
            </li>
          )
        })}
      </ol>
      <div className='home-v5-value-panel__outcome'>
        <strong>{t('Controlled route')}</strong>
        <span>
          <Route aria-hidden='true' />
          {t('No public instance weights shown')}
        </span>
      </div>
    </div>
  )
}

export function RuntimeSignalsPanel(props: ValuePanelProps) {
  const { i18n, t } = useTranslation()
  const metrics = props.model?.observedMetrics
  if (!metrics || props.model?.traffic !== 'observed') {
    let title = t('No recent sample')
    let description = t(
      'Runtime observations appear only when recent relay samples exist.'
    )
    if (props.state === 'loading') {
      title = t('Loading runtime signals')
      description = t('Recent observations are being requested.')
    } else if (props.state === 'error') {
      title = t('Runtime signals unavailable')
      description = t('Recent observations could not be loaded.')
    } else if (props.state === 'auth-required') {
      title = t('Sign in to view runtime signals')
      description = t('This deployment limits observations to signed-in users.')
    } else if (props.state === 'disabled') {
      title = t('Runtime signals are disabled')
      description = t('This deployment does not publish recent observations.')
    }

    return (
      <div
        className='home-v5-value-panel'
        data-panel='runtime'
        data-empty='true'
      >
        <Activity aria-hidden='true' />
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    )
  }

  const locale = toIntlLocale(i18n.resolvedLanguage ?? i18n.language)
  const wholeNumber = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  })
  const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
  const runtimeMetrics = [
    {
      label: t('Average latency'),
      value:
        metrics.avgLatencyMs === null
          ? t('Not reported')
          : t('{{value}} ms', {
              value: wholeNumber.format(metrics.avgLatencyMs),
            }),
    },
    {
      label: t('Success rate'),
      value:
        metrics.successRate === null
          ? t('Not reported')
          : `${decimal.format(metrics.successRate)}%`,
    },
    {
      label: t('Average TPS'),
      value:
        metrics.avgTps === null
          ? t('Not reported')
          : decimal.format(metrics.avgTps),
    },
  ]

  return (
    <div className='home-v5-value-panel' data-panel='runtime'>
      <div className='home-v5-value-panel__header'>
        <p>{t('Observed requests · last 24h')}</p>
        <h3>{props.model.modelName}</h3>
      </div>
      <dl className='home-v5-value-panel__metrics'>
        {runtimeMetrics.map((metric) => (
          <div key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
      <p className='home-v5-value-panel__disclaimer'>
        {t('Recent observations are not an uptime or SLA statement.')}
      </p>
    </div>
  )
}
