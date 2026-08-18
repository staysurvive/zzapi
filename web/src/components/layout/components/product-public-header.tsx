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
import { Hamburger01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@/components/dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { HeaderLogo } from './header-logo'
import type { PublicHeaderProps } from './public-header'

const AUTH_PROMPT_SECONDS = 5

type AuthPromptTarget = {
  title: string
  href: string
}

export type ProductPublicHeaderProps = PublicHeaderProps

export function ProductPublicHeader(props: ProductPublicHeaderProps) {
  const {
    navLinks = defaultTopNavLinks,
    mobileLinks,
    navContent,
    leftContent,
    rightContent,
    showNavigation = true,
    showThemeSwitch = true,
    showLanguageSwitcher = true,
    logo: customLogo,
    siteName: customSiteName,
    homeUrl = '/',
    showAuthButtons = true,
    showNotifications = true,
  } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuId = useId()
  const bodyOverflowBeforeMenu = useRef<string | null>(null)
  const [authPromptTarget, setAuthPromptTarget] =
    useState<AuthPromptTarget | null>(null)
  const [authPromptSecondsLeft, setAuthPromptSecondsLeft] =
    useState(AUTH_PROMPT_SECONDS)
  const { auth } = useAuthStore()
  const {
    systemName,
    logo: systemLogo,
    loading,
    logoLoaded,
  } = useSystemConfig()
  const dynamicLinks = useTopNavLinks()
  const notifications = useNotifications()

  const user = auth.user
  const isAuthenticated = !!user
  const displaySiteName = customSiteName || systemName
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const menuLinks = mobileLinks ?? links
  let brandMark: ReactNode
  if (loading) {
    brandMark = <Skeleton className='size-full rounded-md' />
  } else if (customLogo) {
    brandMark = customLogo
  } else {
    brandMark = (
      <HeaderLogo
        src={systemLogo}
        alt={displaySiteName}
        loading={loading}
        logoLoaded={logoLoaded}
        className='size-full rounded-md object-contain'
      />
    )
  }

  let authControl: ReactNode = null
  if (showAuthButtons) {
    if (loading) {
      authControl = <Skeleton className='h-9 w-20 rounded-md' />
    } else if (isAuthenticated) {
      authControl = <ProfileDropdown />
    } else {
      authControl = (
        <Button
          size='sm'
          className='h-9 rounded-md px-3.5 text-xs font-medium'
          render={<Link to='/sign-in' />}
        >
          {t('Sign in')}
        </Button>
      )
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow =
      bodyOverflowBeforeMenu.current ?? document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      bodyOverflowBeforeMenu.current = null
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!authPromptTarget) return

    const intervalId = window.setInterval(() => {
      setAuthPromptSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)
    const timeoutId = window.setTimeout(() => {
      const redirect = authPromptTarget.href
      setAuthPromptTarget(null)
      navigate({ to: '/sign-in', search: { redirect } })
    }, AUTH_PROMPT_SECONDS * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [authPromptTarget, navigate])

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null)
    setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
  }, [])

  const navigateToSignIn = useCallback(() => {
    const redirect = authPromptTarget?.href || '/'
    setAuthPromptTarget(null)
    navigate({ to: '/sign-in', search: { redirect } })
  }, [authPromptTarget?.href, navigate])

  const handleMobileOpenChange = useCallback((open: boolean) => {
    if (open && bodyOverflowBeforeMenu.current === null) {
      bodyOverflowBeforeMenu.current = document.body.style.overflow
    }
    setMobileOpen(open)
  }, [])

  const handleNavLinkClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      link: TopNavLink,
      closeMobile = false
    ) => {
      if (link.disabled) {
        event.preventDefault()
        return
      }

      if (link.requiresAuth && !isAuthenticated) {
        event.preventDefault()
        if (closeMobile) setMobileOpen(false)
        setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
        setAuthPromptTarget({ title: t(link.title), href: link.href })
        return
      }

      if (closeMobile) setMobileOpen(false)
    },
    [isAuthenticated, t]
  )

  const renderLink = (link: TopNavLink, index: number, closeMobile = false) => {
    const isActive = link.isActive || pathname === link.href
    const className = cn(
      'product-public-link',
      isActive && 'product-public-link-active',
      link.disabled && 'pointer-events-none opacity-50'
    )

    if (link.external) {
      return (
        <a
          key={`${link.href}-${index}`}
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          aria-current={isActive ? 'page' : undefined}
          aria-disabled={link.disabled}
          tabIndex={link.disabled ? -1 : undefined}
          onClick={(event) => handleNavLinkClick(event, link, closeMobile)}
          className={className}
        >
          {t(link.title)}
        </a>
      )
    }

    return (
      <Link
        key={`${link.href}-${index}`}
        to={link.href}
        disabled={link.disabled}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={link.disabled}
        tabIndex={link.disabled ? -1 : undefined}
        onClick={(event) => handleNavLinkClick(event, link, closeMobile)}
        className={className}
      >
        {t(link.title)}
      </Link>
    )
  }

  return (
    <header data-product-public-header='true' className={props.className}>
      <div
        data-product-public-header-inner='true'
        data-product-scrolled={scrolled ? 'true' : 'false'}
      >
        <nav
          aria-label={t('Primary navigation')}
          data-product-public-nav='true'
        >
          {leftContent}
          <Link
            to={homeUrl}
            className='product-public-brand'
            aria-label={displaySiteName}
          >
            <span className='product-public-brand-mark'>{brandMark}</span>
            <span className='product-public-brand-name'>
              {loading ? <Skeleton className='h-4 w-16' /> : displaySiteName}
            </span>
          </Link>

          {showNavigation ? (
            <div data-product-public-links='true'>
              {links.map((link, index) => renderLink(link, index))}
              {navContent}
            </div>
          ) : null}

          <div data-product-public-tools='true'>
            {showLanguageSwitcher ? <LanguageSwitcher /> : null}
            {showThemeSwitch ? <ThemeSwitch /> : null}
            {showNotifications ? (
              <NotificationPopover
                open={notifications.popoverOpen}
                onOpenChange={notifications.setPopoverOpen}
                unreadCount={notifications.unreadCount}
                activeTab={notifications.activeTab}
                onTabChange={notifications.setActiveTab}
                notice={notifications.notice}
                announcements={notifications.announcements}
                loading={notifications.loading}
              />
            ) : null}
            {authControl}
            {rightContent}
            {showNavigation ? (
              <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
                <SheetTrigger
                  render={
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='product-public-menu-trigger sm:hidden'
                      aria-label={t('Toggle navigation menu')}
                      aria-controls={mobileMenuId}
                    />
                  }
                >
                  <HugeiconsIcon icon={Hamburger01Icon} strokeWidth={2} />
                </SheetTrigger>
                <SheetContent
                  side='right'
                  showCloseButton
                  closeLabel={t('Close')}
                  id={mobileMenuId}
                  className='product-public-menu'
                  data-zzapi-product='true'
                  data-product-public-menu='true'
                >
                  <SheetHeader>
                    <SheetTitle>{displaySiteName}</SheetTitle>
                    <SheetDescription>
                      {t('Primary navigation')}
                    </SheetDescription>
                  </SheetHeader>
                  <nav
                    aria-label={t('Primary navigation')}
                    className='product-public-mobile-links'
                  >
                    {menuLinks.map((link, index) =>
                      renderLink(link, index, true)
                    )}
                    {navContent}
                  </nav>
                  {showAuthButtons ? (
                    <div className='product-public-mobile-footer'>
                      <Link
                        to={isAuthenticated ? '/dashboard' : '/sign-in'}
                        onClick={() => setMobileOpen(false)}
                        className='product-public-mobile-cta'
                      >
                        {isAuthenticated ? t('Go to Dashboard') : t('Sign in')}
                      </Link>
                    </div>
                  ) : null}
                </SheetContent>
              </Sheet>
            ) : null}
          </div>
        </nav>
      </div>

      <Dialog
        open={!!authPromptTarget}
        onOpenChange={(open) => {
          if (!open) closeAuthPrompt()
        }}
        title={t('Sign in required')}
        description={t('Please sign in to view {{module}}.', {
          module: authPromptTarget?.title || '',
        })}
        contentClassName='sm:max-w-md'
        contentHeight='auto'
        productScope
        closeLabel={t('Close')}
        footer={
          <>
            <Button variant='outline' onClick={closeAuthPrompt}>
              {t('Cancel')}
            </Button>
            <Button onClick={navigateToSignIn}>{t('Sign in now')}</Button>
          </>
        }
      >
        <div className='bg-muted/40 text-muted-foreground rounded-md px-3 py-2 text-sm'>
          {t('Redirecting to sign in in {{seconds}} seconds.', {
            seconds: authPromptSecondsLeft,
          })}
        </div>
      </Dialog>
    </header>
  )
}
