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
import { createElement, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type ResourceHeaderProps = {
  title: ReactNode
  eyebrow?: ReactNode
  description?: ReactNode
  meta?: ReactNode
  status?: ReactNode
  actions?: ReactNode
  headingLevel?: HeadingLevel
  compact?: boolean
  className?: string
}

const headingTags: Record<
  HeadingLevel,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
}

export function ResourceHeader(props: ResourceHeaderProps) {
  const headingTag = headingTags[props.headingLevel ?? 1]

  return (
    <header
      data-product-resource-header='true'
      data-product-compact={props.compact ? 'true' : undefined}
      className={cn(props.className)}
    >
      <div data-product-resource-header-row='true'>
        <div data-product-resource-heading='true'>
          {props.eyebrow ? (
            <p data-product-resource-eyebrow='true'>{props.eyebrow}</p>
          ) : null}
          {createElement(
            headingTag,
            { 'data-product-resource-title': 'true' },
            props.title
          )}
          {props.description ? (
            <p data-product-resource-description='true'>{props.description}</p>
          ) : null}
        </div>

        {props.actions ? (
          <div data-product-resource-actions='true'>{props.actions}</div>
        ) : null}
      </div>

      {props.status || props.meta ? (
        <div data-product-resource-meta='true'>
          {props.status ? (
            <span data-product-resource-status='true'>{props.status}</span>
          ) : null}
          {props.meta}
        </div>
      ) : null}
    </header>
  )
}
