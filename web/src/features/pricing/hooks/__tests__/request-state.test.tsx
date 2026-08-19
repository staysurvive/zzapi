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
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PricingData } from '../../types'
import { usePricingData } from '../use-pricing-data'

const getPricingMock = vi.hoisted(() => vi.fn())

vi.mock('../../api', () => ({
  getPricing: getPricingMock,
}))

vi.mock('@/hooks/use-status', () => ({
  useStatus: () => ({ status: { price: 1, usd_exchange_rate: 1 } }),
}))

const pricingData: PricingData = {
  success: true,
  data: [
    {
      id: 1,
      model_name: 'cached-model',
      quota_type: 0,
      model_ratio: 1,
      completion_ratio: 1,
      enable_groups: ['default'],
    },
  ],
  vendors: [],
  group_ratio: {},
  usable_group: {},
  supported_endpoint: {},
  auto_groups: [],
}

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return {
    queryClient,
    wrapper: (props: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    ),
  }
}

describe('usePricingData request state', () => {
  beforeEach(() => {
    getPricingMock.mockReset()
  })

  it('retains a fatal error while its retry is pending', async () => {
    let resolveRetry: ((value: PricingData) => void) | undefined
    getPricingMock
      .mockRejectedValueOnce(new Error('Pricing service unavailable'))
      .mockImplementationOnce(
        () =>
          new Promise<PricingData>((resolve) => {
            resolveRetry = resolve
          })
      )
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(() => usePricingData(), { wrapper })

    await waitFor(() => {
      expect(view.result.current.error).toHaveProperty(
        'message',
        'Pricing service unavailable'
      )
    })

    act(() => {
      void view.result.current.refetch()
    })

    await waitFor(() => expect(view.result.current.isFetching).toBe(true))
    expect(view.result.current.isLoading).toBe(true)
    expect(view.result.current.error).toHaveProperty(
      'message',
      'Pricing service unavailable'
    )

    act(() => resolveRetry?.(pricingData))

    await waitFor(() => {
      expect(view.result.current.hasResolvedData).toBe(true)
      expect(view.result.current.error).toBeNull()
    })

    queryClient.clear()
  })

  it('keeps cached pricing and its refresh error during a retry', async () => {
    let resolveRetry: ((value: PricingData) => void) | undefined
    getPricingMock
      .mockResolvedValueOnce(pricingData)
      .mockRejectedValueOnce(new Error('Pricing refresh failed'))
      .mockImplementationOnce(
        () =>
          new Promise<PricingData>((resolve) => {
            resolveRetry = resolve
          })
      )
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(() => usePricingData(), { wrapper })

    await waitFor(() =>
      expect(view.result.current.models[0]?.model_name).toBe('cached-model')
    )

    await act(async () => {
      await view.result.current.refetch()
    })

    await waitFor(() => {
      expect(view.result.current.models[0]?.model_name).toBe('cached-model')
      expect(view.result.current.error).toHaveProperty(
        'message',
        'Pricing refresh failed'
      )
    })

    act(() => {
      void view.result.current.refetch()
    })

    await waitFor(() => expect(view.result.current.isFetching).toBe(true))
    expect(view.result.current.models[0]?.model_name).toBe('cached-model')
    expect(view.result.current.error).toHaveProperty(
      'message',
      'Pricing refresh failed'
    )

    act(() => resolveRetry?.(pricingData))

    await waitFor(() => expect(view.result.current.error).toBeNull())
    queryClient.clear()
  })
})
