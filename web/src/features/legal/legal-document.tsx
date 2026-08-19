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
import { FileWarning } from 'lucide-react'
import {
  memo,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorState } from '@/components/error-state'
import { ProductBrandLogo, PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'
import { cn } from '@/lib/utils'

import type { LegalDocumentResponse } from './types'

type LegalDocumentProps = {
  title: string
  queryKey: string
  fetchDocument: () => Promise<LegalDocumentResponse>
  emptyMessage: string
}

type LegalSection = {
  id: string
  label: string
  level: number
}

const legalHeadingSelector = 'h1, h2, h3, h4, h5, h6'
const legalHeadingClasses = [
  'scroll-mt-24',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring/40',
  'focus-visible:ring-offset-4',
]

type LegalContentRoot = HTMLElement | ShadowRoot

function getLegalContentRoots(container: HTMLElement): LegalContentRoot[] {
  const roots: LegalContentRoot[] = [container]

  container.querySelectorAll<HTMLElement>('*').forEach((element) => {
    if (element.shadowRoot) {
      roots.push(element.shadowRoot)
    }
  })

  return roots
}

function createLegalSectionId(label: string, usedIds: Set<string>): string {
  const baseId =
    label
      .normalize('NFKD')
      .toLowerCase()
      .replaceAll(/[^\p{L}\p{N}]+/gu, '-')
      .replaceAll(/^-+|-+$/g, '') || 'section'
  const prefixedId = `legal-${baseId}`
  let id = prefixedId
  let occurrence = 2

  while (usedIds.has(id)) {
    id = `${prefixedId}-${occurrence}`
    occurrence += 1
  }

  usedIds.add(id)
  return id
}

function decodeHashSectionId(hash: string): string {
  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
}

function getHashSectionId(): string {
  return decodeHashSectionId(window.location.hash.slice(1))
}

function focusLegalSection(target: HTMLElement): void {
  target.focus({ preventScroll: true })
  target.scrollIntoView?.({ block: 'start' })
}

function focusLegalSectionById(
  targets: ReadonlyMap<string, HTMLElement>,
  id: string
): boolean {
  const target = targets.get(id)
  if (!target) {
    return false
  }

  focusLegalSection(target)
  return true
}

function navigateToLegalSection(
  targets: ReadonlyMap<string, HTMLElement>,
  id: string
): boolean {
  if (!focusLegalSectionById(targets, id)) {
    return false
  }

  const nextHash = `#${encodeURIComponent(id)}`
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, '', nextHash)
  }

  return true
}

function ProductLegalLayout(props: { children: ReactNode }) {
  return (
    <PublicLayout
      appearance='product'
      showMainContainer={false}
      logo={<ProductBrandLogo />}
      siteName='zzapi'
    >
      {props.children}
    </PublicLayout>
  )
}

// Keep the sanitized DOM stable while the parent renders its derived outline.
const LegalRichContent = memo(function LegalRichContent(props: {
  content: string
  contentIsHtml: boolean
}) {
  return (
    <RichContent
      mode={props.contentIsHtml ? 'html' : 'markdown'}
      htmlVariant={props.contentIsHtml ? 'isolated' : undefined}
      content={props.content}
      className={cn(
        props.contentIsHtml && 'legal-page',
        !props.contentIsHtml && 'prose-neutral dark:prose-invert max-w-none'
      )}
    />
  )
})

function LegalConfiguredContent(props: {
  content: string
  contentIsHtml: boolean
  title: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionTargetsRef = useRef(new Map<string, HTMLElement>())
  const lastHandledHashRef = useRef<string | null>(null)
  const [sections, setSections] = useState<LegalSection[]>([])

  useLayoutEffect(() => {
    const container = contentRef.current
    if (!container) {
      return
    }

    const usedIds = new Set<string>()
    const cleanups: Array<() => void> = []
    const nextTargets = new Map<string, HTMLElement>()
    const nextSections: LegalSection[] = []
    const contentRoots = getLegalContentRoots(container)

    contentRoots.forEach((root) => {
      root
        .querySelectorAll<HTMLElement>(legalHeadingSelector)
        .forEach((heading) => {
          const label = heading.textContent?.trim()
          if (!label) {
            return
          }

          const originalId = heading.getAttribute('id')
          const originalTabIndex = heading.getAttribute('tabindex')
          const retainedId = originalId?.trim()
          const id =
            retainedId && !usedIds.has(retainedId)
              ? retainedId
              : createLegalSectionId(label, usedIds)

          usedIds.add(id)
          heading.id = id
          heading.tabIndex = -1
          const addedHeadingClasses = legalHeadingClasses.filter(
            (className) => !heading.classList.contains(className)
          )
          heading.classList.add(...addedHeadingClasses)

          nextTargets.set(id, heading)
          nextSections.push({
            id,
            label,
            level: Number(heading.tagName.slice(1)),
          })

          cleanups.push(() => {
            if (originalId == null) {
              heading.removeAttribute('id')
            } else {
              heading.setAttribute('id', originalId)
            }

            if (originalTabIndex == null) {
              heading.removeAttribute('tabindex')
            } else {
              heading.setAttribute('tabindex', originalTabIndex)
            }

            addedHeadingClasses.forEach((className) =>
              heading.classList.remove(className)
            )
          })
        })

      root.querySelectorAll<HTMLElement>('pre').forEach((element) => {
        const hadMaxWidth = element.classList.contains('max-w-full')
        const hadOverflow = element.classList.contains('overflow-x-auto')
        element.classList.add('max-w-full', 'overflow-x-auto')

        cleanups.push(() => {
          if (!hadMaxWidth) {
            element.classList.remove('max-w-full')
          }
          if (!hadOverflow) {
            element.classList.remove('overflow-x-auto')
          }
        })
      })

      root.querySelectorAll<HTMLTableElement>('table').forEach((table) => {
        const parent = table.parentNode
        if (!parent) {
          return
        }

        const scrollContainer = document.createElement('div')
        scrollContainer.className =
          'legal-table-scroll min-w-0 w-full max-w-full overflow-x-auto'
        scrollContainer.setAttribute('data-legal-table-scroll', '')
        table.before(scrollContainer)
        scrollContainer.append(table)

        cleanups.push(() => {
          if (table.parentNode === scrollContainer) {
            scrollContainer.replaceWith(table)
          }
        })
      })
    })

    sectionTargetsRef.current = nextTargets
    setSections(nextSections)

    const focusCurrentHash = () => {
      const currentHash = window.location.hash
      if (currentHash === lastHandledHashRef.current) {
        return
      }

      lastHandledHashRef.current = currentHash
      focusLegalSectionById(nextTargets, getHashSectionId())
    }

    const handleContentAnchorClick = (event: Event) => {
      if (!(event.target instanceof Element)) {
        return
      }

      const mouseEvent = event as globalThis.MouseEvent
      if (
        mouseEvent.button !== 0 ||
        mouseEvent.metaKey ||
        mouseEvent.ctrlKey ||
        mouseEvent.shiftKey ||
        mouseEvent.altKey
      ) {
        return
      }

      const anchor = event.target.closest('a[href]')
      const href = anchor?.getAttribute('href')
      if (!href?.startsWith('#')) {
        return
      }

      const targetId = decodeHashSectionId(href.slice(1))
      if (!nextTargets.has(targetId)) {
        return
      }

      event.preventDefault()
      navigateToLegalSection(nextTargets, targetId)
      lastHandledHashRef.current = window.location.hash
    }

    contentRoots.forEach((root) => {
      root.addEventListener('click', handleContentAnchorClick)
    })
    window.addEventListener('hashchange', focusCurrentHash)
    window.addEventListener('popstate', focusCurrentHash)
    focusCurrentHash()

    cleanups.push(() => {
      contentRoots.forEach((root) => {
        root.removeEventListener('click', handleContentAnchorClick)
      })
      window.removeEventListener('hashchange', focusCurrentHash)
      window.removeEventListener('popstate', focusCurrentHash)
      sectionTargetsRef.current = new Map()
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      sectionTargetsRef.current = new Map()
      lastHandledHashRef.current = null
    }
  }, [props.content, props.contentIsHtml])

  const firstLevel =
    sections.length > 0
      ? Math.min(...sections.map((section) => section.level))
      : 1

  const handleSectionClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    section: LegalSection
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    if (navigateToLegalSection(sectionTargetsRef.current, section.id)) {
      event.preventDefault()
      lastHandledHashRef.current = window.location.hash
    }
  }

  return (
    <div
      className='legal-page mx-auto w-full max-w-6xl px-4 py-12 sm:px-6'
      data-legal-reading
    >
      <h1 className='text-3xl font-semibold'>{props.title}</h1>

      <div
        className={cn(
          'mt-6 min-w-0',
          sections.length > 0 &&
            'grid items-start gap-8 lg:grid-cols-[13rem_minmax(0,45rem)] lg:justify-center'
        )}
      >
        {sections.length > 0 && (
          <nav
            aria-label={props.title}
            className='border-border overflow-x-auto border-b pb-3 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-x-hidden lg:overflow-y-auto lg:border-b-0 lg:border-l lg:py-1 lg:pb-0'
            data-legal-navigation
          >
            <ol className='flex min-w-max gap-1 lg:min-w-0 lg:flex-col'>
              {sections.map((section) => (
                <li
                  key={section.id}
                  className={cn(
                    'max-w-56 shrink-0 lg:max-w-none',
                    section.level > firstLevel && 'lg:ps-3'
                  )}
                >
                  <a
                    href={`#${encodeURIComponent(section.id)}`}
                    className='text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 block rounded-sm px-3 py-2 text-sm leading-snug break-words transition-colors focus-visible:ring-2 focus-visible:outline-none'
                    onClick={(event) => handleSectionClick(event, section)}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          ref={contentRef}
          className={cn(
            'min-w-0 max-w-3xl [overflow-wrap:anywhere]',
            sections.length === 0 && 'mx-auto'
          )}
          data-legal-content
        >
          <LegalRichContent
            content={props.content}
            contentIsHtml={props.contentIsHtml}
          />
        </div>
      </div>
    </div>
  )
}

export function LegalDocument({
  title,
  queryKey,
  fetchDocument,
  emptyMessage,
}: LegalDocumentProps) {
  const { t } = useTranslation()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchDocument,
    staleTime: 10 * 60 * 1000,
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)
  const success = data?.success ?? false

  if (isLoading) {
    return (
      <ProductLegalLayout>
        <div className='legal-page mx-auto flex max-w-4xl flex-col gap-4 px-4 py-12 sm:px-6'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </ProductLegalLayout>
    )
  }

  if (error) {
    return (
      <ProductLegalLayout>
        <div className='legal-page mx-auto max-w-4xl px-4 py-12 sm:px-6'>
          <ErrorState
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        </div>
      </ProductLegalLayout>
    )
  }

  if (!success || !hasContent) {
    return (
      <ProductLegalLayout>
        <div className='legal-page mx-auto max-w-2xl px-4 py-12 sm:px-6'>
          <Card className='rounded-lg border-dashed'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <div className='bg-muted rounded-lg p-2'>
                <FileWarning className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='space-y-1'>
                <h1 className='text-lg font-semibold'>{title}</h1>
                <p className='text-muted-foreground text-sm'>
                  {data?.message || emptyMessage}
                </p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ProductLegalLayout>
    )
  }

  if (isUrl) {
    return (
      <ProductLegalLayout>
        <div className='legal-page mx-auto max-w-2xl px-4 py-12 sm:px-6'>
          <Card className='rounded-lg'>
            <CardHeader>
              <h1 className='text-lg font-semibold'>{title}</h1>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground text-sm'>
                {t(
                  'The administrator configured an external link for this document.'
                )}
              </p>
              <Button
                render={
                  <a
                    href={rawContent}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                }
              >
                {t('View document')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProductLegalLayout>
    )
  }

  return (
    <ProductLegalLayout>
      <LegalConfiguredContent
        content={rawContent}
        contentIsHtml={contentIsHtml}
        title={title}
      />
    </ProductLegalLayout>
  )
}
