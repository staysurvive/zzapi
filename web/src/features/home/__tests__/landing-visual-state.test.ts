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

test('removes settlement transitions when reduced motion is requested', () => {
  const domWindow = new Window({
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
    const infrastructureDepth = domWindow.document.createElement('div')
    infrastructureDepth.className = 'home-infrastructure-depth'
    const coreOrbit = domWindow.document.createElement('span')
    coreOrbit.className = 'zzapi-core-orbit zzapi-core-orbit-one'
    infrastructure.append(infrastructureDepth, coreOrbit)
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
  } finally {
    domWindow.close()
  }
})
