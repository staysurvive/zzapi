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
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LegalDocument } from '../legal-document'

vi.mock('@/components/layout', () => ({
  ProductBrandLogo: () => null,
  PublicLayout: (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  ),
}))

function renderWithQueryClient(component: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

afterEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('LegalDocument configured content', () => {
  it('creates stable focusable section anchors for configured markdown headings', async () => {
    const user = userEvent.setup()

    renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-markdown'
        fetchDocument={async () => ({
          success: true,
          data: [
            '## Data use',
            'We use data only to provide the service.',
            '### Retention',
            'Retention depends on account settings.',
            '## Data use',
            'This duplicate heading has a stable suffix.',
          ].join('\n\n'),
        })}
        emptyMessage='Missing policy'
      />
    )

    const navigation = await screen.findByRole('navigation', {
      name: 'Privacy Policy',
    })
    expect(navigation).toHaveClass('overflow-x-auto')
    const dataUseLinks = within(navigation).getAllByRole('link', {
      name: 'Data use',
    })
    const retentionLink = within(navigation).getByRole('link', {
      name: 'Retention',
    })
    const dataUseHeadings = screen.getAllByRole('heading', {
      level: 2,
      name: 'Data use',
    })
    const retentionHeading = screen.getByRole('heading', {
      level: 3,
      name: 'Retention',
    })

    expect(dataUseLinks[0]).toHaveAttribute('href', '#legal-data-use')
    expect(dataUseLinks[1]).toHaveAttribute('href', '#legal-data-use-2')
    expect(dataUseHeadings[0]).toHaveAttribute('id', 'legal-data-use')
    expect(dataUseHeadings[1]).toHaveAttribute('id', 'legal-data-use-2')
    expect(retentionHeading).toHaveAttribute('tabindex', '-1')

    await user.click(dataUseLinks[0])

    expect(dataUseHeadings[0]).toHaveFocus()
    expect(window.location.hash).toBe('#legal-data-use')

    await user.click(retentionLink)

    expect(retentionHeading).toHaveFocus()
    expect(window.location.hash).toBe('#legal-retention')

    window.history.back()
    await waitFor(() => {
      expect(window.location.hash).toBe('#legal-data-use')
      expect(dataUseHeadings[0]).toHaveFocus()
    })

    window.history.forward()
    await waitFor(() => {
      expect(window.location.hash).toBe('#legal-retention')
      expect(retentionHeading).toHaveFocus()
    })
  })

  it('does not render local navigation when configured content has no headings', async () => {
    const { container } = renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-without-headings'
        fetchDocument={async () => ({
          success: true,
          data: 'The policy is configured as a single paragraph.',
        })}
        emptyMessage='Missing policy'
      />
    )

    expect(
      await screen.findByText('The policy is configured as a single paragraph.')
    ).toBeVisible()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(container.querySelector('[data-legal-content]')).toHaveClass(
      'min-w-0',
      '[overflow-wrap:anywhere]'
    )
  })

  it('builds navigation from sanitized configured HTML headings', async () => {
    const user = userEvent.setup()

    const { container } = renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-html'
        fetchDocument={async () => ({
          success: true,
          data: '<script>window.unsafe = true</script><h2>Collection</h2><p>Details</p>',
        })}
        emptyMessage='Missing policy'
      />
    )

    const sectionLink = await screen.findByRole('link', { name: 'Collection' })
    const content = container.querySelector('[data-legal-content]')
    const shadowRoot = content?.firstElementChild?.shadowRoot
    const heading = shadowRoot?.querySelector<HTMLElement>('h2')

    expect(shadowRoot?.querySelector('script')).toBeNull()
    expect(
      screen.getAllByRole('heading', { level: 1, name: 'Privacy Policy' })
    ).toHaveLength(1)
    expect(heading).toHaveAttribute('id', 'legal-collection')
    expect(heading).toHaveAttribute('tabindex', '-1')

    await user.click(sectionLink)

    expect(shadowRoot?.activeElement).toBe(heading)
  })

  it('keeps wide configured HTML tables inside a reversible scroll container', async () => {
    const { container, unmount } = renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-table-overflow'
        fetchDocument={async () => ({
          success: true,
          data: '<h2>Data table</h2><table style="min-width: 70rem"><tbody><tr><td>Wide legal content</td></tr></tbody></table>',
        })}
        emptyMessage='Missing policy'
      />
    )

    await screen.findByRole('navigation', { name: 'Privacy Policy' })
    const content = container.querySelector('[data-legal-content]')
    const shadowRoot = content?.firstElementChild?.shadowRoot
    const table = shadowRoot?.querySelector('table')
    const scrollContainer = table?.parentElement

    expect(scrollContainer).toHaveAttribute('data-legal-table-scroll', '')
    expect(scrollContainer).toHaveClass(
      'w-full',
      'max-w-full',
      'overflow-x-auto'
    )
    expect(table).not.toHaveClass('overflow-x-auto')

    unmount()

    expect(table?.parentElement).not.toBe(scrollContainer)
    expect(scrollContainer?.parentElement).toBeNull()
  })

  it('restores ShadowRoot section focus for content anchors and browser history', async () => {
    const user = userEvent.setup()
    const { container } = renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-shadow-history'
        fetchDocument={async () => ({
          success: true,
          data: '<a href="#collection">Jump to collection</a><h2 id="collection">Collection</h2><h2 id="retention">Retention</h2>',
        })}
        emptyMessage='Missing policy'
      />
    )

    const navigation = await screen.findByRole('navigation', {
      name: 'Privacy Policy',
    })
    const content = container.querySelector('[data-legal-content]')
    const shadowRoot = content?.firstElementChild?.shadowRoot
    const contentAnchor = shadowRoot?.querySelector<HTMLAnchorElement>('a')
    const collectionHeading =
      shadowRoot?.querySelector<HTMLElement>('#collection')
    const retentionHeading =
      shadowRoot?.querySelector<HTMLElement>('#retention')

    expect(contentAnchor).toBeInstanceOf(HTMLAnchorElement)
    await user.click(contentAnchor as HTMLAnchorElement)

    expect(window.location.hash).toBe('#collection')
    expect(shadowRoot?.activeElement).toBe(collectionHeading)

    await user.click(
      within(navigation).getByRole('link', { name: 'Retention' })
    )
    expect(window.location.hash).toBe('#retention')
    expect(shadowRoot?.activeElement).toBe(retentionHeading)

    window.history.back()
    await waitFor(() => {
      expect(window.location.hash).toBe('#collection')
      expect(shadowRoot?.activeElement).toBe(collectionHeading)
    })

    window.history.forward()
    await waitFor(() => {
      expect(window.location.hash).toBe('#retention')
      expect(shadowRoot?.activeElement).toBe(retentionHeading)
    })
  })

  it('focuses a configured section named by the initial URL hash', async () => {
    window.history.replaceState(null, '', '/privacy-policy#legal-retention')

    renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-initial-hash'
        fetchDocument={async () => ({
          success: true,
          data: '## Collection\n\n### Retention\n\nRetention details.',
        })}
        emptyMessage='Missing policy'
      />
    )

    const retentionHeading = await screen.findByRole('heading', {
      level: 3,
      name: 'Retention',
    })

    await waitFor(() => expect(retentionHeading).toHaveFocus())
  })
})

describe('LegalDocument missing and error states', () => {
  it('uses a semantic document heading when content is not configured', async () => {
    renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document'
        fetchDocument={async () => ({
          success: false,
          message: 'Not configured',
        })}
        emptyMessage='Missing policy'
      />
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Privacy Policy' })
    ).toBeVisible()
    expect(screen.getByText('Not configured')).toBeVisible()
  })

  it('retries a failed request and renders the recovered document', async () => {
    const user = userEvent.setup()
    const fetchDocument = vi
      .fn()
      .mockRejectedValueOnce(new Error('legal request failed'))
      .mockResolvedValueOnce({
        success: true,
        data: 'Recovered policy content.',
      })

    renderWithQueryClient(
      <LegalDocument
        title='Privacy Policy'
        queryKey='test-legal-document-error'
        fetchDocument={fetchDocument}
        emptyMessage='Missing policy'
      />
    )

    const retry = await screen.findByRole('button', { name: 'Retry' })
    expect(screen.getByText('legal request failed')).toBeVisible()

    await user.click(retry)

    expect(await screen.findByText('Recovered policy content.')).toBeVisible()
    await waitFor(() => expect(fetchDocument).toHaveBeenCalledTimes(2))
  })
})
