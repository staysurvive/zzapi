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
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { isHttpUrl, isSafeInternalUrl } from '@/lib/content-format'

import { SignalSpine } from './signal-spine'

interface HomepageV5CtaProps {
  isAuthenticated: boolean
  docsLink: string | null
}

export function HomepageV5Cta(props: HomepageV5CtaProps) {
  const { t } = useTranslation()
  const primaryTarget = props.isAuthenticated ? '/dashboard' : '/sign-up'
  const primaryLabel = props.isAuthenticated
    ? t('Open Console')
    : t('Get Started')
  const docsTarget =
    props.docsLink &&
    (isHttpUrl(props.docsLink) || isSafeInternalUrl(props.docsLink))
      ? props.docsLink
      : 'https://docs.newapi.pro'

  return (
    <section
      className='home-v5-stage home-v5-cta'
      data-home-v5-stage='cta'
      aria-labelledby='home-v5-cta-title'
    >
      <SignalSpine branch='right' node='ring' />
      <div className='home-v5-cta__copy'>
        <h2 id='home-v5-cta-title'>{t('Ready to build?')}</h2>
        <p>{t('Start routing your requests through zzapi.')}</p>
      </div>
      <div className='home-v5-cta__actions'>
        <Button
          size='lg'
          className='home-v5-cta__primary'
          render={<Link to={primaryTarget} />}
        >
          {primaryLabel}
          <ArrowRight aria-hidden='true' />
        </Button>
        <Button
          size='lg'
          variant='outline'
          className='home-v5-cta__secondary'
          render={
            isHttpUrl(docsTarget) ? (
              <a href={docsTarget} target='_blank' rel='noopener noreferrer' />
            ) : (
              <Link to={docsTarget} />
            )
          }
        >
          <BookOpen aria-hidden='true' />
          {t('Read Docs')}
        </Button>
      </div>
    </section>
  )
}
