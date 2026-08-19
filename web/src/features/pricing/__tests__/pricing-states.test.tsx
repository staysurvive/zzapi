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
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Pricing } from '../index'

const testState = vi.hoisted(() => ({
  resolvedTheme: 'light',
  hasResolvedData: false,
  isLoading: false,
  isFetching: false,
  error: null as unknown,
  filteredModels: [] as Array<{ model_name: string }>,
  refetch: vi.fn(),
}))

vi.mock('@/context/theme-provider', () => ({
  useTheme: () => ({ resolvedTheme: testState.resolvedTheme }),
}))

vi.mock('@/components/layout', () => ({
  ProductShell: (props: { children: ReactNode }) => props.children,
  PublicLayout: (props: { children: ReactNode }) => props.children,
}))

vi.mock('../components', () => ({
  LoadingSkeleton: () => <div data-testid='pricing-loading' />,
  EmptyState: () => <div data-testid='pricing-empty' />,
  SearchBar: () => null,
  PricingTable: () => <div data-testid='pricing-table' />,
  PricingSidebar: () => null,
  PricingToolbar: () => null,
  ModelCardGrid: () => <div data-testid='pricing-grid' />,
  ModelDetailsDrawer: () => null,
}))

vi.mock('../hooks/use-pricing-data', () => ({
  usePricingData: () => ({
    models: testState.filteredModels,
    vendors: [],
    groupRatio: {},
    usableGroup: {},
    endpointMap: {},
    autoGroups: [],
    hasResolvedData: testState.hasResolvedData,
    isLoading: testState.isLoading,
    isFetching: testState.isFetching,
    error: testState.error,
    refetch: testState.refetch,
    priceRate: 1,
    usdExchangeRate: 1,
  }),
}))

vi.mock('../hooks/use-filters', () => ({
  useFilters: () => ({
    searchInput: '',
    sortBy: 'name',
    vendorFilter: [],
    groupFilter: 'all',
    quotaTypeFilter: 'all',
    endpointTypeFilter: 'all',
    tagFilter: [],
    tokenUnit: 'M',
    viewMode: 'card',
    showRechargePrice: false,
    setSearchInput: vi.fn(),
    setSortBy: vi.fn(),
    setVendorFilter: vi.fn(),
    setGroupFilter: vi.fn(),
    setQuotaTypeFilter: vi.fn(),
    setEndpointTypeFilter: vi.fn(),
    setTagFilter: vi.fn(),
    setTokenUnit: vi.fn(),
    setViewMode: vi.fn(),
    setShowRechargePrice: vi.fn(),
    filteredModels: testState.filteredModels,
    hasActiveFilters: false,
    activeFilterCount: 0,
    availableTags: [],
    clearFilters: vi.fn(),
    clearSearch: vi.fn(),
  }),
}))

describe('Pricing request states', () => {
  beforeEach(() => {
    testState.resolvedTheme = 'light'
    testState.hasResolvedData = false
    testState.isLoading = false
    testState.isFetching = false
    testState.error = null
    testState.filteredModels = []
    testState.refetch.mockReset()
  })

  it('keeps the loading state distinct from an empty result', () => {
    testState.isLoading = true
    testState.isFetching = true

    render(<Pricing />)

    expect(screen.getByTestId('pricing-loading')).toBeVisible()
    expect(screen.queryByTestId('pricing-empty')).toBeNull()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Model Square' })
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading...')
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true')
  })

  it('disables retry while fetching and renders recovered results', async () => {
    const user = userEvent.setup()
    testState.error = new Error('Pricing service unavailable')

    const view = render(<Pricing />)

    expect(screen.getByText('Pricing service unavailable')).toBeInTheDocument()
    expect(screen.queryByTestId('pricing-empty')).toBeNull()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Model Square' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(testState.refetch).toHaveBeenCalledOnce()

    testState.isFetching = true
    testState.isLoading = true
    view.rerender(<Pricing />)

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Loading...' })).toHaveAttribute(
      'aria-busy',
      'true'
    )

    testState.error = null
    testState.isFetching = false
    testState.isLoading = false
    testState.hasResolvedData = true
    testState.filteredModels = [{ model_name: 'recovered-model' }]
    view.rerender(<Pricing />)

    expect(screen.getByTestId('pricing-grid')).toBeVisible()
    expect(screen.queryByText('Pricing service unavailable')).toBeNull()
  })

  it('preserves cached results when a background refresh fails', () => {
    testState.hasResolvedData = true
    testState.error = new Error('Pricing refresh failed')
    testState.filteredModels = [{ model_name: 'cached-model' }]

    render(<Pricing />)

    expect(screen.getByTestId('pricing-grid')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Refresh failed')
    expect(screen.queryByText('Pricing refresh failed')).toBeNull()
  })

  it('renders the empty state after a successful empty response', () => {
    testState.hasResolvedData = true
    render(<Pricing />)

    expect(screen.getByTestId('pricing-empty')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it('mounts only the active theme poster asset', () => {
    testState.hasResolvedData = true
    const view = render(<Pricing />)

    let posters = view.container.querySelectorAll('.pricing-poster-background')
    expect(posters).toHaveLength(1)
    expect(posters[0]).toHaveAttribute(
      'src',
      '/product-brand/model-plaza-poster-background.webp'
    )

    testState.resolvedTheme = 'dark'
    view.rerender(<Pricing />)

    posters = view.container.querySelectorAll('.pricing-poster-background')
    expect(posters).toHaveLength(1)
    expect(posters[0]).toHaveAttribute(
      'src',
      '/product-brand/model-plaza-poster-background-dark.webp'
    )
  })
})
