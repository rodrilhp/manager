"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"

export type Salario = {
  id: number
  cargo?: string | null
  nivel?: number | null
  step?: string | null
  salario?: number | null
  created_at?: string | null
}

const salarioColumns: ColumnDef<Salario>[] = [
  {
    accessorKey: "cargo",
    header: "Cargo",
  },
  {
    accessorKey: "nivel",
    header: "Nível",
    cell: ({ row }) => {
      const value = row.getValue("nivel")
      return value !== null && value !== undefined ? String(value) : "-"
    },
  },
  {
    accessorKey: "step",
    header: "Step",
  },
  {
    accessorKey: "salario",
    header: "Salário",
    cell: ({ row }) => {
      const amount = row.getValue("salario") as number | null | undefined
      if (amount == null || Number.isNaN(Number(amount))) return "-"
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)
    },
  },
]

interface Props {
  data: Salario[]
  pageSize?: number
}

export function SalariosTable({ data, pageSize = 20 }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const memoizedData = React.useMemo(() => data, [data])
  const memoizedColumns = React.useMemo(() => salarioColumns, [])

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-sm text-neutral-500">{table.getRowModel().rows.length} registros</div>
      </div>

      <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto">          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200 sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 font-medium">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-1 hover:text-neutral-900 transition-colors"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className="w-4 h-4 ml-1" />,
                            desc: <ChevronDown className="w-4 h-4 ml-1" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-2 whitespace-nowrap text-neutral-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={salarioColumns.length} className="h-24 text-center text-neutral-500">
                    Nenhum registro de salários encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-white border border-neutral-200 rounded-b-md px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <button
            className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600">Exibir</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-2 py-1 border border-neutral-200 rounded-md"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-neutral-500">registros por página</span>
        </div>
      </div>
    </div>
  )
}
