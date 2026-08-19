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
import { describe, expect, it } from 'vitest'

import {
  convertDetectedLanguage,
  INTERFACE_LANGUAGE_OPTIONS,
  normalizeInterfaceLanguage,
  toIntlLocale,
} from '../languages'

describe('interface language contract', () => {
  it('exposes only Simplified Chinese and English', () => {
    expect(INTERFACE_LANGUAGE_OPTIONS).toEqual([
      { code: 'zhCN', label: '简体中文' },
      { code: 'en', label: 'English' },
    ])
  })

  it.each(['zh', 'zh-CN', 'zh-TW', 'zh-Hant', 'zh_HK', 'zhCN'])(
    'normalizes %s to Simplified Chinese',
    (locale) => {
      expect(normalizeInterfaceLanguage(locale)).toBe('zhCN')
      expect(convertDetectedLanguage(locale)).toBe('zhCN')
    }
  )

  it.each(['en', 'en-US', 'fr', 'ja', 'ru', 'vi', 'unknown'])(
    'normalizes unsupported %s to English',
    (locale) => {
      expect(normalizeInterfaceLanguage(locale)).toBe('en')
      expect(convertDetectedLanguage(locale)).toBe('en')
    }
  )

  it('maps supported interface codes to Intl locales', () => {
    expect(toIntlLocale('zhCN')).toBe('zh-CN')
    expect(toIntlLocale('en')).toBe('en')
    expect(toIntlLocale('ru')).toBe('en')
    expect(toIntlLocale()).toBe('en')
  })
})
