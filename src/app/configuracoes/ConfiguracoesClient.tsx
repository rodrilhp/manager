"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ColaboradoresTable } from "@/components/ColaboradoresTable"
import { columns, Colaborador } from "@/components/ColaboradoresTable/columns"
import { AddColaboradorModal } from "@/components/AddColaboradorModal"
import { supabase } from "@/lib/supabase"

export function ConfiguracoesClient({ data }: { data: Colaborador[] }) {
    const router = useRouter()
    const [modalOpen, setModalOpen] = useState(false)
    const [modalKey, setModalKey] = useState(0)
    const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null)
    const [deleteCandidate, setDeleteCandidate] = useState<Colaborador | null>(null)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const columnsWithActions = [
        ...columns,
        {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: Colaborador }}) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            openEditModal(row.original)
                        }}
                        className="p-1 rounded-md text-blue-600 hover:bg-blue-100"
                        aria-label="Editar colaborador"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setDeleteCandidate(row.original)
                            setDeleteConfirmText("")
                            setDeleteError(null)
                        }}
                        className="p-1 rounded-md text-red-600 hover:bg-red-100"
                        aria-label="Excluir colaborador"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ] as typeof columns

    const openAddModal = () => {
        setEditingColaborador(null)
        setModalKey((prev) => prev + 1)
        setModalOpen(true)
    }

    const openEditModal = (colaborador: Colaborador) => {
        setEditingColaborador(colaborador)
        setModalKey((prev) => prev + 1)
        setModalOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteCandidate) return
        if (deleteConfirmText.trim().toUpperCase() !== "EXCLUIR") {
            setDeleteError('Digite EXCLUIR para confirmar a exclusão.')
            return
        }

        setDeleteLoading(true)
        setDeleteError(null)

        const { error } = await supabase
            .from("colaboradores")
            .delete()
            .eq("id", deleteCandidate.id)

        setDeleteLoading(false)

        if (error) {
            setDeleteError(error.message)
            return
        }

        setDeleteCandidate(null)
        setDeleteConfirmText("")
        router.refresh()
    }

    return (
        <>
            {/* Toolbar */}
            <div className="flex items-center justify-end mb-4">
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors cursor-pointer">
                        Importar CSV
                    </button>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Adicionar Colaborador
                    </button>
                </div>
            </div>

            {/* Table */}
            <ColaboradoresTable columns={columnsWithActions} data={data} />

            {/* Modal */}
            <AddColaboradorModal
                key={`${modalKey}-${editingColaborador?.id ?? "new"}`}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={editingColaborador}
            />

            {/* Delete Confirmation Modal */}
            {deleteCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setDeleteCandidate(null)}
                    />
                    <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirmar exclusão</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Você está prestes a apagar <strong>{deleteCandidate.nome}</strong> do banco de dados.
                            Esta ação é irreversível.
                        </p>
                        <p className="text-sm text-neutral-500 mb-4">
                            Para confirmar, digite <strong>EXCLUIR</strong> no campo abaixo.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Digite EXCLUIR"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {deleteError && (
                            <p className="text-sm text-red-600 mb-2">{deleteError}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteCandidate(null)}
                                className="px-4 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
                                disabled={deleteLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Excluindo..." : "Confirmar exclusão"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
