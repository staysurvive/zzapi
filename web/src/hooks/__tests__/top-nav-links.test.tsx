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
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTopNavLinks } from '../use-top-nav-links'

const testState = vi.hoisted(() => ({
  status: null as Record<string, unknown> | null,
}))

vi.mock('@/hooks/use-status', () => ({
  useStatus: () => ({ status: testState.status }),
}))

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({ auth: { user: null } }),
}))

const docsOnlyModules = {
  home: false,
  console: false,
  pricing: false,
  rankings: false,
  docs: true,
  about: false,
}

describe('useTopNavLinks documentation fallback', () => {
  beforeEach(() => {
    testState.status = {
      HeaderNavModules: docsOnlyModules,
    }
  })

  it('keeps a configured HTTPS documentation URL external', () => {
    testState.status = {
      HeaderNavModules: docsOnlyModules,
      docs_link: '  https://docs.example.com/start  ',
    }

    const { result } = renderHook(() => useTopNavLinks())

    expect(result.current).toEqual([
      {
        title: 'Docs',
        href: 'https://docs.example.com/start',
        external: true,
      },
    ])
  })

  it('keeps a configured safe internal documentation URL navigable', () => {
    testState.status = {
      HeaderNavModules: docsOnlyModules,
      docs_link: '/developer/reference',
    }

    const { result } = renderHook(() => useTopNavLinks())

    expect(result.current).toEqual([
      { title: 'Docs', href: '/developer/reference' },
    ])
  })

  it.each([
    ['a missing URL', undefined],
    ['an invalid URL', 'javascript:alert(1)'],
  ])('disables Docs for %s without inventing a local route', (_, docsLink) => {
    testState.status = {
      HeaderNavModules: docsOnlyModules,
      docs_link: docsLink,
    }

    const { result } = renderHook(() => useTopNavLinks())

    expect(result.current).toEqual([
      { title: 'Docs', href: '', disabled: true },
    ])
    expect(result.current[0]?.href).not.toBe('/docs')
  })
})
