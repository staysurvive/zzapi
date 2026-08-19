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
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorState } from '@/components/error-state'
import {
  ProductBrandLogo,
  ProductShell,
  PublicLayout,
} from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { Skeleton } from '@/components/ui/skeleton'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'

import { getAboutContent } from './api'

function AboutPublicLayout(props: { children: ReactNode }) {
  return (
    <PublicLayout showMainContainer={false}>
      <ProductShell surface='public' className='about-page-shell'>
        <main id='main-content' tabIndex={-1}>
          {props.children}
        </main>
      </ProductShell>
    </PublicLayout>
  )
}

function EmptyAboutState() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <div className='about-page relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-12 sm:px-8'>
      <img
        aria-hidden
        src='/product-brand/about-route-accent.png'
        alt=''
        className='about-route-accent pointer-events-none absolute top-1/2 right-[-3rem] hidden size-[22rem] -translate-y-1/2 select-none lg:block'
      />
      <div className='max-w-3xl space-y-7 text-center'>
        <div className='mx-auto size-24 sm:size-28'>
          <ProductBrandLogo />
        </div>
        <div className='space-y-3'>
          <p className='text-primary text-xs font-semibold'>zzapi</p>
          <h1 className='text-3xl leading-tight font-semibold sm:text-4xl'>
            {t('One API for')}{' '}
            <span className='text-primary'>{t('Every Model')}</span>
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed'>
            {t(
              'Unified access, intelligent routing, and usage control for production AI.'
            )}
          </p>
          <p className='text-muted-foreground/75 mx-auto max-w-xl text-sm leading-relaxed'>
            <span className='text-foreground block font-medium'>
              {t('No About Content Set')}
            </span>
            <span className='mt-1 block'>
              {t(
                'The administrator has not configured any about content yet. You can set it in the settings page, supporting HTML or URL.'
              )}
            </span>
          </p>
        </div>
        <div className='space-y-4 border-t pt-6 text-sm'>
          <p>
            {t('New API Project Repository:')}{' '}
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('https://github.com/QuantumNous/new-api')}
            </a>
          </p>
          <p className='text-muted-foreground'>
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('NewAPI')}
            </a>{' '}
            © {currentYear}{' '}
            <a
              href='https://github.com/QuantumNous'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('QuantumNous')}
            </a>{' '}
            {t('| Based on')}{' '}
            <a
              href='https://github.com/songquanpeng/one-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('One API')}
            </a>{' '}
            © 2023{' '}
            <a
              href='https://github.com/songquanpeng'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('JustSong')}
            </a>
          </p>
          <p className='text-muted-foreground'>
            {t('This project must be used in compliance with the')}{' '}
            <a
              href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('AGPL v3.0 License')}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export function About() {
  const { t } = useTranslation()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['about-content'],
    queryFn: getAboutContent,
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)

  if (isLoading) {
    return (
      <AboutPublicLayout>
        <div className='about-page mx-auto flex max-w-4xl flex-col gap-4 px-4 py-12 sm:px-6'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </AboutPublicLayout>
    )
  }

  if (error) {
    return (
      <AboutPublicLayout>
        <div className='about-page mx-auto max-w-4xl px-4 py-12 sm:px-6'>
          <ErrorState
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        </div>
      </AboutPublicLayout>
    )
  }

  if (!hasContent) {
    return (
      <AboutPublicLayout>
        <EmptyAboutState />
      </AboutPublicLayout>
    )
  }

  if (isUrl) {
    return (
      <AboutPublicLayout>
        <iframe
          src={rawContent}
          className='h-[calc(100vh-3.5rem)] w-full border-0'
          title={t('About')}
          sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
        />
      </AboutPublicLayout>
    )
  }

  if (contentIsHtml) {
    return (
      <AboutPublicLayout>
        <RichContent
          mode='html'
          htmlVariant='isolated'
          content={rawContent}
          className='about-page prose-neutral dark:prose-invert max-w-none'
        />
      </AboutPublicLayout>
    )
  }

  return (
    <AboutPublicLayout>
      <div className='about-page mx-auto max-w-6xl px-4 py-8 sm:px-6'>
        <RichContent
          mode='markdown'
          content={rawContent}
          className='prose-neutral dark:prose-invert max-w-none'
        />
      </div>
    </AboutPublicLayout>
  )
}
