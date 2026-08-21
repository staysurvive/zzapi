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
import { createElement, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PerfSummaryAllData } from '@/features/performance-metrics/types'
import type { PricingData, PricingModel } from '@/features/pricing/types'

import { useHomepageV5Data } from '../../hooks/use-homepage-v5-data'
import {
  attachHomepagePerformance,
  projectHomepageCatalog,
  resolveHomepageBaseUrl,
  resolveHomepageDataState,
  resolveHomepageDocsLink,
} from '../homepage-v5-data'

const apiGetMock = vi.hoisted(() => vi.fn())
const statusState = vi.hoisted(() => ({
  status: null as Record<string, unknown> | null,
  loading: false,
  error: null as unknown,
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGetMock },
}))

vi.mock('@/hooks/use-status', () => ({
  useStatus: () => statusState,
}))

function makeModel(
  modelName: string,
  overrides: Partial<PricingModel> = {}
): PricingModel {
  return {
    id: 1,
    model_name: modelName,
    quota_type: 0,
    model_ratio: 1,
    completion_ratio: 2,
    enable_groups: ['default'],
    ...overrides,
  }
}

function makePricingData(models: PricingModel[]): PricingData {
  return {
    success: true,
    data: models,
    vendors: [{ id: 7, name: 'Catalog vendor' }],
    group_ratio: { default: 1 },
    usable_group: { default: { desc: 'Default', ratio: 1 } },
    supported_endpoint: {},
    auto_groups: [],
  }
}

function makePerformanceData(
  models: PerfSummaryAllData['data']['models']
): PerfSummaryAllData {
  return { success: true, data: { models } }
}

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return {
    queryClient,
    wrapper: (props: { children: ReactNode }) =>
      createElement(
        QueryClientProvider,
        { client: queryClient },
        props.children
      ),
  }
}

describe('homepage v5 catalog projection', () => {
  it('sorts and deduplicates model names while preserving only reportable data', () => {
    const pricing = makePricingData([
      makeModel('zeta-model', {
        quota_type: 1,
        model_price: 0.2,
        enable_groups: [],
      }),
      makeModel('Alpha-model', {
        vendor_id: 7,
        supported_endpoint_types: ['openai'],
        cache_ratio: 0,
        create_cache_ratio: null,
      }),
      makeModel('Alpha-model', { vendor_name: 'Duplicate metadata' }),
      makeModel('dynamic-model', {
        billing_mode: 'tiered_expr',
        billing_expr: 'usage.input_tokens',
      }),
      makeModel('   '),
    ])
    pricing.supported_endpoint = {
      openai: {
        path: '/v1/models/{model}/responses',
        method: 'post',
      },
    } as unknown as Record<string, string>

    const projected = projectHomepageCatalog(pricing)

    expect(projected.map((model) => model.modelName)).toEqual([
      'Alpha-model',
      'dynamic-model',
      'zeta-model',
    ])
    expect(projected[0]).toEqual({
      modelName: 'Alpha-model',
      catalogVendor: 'Catalog vendor',
      endpointType: 'openai',
      endpointMethod: 'POST',
      endpointPath: '/v1/models/Alpha-model/responses',
      pricingMode: 'usage-based',
      cachePricingReported: true,
      groupRuleReported: true,
      inputPricingReported: true,
      outputPricingReported: true,
      traffic: 'unavailable',
      observedMetrics: null,
    })
    expect(projected[1]?.pricingMode).toBe('dynamic')
    expect(projected[2]).toMatchObject({
      pricingMode: 'per-request',
      groupRuleReported: false,
      inputPricingReported: false,
      outputPricingReported: false,
    })
  })

  it('does not project certification, capability, owner or competitive fields', () => {
    const rawModel = {
      ...makeModel('truth-boundary-model'),
      capabilities: ['tools'],
      owner_by: 'upstream-owner',
      official: true,
      verified: true,
      growth_pct: 64,
      request_count: 123456,
    } as unknown as PricingModel

    const [projected] = projectHomepageCatalog(makePricingData([rawModel]))
    const serialized = JSON.stringify(projected)

    expect(serialized).not.toMatch(
      /official|verified|capabilities|owner_by|growth_pct|request_count/i
    )
    expect(Object.keys(projected ?? {}).sort()).toEqual(
      [
        'cachePricingReported',
        'catalogVendor',
        'endpointMethod',
        'endpointPath',
        'endpointType',
        'groupRuleReported',
        'inputPricingReported',
        'modelName',
        'observedMetrics',
        'outputPricingReported',
        'pricingMode',
        'traffic',
      ].sort()
    )
  })

  it('uses only same-name observed summaries without exposing request counts', () => {
    const catalog = projectHomepageCatalog(
      makePricingData([makeModel('alpha'), makeModel('beta')])
    )
    const performance = makePerformanceData([
      {
        model_name: 'alpha',
        avg_latency_ms: 348,
        success_rate: 99.25,
        avg_tps: 42.5,
        request_count: 500,
        recent_success_rates: [98, 99, 100],
      },
      {
        model_name: 'outside-catalog',
        avg_latency_ms: 1,
        success_rate: 100,
        avg_tps: 999,
        request_count: 1,
      },
    ])

    const projected = attachHomepagePerformance(catalog, performance, 'current')

    expect(projected[0]).toMatchObject({
      modelName: 'alpha',
      traffic: 'observed',
      observedMetrics: {
        avgLatencyMs: 348,
        successRate: 99.25,
        avgTps: 42.5,
      },
    })
    expect(projected[1]).toMatchObject({
      modelName: 'beta',
      traffic: 'no-recent-sample',
      observedMetrics: null,
    })
    expect(JSON.stringify(projected)).not.toMatch(
      /request_count|recent_success_rates|outside-catalog/
    )
  })

  it('marks traffic unavailable when the performance source is not usable', () => {
    const catalog = projectHomepageCatalog(
      makePricingData([makeModel('alpha')])
    )
    const performance = makePerformanceData([
      {
        model_name: 'alpha',
        avg_latency_ms: 12,
        success_rate: 100,
        avg_tps: 20,
      },
    ])

    expect(
      attachHomepagePerformance(catalog, performance, 'error')[0]
    ).toMatchObject({ traffic: 'unavailable', observedMetrics: null })
  })

  it('marks a successfully empty performance window as no recent sample', () => {
    const catalog = projectHomepageCatalog(
      makePricingData([makeModel('alpha')])
    )

    expect(
      attachHomepagePerformance(catalog, makePerformanceData([]), 'empty')[0]
    ).toMatchObject({
      traffic: 'no-recent-sample',
      observedMetrics: null,
    })
  })
})

describe('homepage v5 state semantics', () => {
  const currentInput = {
    moduleEnabled: true,
    requiresAuthentication: false,
    isAuthenticated: false,
    openingReady: true,
    statusPending: false,
    hasResolvedData: true,
    itemCount: 1,
    hasError: false,
  }

  it.each([
    ['current', {}, 'current'],
    ['empty', { itemCount: 0 }, 'empty'],
    ['loading', { hasResolvedData: false }, 'loading'],
    ['error', { hasResolvedData: false, hasError: true }, 'error'],
    ['last-known', { hasError: true }, 'last-known'],
    ['auth-required', { requiresAuthentication: true }, 'auth-required'],
    ['disabled', { moduleEnabled: false }, 'disabled'],
  ] as const)('resolves the %s state', (_label, overrides, expected) => {
    expect(resolveHomepageDataState({ ...currentInput, ...overrides })).toBe(
      expected
    )
  })

  it('keeps data loading until the opening and status gates are ready', () => {
    expect(
      resolveHomepageDataState({ ...currentInput, openingReady: false })
    ).toBe('loading')
    expect(
      resolveHomepageDataState({ ...currentInput, statusPending: true })
    ).toBe('loading')
  })
})

describe('homepage v5 public links', () => {
  it('uses a valid configured base URL before the deployment origin', () => {
    expect(
      resolveHomepageBaseUrl(
        { server_address: 'https://api.example.com/' },
        'https://deployment.example.com'
      )
    ).toBe('https://api.example.com')
  })

  it('falls back to a safe deployment origin or an explicit placeholder', () => {
    expect(resolveHomepageBaseUrl({}, 'https://deployment.example.com/')).toBe(
      'https://deployment.example.com'
    )
    expect(resolveHomepageBaseUrl({}, 'javascript:alert(1)')).toBe(
      '<YOUR_BASE_URL>'
    )
  })

  it('accepts only http or safe internal documentation links', () => {
    expect(
      resolveHomepageDocsLink({ docs_link: '/docs/getting-started' })
    ).toBe('/docs/getting-started')
    expect(
      resolveHomepageDocsLink({ docs_link: 'https://docs.example.com' })
    ).toBe('https://docs.example.com')
    expect(resolveHomepageDocsLink({ docs_link: 'javascript:alert(1)' })).toBe(
      null
    )
    expect(resolveHomepageDocsLink({ docs_link: '//attacker.example' })).toBe(
      null
    )
  })
})

describe('useHomepageV5Data request gates', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
    statusState.status = {
      HeaderNavModules: {
        pricing: { enabled: true, requireAuth: false },
      },
      docs_link: '/docs',
      server_address: 'https://api.example.com/',
      system_name: 'zzapi',
    }
    statusState.loading = false
    statusState.error = null
  })

  it('does not request live data before the opening becomes ambient', () => {
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(
      () =>
        useHomepageV5Data({
          isAuthenticated: false,
          openingPhase: 'settle',
        }),
      { wrapper }
    )

    expect(view.result.current.pricingState).toBe('loading')
    expect(view.result.current.performanceState).toBe('loading')
    expect(view.result.current.models).toEqual([])
    expect(apiGetMock).not.toHaveBeenCalled()
    queryClient.clear()
  })

  it.each([
    ['disabled', { enabled: false, requireAuth: false }, false, 'disabled'],
    [
      'authentication-required',
      { enabled: true, requireAuth: true },
      false,
      'auth-required',
    ],
  ] as const)(
    'does not request data when pricing is %s',
    (_label, pricingAccess, isAuthenticated, expectedState) => {
      statusState.status = {
        HeaderNavModules: { pricing: pricingAccess },
      }
      const { queryClient, wrapper } = createQueryWrapper()
      const view = renderHook(
        () =>
          useHomepageV5Data({
            isAuthenticated,
            openingPhase: 'ambient',
          }),
        { wrapper }
      )

      expect(view.result.current.pricingState).toBe(expectedState)
      expect(view.result.current.performanceState).toBe(expectedState)
      expect(view.result.current.models).toEqual([])
      expect(apiGetMock).not.toHaveBeenCalled()
      queryClient.clear()
    }
  )

  it('loads pricing and performance silently and keeps their failures independent', async () => {
    const pricing = makePricingData([
      makeModel('zeta'),
      makeModel('alpha'),
      makeModel('beta'),
      makeModel('delta'),
    ])
    apiGetMock.mockImplementation((url: string) => {
      if (url === '/api/pricing') return Promise.resolve({ data: pricing })
      return Promise.reject(new Error('Performance unavailable'))
    })
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(
      () =>
        useHomepageV5Data({
          isAuthenticated: false,
          openingPhase: 'ambient',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(view.result.current.pricingState).toBe('current')
      expect(view.result.current.performanceState).toBe('error')
    })

    expect(view.result.current.models.map((model) => model.modelName)).toEqual([
      'alpha',
      'beta',
      'delta',
      'zeta',
    ])
    expect(view.result.current.catalogPreview).toHaveLength(3)
    expect(view.result.current.remainingModelCount).toBe(1)
    expect(view.result.current.selectedModelName).toBe('alpha')
    expect(view.result.current.selectedModel?.traffic).toBe('unavailable')
    expect(view.result.current.baseUrl).toBe('https://api.example.com')
    expect(view.result.current.docsLink).toBe('/docs')

    act(() => view.result.current.onSelectModel('delta'))
    expect(view.result.current.selectedModelName).toBe('delta')
    act(() => view.result.current.onSelectModel('not-in-catalog'))
    expect(view.result.current.selectedModelName).toBe('delta')

    expect(apiGetMock).toHaveBeenCalledWith('/api/pricing', {
      skipAuthRefresh: true,
      skipBusinessError: true,
      skipErrorHandler: true,
    })
    expect(apiGetMock).toHaveBeenCalledWith('/api/perf-metrics/summary', {
      skipAuthRefresh: true,
      skipBusinessError: true,
      skipErrorHandler: true,
      params: { hours: 24 },
    })
    queryClient.clear()
  })

  it('allows an authenticated visitor through an auth-required module gate', async () => {
    statusState.status = {
      HeaderNavModules: {
        pricing: { enabled: true, requireAuth: true },
      },
    }
    apiGetMock.mockImplementation((url: string) =>
      Promise.resolve({
        data:
          url === '/api/pricing'
            ? makePricingData([makeModel('authenticated-model')])
            : makePerformanceData([]),
      })
    )
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(
      () =>
        useHomepageV5Data({
          isAuthenticated: true,
          openingPhase: 'ambient',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(view.result.current.pricingState).toBe('current')
      expect(view.result.current.performanceState).toBe('empty')
    })
    expect(view.result.current.selectedModel).toMatchObject({
      modelName: 'authenticated-model',
      traffic: 'no-recent-sample',
    })
    expect(apiGetMock).toHaveBeenCalledTimes(2)
    queryClient.clear()
  })

  it('retains a last-known catalog when a background refresh fails', async () => {
    let pricingAttempt = 0
    apiGetMock.mockImplementation((url: string) => {
      if (url === '/api/pricing') {
        pricingAttempt += 1
        if (pricingAttempt > 1) {
          return Promise.reject(new Error('Catalog refresh unavailable'))
        }
        return Promise.resolve({
          data: makePricingData([makeModel('cached-model')]),
        })
      }
      return Promise.resolve({ data: makePerformanceData([]) })
    })
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(
      () =>
        useHomepageV5Data({
          isAuthenticated: false,
          openingPhase: 'ambient',
        }),
      { wrapper }
    )

    await waitFor(() =>
      expect(view.result.current.pricingState).toBe('current')
    )
    await act(async () => {
      await queryClient.invalidateQueries({
        queryKey: ['homepage-v5', 'pricing'],
      })
    })

    await waitFor(() =>
      expect(view.result.current.pricingState).toBe('last-known')
    )
    expect(view.result.current.selectedModelName).toBe('cached-model')
    queryClient.clear()
  })

  it('exposes current observations only after both queries resolve', async () => {
    apiGetMock.mockImplementation((url: string) => {
      if (url === '/api/pricing') {
        return Promise.resolve({
          data: makePricingData([makeModel('observed-model')]),
        })
      }
      return Promise.resolve({
        data: makePerformanceData([
          {
            model_name: 'observed-model',
            avg_latency_ms: 410,
            success_rate: 98.5,
            avg_tps: 36,
            request_count: 900,
          },
        ]),
      })
    })
    const { queryClient, wrapper } = createQueryWrapper()
    const view = renderHook(
      () =>
        useHomepageV5Data({
          isAuthenticated: false,
          openingPhase: 'ambient',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(view.result.current.performanceState).toBe('current')
      expect(view.result.current.selectedModel?.traffic).toBe('observed')
    })
    expect(view.result.current.selectedModel?.observedMetrics).toEqual({
      avgLatencyMs: 410,
      successRate: 98.5,
      avgTps: 36,
    })
    expect(JSON.stringify(view.result.current.models)).not.toContain(
      'request_count'
    )
    queryClient.clear()
  })
})
