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
import { describe, expect, it } from 'vitest'

import { Dialog } from '@/components/dialog'

describe('Dialog product scope', () => {
  it('keeps the legacy portal free of product attributes by default', () => {
    render(
      <Dialog open title='Legacy dialog'>
        Legacy content
      </Dialog>
    )

    const dialog = screen.getByRole('dialog')
    const portal = dialog.closest('[data-slot="dialog-portal"]')
    expect(dialog).not.toHaveAttribute('data-product-dialog')
    expect(portal).not.toHaveAttribute('data-zzapi-product')
    expect(portal).not.toHaveAttribute('data-product-dialog-portal')
  })

  it('scopes the portal and accepts a localized close label when opted in', () => {
    render(
      <Dialog
        open
        title='Product dialog'
        productScope
        closeLabel='Dismiss product dialog'
      >
        Product content
      </Dialog>
    )

    const dialog = screen.getByRole('dialog')
    const portal = dialog.closest('[data-slot="dialog-portal"]')
    expect(dialog).toHaveAttribute('data-product-dialog', 'true')
    expect(portal).toHaveAttribute('data-zzapi-product', 'true')
    expect(portal).toHaveAttribute('data-product-dialog-portal', 'true')
    expect(
      screen.getByRole('button', { name: 'Dismiss product dialog' })
    ).toBeVisible()
  })
})
