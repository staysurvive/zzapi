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
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { RankingsHero } from '../components/rankings-hero'
import type { RankingPeriod } from '../types'

function RankingsHeroHarness() {
  const [period, setPeriod] = useState<RankingPeriod>('week')
  return <RankingsHero period={period} onPeriodChange={setPeriod} />
}

describe('RankingsHero period tabs', () => {
  it('moves and activates period tabs with horizontal arrow keys', async () => {
    const user = userEvent.setup()
    render(<RankingsHeroHarness />)

    const week = screen.getByRole('tab', { name: 'Week' })
    week.focus()
    await user.keyboard('{ArrowRight}')

    const month = screen.getByRole('tab', { name: 'Month' })
    expect(month).toHaveFocus()
    expect(month).toHaveAttribute('aria-selected', 'true')
    expect(month).toHaveAttribute('aria-controls', 'rankings-results-panel')
    expect(week).toHaveAttribute('tabindex', '-1')

    await user.keyboard('{ArrowLeft}')
    expect(week).toHaveFocus()
    expect(week).toHaveAttribute('aria-selected', 'true')
  })

  it('supports Home and End and wraps between the first and last periods', async () => {
    const user = userEvent.setup()
    render(<RankingsHeroHarness />)

    const week = screen.getByRole('tab', { name: 'Week' })
    week.focus()
    await user.keyboard('{End}')

    const year = screen.getByRole('tab', { name: 'Year' })
    expect(year).toHaveFocus()
    expect(year).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    const today = screen.getByRole('tab', { name: 'Today' })
    expect(today).toHaveFocus()
    expect(today).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(today).toHaveFocus()
    expect(today).toHaveAttribute('aria-selected', 'true')
  })
})
