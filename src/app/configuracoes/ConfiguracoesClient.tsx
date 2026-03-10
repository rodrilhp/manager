"use client"

import { useState } from "react"
import { ColaboradoresTable } from "@/components/ColaboradoresTable"
import { columns, Colaborador } from "@/components/ColaboradoresTable/columns"
import { AddColaboradorModal } from "@/components/AddColaboradorModal"

export function ConfiguracoesClient({ data }: { data: Colaborador[] }) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-neutral-500">
                    {data.length} colaboradores
                </span>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors cursor-pointer">
                        Importar CSV
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        Adicionar Colaborador
                    </button>
                </div>
            </div>

            {/* Table */}
            <ColaboradoresTable columns={columns} data={data} />

            {/* Modal */}
            <AddColaboradorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}
