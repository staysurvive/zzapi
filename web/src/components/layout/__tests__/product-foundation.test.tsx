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
import { describe, expect, it } from 'vitest'

import { MetricStrip } from '@/components/metric-strip'

import { Main } from '../components/main'
import { ProductShell } from '../components/product-shell'
import { ResourceHeader } from '../components/resource-header'

describe('product foundation primitives', () => {
  it('keeps ProductShell as a non-landmark scoped container', () => {
    render(
      <ProductShell surface='workspace'>
        <p>Workspace content</p>
      </ProductShell>
    )

    const shell = screen.getByText('Workspace content').parentElement
    expect(shell).toHaveAttribute('data-zzapi-product', 'true')
    expect(shell).toHaveAttribute('data-product-surface', 'workspace')
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })

  it('renders an accessible resource heading and action region', () => {
    render(
      <ResourceHeader
        eyebrow='Operations'
        title='Usage'
        description='Review recent requests.'
        status={<span>Healthy</span>}
        actions={<button type='button'>Export</button>}
      />
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'Usage' })
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Export' })).toBeVisible()
    expect(screen.getByText('Healthy')).toBeVisible()
  })

  it('supports an explicit heading level for nested resource regions', () => {
    render(<ResourceHeader title='Models' headingLevel={2} compact />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Models' })
    ).toBeVisible()
  })

  it('keeps metric data semantic and exposes textual status', () => {
    render(
      <MetricStrip
        items={[
          {
            id: 'requests',
            label: 'Requests',
            value: '1,204',
            supportingText: 'Last 24 hours',
            trend: '+12%',
            status: 'Within budget',
          },
        ]}
      />
    )

    expect(document.querySelector('dl')).toBeInTheDocument()
    expect(screen.getByText('Requests').tagName).toBe('DT')
    expect(screen.getByText('1,204').tagName).toBe('DD')
    expect(screen.getByText('+12% · Within budget')).toBeVisible()
  })

  it('allows an inner authenticated layout region to be a div', () => {
    const { container } = render(<Main as='div' data-testid='inner-region' />)

    expect(screen.getByTestId('inner-region').tagName).toBe('DIV')
    expect(container.querySelectorAll('main')).toHaveLength(0)
  })
})
