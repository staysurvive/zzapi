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
import { act, render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PublicHeader } from '../components/public-header'

const testState = vi.hoisted(() => ({
  pathname: '/',
  navigate: vi.fn(),
}))

const mediaState = {
  matches: false,
  listeners: new Set<(event: MediaQueryListEvent) => void>(),
}

vi.mock('@tanstack/react-router', () => ({
  Link: (props: {
    children: ReactNode
    className?: string
    disabled?: boolean
    onClick?: MouseEventHandler<HTMLAnchorElement>
    style?: CSSProperties
    tabIndex?: number
    to: string
  }) => (
    <a
      href={props.to}
      className={props.className}
      aria-disabled={props.disabled}
      onClick={(event) => {
        event.preventDefault()
        props.onClick?.(event)
      }}
      style={props.style}
      tabIndex={props.tabIndex}
    >
      {props.children}
    </a>
  ),
  useNavigate: () => testState.navigate,
  useRouterState: () => ({ location: { pathname: testState.pathname } }),
}))

vi.mock('@/hooks/use-system-config', () => ({
  useSystemConfig: () => ({
    systemName: 'zzapi',
    logo: '',
    loading: false,
    logoLoaded: true,
  }),
}))

vi.mock('@/hooks/use-top-nav-links', () => ({
  useTopNavLinks: () => [
    { title: 'Home', href: '/' },
    { title: 'Model Square', href: '/pricing' },
    { title: 'Docs', href: '', disabled: true },
  ],
}))

vi.mock('@/hooks/use-notifications', () => ({
  useNotifications: () => ({
    popoverOpen: false,
    setPopoverOpen: vi.fn(),
    unreadCount: 0,
    activeTab: 'notice',
    setActiveTab: vi.fn(),
    notice: null,
    announcements: [],
    loading: false,
  }),
}))

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({ auth: { user: null } }),
}))

vi.mock('@/components/dialog', () => ({ Dialog: () => null }))
vi.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => null,
}))
vi.mock('@/components/theme-switch', () => ({ ThemeSwitch: () => null }))
vi.mock('@/components/notification-popover', () => ({
  NotificationPopover: () => null,
}))
vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => null,
}))
vi.mock('../components/header-logo', () => ({ HeaderLogo: () => null }))

function renderHeader() {
  return render(
    <>
      <PublicHeader
        showThemeSwitch={false}
        showLanguageSwitcher={false}
        showNotifications={false}
        showAuthButtons={false}
      />
      <main id='main-content' />
    </>
  )
}

describe('PublicHeader mobile menu lifecycle', () => {
  beforeEach(() => {
    testState.pathname = '/'
    testState.navigate.mockReset()
    document.body.style.overflow = ''
    mediaState.matches = false
    mediaState.listeners.clear()
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: mediaState.matches,
        media: '(min-width: 640px)',
        onchange: null,
        addEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void
        ) => mediaState.listeners.add(listener),
        removeEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void
        ) => mediaState.listeners.delete(listener),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('removes the closed overlay from keyboard navigation', () => {
    renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    const menu = document.querySelector<HTMLElement>(
      '#public-header-mobile-menu'
    )
    expect(menu).not.toBeNull()
    if (!menu) return

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
    expect(menu).toHaveAttribute('aria-hidden', 'true')
    expect(menu).toHaveAttribute('inert')
    expect(
      within(menu).getByRole('link', { name: 'Home', hidden: true })
    ).toHaveAttribute('tabindex', '-1')
  })

  it('moves focus into the menu and restores it on Escape', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    await user.click(trigger)

    const menu = screen.getByRole('navigation', {
      name: 'Primary navigation',
    })
    const homeLink = within(menu).getByRole('link', { name: 'Home' })
    const pricingLink = within(menu).getByRole('link', {
      name: 'Model Square',
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(menu).not.toHaveAttribute('inert')
    expect(document.body.style.overflow).toBe('hidden')
    expect(homeLink).toHaveFocus()

    await user.tab({ shift: true })
    expect(trigger).toHaveFocus()
    await user.tab()
    expect(homeLink).toHaveFocus()
    pricingLink.focus()
    await user.tab()
    expect(trigger).toHaveFocus()

    homeLink.focus()

    await user.keyboard('{Escape}')

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    )
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('clip')
  })

  it('returns focus to the trigger when the active route link closes the menu', async () => {
    const user = userEvent.setup()
    renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    await user.click(trigger)
    const menu = screen.getByRole('navigation', {
      name: 'Primary navigation',
    })

    await user.click(within(menu).getByRole('link', { name: 'Home' }))

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    )
    expect(trigger).toHaveFocus()
  })

  it('closes on route changes and restores the prior body overflow', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    const view = renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    await user.click(trigger)
    expect(document.body.style.overflow).toBe('hidden')

    const menu = screen.getByRole('navigation', {
      name: 'Primary navigation',
    })
    await user.click(within(menu).getByRole('link', { name: 'Model Square' }))
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    testState.pathname = '/pricing'
    view.rerender(
      <>
        <PublicHeader
          showThemeSwitch={false}
          showLanguageSwitcher={false}
          showNotifications={false}
          showAuthButtons={false}
        />
        <main id='main-content' />
      </>
    )

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    )
    expect(document.body.style.overflow).toBe('clip')
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('tabindex', '-1')
    expect(main).toHaveFocus()
  })

  it('closes and restores scrolling when the viewport enters desktop', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'clip'
    renderHeader()

    const trigger = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    })
    await user.click(trigger)
    expect(document.body.style.overflow).toBe('hidden')

    mediaState.matches = true
    act(() => {
      mediaState.listeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent)
      )
    })

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    )
    expect(document.body.style.overflow).toBe('clip')
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('tabindex', '-1')
    expect(main).toHaveFocus()
  })
})
