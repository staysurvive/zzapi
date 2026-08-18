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
import { describe, expect, it, vi } from 'vitest'

import { AuthenticatedLayout } from '../components/authenticated-layout'
import { PublicLayout } from '../components/public-layout'
import { SectionPageLayout } from '../components/section-page-layout'

vi.mock('../components/app-header', () => ({
  AppHeader: () => <header data-testid='app-header' />,
}))

vi.mock('../components/app-sidebar', () => ({
  AppSidebar: () => <aside data-testid='app-sidebar' />,
}))

vi.mock('../components/public-header', () => ({
  PublicHeader: () => <header data-testid='legacy-public-header' />,
}))

vi.mock('../components/product-public-header', () => ({
  ProductPublicHeader: () => <header data-testid='product-public-header' />,
}))

vi.mock('@/context/search-provider', () => ({
  SearchProvider: (props: { children: React.ReactNode }) => props.children,
}))

describe('product layout contracts', () => {
  it('keeps the default PublicLayout on the legacy branch', () => {
    const { container } = render(
      <PublicLayout>
        <p>Legacy public content</p>
      </PublicLayout>
    )

    expect(screen.getByTestId('legacy-public-header')).toBeInTheDocument()
    expect(
      screen.queryByTestId('product-public-header')
    ).not.toBeInTheDocument()
    expect(container.firstElementChild).not.toHaveAttribute(
      'data-zzapi-product'
    )
    expect(screen.getAllByRole('main')).toHaveLength(1)
  })

  it('keeps one real main target when product public styling omits the container', () => {
    render(
      <PublicLayout appearance='product' showMainContainer={false}>
        <p>Product public content</p>
      </PublicLayout>
    )

    expect(screen.getByTestId('product-public-header')).toBeInTheDocument()
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main-content')
    expect(document.querySelectorAll('#main-content')).toHaveLength(1)
    expect(document.querySelectorAll('main')).toHaveLength(1)
  })

  it('keeps the workspace shell inside its single main landmark', () => {
    render(
      <AuthenticatedLayout>
        <div>Workspace content</div>
      </AuthenticatedLayout>
    )

    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main-content')
    expect(main).toHaveAttribute('tabindex', '-1')
    expect(
      main.querySelector('[data-product-surface="workspace"]')
    ).toHaveClass('flex-1')
    expect(document.querySelectorAll('main')).toHaveLength(1)
  })

  it('adds product header slots without changing the legacy heading contract', () => {
    const { rerender } = render(
      <SectionPageLayout>
        <SectionPageLayout.Title>Legacy title</SectionPageLayout.Title>
        <SectionPageLayout.Content>Legacy content</SectionPageLayout.Content>
      </SectionPageLayout>
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Legacy title' })
    ).toBeVisible()
    expect(document.querySelector('[data-product-section-page]')).toBeNull()

    rerender(
      <SectionPageLayout appearance='product'>
        <SectionPageLayout.Title>Product title</SectionPageLayout.Title>
        <SectionPageLayout.Description>
          Product description
        </SectionPageLayout.Description>
        <SectionPageLayout.Status>Healthy</SectionPageLayout.Status>
        <SectionPageLayout.Content>Product content</SectionPageLayout.Content>
      </SectionPageLayout>
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'Product title' })
    ).toBeVisible()
    expect(screen.getByText('Product description')).toBeVisible()
    expect(screen.getByText('Healthy')).toBeVisible()
    expect(
      document.querySelector('[data-product-section-page]')
    ).toHaveAttribute('data-zzapi-product', 'true')
  })
})
