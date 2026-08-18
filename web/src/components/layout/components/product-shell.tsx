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
import type { ReactNode } from 'react'

import '@/styles/product-shell.css'

import { cn } from '@/lib/utils'

export type ProductSurface = 'public' | 'auth' | 'workspace'

export type ProductShellProps = {
  children: ReactNode
  surface?: ProductSurface
  className?: string
  motion?: 'enter' | 'none'
}

/**
 * Provides the product-only canvas and token scope without owning a landmark.
 * Layouts remain responsible for deciding where the page's single main lives.
 */
export function ProductShell(props: ProductShellProps) {
  return (
    <div
      data-zzapi-product='true'
      data-product-surface={props.surface ?? 'public'}
      data-product-motion={props.motion ?? 'enter'}
      className={cn('product-shell min-h-0', props.className)}
    >
      {props.children}
    </div>
  )
}
