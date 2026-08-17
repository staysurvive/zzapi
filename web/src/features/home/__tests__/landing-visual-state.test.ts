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
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import { Window } from 'happy-dom'

const landingStyles = readFileSync(
  new URL('../../../styles/index.css', import.meta.url),
  'utf8'
)

test('hides the aperture planes before revealing Hero copy during settlement', () => {
  const domWindow = new Window()

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const opening = domWindow.document.createElement('div')
    opening.className = 'zzapi-opening zzapi-opening--handoff'
    opening.dataset.openingPhase = 'handoff'
    const plane = domWindow.document.createElement('div')
    plane.className = 'zzapi-opening-plane zzapi-opening-plane-a'
    opening.append(plane)

    const hero = domWindow.document.createElement('section')
    hero.className = 'home-hero'
    hero.dataset.openingPhase = 'handoff'
    const copy = domWindow.document.createElement('div')
    copy.className = 'home-hero-copy'
    hero.append(copy)

    domWindow.document.body.append(opening, hero)

    assert.notEqual(domWindow.getComputedStyle(plane).visibility, 'hidden')
    assert.equal(domWindow.getComputedStyle(copy).visibility, 'hidden')

    opening.dataset.openingPhase = 'settle'
    hero.dataset.openingPhase = 'settle'

    assert.equal(domWindow.getComputedStyle(plane).visibility, 'hidden')
    assert.notEqual(domWindow.getComputedStyle(copy).visibility, 'hidden')
  } finally {
    domWindow.close()
  }
})

test('hides redundant routing metadata at mobile viewport widths', () => {
  const domWindow = new Window({ width: 390, height: 844 })

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const metadata = domWindow.document.createElement('div')
    metadata.className = 'zzapi-network-meta'
    domWindow.document.body.append(metadata)

    assert.equal(domWindow.getComputedStyle(metadata).display, 'none')
  } finally {
    domWindow.close()
  }
})

test('keeps only the branded static topology on mobile', () => {
  const domWindow = new Window({ width: 390, height: 844 })

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const infrastructure = domWindow.document.createElement('div')
    infrastructure.className = 'home-infrastructure'
    infrastructure.dataset.openingPhase = 'handoff'
    const routeField = domWindow.document.createElement('div')
    routeField.className = 'zzapi-route-field'
    const coreOrbit = domWindow.document.createElement('div')
    coreOrbit.className = 'zzapi-core-orbit'

    const client = domWindow.document.createElement('div')
    client.className = 'zzapi-client-origin'
    const clientLabel = domWindow.document.createElement('strong')
    const clientMeta = domWindow.document.createElement('small')
    client.append(clientLabel, clientMeta)
    const coreLockup = domWindow.document.createElement('div')
    coreLockup.className = 'zzapi-core-lockup'
    const coreLabel = domWindow.document.createElement('strong')
    const coreMeta = domWindow.document.createElement('span')
    coreLockup.append(coreLabel, coreMeta)
    const core = domWindow.document.createElement('div')
    core.className = 'zzapi-gateway-core'
    core.append(coreLockup)
    const modelControls = domWindow.document.createElement('div')
    modelControls.className = 'zzapi-model-controls'
    const openaiNode = domWindow.document.createElement('div')
    openaiNode.className = 'zzapi-model-node zzapi-node-openai'
    const claudeNode = domWindow.document.createElement('div')
    claudeNode.className = 'zzapi-model-node zzapi-node-claude'
    const aggregate = domWindow.document.createElement('div')
    aggregate.className = 'zzapi-model-aggregate'
    modelControls.append(openaiNode, claudeNode, aggregate)
    infrastructure.append(client, routeField, coreOrbit, core, modelControls)
    domWindow.document.body.append(infrastructure)

    assert.equal(domWindow.getComputedStyle(routeField).display, 'none')
    assert.equal(domWindow.getComputedStyle(coreOrbit).display, 'none')
    assert.equal(domWindow.getComputedStyle(clientMeta).display, 'none')
    assert.equal(domWindow.getComputedStyle(coreMeta).display, 'none')
    assert.notEqual(domWindow.getComputedStyle(clientLabel).display, 'none')
    assert.notEqual(domWindow.getComputedStyle(coreLabel).display, 'none')
    assert.notEqual(domWindow.getComputedStyle(aggregate).display, 'none')
    assert.equal(domWindow.getComputedStyle(infrastructure).display, 'grid')
    assert.equal(domWindow.getComputedStyle(client).position, 'relative')
    assert.equal(domWindow.getComputedStyle(core).position, 'relative')
    assert.equal(domWindow.getComputedStyle(modelControls).display, 'grid')
    assert.equal(domWindow.getComputedStyle(modelControls).opacity, '0')
    assert.equal(domWindow.getComputedStyle(openaiNode).position, 'relative')
    assert.equal(domWindow.getComputedStyle(claudeNode).position, 'relative')
    assert.equal(domWindow.getComputedStyle(aggregate).position, 'relative')

    infrastructure.dataset.openingPhase = 'settle'
    assert.equal(domWindow.getComputedStyle(modelControls).opacity, '1')
  } finally {
    domWindow.close()
  }
})

test('keeps the Core identity inside a short mobile viewport', () => {
  const domWindow = new Window({ width: 320, height: 568 })

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const heroMap = domWindow.document.createElement('div')
    heroMap.className = 'home-hero-map'
    domWindow.document.body.append(heroMap)

    assert.equal(domWindow.getComputedStyle(heroMap).top, '236px')
  } finally {
    domWindow.close()
  }
})

test('keeps the full brand stack in a wide short mobile viewport', () => {
  const domWindow = new Window({ width: 583, height: 709 })

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const hero = domWindow.document.createElement('section')
    hero.className = 'home-hero'
    const stage = domWindow.document.createElement('div')
    stage.className = 'home-hero-stage'
    hero.append(stage)
    domWindow.document.body.append(hero)

    assert.equal(domWindow.getComputedStyle(hero).minHeight, '704px')
    assert.equal(domWindow.getComputedStyle(stage).minHeight, '612px')
  } finally {
    domWindow.close()
  }
})

test('swaps the landed wordmark proxy for the real Core label without overlap', () => {
  const domWindow = new Window()

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const opening = domWindow.document.createElement('div')
    opening.className =
      'zzapi-opening zzapi-opening--locked zzapi-opening--handoff'
    opening.dataset.openingPhase = 'handoff'
    const proxy = domWindow.document.createElement('div')
    proxy.className = 'zzapi-opening-wordmark-proxy'
    opening.append(proxy)
    domWindow.document.body.append(opening)

    assert.notEqual(domWindow.getComputedStyle(proxy).visibility, 'hidden')

    opening.dataset.openingPhase = 'settle'

    assert.equal(domWindow.getComputedStyle(proxy).visibility, 'hidden')
    assert.equal(domWindow.getComputedStyle(proxy).opacity, '0')
    assert.equal(domWindow.getComputedStyle(proxy).animation, 'none')
  } finally {
    domWindow.close()
  }
})

test('keeps opening lines hidden until the Logo has settled into the Core', () => {
  const domWindow = new Window()

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const opening = domWindow.document.createElement('div')
    opening.className = 'zzapi-opening'
    opening.dataset.openingPhase = 'signal'
    const openingAxis = domWindow.document.createElement('div')
    openingAxis.className = 'zzapi-opening-axis'
    opening.append(openingAxis)

    const infrastructure = domWindow.document.createElement('div')
    infrastructure.className = 'home-infrastructure'
    infrastructure.dataset.openingPhase = 'handoff'
    const heroField = domWindow.document.createElement('div')
    heroField.className = 'home-hero-field'
    const heroGeometry = domWindow.document.createElement('div')
    heroGeometry.className = 'home-hero-geometry'
    const infrastructureDepth = domWindow.document.createElement('div')
    infrastructureDepth.className = 'home-infrastructure-depth'
    const coreOrbit = domWindow.document.createElement('span')
    coreOrbit.className = 'zzapi-core-orbit zzapi-core-orbit-one'
    const route = domWindow.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    route.setAttribute('class', 'zzapi-model-route')
    infrastructure.append(route, coreOrbit)

    const openingState = domWindow.document.createElement('div')
    openingState.dataset.zzapiOpening = 'true'
    openingState.dataset.zzapiOpeningPhase = 'handoff'
    openingState.append(
      opening,
      infrastructure,
      heroField,
      heroGeometry,
      infrastructureDepth
    )
    domWindow.document.body.append(openingState)

    assert.equal(domWindow.getComputedStyle(openingAxis).opacity, '0')
    assert.equal(domWindow.getComputedStyle(route).opacity, '0')
    assert.equal(domWindow.getComputedStyle(heroField).opacity, '0')
    assert.equal(domWindow.getComputedStyle(heroGeometry).opacity, '0')
    assert.equal(domWindow.getComputedStyle(infrastructureDepth).opacity, '0')
    assert.equal(domWindow.getComputedStyle(coreOrbit).opacity, '0')

    opening.className =
      'zzapi-opening zzapi-opening--assembled zzapi-opening--handoff'
    opening.dataset.openingPhase = 'handoff'

    assert.equal(domWindow.getComputedStyle(openingAxis).opacity, '0')

    openingState.dataset.zzapiOpeningPhase = 'settle'
    infrastructure.dataset.openingPhase = 'settle'

    assert.equal(domWindow.getComputedStyle(route).opacity, '0.86')
    assert.notEqual(
      domWindow.getComputedStyle(route).animationName,
      'zzapi-route-draw'
    )
    assert.equal(domWindow.getComputedStyle(route).transitionDelay, '48ms')
    assert.equal(domWindow.getComputedStyle(heroField).opacity, '1')
    assert.equal(domWindow.getComputedStyle(heroField).transitionDelay, '48ms')
    assert.equal(domWindow.getComputedStyle(coreOrbit).opacity, '1')
    assert.equal(domWindow.getComputedStyle(coreOrbit).transitionDelay, '48ms')
  } finally {
    domWindow.close()
  }
})

test('keeps the ambient route packet moving through most of each cycle', () => {
  const domWindow = new Window()

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const infrastructure = domWindow.document.createElement('div')
    infrastructure.className = 'home-infrastructure'
    infrastructure.dataset.openingPhase = 'ambient'
    const packetTrail = domWindow.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    packetTrail.setAttribute('class', 'zzapi-route-packet-trail')
    const packetHead = domWindow.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    packetHead.setAttribute('class', 'zzapi-route-packet-head')
    infrastructure.append(packetTrail, packetHead)
    domWindow.document.body.append(infrastructure)

    assert.ok(style.sheet)
    const trailAnimation = [...style.sheet.cssRules].find((rule) =>
      rule.cssText.startsWith(
        ".home-infrastructure[data-opening-phase='ambient'] .zzapi-route-packet-trail"
      )
    )
    assert.ok(trailAnimation)
    assert.match(
      trailAnimation.cssText,
      /animation: zzapi-route-packet-trail 4\.8s linear 0\.8s infinite/
    )

    const headAnimation = [...style.sheet.cssRules].find((rule) =>
      rule.cssText.startsWith(
        ".home-infrastructure[data-opening-phase='ambient'] .zzapi-route-packet-head"
      )
    )
    assert.ok(headAnimation)
    assert.match(
      headAnimation.cssText,
      /animation: zzapi-route-packet-head 4\.8s linear 0\.8s infinite/
    )

    const trailAppearance = [...style.sheet.cssRules].find((rule) =>
      rule.cssText.startsWith('.zzapi-route-packet-trail {')
    )
    assert.ok(trailAppearance)
    assert.match(trailAppearance.cssText, /stroke: var\(--zzapi-blue-flow\)/)
    assert.match(trailAppearance.cssText, /stroke-width: 1\.7/)
    assert.match(trailAppearance.cssText, /stroke-dasharray: 0\.052 0\.948/)

    const headAppearance = [...style.sheet.cssRules].find((rule) =>
      rule.cssText.startsWith('.zzapi-route-packet-head {')
    )
    assert.ok(headAppearance)
    assert.match(headAppearance.cssText, /stroke: var\(--zzapi-blue\)/)
    assert.match(headAppearance.cssText, /stroke-width: 2\.1/)
    assert.match(headAppearance.cssText, /stroke-dasharray: 0\.012 0\.988/)
    assert.match(headAppearance.cssText, /stroke-dashoffset: 0\.96/)

    const trailKeyframes = [...style.sheet.cssRules].find((rule) =>
      rule.cssText.startsWith('@keyframes zzapi-route-packet-trail')
    )
    assert.ok(trailKeyframes)
    assert.match(trailKeyframes.cssText, /12%\s*{\s*opacity: 0\.12/)
    assert.match(trailKeyframes.cssText, /38%\s*{\s*opacity: 0\.2/)
    assert.match(trailKeyframes.cssText, /66%,\s*92%\s*{\s*opacity: 0\.3/)

    const headKeyframes = [...style.sheet.cssRules].find((rule) =>
      rule.cssText.startsWith('@keyframes zzapi-route-packet-head')
    )
    assert.ok(headKeyframes)
    assert.match(headKeyframes.cssText, /12%\s*{\s*opacity: 0\.42/)
    assert.match(headKeyframes.cssText, /38%\s*{\s*opacity: 0\.64/)
    assert.match(headKeyframes.cssText, /66%,\s*92%\s*{\s*opacity: 0\.88/)
    assert.match(headKeyframes.cssText, /stroke-dashoffset: -0\.04/)
  } finally {
    domWindow.close()
  }
})

test('removes settlement transitions when reduced motion is requested', () => {
  const domWindow = new Window({
    width: 390,
    height: 844,
    settings: { device: { prefersReducedMotion: 'reduce' } },
  })

  try {
    const style = domWindow.document.createElement('style')
    style.textContent = landingStyles
    domWindow.document.head.append(style)

    const openingState = domWindow.document.createElement('div')
    openingState.dataset.zzapiOpening = 'true'
    openingState.dataset.zzapiOpeningPhase = 'settle'

    const heroField = domWindow.document.createElement('div')
    heroField.className = 'home-hero-field'
    const heroGeometry = domWindow.document.createElement('div')
    heroGeometry.className = 'home-hero-geometry'
    const infrastructure = domWindow.document.createElement('div')
    infrastructure.className = 'home-infrastructure'
    infrastructure.dataset.openingPhase = 'ambient'
    const infrastructureDepth = domWindow.document.createElement('div')
    infrastructureDepth.className = 'home-infrastructure-depth'
    const coreOrbit = domWindow.document.createElement('span')
    coreOrbit.className = 'zzapi-core-orbit zzapi-core-orbit-one'
    const modelControls = domWindow.document.createElement('div')
    modelControls.className = 'zzapi-model-controls'
    const packetTrail = domWindow.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    packetTrail.setAttribute('class', 'zzapi-route-packet-trail')
    const packetHead = domWindow.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    packetHead.setAttribute('class', 'zzapi-route-packet-head')
    infrastructure.append(
      infrastructureDepth,
      coreOrbit,
      modelControls,
      packetTrail,
      packetHead
    )
    openingState.append(heroField, heroGeometry, infrastructure)
    domWindow.document.body.append(openingState)

    assert.equal(
      domWindow.matchMedia('(prefers-reduced-motion: reduce)').matches,
      true
    )
    assert.equal(domWindow.getComputedStyle(heroField).transition, 'none')
    assert.equal(domWindow.getComputedStyle(heroGeometry).transition, 'none')
    assert.equal(
      domWindow.getComputedStyle(infrastructureDepth).transition,
      'none'
    )
    assert.equal(domWindow.getComputedStyle(coreOrbit).transition, 'none')
    assert.equal(domWindow.getComputedStyle(modelControls).transition, 'none')
    assert.equal(domWindow.getComputedStyle(packetTrail).animation, 'none')
    assert.equal(domWindow.getComputedStyle(packetTrail).opacity, '0')
    assert.equal(domWindow.getComputedStyle(packetHead).animation, 'none')
    assert.equal(domWindow.getComputedStyle(packetHead).opacity, '0')
  } finally {
    domWindow.close()
  }
})
