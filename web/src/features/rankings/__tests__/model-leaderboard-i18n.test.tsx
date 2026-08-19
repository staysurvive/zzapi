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
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ModelLeaderboard } from '../components/model-leaderboard'

vi.mock('@tanstack/react-router', () => ({
  Link: (props: { children: ReactNode }) => <a href='#'>{props.children}</a>,
}))

vi.mock('@/lib/lobe-icon', () => ({
  getLobeIcon: () => <span aria-hidden='true' />,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'by' ? 'translated-by' : key),
  }),
}))

describe('ModelLeaderboard localization', () => {
  it('renders the model author prefix through i18n', () => {
    render(
      <ModelLeaderboard
        rows={[
          {
            rank: 1,
            model_name: 'gpt-test',
            vendor: 'OpenAI',
            category: 'all',
            total_tokens: 100,
            share: 1,
            growth_pct: 10,
          },
        ]}
      />
    )

    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === 'P' &&
          element.textContent === 'translated-by openai'
      )
    ).toBeVisible()
  })
})
