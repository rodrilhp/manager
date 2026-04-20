"use client"

import React, { useCallback } from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
    ColumnDef,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronRight, ChevronLeft, X } from "lucide-react"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { differenceInDays } from "date-fns"
import { toTitleCase } from "@/lib/utils"

interface FinanceiroTableProps {
    colaboradores: Colaborador[]
    novosSalarios: Record<string, number>
    buscaProximoStep: (colaborador: Colaborador) => number | null
    buscaStepAnterior: (colaborador: Colaborador) => number | null
    onAvancarStep: (colaboradorId: string) => void
    onVoltarStep: (colaboradorId: string) => void
}

export function FinanceiroTable({
    colaboradores,
    novosSalarios,
    buscaProximoStep,
    buscaStepAnterior,
    onAvancarStep,
    onVoltarStep,
}: FinanceiroTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    // Função para normalizar cargo para busca de salários
    const normalizarCargo = useCallback((cargo: string | null): string | null => {
        if (!cargo) return null
        const cargoLower = cargo.toLowerCase()

        // Todos os analistas são considerados analistas de TI
        if (cargoLower.includes('analista')) {
            return 'Analista de TI'
        }

        // Outros cargos especiais
        if (cargoLower.includes('squad leader')) {
            return 'Squad Leader'
        }
        if (cargoLower.includes('product designer')) {
            return 'Product Designer'
        }
        if (cargoLower.includes('tribe leader')) {
            return 'Tribe Leader'
        }

        return cargo
    }, [])

    // Montar dados com cálculos
    const dadosComCaculos = React.useMemo(() => {
        return colaboradores.map(colab => {
            const cargoNormalizado = normalizarCargo(colab.cargo)
            const salarioAtual = novosSalarios[colab.id] || colab.salario || 0

            // Criar colaborador com cargo normalizado para busca
            const colabNormalizado = { ...colab, cargo: cargoNormalizado }

            const proximoStep = buscaProximoStep(colabNormalizado)
            const stepAnterior = buscaStepAnterior(colabNormalizado)

            return {
                ...colab,
                proximoStep,
                stepAnterior,
                novoSalarioDisplay: novosSalarios[colab.id],
                temProximoStep: proximoStep !== null,
                temStepAnterior: novosSalarios[colab.id] !== undefined, // Só habilitado se usuário aplicou aumento
            }
        })
    }, [colaboradores, novosSalarios, buscaProximoStep, buscaStepAnterior, normalizarCargo])

    const columns: ColumnDef<(typeof dadosComCaculos)[0]>[] = [
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
            cell: ({ row }) => toTitleCase(row.getValue("cargo") || ""),
        },
        {
            accessorKey: "salario",
            header: "Salário",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("salario") || "0")
                if (isNaN(amount)) return "-"
                return new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(amount)
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
            id: "step_salarial",
            header: "Step Salarial",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const temProximoStep = row.original.temProximoStep
                const temStepAnterior = row.original.temStepAnterior

                return (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onVoltarStep(row.original.id)}
                            disabled={!temStepAnterior}
                            className={`inline-flex items-center px-2 py-1 rounded-md font-medium text-sm transition-colors ${
                                temStepAnterior
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            }`}
                            title={temStepAnterior ? "Voltar ao step anterior" : "Nenhum aumento aplicado"}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Anterior</span>
                        </button>
                        <button
                            onClick={() => onAvancarStep(row.original.id)}
                            disabled={!temProximoStep}
                            className={`inline-flex items-center px-2 py-1 rounded-md font-medium text-sm transition-colors ${
                                temProximoStep
                                    ? "bg-green-100 text-green-700 hover:bg-green-200 active:scale-95"
                                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            }`}
                            title={temProximoStep ? "Avançar para próximo step" : "Já está no último step"}
                        >
                            <span className="hidden sm:inline">Próximo</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )
            },
        },
        {
            id: "novo_salario",
            header: "Novo Salário",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const novoSalario = row.original.novoSalarioDisplay

                if (!novoSalario) {
                    return <span className="text-neutral-400">-</span>
                }

                const salarioAtual = row.original.salario || 0
                const diferenca = novoSalario - salarioAtual

                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-green-700">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(novoSalario)}
                        </span>
                        <span className="text-xs text-green-600">
                            +{new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(diferenca)}
                        </span>
                    </div>
                )
            },
        },
    ]

    const memoizedData = React.useMemo(() => dadosComCaculos, [dadosComCaculos])

    const table = useReactTable({
        data: memoizedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
    })

    const uniqueCargos = React.useMemo(() => {
        const set = new Set<string>()
        memoizedData.forEach((row) => {
            const val = row.cargo
            if (val != null && val !== "") set.add(String(val))
        })
        return Array.from(set).sort()
    }, [memoizedData])

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
                    {table.getFilteredRowModel().rows.length} de {memoizedData.length}
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
                                        colSpan={columns.length}
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
