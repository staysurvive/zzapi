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
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import type { HomepageModelSignal } from '../../../lib/homepage-v5-data'
import { HomepageValueTabs } from '../homepage-value-tabs'

const model: HomepageModelSignal = {
  modelName: 'alpha-model',
  catalogVendor: 'Example catalog',
  endpointMethod: 'POST',
  endpointPath: '/v1/chat/completions',
  pricingMode: 'usage-based',
  cachePricingReported: true,
  groupRuleReported: false,
  inputPricingReported: true,
  outputPricingReported: true,
  traffic: 'observed',
  observedMetrics: {
    avgLatencyMs: 241,
    successRate: 98.75,
    avgTps: 32.5,
  },
}

describe('Homepage V5 value tabs', () => {
  test('uses vertical manual activation and keeps a single selected panel', async () => {
    const user = userEvent.setup()
    render(
      <HomepageValueTabs
        pricingState='current'
        performanceState='current'
        model={model}
      />
    )

    const tablist = screen.getByRole('tablist', { name: 'Gateway value views' })
    const usage = screen.getByRole('tab', { name: /Usage clarity/i })
    const routing = screen.getByRole('tab', { name: /Routing control/i })
    const runtime = screen.getByRole('tab', { name: /Runtime signals/i })

    expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    expect(usage).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

    usage.focus()
    await user.keyboard('{ArrowDown}')
    expect(routing).toHaveFocus()
    expect(usage).toHaveAttribute('aria-selected', 'true')
    expect(routing).toHaveAttribute('aria-selected', 'false')

    await user.keyboard('{Enter}')
    expect(routing).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Policy remains explicit')).toBeInTheDocument()

    await user.keyboard('{End}')
    expect(runtime).toHaveFocus()
    expect(routing).toHaveAttribute('aria-selected', 'true')
    await user.keyboard(' ')
    expect(runtime).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

    await user.keyboard('{Home}')
    expect(usage).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(usage).toHaveAttribute('aria-selected', 'true')
  })

  test('reports recent metrics as observations rather than an SLA', async () => {
    const user = userEvent.setup()
    render(
      <HomepageValueTabs
        pricingState='current'
        performanceState='current'
        model={model}
      />
    )

    await user.click(screen.getByRole('tab', { name: /Runtime signals/i }))
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveTextContent('Observed requests · last 24h')
    expect(panel).toHaveTextContent('241 ms')
    expect(panel).toHaveTextContent('98.75%')
    expect(panel).toHaveTextContent(
      'Recent observations are not an uptime or SLA statement.'
    )
  })

  test('renders no-sample copy without zero-value stand-ins', async () => {
    const user = userEvent.setup()
    render(
      <HomepageValueTabs
        pricingState='current'
        performanceState='empty'
        model={{ ...model, traffic: 'no-recent-sample', observedMetrics: null }}
      />
    )

    await user.click(screen.getByRole('tab', { name: /Runtime signals/i }))
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveTextContent('No recent sample')
    expect(panel).not.toHaveTextContent('0 ms')
    expect(panel).not.toHaveTextContent('0%')
  })
})
