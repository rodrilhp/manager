"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

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
}

export function SalariosTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [cargoFilter, setCargoFilter] = React.useState("")

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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  })

  React.useEffect(() => {
    if (cargoFilter) {
      setColumnFilters([{ id: "cargo", value: cargoFilter }])
    } else {
      setColumnFilters([])
    }
  }, [cargoFilter])

  return (
    <div className="w-full">

      <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden max-h-[40vh]">
        <div className="overflow-x-auto overflow-y-auto max-h-[40vh]">
          <table className="w-full text-sm text-left">
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
    </div>
  )
}
