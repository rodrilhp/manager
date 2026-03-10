"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    showPagination?: boolean
    showFilter?: boolean
}

export function ColaboradoresTable<TData, TValue>({
    columns,
    data,
    showPagination = true,
    showFilter = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "auto",
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: showPagination ? 20 : 10000,
            },
        },
    })

    return (
        <div className="w-full">
            {showFilter && (
                <div className="flex items-center mb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar colaboradores..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(String(e.target.value))}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                </div>
            )}

            <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th
                                                key={header.id}
                                                className="px-6 font-medium"
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? "cursor-pointer select-none flex items-center gap-1 hover:text-neutral-900 transition-colors"
                                                                : "",
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: <ChevronUp className="w-4 h-4 ml-1" />,
                                                            desc: <ChevronDown className="w-4 h-4 ml-1" />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-6 py-2 whitespace-nowrap text-neutral-700"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center text-neutral-500"
                                    >
                                        Nenhum colaborador encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPagination && (
                <div className="flex items-center justify-between px-2 py-4">
                    <div className="flex-1 text-sm text-neutral-500">
                        Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} registros
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-1 border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button
                            className="p-1 border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium mx-2">
                            Página {table.getState().pagination.pageIndex + 1} de{" "}
                            {table.getPageCount()}
                        </span>
                        <button
                            className="p-1 border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            className="p-1 border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
