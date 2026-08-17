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
import assert from 'node:assert/strict'
import { after, describe, test } from 'node:test'

import { Window } from 'happy-dom'

const domWindow = new Window()
const domGlobals = [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLButtonElement',
  'SVGElement',
  'Node',
  'Element',
  'Event',
  'FocusEvent',
  'MouseEvent',
  'CustomEvent',
  'MutationObserver',
  'ResizeObserver',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'getComputedStyle',
] as const

for (const key of domGlobals) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: domWindow[key],
  })
}

const { act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { createInstance } = await import('i18next')
const { I18nextProvider, initReactI18next } = await import('react-i18next')
const { InfrastructureMap } = await import('../components/infrastructure-map')
const reactTestGlobals = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}
reactTestGlobals.IS_REACT_ACT_ENVIRONMENT = true

const i18n = createInstance()
await i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        Client: 'Client',
        'Gateway Core': 'Gateway Core',
        'Live Routing': 'Live Routing',
        'Model Network': 'Model Network',
        'One Key': 'One Key',
        '+{{count}} Models': '+{{count}} Models',
      },
    },
  },
})

function MapHarness(props: React.ComponentProps<typeof InfrastructureMap>) {
  return (
    <I18nextProvider i18n={i18n}>
      <InfrastructureMap {...props} />
    </I18nextProvider>
  )
}

describe('InfrastructureMap accessibility', () => {
  after(() => {
    domWindow.close()
  })

  test('keeps provider controls inert before settlement and restores all controls after it', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)

    await act(async () => root.render(<MapHarness openingPhase='handoff' />))
    const controls = container.querySelector('[data-zzapi-model-controls]')
    const buttons = [...container.querySelectorAll('button')]
    assert.ok(controls)
    assert.equal(controls.hasAttribute('inert'), true)
    assert.equal(controls.getAttribute('aria-hidden'), 'true')
    assert.equal(buttons.length, 4)
    assert.ok(buttons.every((button) => button.tabIndex === -1))

    await act(async () => root.render(<MapHarness openingPhase='settle' />))
    assert.equal(controls.hasAttribute('inert'), false)
    assert.equal(controls.hasAttribute('aria-hidden'), false)
    assert.deepEqual(
      buttons.map((button) => button.textContent?.trim()),
      ['OpenAI', 'Claude', 'Gemini', 'Qwen']
    )
    assert.ok(buttons.every((button) => button.tabIndex === 0))
    assert.ok(
      buttons.every((button) => button.getAttribute('aria-pressed') === 'false')
    )

    await act(async () => root.unmount())
    container.remove()
  })

  test('preserves selection toggling and focus route feedback after settlement', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    await act(async () => root.render(<MapHarness openingPhase='ambient' />))

    const infrastructure = container.querySelector('.home-infrastructure')
    const openai = [...container.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'OpenAI'
    )
    const claude = [...container.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Claude'
    )
    assert.ok(infrastructure)
    assert.ok(openai)
    assert.ok(claude)

    await act(async () => openai.focus())
    assert.equal(infrastructure.getAttribute('data-active-model'), 'openai')
    assert.equal(openai.getAttribute('aria-pressed'), 'false')
    await act(async () => openai.blur())
    assert.equal(infrastructure.hasAttribute('data-active-model'), false)

    await act(async () => openai.click())
    assert.equal(openai.getAttribute('aria-pressed'), 'true')
    assert.equal(claude.getAttribute('aria-pressed'), 'false')
    assert.equal(infrastructure.getAttribute('data-active-model'), 'openai')
    await act(async () => openai.click())
    assert.equal(openai.getAttribute('aria-pressed'), 'false')
    assert.equal(infrastructure.hasAttribute('data-active-model'), false)

    const aggregate = container.querySelector('.zzapi-model-aggregate')
    assert.ok(aggregate)
    assert.equal(aggregate.textContent?.trim(), '+2 Models')
    assert.equal(aggregate.tagName, 'DIV')

    await act(async () => root.unmount())
    container.remove()
  })

  test('renders the route packet only for the desktop topology', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    await act(async () => root.render(<MapHarness openingPhase='ambient' />))

    const trails = [
      ...container.querySelectorAll<SVGPathElement>(
        '.zzapi-route-packet-trail'
      ),
    ]
    const heads = [
      ...container.querySelectorAll<SVGPathElement>('.zzapi-route-packet-head'),
    ]
    assert.equal(trails.length, 1)
    assert.equal(heads.length, 1)
    assert.deepEqual(
      trails.map((trail) => trail.getAttribute('d')),
      heads.map((head) => head.getAttribute('d'))
    )
    assert.ok(
      [...trails, ...heads].every(
        (path) => path.getAttribute('pathLength') === '1'
      )
    )

    assert.equal(container.querySelector('.zzapi-route-topology-mobile'), null)

    await act(async () => root.unmount())
    container.remove()
  })

  test('keeps the semantic order aligned with the mobile visual order', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    await act(async () => root.render(<MapHarness openingPhase='ambient' />))

    const client = container.querySelector('.zzapi-client-origin')
    const core = container.querySelector('.zzapi-gateway-core')
    const controls = container.querySelector('.zzapi-model-controls')
    assert.ok(client)
    assert.ok(core)
    assert.ok(controls)
    assert.ok(
      client.compareDocumentPosition(core) & Node.DOCUMENT_POSITION_FOLLOWING
    )
    assert.ok(
      core.compareDocumentPosition(controls) & Node.DOCUMENT_POSITION_FOLLOWING
    )

    await act(async () => root.unmount())
    container.remove()
  })
})
