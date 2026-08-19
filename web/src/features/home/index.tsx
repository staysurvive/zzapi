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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { RichContent } from '@/components/rich-content'
import { SkipToMain } from '@/components/skip-to-main'
import { useTheme } from '@/context/theme-provider'
import { toIntlLocale } from '@/i18n/languages'
import { isLikelyHtml } from '@/lib/content-format'
import { useAuthStore } from '@/stores/auth-store'

import { Hero, HomepageV5Container, LandingEntrance } from './components'
import { useHomePageContent } from './hooks'
import { shouldRenderCustomHome, type OpeningPhase } from './types'

export function Home() {
  const { i18n, t } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { resolvedTheme } = useTheme()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user
  const { content, isUrl } = useHomePageContent()
  const initialContentRef = useRef(Boolean(content))
  const [openingPhase, setOpeningPhase] = useState<OpeningPhase>(() =>
    content ? 'ambient' : 'signal'
  )
  const landingLogo = '/landing-brand-core.png'
  const showCustomContent = shouldRenderCustomHome(
    content,
    initialContentRef.current,
    openingPhase
  )

  const syncIframePreferences = useCallback(() => {
    let iframeUrl: URL
    try {
      iframeUrl = new URL(content.trim())
    } catch {
      return
    }
    if (iframeUrl.protocol !== 'http:' && iframeUrl.protocol !== 'https:') {
      return
    }

    // The sandbox intentionally omits allow-same-origin, so the frame has an
    // opaque origin and cannot receive a concrete URL target. These messages
    // contain only non-sensitive display preferences.
    const targetOrigin = '*'

    try {
      iframeRef.current?.contentWindow?.postMessage(
        { themeMode: resolvedTheme },
        targetOrigin
      )
      iframeRef.current?.contentWindow?.postMessage(
        { lang: i18n.language },
        targetOrigin
      )
    } catch {
      // Cross-origin frames may reject access while navigating.
    }
  }, [content, i18n.language, resolvedTheme])

  useEffect(() => {
    if (isUrl) {
      syncIframePreferences()
    }
  }, [isUrl, syncIframePreferences])

  useLayoutEffect(() => {
    if (openingPhase === 'ambient') {
      delete document.documentElement.dataset.zzapiOpening
      delete document.documentElement.dataset.zzapiOpeningPhase
      return
    }

    document.documentElement.dataset.zzapiOpening = 'true'
    document.documentElement.dataset.zzapiOpeningPhase = openingPhase

    return () => {
      delete document.documentElement.dataset.zzapiOpening
      delete document.documentElement.dataset.zzapiOpeningPhase
    }
  }, [openingPhase])

  if (showCustomContent) {
    if (isUrl) {
      return (
        <PublicLayout showMainContainer={false}>
          {/*
            allow-top-navigation-by-user-activation: the custom home page URL is
            admin-configured (trusted); this lets its target="_top" nav/menu links
            navigate the top-level window on user click. The default sandbox blocks
            this on desktop, while some mobile browsers allow it via allow-popups,
            causing inconsistent behavior. This token only permits user-activated
            top-level navigation and does NOT grant same-origin access.
          */}
          <main>
            <iframe
              ref={iframeRef}
              src={content.trim()}
              className='h-screen w-full border-none'
              title={t('Custom Home Page')}
              sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation-by-user-activation'
              onLoad={syncIframePreferences}
            />
          </main>
        </PublicLayout>
      )
    }

    const contentIsHtml = isLikelyHtml(content)

    if (contentIsHtml) {
      return (
        <PublicLayout showMainContainer={false}>
          <main>
            <RichContent
              mode='html'
              htmlVariant='isolated'
              content={content}
              className='custom-home-content'
            />
          </main>
        </PublicLayout>
      )
    }

    return (
      <PublicLayout>
        <div className='mx-auto max-w-6xl px-4 py-8'>
          <RichContent
            mode='markdown'
            content={content}
            className='custom-home-content'
          />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout
      showMainContainer={false}
      siteName='zzapi'
      logo={
        <img
          src={landingLogo}
          alt=''
          className='size-full rounded-lg object-contain'
        />
      }
    >
      {openingPhase === 'ambient' && <SkipToMain />}
      <main
        id='main-content'
        tabIndex={-1}
        lang={toIntlLocale(i18n.resolvedLanguage ?? i18n.language)}
      >
        {openingPhase !== 'ambient' && (
          <LandingEntrance
            logo={landingLogo}
            phase={openingPhase}
            onPhaseChange={setOpeningPhase}
            onComplete={() => setOpeningPhase('ambient')}
          />
        )}
        <Hero
          isAuthenticated={isAuthenticated}
          logo={landingLogo}
          openingPhase={openingPhase}
        />
        <div className='home-below-fold' data-home-v5='true'>
          <HomepageV5Container
            isAuthenticated={isAuthenticated}
            openingPhase={openingPhase}
          />
          <Footer />
        </div>
      </main>
    </PublicLayout>
  )
}
