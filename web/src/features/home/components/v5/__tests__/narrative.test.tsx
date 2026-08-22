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
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { describe, expect, test, vi } from 'vitest'

import type { HomepageModelSignal } from '../../../lib/homepage-v5-data'
import { HomepageV5 } from '../homepage-v5'

vi.mock('@tanstack/react-router', () => ({
  Link: forwardRef<
    HTMLAnchorElement,
    AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
  >((props, ref) => {
    const { to, ...anchorProps } = props
    return <a ref={ref} href={to} {...anchorProps} />
  }),
}))

const model: HomepageModelSignal = {
  modelName: 'alpha-model',
  catalogVendor: 'Example catalog',
  endpointType: 'openai',
  endpointMethod: 'POST',
  endpointPath: '/v1/chat/completions',
  pricingMode: 'usage-based',
  cachePricingReported: true,
  groupRuleReported: true,
  inputPricingReported: true,
  outputPricingReported: true,
  traffic: 'observed',
  observedMetrics: {
    avgLatencyMs: 241,
    successRate: 98.75,
    avgTps: 32.5,
  },
}

const alternateModel: HomepageModelSignal = {
  ...model,
  modelName: 'beta-model',
  catalogVendor: null,
  traffic: 'no-recent-sample',
  observedMetrics: null,
}

describe('Homepage V5 narrative', () => {
  test('keeps the five product stages in the selected narrative order', () => {
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model, alternateModel]}
        remainingModelCount={4}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink='/docs'
      />
    )

    const stages = screen
      .getAllByRole('region')
      .map((stage) => stage.getAttribute('data-home-v5-stage'))
    expect(stages).toEqual([
      'request-corridor',
      'catalog',
      'value-tabs',
      'developer-integration',
      'cta',
    ])
    expect(
      document.querySelector('[data-motion-ready="true"]')
    ).toBeInTheDocument()
  })

  test('keeps the catalog on one local connector instead of layering global branches', () => {
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model, alternateModel]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='<YOUR_BASE_URL>'
        docsLink={null}
      />
    )

    const catalog = document.querySelector('[data-home-v5-stage="catalog"]')
    const spine = catalog?.querySelector('.home-v5-signal-spine')
    expect(spine).toHaveAttribute('data-branch', 'none')
    expect(spine).toHaveAttribute('data-node', 'quiet')
    const catalogModels = catalog?.querySelectorAll<HTMLElement>(
      '.home-v5-catalog__model'
    )
    const origins = catalog?.querySelectorAll<HTMLElement>(
      '.home-v5-catalog__origin'
    )
    expect(origins).toHaveLength(1)
    expect(catalogModels?.[0]).toContainElement(origins?.[0] ?? null)
    expect(catalog?.querySelectorAll('.home-v5-catalog__route')).toHaveLength(2)
  })

  test('keeps every stage visible when IntersectionObserver is unavailable', async () => {
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='empty'
        performanceState='empty'
        catalogPreview={[]}
        remainingModelCount={0}
        selectedModel={null}
        selectedModelName={null}
        onSelectModel={vi.fn()}
        baseUrl='<YOUR_BASE_URL>'
        docsLink={null}
      />
    )

    await waitFor(() => {
      for (const stage of screen.getAllByRole('region')) {
        expect(stage).not.toHaveAttribute('data-reveal-pending')
      }
    })
  })

  test('renders the request path as an ordered five-stage process', () => {
    const isAuthenticated = true
    render(
      <HomepageV5
        isAuthenticated={isAuthenticated}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink='https://docs.example'
      />
    )

    const corridor = document.querySelector(
      '[data-home-v5-stage="request-corridor"]'
    )
    expect(corridor).not.toBeNull()
    const steps = within(corridor as HTMLElement).getAllByRole('listitem')
    expect(steps).toHaveLength(5)
    expect(steps.map((step) => step.getAttribute('data-step'))).toEqual([
      'client',
      'gateway',
      'policy',
      'model',
      'response',
    ])
  })

  test('exposes catalog selection as pressed buttons without changing the page', () => {
    const onSelectModel = vi.fn()
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model, alternateModel]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={onSelectModel}
        baseUrl='<YOUR_BASE_URL>'
        docsLink={null}
      />
    )

    const selected = screen.getByRole('button', { name: /alpha-model/i })
    const alternate = screen.getByRole('button', { name: /beta-model/i })
    expect(selected).toHaveAttribute('aria-pressed', 'true')
    expect(alternate).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(alternate)
    expect(onSelectModel).toHaveBeenCalledWith('beta-model')
  })

  test('labels fixed model data as a demonstration', async () => {
    const user = userEvent.setup()
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='demo'
        performanceState='demo'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    expect(screen.getByText('Demo catalog')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /Stable direct access/i }))
    expect(screen.getByText('Stable access path')).toBeInTheDocument()
  })

  test('does not invent a docs destination when no docs link is configured', () => {
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    expect(
      screen.queryByRole('link', { name: /Read Docs/i })
    ).not.toBeInTheDocument()
  })

  test('builds the developer example from the real endpoint and placeholders', () => {
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    const example = screen.getByLabelText('cURL example')
    expect(example).toHaveTextContent(
      'https://gateway.example/v1/chat/completions'
    )
    expect(example).toHaveTextContent('$ZZAPI_KEY')
    expect(example).toHaveTextContent(
      `'${JSON.stringify({ model: 'alpha-model', messages: [{ role: 'user', content: 'Hello' }] })}`
    )
    expect(example).toHaveTextContent('alpha-model')
    expect(screen.getByRole('tab', { name: 'cURL' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(document.body).not.toHaveTextContent(/verified|official provider/i)
  })

  test('switches the developer example without changing its request contract', async () => {
    const user = userEvent.setup()
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    await user.click(screen.getByRole('tab', { name: 'Python' }))
    const pythonExample = screen.getByLabelText('Python example')
    expect(pythonExample).toHaveTextContent('os.environ["ZZAPI_KEY"]')
    expect(pythonExample).toHaveTextContent('requests.post')
    expect(pythonExample).toHaveTextContent('alpha-model')

    await user.click(screen.getByRole('tab', { name: 'Node.js' }))
    const nodeExample = screen.getByLabelText('Node.js example')
    expect(nodeExample).toHaveTextContent('fetch')
    expect(nodeExample).toHaveTextContent('/v1/chat/completions')
  })

  test('supports arrow and boundary keyboard navigation between code languages', async () => {
    const user = userEvent.setup()
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    const curlTab = screen.getByRole('tab', { name: 'cURL' })
    const nodeTab = screen.getByRole('tab', { name: 'Node.js' })
    curlTab.focus()
    await user.keyboard('{ArrowLeft}')
    expect(nodeTab).toHaveFocus()
    expect(nodeTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(curlTab).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'cURL' })).toHaveAttribute(
      'aria-labelledby',
      curlTab.id
    )
  })

  test('does not offer a chat snippet for a non-chat endpoint', () => {
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[{ ...model, endpointType: 'gemini' }]}
        remainingModelCount={0}
        selectedModel={{ ...model, endpointType: 'gemini' }}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    expect(
      screen.getByText('Compatible request example unavailable')
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Copy code')).not.toBeInTheDocument()
  })

  test('provides a polite copy confirmation for the developer example', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='current'
        performanceState='current'
        catalogPreview={[model]}
        remainingModelCount={0}
        selectedModel={model}
        selectedModelName={model.modelName}
        onSelectModel={vi.fn()}
        baseUrl='https://gateway.example'
        docsLink={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(writeText).toHaveBeenCalledOnce()
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Code copied' })
      ).toBeInTheDocument()
    })
    expect(screen.getByText('Code copied')).toBeInTheDocument()
  })

  test('uses explicit empty-state language instead of fabricated models or metrics', async () => {
    const user = userEvent.setup()
    render(
      <HomepageV5
        isAuthenticated={false}
        openingPhase='ambient'
        pricingState='empty'
        performanceState='empty'
        catalogPreview={[]}
        remainingModelCount={0}
        selectedModel={null}
        selectedModelName={null}
        onSelectModel={vi.fn()}
        baseUrl='<YOUR_BASE_URL>'
        docsLink={null}
      />
    )

    expect(screen.getAllByText('Catalog not currently published')).toHaveLength(
      2
    )
    await user.click(screen.getByRole('tab', { name: /Refund assurance/i }))
    expect(screen.getByText('Refund received')).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent(/99\.99|100%/i)
  })
})
