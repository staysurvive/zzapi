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
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/stores/auth-store'

import { ProductPublicHeader } from '../components/product-public-header'
import type { TopNavLink } from '../types'

const { navigate, routerLocation } = vi.hoisted(() => ({
  navigate: vi.fn(),
  routerLocation: { pathname: '/' },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    disabled,
    onClick,
    ...props
  }: {
    to: string
    children: React.ReactNode
    disabled?: boolean
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={to}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event)
        const blocked = event.defaultPrevented || disabled
        event.preventDefault()
        if (!blocked) navigate({ to })
      }}
      {...props}
    >
      {children}
    </a>
  ),
  useNavigate: () => navigate,
  useRouterState: () => ({ location: routerLocation }),
}))

vi.mock('@/hooks/use-system-config', () => ({
  useSystemConfig: () => ({
    systemName: 'zzapi',
    logo: '/logo.svg',
    loading: false,
    logoLoaded: true,
  }),
}))

vi.mock('@/hooks/use-top-nav-links', () => ({
  useTopNavLinks: () => [],
}))

vi.mock('@/hooks/use-notifications', () => ({
  useNotifications: () => ({
    popoverOpen: false,
    setPopoverOpen: vi.fn(),
    unreadCount: 0,
    activeTab: 'notice',
    setActiveTab: vi.fn(),
    notice: '',
    announcements: [],
    loading: false,
  }),
}))

vi.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => null,
}))

vi.mock('@/components/theme-switch', () => ({
  ThemeSwitch: () => null,
}))

vi.mock('@/components/notification-popover', () => ({
  NotificationPopover: () => null,
}))

vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => null,
}))

const navLinks: TopNavLink[] = [
  { title: 'Home', href: '/' },
  { title: 'Models', href: '/models' },
  { title: 'Disabled', href: '/disabled', disabled: true },
]

function renderHeader(
  links: TopNavLink[] = navLinks,
  props: Partial<React.ComponentProps<typeof ProductPublicHeader>> = {}
) {
  return render(
    <ProductPublicHeader
      navLinks={links}
      siteName='zzapi'
      showAuthButtons={false}
      showLanguageSwitcher={false}
      showThemeSwitch={false}
      showNotifications={false}
      {...props}
    />
  )
}

describe('ProductPublicHeader navigation behavior', () => {
  beforeEach(() => {
    navigate.mockReset()
    routerLocation.pathname = '/'
    useAuthStore.getState().auth.setUser(null)
    document.body.style.overflow = ''
  })

  it('locks body scroll and returns focus after closing the mobile menu with Escape', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls')

    await user.click(trigger)

    const menu = await screen.findByRole('dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
    expect(menu).toHaveAttribute('data-zzapi-product', 'true')
    expect(document.body.style.overflow).toBe('hidden')
    const firstLink = within(menu).getByRole('link', { name: 'Home' })
    expect(firstLink).toHaveFocus()
    expect(within(menu).getByRole('link', { name: 'Models' })).toBeVisible()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(document.body.style.overflow).toBe('clip')
      expect(trigger).toHaveFocus()
    })
  })

  it('restores body scroll state when an open mobile menu unmounts', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    const { unmount } = renderHeader()

    await user.click(
      screen.getByRole('button', { name: 'Toggle navigation menu' })
    )
    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe('clip')
  })

  it('closes the mobile menu and restores body scroll after a route change', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    const view = renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    await user.click(trigger)
    expect(document.body.style.overflow).toBe('hidden')

    routerLocation.pathname = '/models'
    view.rerender(
      <ProductPublicHeader
        navLinks={navLinks}
        siteName='zzapi'
        showAuthButtons={false}
        showLanguageSwitcher={false}
        showThemeSwitch={false}
        showNotifications={false}
      />
    )

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(document.body.style.overflow).toBe('clip')
    })
  })

  it('keeps disabled links out of the keyboard order and blocks activation', async () => {
    const user = userEvent.setup()
    renderHeader()

    const disabledLink = screen.getByRole('link', { name: 'Disabled' })
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true')
    expect(disabledLink).toHaveAttribute('tabindex', '-1')

    await user.click(disabledLink)

    expect(navigate).not.toHaveBeenCalled()
  })

  it('marks requires-auth prompts as product-scoped dialog content', async () => {
    const user = userEvent.setup()
    renderHeader([{ title: 'Models', href: '/models', requiresAuth: true }])

    await user.click(screen.getByRole('link', { name: 'Models' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('data-product-dialog', 'true')
    expect(dialog.closest('[data-slot="dialog-portal"]')).toHaveAttribute(
      'data-product-dialog-portal',
      'true'
    )
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeVisible()
  })

  it('lets authenticated users follow requires-auth links directly', async () => {
    const user = userEvent.setup()
    useAuthStore.getState().auth.setUser({
      id: 1,
      username: 'operator',
      role: 1,
    })
    renderHeader([{ title: 'Models', href: '/models', requiresAuth: true }])

    await user.click(screen.getByRole('link', { name: 'Models' }))

    expect(navigate).toHaveBeenCalledWith({ to: '/models' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exposes the active route to assistive technology', () => {
    routerLocation.pathname = '/models'
    renderHeader(navLinks, { className: 'consumer-header-class' })

    expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(document.querySelector('[data-product-public-header]')).toHaveClass(
      'consumer-header-class'
    )
  })
})
