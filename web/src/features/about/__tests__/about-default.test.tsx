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
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { About } from '../index'

const { getAboutContent } = vi.hoisted(() => ({
  getAboutContent: vi.fn(),
}))

vi.mock('../api', () => ({ getAboutContent }))

vi.mock('@/components/layout', () => ({
  ProductBrandLogo: () => null,
  ProductShell: (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
  PublicLayout: (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
}))

describe('About default content', () => {
  beforeEach(() => {
    getAboutContent.mockReset()
    getAboutContent.mockResolvedValue({ success: true, data: '' })
  })

  it('shows branded product context when configured content is missing', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <About />
      </QueryClientProvider>
    )

    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading.textContent).toMatch(/API/)
    expect(
      screen.getByText(/No About Content Set|未设置关于内容/)
    ).toBeVisible()
    expect(
      screen.getAllByRole('link', { name: /NewAPI|github\.com/ })[0]
    ).toHaveAttribute('href', 'https://github.com/QuantumNous/new-api')
    expect(screen.getByRole('link', { name: 'QuantumNous' })).toHaveAttribute(
      'href',
      'https://github.com/QuantumNous'
    )
    expect(screen.getByRole('link', { name: 'One API' })).toBeVisible()
  })

  it('renders configured markdown as the primary product narrative', async () => {
    getAboutContent.mockResolvedValueOnce({
      success: true,
      data: '# Configured Product Story\n\nPurpose-built infrastructure.',
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <About />
      </QueryClientProvider>
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Configured Product Story',
      })
    ).toBeVisible()
    expect(screen.getByText('Purpose-built infrastructure.')).toBeVisible()
    expect(screen.queryByText(/No About Content Set/)).toBeNull()
  })

  it('isolates a configured external About page in a sandboxed iframe', async () => {
    getAboutContent.mockResolvedValueOnce({
      success: true,
      data: 'https://about.example.com/product',
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <About />
      </QueryClientProvider>
    )

    const frame = await screen.findByTitle('About')
    expect(frame).toHaveAttribute('src', 'https://about.example.com/product')
    expect(frame).toHaveAttribute(
      'sandbox',
      'allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
    )
  })

  it('offers a retry action when about content fails to load', async () => {
    getAboutContent.mockRejectedValueOnce(new Error('network unavailable'))
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <About />
      </QueryClientProvider>
    )

    const retry = await screen.findByRole('button', { name: 'Retry' })
    await waitFor(() => expect(retry).toBeVisible())
    expect(screen.getByText('network unavailable')).toBeVisible()
  })
})
