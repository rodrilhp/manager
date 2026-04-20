"use client"

import React, { useState } from "react"

interface Props {
    valor: number
    onChange: (novoValor: number) => void
}

export function OrcamentoWidget({ valor, onChange }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState(valor.toString())

    const handleSave = () => {
        const novoValor = parseFloat(inputValue) || 0
        onChange(novoValor)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setInputValue(valor.toString())
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave()
        if (e.key === "Escape") handleCancel()
    }

    return (
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-600 mb-1">Orçamento Mensal</p>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-medium text-neutral-700">R$</span>
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-32 px-2 py-1 border border-blue-500 rounded text-2xl font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ) : (
                        <p className="text-3xl font-bold text-neutral-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setIsEditing(true)}>
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(valor)}
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
            </div>
            {isEditing && (
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleSave}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                        Salvar
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-3 py-1.5 bg-neutral-200 text-neutral-700 text-sm font-medium rounded hover:bg-neutral-300 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            )}
            <p className="text-xs text-neutral-500 mt-3">Clique para editar o orçamento mensal</p>
        </div>
    )
}
