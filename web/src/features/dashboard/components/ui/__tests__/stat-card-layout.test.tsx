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
import { Activity } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { StatCard } from '../stat-card'

describe('StatCard responsive title', () => {
  it('reserves two mobile lines for long metric labels', () => {
    render(
      <StatCard
        title='Last 24 hours usage'
        value='$12.34'
        description='Usage over the latest day'
        icon={Activity}
        compactMobile
      />
    )

    expect(screen.getByText('Last 24 hours usage')).toHaveClass(
      'line-clamp-2',
      'min-h-[2.5em]',
      'text-balance'
    )
  })
})
