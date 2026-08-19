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
import { describe, expect, test } from 'vitest'

import type { QuotaDataItem } from '../../types'
import {
  getDashboardChartColors,
  getDashboardChartStyle,
  processChartData,
  processUserChartData,
} from '../charts'

const chartRows: QuotaDataItem[] = [
  {
    username: 'alice',
    model_name: 'gpt-4.1',
    created_at: 1_725_235_200,
    quota: 100,
    count: 2,
  },
  {
    username: 'bob',
    model_name: 'claude-4-sonnet',
    created_at: 1_725_321_600,
    quota: 75,
    count: 1,
  },
]

describe('dashboard chart theme', () => {
  test('preserves the legacy palette and black mark stroke in light mode', () => {
    const chartStyle = getDashboardChartStyle('light', 'default')
    const result = processChartData(
      chartRows,
      'day',
      undefined,
      undefined,
      chartStyle
    )

    expect(chartStyle.colorPalette).toBeUndefined()
    expect(getDashboardChartColors(3)).toEqual([
      '#1664FF',
      '#1AC6FF',
      '#FF8A00',
      '#3CC780',
      '#7442D4',
      '#FFC400',
      '#304D77',
      '#B48DEB',
      '#009488',
      '#FF7DDA',
    ])
    expect(result.spec_pie.color.range).toEqual(getDashboardChartColors(3))
    expect(result.spec_pie.pie.state.hover.stroke).toBe('#000')
    expect(result.spec_line.bar.state.hover.stroke).toBe('#000')
  })

  test('keeps explicit dark presets on the legacy chart behavior', () => {
    const chartStyle = getDashboardChartStyle('dark', 'anthropic')

    expect(chartStyle.colorPalette).toBeUndefined()
    expect(chartStyle.markHoverStroke).toBe('#000')
    expect(chartStyle.flow.labelFill).toBe('#475569')
  })

  test('uses muted premium colors and silver mark strokes in default dark mode', () => {
    const chartStyle = getDashboardChartStyle('dark', 'default')
    const modelResult = processChartData(
      chartRows,
      'day',
      undefined,
      undefined,
      chartStyle
    )
    const userResult = processUserChartData(
      chartRows,
      'day',
      undefined,
      10,
      chartStyle
    )

    expect(chartStyle.colorPalette?.slice(0, 4)).toEqual([
      '#D3D6DB',
      '#B8BDC4',
      '#9DA5A7',
      '#B7AFA6',
    ])
    expect(modelResult.spec_pie.color.range.slice(0, 3)).toEqual([
      '#D3D6DB',
      '#B8BDC4',
      '#9DA5A7',
    ])
    expect(modelResult.spec_rank_bar.bar.state.hover.stroke).toBe(
      'rgba(244, 246, 249, 0.88)'
    )
    expect(userResult.spec_user_rank.color.specified).toEqual({
      alice: '#D3D6DB',
      bob: '#B8BDC4',
    })
    expect(userResult.spec_user_rank.bar.state.hover.stroke).toBe(
      'rgba(244, 246, 249, 0.88)'
    )
  })
})
