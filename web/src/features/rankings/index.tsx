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
import { useNavigate, useSearch } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { ProductShell, PublicLayout } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

import {
  MarketShareSection,
  ModelsSection,
  PulseSection,
  RankingsHero,
} from './components'
import { useRankings } from './hooks/use-rankings'
import type { RankingPeriod } from './types'

const VALID_PERIODS = new Set<RankingPeriod>(['today', 'week', 'month', 'year'])

export function Rankings() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/rankings/' })
  const navigate = useNavigate()

  const period: RankingPeriod = VALID_PERIODS.has(
    search.period as RankingPeriod
  )
    ? (search.period as RankingPeriod)
    : 'week'

  const rankingsQuery = useRankings(period)
  const snapshot = rankingsQuery.data?.data
  const isEmpty =
    snapshot != null &&
    snapshot.models.length === 0 &&
    snapshot.vendors.length === 0 &&
    snapshot.top_movers.length === 0 &&
    snapshot.top_droppers.length === 0 &&
    snapshot.models_history.points.length === 0 &&
    snapshot.vendor_share_history.points.length === 0

  const handlePeriodChange = (next: RankingPeriod) => {
    navigate({
      to: '/rankings',
      search: (prev) => ({ ...prev, period: next }),
    })
  }

  return (
    <PublicLayout showMainContainer={false}>
      <ProductShell surface='public' className='rankings-page-shell'>
        <main
          id='main-content'
          tabIndex={-1}
          className='rankings-page relative'
        >
          <div className='relative mx-auto w-full max-w-[1280px] space-y-8 px-3 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-12 xl:px-8'>
            <RankingsHero period={period} onPeriodChange={handlePeriodChange} />

            <section
              id='rankings-results-panel'
              role='tabpanel'
              aria-labelledby={`ranking-period-${period}-tab`}
              aria-busy={rankingsQuery.isFetching}
              tabIndex={0}
            >
              {rankingsQuery.isLoading ? <RankingsLoading /> : null}
              {!rankingsQuery.isLoading && !snapshot ? (
                <ErrorState
                  title={t('Unable to load rankings')}
                  description={
                    rankingsQuery.error instanceof Error
                      ? rankingsQuery.error.message
                      : t('Unable to load rankings data')
                  }
                  onRetry={() => void rankingsQuery.refetch()}
                  className='bg-card rounded-lg border'
                />
              ) : null}
              {!rankingsQuery.isLoading && isEmpty ? (
                <EmptyState
                  icon={BarChart3}
                  title={t('No ranking activity yet')}
                  description={t(
                    'Rankings will appear after models receive traffic during this period.'
                  )}
                  className='bg-card rounded-lg'
                  bordered
                />
              ) : null}
              {!rankingsQuery.isLoading && snapshot && !isEmpty ? (
                <div className='space-y-8'>
                  <ModelsSection
                    history={snapshot.models_history}
                    rows={snapshot.models}
                    period={period}
                  />

                  <MarketShareSection
                    history={snapshot.vendor_share_history}
                    rows={snapshot.vendors}
                    period={period}
                  />

                  <PulseSection
                    movers={snapshot.top_movers}
                    droppers={snapshot.top_droppers}
                  />
                </div>
              ) : null}
            </section>
          </div>
        </main>
      </ProductShell>
    </PublicLayout>
  )
}

function RankingsLoading() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-[420px] w-full rounded-lg' />
      <Skeleton className='h-[360px] w-full rounded-lg' />
      <Skeleton className='h-[180px] w-full rounded-lg' />
    </div>
  )
}
