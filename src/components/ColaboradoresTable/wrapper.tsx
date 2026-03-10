"use client"

import { ColaboradoresTable } from "./index"
import { columns, Colaborador } from "./columns"

export function ContratadosTableWrapper({ data }: { data: Colaborador[] }) {
    // Specifically select only the columns requested by the user:
    // Nome, cargo, Produto, Salário, Último reajuste, Meses sem reajuste and Status
    const allowedColumns = [
        "nome",
        "cargo",
        "produto",
        "salario",
        "data_ultimo_reajuste",
        "meses_sem_reajuste",
        "saiu_do_time"
    ]

    // Filter and sort columns to match the allowed list order
    const contratadosColumns = allowedColumns.map(id => {
        return columns.find(col => {
            const key = (col as { accessorKey?: string, id?: string }).accessorKey || col.id
            return key === id
        })!
    }).filter(Boolean)

    return (
        <ColaboradoresTable
            columns={contratadosColumns}
            data={data}
            showPagination={false}
            showFilter={true}
        />
    )
}
