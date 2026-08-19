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
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Route as PricingRoute } from '../pricing/index'
import { Route as RankingsRoute } from '../rankings/index'

const testState = vi.hoisted(() => ({
  access: vi.fn(),
  user: null as null | { id: number },
}))

vi.mock('@/lib/nav-modules', () => ({
  getFreshModuleAccess: testState.access,
}))

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: {
    getState: () => ({ auth: { user: testState.user } }),
  },
}))

vi.mock('@/features/pricing', () => ({ Pricing: () => null }))
vi.mock('@/features/rankings', () => ({ Rankings: () => null }))

type PublicBeforeLoad = (context: {
  location: { href: string }
}) => Promise<unknown>

function getBeforeLoad(route: typeof PricingRoute | typeof RankingsRoute) {
  const beforeLoad = route.options.beforeLoad as PublicBeforeLoad | undefined
  if (!beforeLoad) {
    throw new Error('Expected public module route to define beforeLoad')
  }
  return beforeLoad
}

describe('public module route access', () => {
  beforeEach(() => {
    testState.access.mockReset()
    testState.user = null
  })

  it('allows an enabled public pricing module', async () => {
    testState.access.mockResolvedValue({ enabled: true, requireAuth: false })

    await expect(
      getBeforeLoad(PricingRoute)({ location: { href: '/pricing' } })
    ).resolves.toBeUndefined()
    expect(testState.access).toHaveBeenCalledWith('pricing')
  })

  it('blocks a disabled rankings module', async () => {
    testState.access.mockResolvedValue({ enabled: false, requireAuth: false })

    await expect(
      getBeforeLoad(RankingsRoute)({ location: { href: '/rankings' } })
    ).rejects.toBeDefined()
    expect(testState.access).toHaveBeenCalledWith('rankings')
  })

  it('redirects guests when pricing requires authentication', async () => {
    testState.access.mockResolvedValue({ enabled: true, requireAuth: true })

    await expect(
      getBeforeLoad(PricingRoute)({
        location: { href: '/pricing?view=table' },
      })
    ).rejects.toBeDefined()
  })

  it('allows authenticated users through an auth-gated module', async () => {
    testState.user = { id: 1 }
    testState.access.mockResolvedValue({ enabled: true, requireAuth: true })

    await expect(
      getBeforeLoad(PricingRoute)({ location: { href: '/pricing' } })
    ).resolves.toBeUndefined()
  })
})
