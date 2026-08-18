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
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DataTablePage } from '../layout/data-table-page'

type RowData = { name: string }

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
]

function TableFixture(props: { appearance?: 'legacy' | 'product' }) {
  const table = useReactTable({
    columns,
    data: [],
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTablePage
      table={table}
      columns={columns}
      appearance={props.appearance}
      toolbar={null}
      showPagination={false}
      hideMobile
      fixedHeight={false}
    />
  )
}

describe('DataTablePage product appearance', () => {
  it('keeps the existing root unscoped by default', () => {
    const { container } = render(<TableFixture />)

    expect(container.childElementCount).toBe(1)
    expect(container.firstElementChild).not.toHaveAttribute(
      'data-zzapi-product'
    )
    expect(container.firstElementChild).not.toHaveAttribute(
      'data-product-table-page'
    )
  })

  it('adds product attributes directly to the existing root', () => {
    const { container } = render(<TableFixture appearance='product' />)

    expect(container.childElementCount).toBe(1)
    expect(container.firstElementChild).toHaveAttribute(
      'data-zzapi-product',
      'true'
    )
    expect(container.firstElementChild).toHaveAttribute(
      'data-product-table-page',
      'true'
    )
    expect(container.firstElementChild).toHaveAttribute(
      'data-product-surface',
      'workspace'
    )
  })
})
