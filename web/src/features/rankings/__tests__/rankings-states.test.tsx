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
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Rankings } from '../index'
import type { RankingsSnapshot } from '../types'

const { navigate, rankingsQuery, search } = vi.hoisted(() => ({
  navigate: vi.fn(),
  rankingsQuery: vi.fn(),
  search: { period: 'week' },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  useSearch: () => search,
}))

vi.mock('../hooks/use-rankings', () => ({
  useRankings: rankingsQuery,
}))

vi.mock('@/components/layout', () => ({
  ProductShell: (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
  PublicLayout: (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
}))

vi.mock('../components', () => ({
  RankingsHero: () => <h1>Rankings</h1>,
  ModelsSection: () => <section>Models content</section>,
  MarketShareSection: () => <section>Market share content</section>,
  PulseSection: () => <section>Pulse content</section>,
}))

const emptySnapshot: RankingsSnapshot = {
  models: [],
  vendors: [],
  top_movers: [],
  top_droppers: [],
  models_history: { points: [], models: [], buckets: 0 },
  vendor_share_history: { points: [], vendors: [], buckets: 0 },
}

describe('Rankings request states', () => {
  beforeEach(() => {
    rankingsQuery.mockReset()
    navigate.mockReset()
    search.period = 'week'
  })

  it('offers a retry action when rankings fail to load', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn()
    rankingsQuery.mockReturnValue({
      data: undefined,
      error: new Error('ranking request failed'),
      isFetching: false,
      isLoading: false,
      refetch,
    })

    render(<Rankings />)

    await waitFor(() =>
      expect(screen.getByText('ranking request failed')).toBeVisible()
    )
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('shows one meaningful empty state for a snapshot without activity', async () => {
    rankingsQuery.mockReturnValue({
      data: { success: true, data: emptySnapshot },
      error: null,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    render(<Rankings />)

    await waitFor(() =>
      expect(screen.getByText('No ranking activity yet')).toBeVisible()
    )
    expect(screen.queryByText('Models content')).not.toBeInTheDocument()
    expect(screen.queryByText('Market share content')).not.toBeInTheDocument()
    expect(screen.queryByText('Pulse content')).not.toBeInTheDocument()
  })

  it('associates populated results with the active period tab', () => {
    rankingsQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          ...emptySnapshot,
          models: [
            {
              rank: 1,
              model_name: 'gpt-test',
              vendor: 'OpenAI',
              category: 'all',
              total_tokens: 100,
              share: 1,
              growth_pct: 10,
            },
          ],
        },
      },
      error: null,
      isFetching: true,
      isLoading: false,
      refetch: vi.fn(),
    })

    render(<Rankings />)

    const results = screen.getByRole('tabpanel')
    expect(results).toHaveAttribute(
      'aria-labelledby',
      'ranking-period-week-tab'
    )
    expect(results).toHaveAttribute('aria-busy', 'true')
    expect(results).toHaveAttribute('tabindex', '0')
    expect(screen.getByText('Models content')).toBeVisible()
  })
})
