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
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PricingModel } from '../../types'
import { PricingTable } from '../pricing-table'

vi.mock('@/lib/lobe-icon', () => ({
  getLobeIcon: () => null,
}))

const model: PricingModel = {
  id: 1,
  model_name: 'keyboard-model',
  quota_type: 0,
  model_ratio: 1,
  completion_ratio: 1,
  enable_groups: ['default'],
}

describe('PricingTable model details activation', () => {
  it('opens a model row with Enter and Space', async () => {
    const user = userEvent.setup()
    const onModelClick = vi.fn()
    render(<PricingTable models={[model]} onModelClick={onModelClick} />)

    const row = screen.getByRole('row', {
      name: 'View details: keyboard-model',
    })

    row.focus()
    expect(row).toHaveFocus()

    await user.keyboard('{Enter}')
    await user.keyboard(' ')

    expect(onModelClick).toHaveBeenNthCalledWith(1, 'keyboard-model')
    expect(onModelClick).toHaveBeenNthCalledWith(2, 'keyboard-model')
  })

  it('does not advertise details interaction without an activation handler', () => {
    render(<PricingTable models={[model]} />)

    const row = screen.getByRole('row', { name: /keyboard-model/ })

    expect(row).not.toHaveAttribute('tabindex')
    expect(row).not.toHaveAttribute('aria-label')
  })
})
