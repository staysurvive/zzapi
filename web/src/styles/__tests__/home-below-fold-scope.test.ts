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
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { Window } from 'happy-dom'
import { describe, expect, it } from 'vitest'

const belowFoldStyles = readFileSync(
  path.resolve('src/styles/home-below-fold.css'),
  'utf8'
)

function createDocument(theme: 'light' | 'dark') {
  const domWindow = new Window()
  domWindow.document.documentElement.className = theme

  const style = domWindow.document.createElement('style')
  style.textContent = belowFoldStyles
  domWindow.document.head.append(style)

  return domWindow
}

describe('home below-fold palette scope', () => {
  it('applies default light tokens only below the frozen Hero', () => {
    const domWindow = createDocument('light')

    try {
      const hero = domWindow.document.createElement('section')
      hero.className = 'home-hero'
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      domWindow.document.body.append(hero, belowFold)

      expect(
        domWindow.getComputedStyle(hero).getPropertyValue('--background')
      ).toBe('')
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--background')
      ).toBe('#ffffff')
      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-footer-surface')
      ).toBe('#edf3f9')
    } finally {
      domWindow.close()
    }
  })

  it('applies premium-black tokens in the default dark theme', () => {
    const domWindow = createDocument('dark')

    try {
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      domWindow.document.body.append(belowFold)

      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--background')
      ).toBe('#1a1d21')
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--card')
      ).toBe('#1d2024')
      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-footer-surface')
      ).toBe('#121417')
    } finally {
      domWindow.close()
    }
  })

  it('leaves explicit theme presets authoritative', () => {
    const domWindow = createDocument('dark')

    try {
      domWindow.document.body.dataset.themePreset = 'anthropic'
      domWindow.document.body.style.setProperty('--background', '#0b0b0b')
      domWindow.document.body.style.setProperty('--card', '#121212')

      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      domWindow.document.body.append(belowFold)

      expect(
        domWindow.document.body.style.getPropertyValue('--background')
      ).toBe('#0b0b0b')
      expect(domWindow.document.body.style.getPropertyValue('--card')).toBe(
        '#121212'
      )
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--background')
      ).toBe('')
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--card')
      ).toBe('')
      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-footer-surface')
      ).toBe('')
    } finally {
      domWindow.close()
    }
  })
})
