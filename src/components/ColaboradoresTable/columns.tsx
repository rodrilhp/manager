"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format, differenceInDays } from "date-fns"

export type Colaborador = {
    id: string
    nome: string
    e_mail: string | null
    cargo: string | null
    senioridade: string | null
    produto: string | null
    foco: string | null
    estado: string | null
    salario: number | null
    data_entrada: string | null
    data_saida: string | null
    saiu_do_time: boolean
    data_ultimo_reajuste: string | null
    ultimo_reajuste: number | null
    tempo_s_reajuste: number | null
    possui_plano: boolean
    percent_da_zg: number | null
    aniversario: string | null
    created_at: string
}

export const columns: ColumnDef<Colaborador>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "cargo",
        header: "Cargo",
    },
    {
        accessorKey: "produto",
        header: "Produto",
    },
    {
        accessorKey: "e_mail",
        header: "E-mail",
    },
    {
        accessorKey: "senioridade",
        header: "Senioridade",
    },
    {
        accessorKey: "foco",
        header: "Foco",
    },
    {
        accessorKey: "estado",
        header: "Estado",
    },
    {
        accessorKey: "salario",
        header: "Salário",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("salario"))
            if (isNaN(amount)) return "-"
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount)
            return formatted
        },
    },
    {
        accessorKey: "data_ultimo_reajuste",
        header: "Último Reajuste",
        cell: ({ row }) => {
            const dateStr = row.getValue("data_ultimo_reajuste") as string | null
            if (!dateStr) return "-"
            return format(new Date(dateStr), "dd/MM/yyyy")
        },
    },
    {
        id: "meses_sem_reajuste",
        header: "Meses sem Reajuste",
        cell: ({ row }) => {
            const dataReajusteStr = row.getValue("data_ultimo_reajuste") as string | null
            if (!dataReajusteStr) return "-"
            const dataReajuste = new Date(dataReajusteStr)
            const diffDias = differenceInDays(new Date(), dataReajuste)
            const diffMeses = Math.floor(diffDias / 30)
            return `${diffMeses} meses`
        },
    },
    {
        accessorKey: "data_entrada",
        header: "Admissão",
        cell: ({ row }) => {
            const dateStr = row.getValue("data_entrada") as string | null
            if (!dateStr) return "-"
            // Simple string splitting for YYYY-MM-DD
            const [year, month, day] = dateStr.split("T")[0].split("-")
            return `${day}/${month}/${year}`
        },
    },
    {
        accessorKey: "data_saida",
        header: "Desligamento",
        cell: ({ row }) => {
            const dateStr = row.getValue("data_saida") as string | null
            if (!dateStr) return "-"
            const [year, month, day] = dateStr.split("T")[0].split("-")
            return `${day}/${month}/${year}`
        },
    },
    {
        accessorKey: "possui_plano",
        header: "Plano Saude",
        cell: ({ row }) => {
            const test = row.getValue("possui_plano")
            return test ? "Sim" : "Não"
        }
    },
    {
        accessorKey: "percent_da_zg",
        header: "% ZG",
        cell: ({ row }) => {
            const val = row.getValue("percent_da_zg")
            return val ? `${val}%` : "-"
        }
    },
    {
        accessorKey: "aniversario",
        header: "Aniversário",
        cell: ({ row }) => {
            const dateStr = row.getValue("aniversario") as string | null
            if (!dateStr) return "-"
            const [, month, day] = dateStr.split("T")[0].split("-")
            return `${day}/${month}`
        },
    },
    {
        accessorKey: "saiu_do_time",
        header: "Status",
        cell: ({ row }) => {
            const saiu = row.getValue("saiu_do_time") as boolean
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${saiu
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                        }`}
                >
                    {saiu ? "Inativo" : "Ativo"}
                </span>
            )
        },
    },
]
