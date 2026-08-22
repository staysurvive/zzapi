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
  it('uses a denser desktop composition for the corridor and value view', () => {
    const domWindow = createDocument('dark')
    domWindow.innerWidth = 1440

    try {
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      belowFold.dataset.homeV5 = 'true'

      const corridor = domWindow.document.createElement('section')
      corridor.className = 'home-v5-stage home-v5-corridor'
      const corridorTitle = domWindow.document.createElement('h2')
      corridorTitle.textContent = '一条可观测的路径'
      corridor.append(corridorTitle)

      const values = domWindow.document.createElement('section')
      values.className = 'home-v5-stage home-v5-values'
      const intro = domWindow.document.createElement('div')
      intro.className = 'home-v5-values__intro'
      const tabs = domWindow.document.createElement('div')
      tabs.className = 'home-v5-values__tabs'
      const tabList = domWindow.document.createElement('div')
      tabList.className = 'home-v5-values__list'
      const activeTab = domWindow.document.createElement('button')
      activeTab.className = 'home-v5-values__trigger'
      activeTab.dataset.active = ''
      tabList.append(activeTab)
      const panel = domWindow.document.createElement('div')
      panel.className = 'home-v5-value-panel'
      tabs.append(tabList, panel)
      values.append(intro, tabs)

      const catalogModel = domWindow.document.createElement('button')
      catalogModel.className = 'home-v5-catalog__model'
      catalogModel.dataset.selected = 'true'
      const catalog = domWindow.document.createElement('section')
      catalog.className = 'home-v5-stage home-v5-catalog'
      const catalogSpine = domWindow.document.createElement('div')
      catalogSpine.className = 'home-v5-signal-spine'
      const catalogSpineLine = domWindow.document.createElement('span')
      catalogSpineLine.className = 'home-v5-signal-spine__line'
      const catalogSpineNode = domWindow.document.createElement('span')
      catalogSpineNode.className = 'home-v5-signal-spine__node'
      catalogSpine.append(catalogSpineLine, catalogSpineNode)
      const catalogNetwork = domWindow.document.createElement('div')
      catalogNetwork.className = 'home-v5-catalog__network'
      const catalogOrigin = domWindow.document.createElement('span')
      catalogOrigin.className = 'home-v5-catalog__origin'
      catalogModel.append(catalogOrigin)
      catalogNetwork.append(catalogModel)
      catalog.append(catalogSpine, catalogNetwork)
      const developerCopy = domWindow.document.createElement('button')
      developerCopy.className = 'home-v5-developer__copy'
      const signal = domWindow.document.createElement('div')
      signal.className = 'home-v5-signal-stack__item'
      const signalValue = domWindow.document.createElement('dd')
      signal.append(signalValue)
      belowFold.append(corridor, values)
      belowFold.append(catalog, developerCopy, signal)
      const eyebrow = domWindow.document.createElement('p')
      eyebrow.className = 'home-v5-stage__eyebrow'
      belowFold.append(eyebrow)
      const panelHeader = domWindow.document.createElement('div')
      panelHeader.className = 'home-v5-value-panel__header'
      belowFold.append(panelHeader)
      domWindow.document.body.append(belowFold)

      const titleStyle = domWindow.getComputedStyle(corridorTitle)
      const corridorStyle = domWindow.getComputedStyle(corridor)
      const valuesStyle = domWindow.getComputedStyle(values)
      const copyStyle = domWindow.getComputedStyle(developerCopy)
      const catalogStyle = domWindow.getComputedStyle(catalogModel)
      const catalogNetworkStyle = domWindow.getComputedStyle(catalogNetwork)
      const catalogOriginStyle = domWindow.getComputedStyle(catalogOrigin)
      const catalogSpineLineStyle = domWindow.getComputedStyle(catalogSpineLine)
      const catalogSpineNodeStyle = domWindow.getComputedStyle(catalogSpineNode)
      const tabListStyle = domWindow.getComputedStyle(tabList)
      const activeTabStyle = domWindow.getComputedStyle(activeTab)
      const panelStyle = domWindow.getComputedStyle(panel)
      const signalValueStyle = domWindow.getComputedStyle(signalValue)
      const eyebrowStyle = domWindow.getComputedStyle(eyebrow)
      const panelHeaderStyle = domWindow.getComputedStyle(panelHeader)
      expect(titleStyle.fontSize).toBe('48px')
      expect(titleStyle.maxWidth).toBe('none')
      expect(corridorStyle.getPropertyValue('--home-v5-axis')).toBe('38%')
      expect(valuesStyle.gridTemplateColumns).toContain('4fr')
      expect(valuesStyle.gridTemplateColumns).toContain('7fr')
      expect(copyStyle.borderRadius).toBe('3px')
      expect(copyStyle.transition).toContain('color')
      expect(catalogStyle.borderRadius).toBe('3px')
      expect(catalogNetworkStyle.position).toBe('absolute')
      expect(catalogNetworkStyle.left).toBe('38%')
      expect(catalogOriginStyle.top).toBe('50%')
      expect(catalogSpineLineStyle.display).toBe('block')
      expect(catalogSpineLineStyle.opacity).toBe('0.78')
      expect(catalogSpineNodeStyle.display).toBe('none')
      expect(tabListStyle.flexDirection).toBe('column')
      expect(activeTabStyle.minHeight).toBe('148px')
      expect(panelStyle.minHeight).toBe('500px')
      expect(signalValueStyle.textAlign).toBe('right')
      expect(eyebrowStyle.display).toBe('flex')
      expect(panelHeaderStyle.borderBottomWidth).toBe('1px')
    } finally {
      domWindow.close()
    }
  })

  it('uses a compact rhythm for the narrative on narrow screens', () => {
    const domWindow = createDocument('dark')
    domWindow.innerWidth = 390

    try {
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      belowFold.dataset.homeV5 = 'true'

      const stage = domWindow.document.createElement('section')
      stage.className = 'home-v5-stage'
      const model = domWindow.document.createElement('div')
      model.className = 'home-v5-identity__model'
      const modelName = domWindow.document.createElement('p')
      modelName.textContent = 'claude-fable-5'
      model.append(modelName)
      const node = domWindow.document.createElement('span')
      node.className = 'home-v5-corridor__node'
      const spine = domWindow.document.createElement('div')
      spine.className = 'home-v5-signal-spine'
      const catalogNetwork = domWindow.document.createElement('div')
      catalogNetwork.className = 'home-v5-catalog__network'
      const catalogModel = domWindow.document.createElement('button')
      catalogModel.className = 'home-v5-catalog__model'
      const catalogRoute = domWindow.document.createElement('span')
      catalogRoute.className = 'home-v5-catalog__route'
      catalogModel.append(catalogRoute)
      catalogNetwork.append(catalogModel)
      stage.append(model, node, spine, catalogNetwork)
      belowFold.append(stage)
      domWindow.document.body.append(belowFold)

      expect(domWindow.getComputedStyle(stage).paddingTop).toBe('72px')
      expect(domWindow.getComputedStyle(stage).paddingLeft).toBe('24px')
      expect(domWindow.getComputedStyle(spine).display).toBe('none')
      expect(domWindow.getComputedStyle(modelName).fontSize).toBe('40px')
      expect(domWindow.getComputedStyle(node).width).toBe('40px')
      expect(domWindow.getComputedStyle(catalogNetwork).position).toBe(
        'relative'
      )
      expect(domWindow.getComputedStyle(catalogRoute).display).toBe('none')
    } finally {
      domWindow.close()
    }
  })

  it('keeps stage titles readable at the 1024px desktop boundary', () => {
    const domWindow = createDocument('light')
    domWindow.innerWidth = 1024

    try {
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      belowFold.dataset.homeV5 = 'true'
      const stage = domWindow.document.createElement('section')
      stage.className = 'home-v5-stage'
      const title = domWindow.document.createElement('h2')
      title.textContent = 'Current model catalog'
      stage.append(title)
      belowFold.append(stage)
      domWindow.document.body.append(belowFold)

      const titleStyle = domWindow.getComputedStyle(title)
      expect(titleStyle.fontSize).toBe('44px')
      expect(titleStyle.maxWidth).toBe('none')
    } finally {
      domWindow.close()
    }
  })

  it('applies default light tokens only below the frozen Hero', () => {
    const domWindow = createDocument('light')

    try {
      const hero = domWindow.document.createElement('section')
      hero.className = 'home-hero'
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      belowFold.dataset.homeV5 = 'true'
      domWindow.document.body.append(hero, belowFold)

      expect(
        domWindow.getComputedStyle(hero).getPropertyValue('--background')
      ).toBe('')
      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-v5-canvas')
      ).toBe('#fcfdfe')
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--home-v5-blue')
      ).toBe('#1549f4')
    } finally {
      domWindow.close()
    }
  })

  it('applies premium-black tokens in the default dark theme', () => {
    const domWindow = createDocument('dark')

    try {
      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      belowFold.dataset.homeV5 = 'true'
      domWindow.document.body.append(belowFold)

      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-v5-canvas')
      ).toBe('#0e1116')
      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-v5-surface')
      ).toBe('#15191f')
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--home-v5-blue')
      ).toBe('#73a2ff')
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
      domWindow.document.body.style.setProperty('--primary', '#b46f3c')

      const belowFold = domWindow.document.createElement('div')
      belowFold.className = 'home-below-fold'
      belowFold.dataset.homeV5 = 'true'
      domWindow.document.body.append(belowFold)

      expect(
        domWindow.document.body.style.getPropertyValue('--background')
      ).toBe('#0b0b0b')
      expect(domWindow.document.body.style.getPropertyValue('--card')).toBe(
        '#121212'
      )
      expect(
        domWindow
          .getComputedStyle(belowFold)
          .getPropertyValue('--home-v5-canvas')
      ).toBe('#0b0b0b')
      expect(
        domWindow.getComputedStyle(belowFold).getPropertyValue('--home-v5-blue')
      ).toBe('#b46f3c')

      const legacyBelowFold = domWindow.document.createElement('div')
      legacyBelowFold.className = 'home-below-fold'
      domWindow.document.body.append(legacyBelowFold)
      expect(
        domWindow
          .getComputedStyle(legacyBelowFold)
          .getPropertyValue('--home-v5-canvas')
      ).toBe('')
    } finally {
      domWindow.close()
    }
  })
})
