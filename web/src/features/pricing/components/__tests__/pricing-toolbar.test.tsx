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
import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { VIEW_MODES } from '../../constants'
import { PricingToolbar, type PricingToolbarProps } from '../pricing-toolbar'

vi.mock('@/lib/lobe-icon', () => ({
  getLobeIcon: () => null,
}))

function renderToolbar(overrides: Partial<PricingToolbarProps> = {}) {
  const props: PricingToolbarProps = {
    filteredCount: 3,
    totalCount: 3,
    sortBy: 'name',
    onSortChange: vi.fn(),
    tokenUnit: 'M',
    onTokenUnitChange: vi.fn(),
    showRechargePrice: false,
    onRechargePriceChange: vi.fn(),
    viewMode: VIEW_MODES.CARD,
    onViewModeChange: vi.fn(),
    quotaTypeFilter: 'all',
    endpointTypeFilter: 'all',
    vendorFilter: 'all',
    groupFilter: 'all',
    tagFilter: 'all',
    onQuotaTypeChange: vi.fn(),
    onEndpointTypeChange: vi.fn(),
    onVendorChange: vi.fn(),
    onGroupChange: vi.fn(),
    onTagChange: vi.fn(),
    vendors: [],
    groups: [],
    tags: [],
    models: [],
    hasActiveFilters: false,
    activeFilterCount: 0,
    onClearFilters: vi.fn(),
    ...overrides,
  }

  render(<PricingToolbar {...props} />)
  return props
}

describe('PricingToolbar display controls', () => {
  it('keeps price mode and token unit controls interactive in the toolbar', async () => {
    const user = userEvent.setup()
    const props = renderToolbar()

    const priceMode = screen.getByRole('group', {
      name: 'Price display mode',
    })
    const tokenUnit = screen.getByRole('group', { name: 'Token unit' })

    expect(
      within(priceMode).getByRole('button', { name: 'Standard' })
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      within(tokenUnit).getByRole('button', { name: '/1M' })
    ).toHaveAttribute('aria-pressed', 'true')

    await user.click(
      within(priceMode).getByRole('button', { name: 'Recharge' })
    )
    await user.click(within(tokenUnit).getByRole('button', { name: '/1K' }))

    expect(props.onRechargePriceChange).toHaveBeenCalledWith(true)
    expect(props.onTokenUnitChange).toHaveBeenCalledWith('K')
  })

  it('opens the complete filter sheet from the compact filter action', async () => {
    const user = userEvent.setup()
    renderToolbar()

    await user.click(screen.getByRole('button', { name: 'Filter' }))

    const sheet = await screen.findByRole('dialog')
    expect(sheet).toHaveAttribute('data-zzapi-product', 'true')
    expect(
      within(sheet).getByText(
        'Filter models by provider, group, type, endpoint, and tags.'
      )
    ).toBeVisible()
    expect(
      within(sheet).getByRole('button', { name: 'All Vendors0' })
    ).toBeVisible()
  })

  it('gives icon-only view controls accessible names', async () => {
    const user = userEvent.setup()
    const props = renderToolbar()
    const viewMode = screen.getByRole('group', { name: 'View mode' })
    const cardView = within(viewMode).getByRole('button', {
      name: 'Card view',
    })
    const tableView = within(viewMode).getByRole('button', {
      name: 'Table view',
    })

    expect(cardView).toHaveAttribute('aria-pressed', 'true')
    expect(tableView).toHaveAttribute('aria-pressed', 'false')

    await user.click(tableView)

    expect(props.onViewModeChange).toHaveBeenCalledWith(VIEW_MODES.TABLE)
  })
})
