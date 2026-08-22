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
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { HomepageValueTabs } from '../homepage-value-tabs'

describe('Homepage V5 value tabs', () => {
  test('uses vertical manual activation and keeps a single selected panel', async () => {
    const user = userEvent.setup()
    render(<HomepageValueTabs />)

    const tablist = screen.getByRole('tablist', {
      name: 'zzapi value views',
    })
    const usage = screen.getByRole('tab', {
      name: /Flexible usage billing/i,
    })
    const access = screen.getByRole('tab', { name: /Stable direct access/i })
    const refund = screen.getByRole('tab', { name: /Refund assurance/i })

    expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    expect(usage).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

    usage.focus()
    await user.keyboard('{ArrowDown}')
    expect(access).toHaveFocus()
    expect(usage).toHaveAttribute('aria-selected', 'true')
    expect(access).toHaveAttribute('aria-selected', 'false')

    await user.keyboard('{Enter}')
    expect(access).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Stable access path')).toBeInTheDocument()

    await user.keyboard('{End}')
    expect(refund).toHaveFocus()
    expect(access).toHaveAttribute('aria-selected', 'true')
    await user.keyboard(' ')
    expect(refund).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

    await user.keyboard('{Home}')
    expect(usage).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(usage).toHaveAttribute('aria-selected', 'true')
  })

  test('renders the fixed usage demonstration values', () => {
    render(<HomepageValueTabs />)

    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveTextContent('¥ 3.47')
    expect(panel).toHaveTextContent('482K')
    expect(panel).toHaveTextContent('1.2M')
    expect(panel).toHaveTextContent('86K')
    expect(
      screen.getByRole('img', { name: 'Usage demo chart' })
    ).toBeInTheDocument()
  })

  test('switches between the stable route and refund assurance demonstrations', async () => {
    const user = userEvent.setup()
    render(<HomepageValueTabs />)

    await user.click(screen.getByRole('tab', { name: /Stable direct access/i }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('24ms')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Latest models')

    await user.click(screen.getByRole('tab', { name: /Refund assurance/i }))
    const refundPanel = screen.getByRole('tabpanel')
    expect(refundPanel).toHaveTextContent('Balance confirmed')
    expect(refundPanel).toHaveTextContent('Original route returned')
    expect(refundPanel).toHaveTextContent('Refund received')
  })
})
