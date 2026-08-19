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
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type {
  HomepageDataState,
  HomepageModelSignal,
} from '../../lib/homepage-v5-data'
import { SignalSpine } from './signal-spine'
import {
  RoutingControlPanel,
  RuntimeSignalsPanel,
  UsageClarityPanel,
} from './value-tab-panels'

interface HomepageValueTabsProps {
  pricingState: HomepageDataState
  performanceState: HomepageDataState
  model: HomepageModelSignal | null
}

export function HomepageValueTabs(props: HomepageValueTabsProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('usage')
  const tabs = [
    {
      value: 'usage',
      number: '01',
      title: t('Usage clarity'),
      description: t('A readable ledger for configured pricing.'),
    },
    {
      value: 'routing',
      number: '02',
      title: t('Routing control'),
      description: t('Priority, weight, and policy stay explicit.'),
    },
    {
      value: 'runtime',
      number: '03',
      title: t('Runtime signals'),
      description: t('Recent observations appear when samples exist.'),
    },
  ]

  return (
    <section
      className='home-v5-stage home-v5-values'
      data-home-v5-stage='value-tabs'
      aria-labelledby='home-v5-values-title'
    >
      <SignalSpine branch='right' node='active' />
      <div className='home-v5-stage__intro home-v5-values__intro'>
        <p className='home-v5-stage__eyebrow'>{t('After connection')}</p>
        <h2 id='home-v5-values-title'>{t('Control after connection')}</h2>
        <p className='home-v5-stage__description'>
          {t('Routing is only useful when its decisions remain legible.')}
        </p>
      </div>

      <TabsPrimitive.Root
        className='group/tabs home-v5-values__tabs flex gap-2 data-horizontal:flex-col'
        value={activeTab}
        onValueChange={setActiveTab}
        orientation='vertical'
        data-slot='tabs'
        data-orientation='vertical'
      >
        <TabsList
          className='home-v5-values__list'
          variant='line'
          activateOnFocus={false}
          loopFocus
          aria-label={t('Gateway value views')}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className='home-v5-values__trigger'
              value={tab.value}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                setActiveTab(tab.value)
              }}
            >
              <span className='home-v5-values__number'>{tab.number}</span>
              <span className='home-v5-values__trigger-copy'>
                <strong>{tab.title}</strong>
                <span>{tab.description}</span>
              </span>
              <Plus aria-hidden='true' className='home-v5-values__plus' />
              <Minus aria-hidden='true' className='home-v5-values__minus' />
            </TabsTrigger>
          ))}
        </TabsList>

        <div className='home-v5-values__panels'>
          <TabsContent value='usage' className='home-v5-values__content'>
            <UsageClarityPanel model={props.model} state={props.pricingState} />
          </TabsContent>
          <TabsContent value='routing' className='home-v5-values__content'>
            <RoutingControlPanel />
          </TabsContent>
          <TabsContent value='runtime' className='home-v5-values__content'>
            <RuntimeSignalsPanel
              model={props.model}
              state={props.performanceState}
            />
          </TabsContent>
        </div>
      </TabsPrimitive.Root>
    </section>
  )
}
