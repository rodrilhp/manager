"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { X } from "lucide-react"

const ESTADOS_BR = [
    "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
    "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
]

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function AddColaboradorModal({ isOpen, onClose }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        nome: "",
        e_mail: "",
        cargo: "",
        senioridade: "",
        produto: "",
        foco: "",
        estado: "",
        salario: "",
        data_entrada: "",
        data_saida: "",
        saiu_do_time: false,
        data_ultimo_reajuste: "",
        ultimo_reajuste: "",
        possui_plano: false,
        percent_da_zg: "",
        aniversario: "",
    })

    const set = (field: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const payload = {
            nome: form.nome.trim(),
            e_mail: form.e_mail || null,
            cargo: form.cargo || null,
            senioridade: form.senioridade || null,
            produto: form.produto || null,
            foco: form.foco || null,
            estado: form.estado || null,
            salario: form.salario ? parseFloat(form.salario) : null,
            data_entrada: form.data_entrada || null,
            data_saida: form.data_saida || null,
            saiu_do_time: form.saiu_do_time,
            data_ultimo_reajuste: form.data_ultimo_reajuste || null,
            ultimo_reajuste: form.ultimo_reajuste ? parseFloat(form.ultimo_reajuste) : null,
            possui_plano: form.possui_plano,
            percent_da_zg: form.percent_da_zg ? parseFloat(form.percent_da_zg) : null,
            aniversario: form.aniversario || null,
        }

        const { error } = await supabase.from("colaboradores").insert(payload)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setLoading(false)
        onClose()
        router.refresh()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900">Novo Colaborador</h2>
                        <p className="text-sm text-neutral-500 mt-0.5">Preencha os dados do colaborador</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
                    {/* Identificação */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Identificação</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={form.nome}
                                    onChange={(e) => set("nome", e.target.value)}
                                    placeholder="Nome completo"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                                <input
                                    type="email"
                                    value={form.e_mail}
                                    onChange={(e) => set("e_mail", e.target.value)}
                                    placeholder="email@empresa.com"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Cargo e Alocação */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Cargo e Alocação</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Cargo</label>
                                <input
                                    type="text"
                                    value={form.cargo}
                                    onChange={(e) => set("cargo", e.target.value)}
                                    placeholder="Ex: Desenvolvedor"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Senioridade</label>
                                <select
                                    value={form.senioridade}
                                    onChange={(e) => set("senioridade", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Selecionar</option>
                                    <option>Júnior</option>
                                    <option>Pleno</option>
                                    <option>Sênior</option>
                                    <option>Especialista</option>
                                    <option>Líder</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Estado</label>
                                <select
                                    value={form.estado}
                                    onChange={(e) => set("estado", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">UF</option>
                                    {ESTADOS_BR.map((uf) => (
                                        <option key={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Produto</label>
                                <input
                                    type="text"
                                    value={form.produto}
                                    onChange={(e) => set("produto", e.target.value)}
                                    placeholder="Ex: Plataforma"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Foco</label>
                                <select
                                    value={form.foco}
                                    onChange={(e) => set("foco", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Selecionar</option>
                                    <option>Evolução</option>
                                    <option>Manutenção</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Remuneração */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Remuneração</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Salário (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.salario}
                                    onChange={(e) => set("salario", e.target.value)}
                                    placeholder="0,00"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Último Reajuste (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.ultimo_reajuste}
                                    onChange={(e) => set("ultimo_reajuste", e.target.value)}
                                    placeholder="0,00"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Data Último Reajuste</label>
                                <input
                                    type="date"
                                    value={form.data_ultimo_reajuste}
                                    onChange={(e) => set("data_ultimo_reajuste", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Plano de Saúde */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Benefícios</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            <div className="flex items-center gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => set("possui_plano", !form.possui_plano)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.possui_plano ? "bg-blue-600" : "bg-neutral-200"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.possui_plano ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                                <span className="text-sm font-medium text-neutral-700">Possui Plano de Saúde</span>
                            </div>
                            {form.possui_plano && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">% Participação ZG</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.percent_da_zg}
                                        onChange={(e) => set("percent_da_zg", e.target.value)}
                                        placeholder="Ex: 80"
                                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Datas */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Datas</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Data de Admissão</label>
                                <input
                                    type="date"
                                    value={form.data_entrada}
                                    onChange={(e) => set("data_entrada", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Aniversário</label>
                                <input
                                    type="date"
                                    value={form.aniversario}
                                    onChange={(e) => set("aniversario", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Status */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Status</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => set("saiu_do_time", !form.saiu_do_time)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.saiu_do_time ? "bg-red-500" : "bg-neutral-200"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.saiu_do_time ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                                <span className="text-sm font-medium text-neutral-700">
                                    {form.saiu_do_time ? "Saiu do time" : "Ativo no time"}
                                </span>
                            </div>
                            {form.saiu_do_time && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Data de Desligamento</label>
                                    <input
                                        type="date"
                                        value={form.data_saida}
                                        onChange={(e) => set("data_saida", e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {loading ? "Salvando..." : "Salvar Colaborador"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
