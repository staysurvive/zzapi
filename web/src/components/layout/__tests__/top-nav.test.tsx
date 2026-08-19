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
import { render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TopNav } from '../components/top-nav'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    disabled,
    children,
    ...props
  }: {
    to: string
    disabled?: boolean
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={disabled ? undefined : to}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </a>
  ),
}))

const links = [
  { title: 'Docs', href: '', disabled: true },
  { title: 'Home', href: '/' },
]

describe('TopNav disabled links', () => {
  it('renders a disabled desktop link without a navigation target', () => {
    render(<TopNav links={links} />)

    const navigation = screen.getByRole('navigation')
    const docsLink = within(navigation).getByRole('link', { name: 'Docs' })

    expect(docsLink).toHaveAttribute('aria-disabled', 'true')
    expect(docsLink).not.toHaveAttribute('href')
    expect(docsLink).toHaveClass('pointer-events-none', 'opacity-50')
  })

  it('removes the mobile navigation target when an item is disabled', async () => {
    const user = userEvent.setup()
    render(<TopNav links={links} />)

    await user.click(
      screen.getByRole('button', { name: 'Toggle navigation menu' })
    )

    const menu = await screen.findByRole('menu')
    const docsItem = within(menu).getByRole('menuitem', { name: 'Docs' })
    const homeItem = within(menu).getByRole('menuitem', { name: 'Home' })

    expect(docsItem).toHaveAttribute('aria-disabled', 'true')
    expect(docsItem).toHaveAttribute('data-disabled')
    expect(docsItem).not.toHaveAttribute('href')
    expect(docsItem).toHaveAttribute('tabindex', '-1')
    expect(homeItem).toHaveAttribute('href', '/')

    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(docsItem).toHaveFocus())
    await user.keyboard('{Enter}')

    expect(screen.getByRole('menu')).toBeVisible()
    expect(docsItem).not.toHaveAttribute('href')
  })
})
