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
import { useRef, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import type { RankingPeriod } from '../types'

const PERIODS: { id: RankingPeriod; labelKey: string }[] = [
  { id: 'today', labelKey: 'Today' },
  { id: 'week', labelKey: 'Week' },
  { id: 'month', labelKey: 'Month' },
  { id: 'year', labelKey: 'Year' },
]

type RankingsHeroProps = {
  period: RankingPeriod
  onPeriodChange: (period: RankingPeriod) => void
}

/**
 * Hero strip for the rankings page. Intentionally minimal — title +
 * subtitle + period tabs only.
 */
export function RankingsHero(props: RankingsHeroProps) {
  const { t } = useTranslation()
  const periodTabs = useRef<Array<HTMLButtonElement | null>>([])

  const handlePeriodKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % PERIODS.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + PERIODS.length) % PERIODS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = PERIODS.length - 1
    }

    if (nextIndex == null) return

    event.preventDefault()
    periodTabs.current[nextIndex]?.focus()
    props.onPeriodChange(PERIODS[nextIndex].id)
  }

  return (
    <section className='rankings-hero relative space-y-5'>
      <img
        aria-hidden
        src='/product-brand/rankings-pulse-accent.png'
        alt=''
        className='rankings-pulse-accent pointer-events-none absolute top-0 right-0 hidden select-none lg:block'
      />
      <div className='space-y-2'>
        <h1 className='text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] font-semibold'>
          {t('Rankings')}
        </h1>
        <p className='text-muted-foreground/80 max-w-2xl text-sm'>
          {t(
            'Discover the most-used models and rising vendors on the platform, updated from live usage data.'
          )}
        </p>
      </div>

      {/* Underline tabs for period — clean and unobtrusive. */}
      <div
        role='tablist'
        aria-label={t('Period')}
        aria-orientation='horizontal'
        className='border-border/60 flex items-center border-b'
      >
        {PERIODS.map((p, index) => {
          const isActive = props.period === p.id
          return (
            <button
              key={p.id}
              id={`ranking-period-${p.id}-tab`}
              ref={(node) => {
                periodTabs.current[index] = node
              }}
              role='tab'
              type='button'
              aria-selected={isActive}
              aria-controls='rankings-results-panel'
              tabIndex={isActive ? 0 : -1}
              onClick={() => props.onPeriodChange(p.id)}
              onKeyDown={(event) => handlePeriodKeyDown(event, index)}
              className={cn(
                'focus-visible:ring-ring/40 relative -mb-px rounded-sm px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(p.labelKey)}
              <span
                aria-hidden
                className={cn(
                  'bg-primary absolute inset-x-3 -bottom-px h-[2px] rounded-full transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
