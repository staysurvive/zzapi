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

import { cn } from '@/lib/utils'

export type MetricStripItem = {
  id: string
  label: ReactNode
  value: ReactNode
  supportingText?: ReactNode
  trend?: ReactNode
  status?: ReactNode
}

export type MetricStripProps = {
  items: MetricStripItem[]
  layout?: 'auto' | 'horizontal' | 'stack'
  className?: string
}

export function MetricStrip(props: MetricStripProps) {
  return (
    <dl
      data-product-metric-strip='true'
      data-product-layout={props.layout ?? 'auto'}
      className={cn(props.className)}
    >
      {props.items.map((item) => (
        <div data-product-metric='true' key={item.id}>
          <dt data-product-metric-label='true'>{item.label}</dt>
          <dd data-product-metric-value='true'>{item.value}</dd>
          {item.supportingText ? (
            <dd data-product-metric-supporting='true'>{item.supportingText}</dd>
          ) : null}
          {item.trend || item.status ? (
            <dd data-product-metric-status='true'>
              {item.trend}
              {item.trend && item.status ? ' · ' : null}
              {item.status}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  )
}
