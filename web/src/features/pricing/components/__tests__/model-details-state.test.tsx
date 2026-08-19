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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PricingModel } from '../../types'
import { ModelDetails } from '../model-details'

const testState = vi.hoisted(() => ({
  modelId: 'missing-model',
  pricingData: {
    models: [] as PricingModel[],
    groupRatio: {},
    usableGroup: {},
    endpointMap: {},
    autoGroups: [],
    hasResolvedData: false,
    isLoading: false,
    isFetching: false,
    error: null as unknown,
    refetch: vi.fn(),
    priceRate: 1,
    usdExchangeRate: 1,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ modelId: testState.modelId }),
  useSearch: () => ({}),
}))

vi.mock('@/features/performance-metrics/api', () => ({
  getPerfMetrics: async () => ({ data: { groups: [] } }),
}))

vi.mock('@/components/layout', () => ({
  ProductBrandLogo: () => <span aria-hidden='true' />,
  PublicLayout: (props: { children: ReactNode }) => props.children,
}))

vi.mock('@/lib/lobe-icon', () => ({
  getLobeIcon: () => null,
}))

vi.mock('../model-details-api', () => ({
  ModelDetailsApi: () => null,
}))

vi.mock('../model-details-performance', () => ({
  ModelDetailsPerformance: () => null,
}))

vi.mock('../../hooks/use-pricing-data', () => ({
  usePricingData: () => testState.pricingData,
}))

const cachedModel: PricingModel = {
  id: 1,
  model_name: 'cached-model',
  quota_type: 0,
  model_ratio: 1,
  completion_ratio: 1,
  enable_groups: ['default'],
}

function renderModelDetails() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ModelDetails />
    </QueryClientProvider>
  )
}

describe('ModelDetails request states', () => {
  beforeEach(() => {
    testState.modelId = 'missing-model'
    testState.pricingData.models = []
    testState.pricingData.hasResolvedData = false
    testState.pricingData.isLoading = false
    testState.pricingData.isFetching = false
    testState.pricingData.error = null
    testState.pricingData.refetch.mockReset()
  })

  it('disables retry while fetching and renders recovered not-found state', async () => {
    const user = userEvent.setup()
    testState.pricingData.error = new Error('Pricing service unavailable')

    const view = renderModelDetails()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Failed to load' })
    ).toBeInTheDocument()
    expect(screen.getByText('Pricing service unavailable')).toBeInTheDocument()
    expect(screen.queryByText('Model not found')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Failed to load' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(testState.pricingData.refetch).toHaveBeenCalledOnce()

    testState.pricingData.isFetching = true
    testState.pricingData.isLoading = true
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ModelDetails />
      </QueryClientProvider>
    )

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled()

    testState.pricingData.error = null
    testState.pricingData.isFetching = false
    testState.pricingData.isLoading = false
    testState.pricingData.hasResolvedData = true
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ModelDetails />
      </QueryClientProvider>
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'Model not found' })
    ).toBeVisible()
  })

  it('preserves cached model details when a background refresh fails', async () => {
    testState.modelId = cachedModel.model_name
    testState.pricingData.models = [cachedModel]
    testState.pricingData.hasResolvedData = true
    testState.pricingData.error = new Error('Pricing refresh failed')

    renderModelDetails()

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: cachedModel.model_name,
      })
    ).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Refresh failed')
    expect(screen.queryByText('Pricing refresh failed')).toBeNull()
  })

  it('uses an h1 not-found title after pricing loads without the requested model', () => {
    testState.pricingData.hasResolvedData = true
    renderModelDetails()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Model not found' })
    ).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Back to Models' })).toBeVisible()
  })

  it('announces the loading state with a single page heading', () => {
    testState.pricingData.isLoading = true
    testState.pricingData.isFetching = true

    renderModelDetails()

    expect(
      screen.getByRole('heading', { level: 1, name: 'missing-model' })
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading...')
  })
})
