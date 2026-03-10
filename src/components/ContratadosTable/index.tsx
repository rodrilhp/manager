"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, X } from "lucide-react"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { format, differenceInDays } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"

// Converts "JOÃO SILVA" → "João Silva"
function toTitleCase(str: string | null | undefined): string {
    if (!str) return "-"
    return str
        .toLowerCase()
        .replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase())
}

// Columns specific to this view
const contratadosColumns: ColumnDef<Colaborador>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
        enableColumnFilter: true,
        cell: ({ row }) => toTitleCase(row.getValue("nome")),
    },
    {
        accessorKey: "cargo",
        header: "Cargo",
        enableColumnFilter: true,
        cell: ({ row }) => toTitleCase(row.getValue("cargo")),
    },
    {
        accessorKey: "produto",
        header: "Produto",
        enableColumnFilter: true,
    },
    {
        accessorKey: "salario",
        header: "Salário",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("salario"))
            if (isNaN(amount)) return "-"
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount)
        },
    },
    {
        accessorKey: "data_ultimo_reajuste",
        header: "Último Reajuste",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const dateStr = row.getValue("data_ultimo_reajuste") as string | null
            if (!dateStr) return "-"
            try { return format(new Date(dateStr), "dd/MM/yyyy") } catch { return "-" }
        },
    },
    {
        id: "meses_sem_reajuste",
        header: "Meses s/ Reajuste",
        enableColumnFilter: false,
        accessorFn: (row) => {
            const dateStr = row.data_ultimo_reajuste
            if (!dateStr) return -1
            return differenceInDays(new Date(), new Date(dateStr))
        },
        sortingFn: "auto",
        cell: ({ row }) => {
            const dateStr = row.original.data_ultimo_reajuste
            if (!dateStr) return "-"
            const diffDias = differenceInDays(new Date(), new Date(dateStr))
            return `${Math.floor(diffDias / 30)} meses`
        },
    },
    {
        accessorKey: "saiu_do_time",
        header: "Status",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            if (filterValue === "") return true
            const val = row.getValue(columnId) as boolean
            const asString = val ? "Inativo" : "Ativo"
            return asString === filterValue
        },
        cell: ({ row }) => {
            const saiu = row.getValue("saiu_do_time") as boolean
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${saiu ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                >
                    {saiu ? "Inativo" : "Ativo"}
                </span>
            )
        },
    },
]

// Helper: get unique values for a column
function getUniqueValues<T>(data: T[], key: keyof T): string[] {
    const set = new Set<string>()
    data.forEach((row) => {
        const val = row[key]
        if (val != null && val !== "") set.add(String(val))
    })
    return Array.from(set).sort()
}

interface Props {
    data: Colaborador[]
}

export function ContratadosTable({ data }: Props) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns: contratadosColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
    })

    // Pre-compute unique values for dropdown filters
    const uniqueCargos = getUniqueValues(data, "cargo")
    const uniqueProdutos = getUniqueValues(data, "produto")

    // Helper to get/set a single column filter value
    const getFilter = (id: string) =>
        (columnFilters.find((f) => f.id === id)?.value as string) ?? ""

    const setFilter = (id: string, value: string) => {
        setColumnFilters((prev) =>
            value === ""
                ? prev.filter((f) => f.id !== id)
                : [...prev.filter((f) => f.id !== id), { id, value }]
        )
    }

    const hasActiveFilters = columnFilters.length > 0

    return (
        <div className="w-full">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
                {/* Nome: text search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filtrar por nome..."
                        value={getFilter("nome")}
                        onChange={(e) => setFilter("nome", e.target.value)}
                        className="w-52 pl-3 pr-8 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    {getFilter("nome") && (
                        <button
                            onClick={() => setFilter("nome", "")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Cargo: dropdown */}
                <div className="relative">
                    <select
                        value={getFilter("cargo")}
                        onChange={(e) => setFilter("cargo", e.target.value)}
                        className="appearance-none w-48 pl-3 pr-8 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="">Todos os cargos</option>
                        {uniqueCargos.map((v) => (
                            <option key={v} value={v}>{toTitleCase(v)}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>

                {/* Produto: dropdown */}
                <div className="relative">
                    <select
                        value={getFilter("produto")}
                        onChange={(e) => setFilter("produto", e.target.value)}
                        className="appearance-none w-48 pl-3 pr-8 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="">Todos os produtos</option>
                        {uniqueProdutos.map((v) => (
                            <option key={v} value={v}>{toTitleCase(v)}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>

                {/* Status: dropdown */}
                <div className="relative">
                    <select
                        value={getFilter("saiu_do_time")}
                        onChange={(e) => setFilter("saiu_do_time", e.target.value)}
                        className="appearance-none w-40 pl-3 pr-8 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="">Todos os status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                    <button
                        onClick={() => setColumnFilters([])}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors ml-1 px-2.5 py-1.5 rounded-md cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                        Limpar filtros
                    </button>
                )}

                {/* Results count */}
                <span className="ml-auto text-sm text-neutral-400">
                    {table.getFilteredRowModel().rows.length} de {data.length} colaboradores
                </span>
            </div>

            {/* Table */}
            <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 font-medium"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? "cursor-pointer select-none flex items-center gap-1 hover:text-neutral-900 transition-colors"
                                                            : "flex items-center gap-1"
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ChevronUp className="w-3.5 h-3.5" />,
                                                        desc: <ChevronDown className="w-3.5 h-3.5" />,
                                                    }[header.column.getIsSorted() as string] ?? (
                                                            header.column.getCanSort()
                                                                ? <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-300" />
                                                                : null
                                                        )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
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
                                        colSpan={contratadosColumns.length}
                                        className="h-24 text-center text-neutral-500"
                                    >
                                        Nenhum colaborador encontrado para os filtros selecionados.
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
