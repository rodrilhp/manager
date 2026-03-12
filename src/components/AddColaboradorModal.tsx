"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { X } from "lucide-react"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { DatePickerInput } from "@/components/DatePickerInput"

const ESTADOS_BR = [
    "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
    "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
]

interface Props {
    isOpen: boolean
    onClose: () => void
    initialData?: Colaborador | null
}

const emptyForm = {
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
}

export function AddColaboradorModal({ isOpen, onClose, initialData = null }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const parseDBDateToDisplay = (dateStr?: string | null) => {
        if (!dateStr) return ""
        const [datePart] = dateStr.split("T")
        const [year, month, day] = datePart.split("-")
        if (!year || !month || !day) return ""
        return `${day}/${month}/${year}`
    }


    const formatCurrencyInput = (value: string) => {
        const onlyNumbers = value.replace(/[^0-9,.-]/g, "").replace(/\./g, "")
        if (!onlyNumbers) return ""

        const normalized = onlyNumbers.replace(/,/g, ".")
        const num = Number(normalized)
        if (Number.isNaN(num)) return ""

        return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const toUpperCaseValue = (value?: string | null) => {
        return value ? value.toUpperCase() : value
    }

    const parseDisplayDateToDB = (display: string) => {
        const parts = display.split("/")
        if (parts.length !== 3) return null
        const [day, month, year] = parts
        if (!day || !month || !year) return null
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }

    const buildInitialForm = () => {
        if (!initialData) return { ...emptyForm }

        return {
            nome: initialData.nome ?? "",
            e_mail: initialData.e_mail ?? "",
            cargo: initialData.cargo ?? "",
            senioridade: initialData.senioridade ?? "",
            produto: initialData.produto ?? "",
            foco: initialData.foco ?? "",
            estado: initialData.estado ?? "",
            salario: initialData.salario != null ? Number(initialData.salario).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
            data_entrada: parseDBDateToDisplay(initialData.data_entrada),
            data_saida: parseDBDateToDisplay(initialData.data_saida),
            saiu_do_time: initialData.saiu_do_time ?? false,
            data_ultimo_reajuste: parseDBDateToDisplay(initialData.data_ultimo_reajuste),
            ultimo_reajuste: initialData.ultimo_reajuste != null ? String(initialData.ultimo_reajuste) : "",
            possui_plano: initialData.possui_plano ?? false,
            percent_da_zg: initialData.percent_da_zg != null ? String(initialData.percent_da_zg) : "",
            aniversario: parseDBDateToDisplay(initialData.aniversario),
        }
    }

    const [form, setForm] = useState(buildInitialForm)

    useEffect(() => {
        if (typeof document === "undefined") return

        const previousOverflow = document.body.style.overflow

        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = previousOverflow || ""
        }

        return () => {
            document.body.style.overflow = previousOverflow || ""
        }
    }, [isOpen])

    const set = (field: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const payload = {
            nome: toUpperCaseValue(form.nome.trim()),
            e_mail: form.e_mail.trim() || null,
            cargo: toUpperCaseValue(form.cargo) || null,
            senioridade: toUpperCaseValue(form.senioridade) || null,
            produto: toUpperCaseValue(form.produto) || null,
            foco: toUpperCaseValue(form.foco) || null,
            estado: toUpperCaseValue(form.estado) || null,
            salario: form.salario ? Number(form.salario.replace(/\./g, "").replace(/,/g, ".")) : null,
            data_entrada: parseDisplayDateToDB(form.data_entrada),
            data_saida: parseDisplayDateToDB(form.data_saida),
            saiu_do_time: form.saiu_do_time,
            data_ultimo_reajuste: parseDisplayDateToDB(form.data_ultimo_reajuste),
            ultimo_reajuste: form.ultimo_reajuste ? Number(form.ultimo_reajuste.replace(/\./g, "").replace(/,/g, ".")) : null,
            possui_plano: form.possui_plano,
            percent_da_zg: form.percent_da_zg ? Number(form.percent_da_zg.replace(/\./g, "").replace(/,/g, ".")) : null,
            aniversario: parseDisplayDateToDB(form.aniversario),
        }

        const query = initialData
            ? supabase.from("colaboradores").update(payload).eq("id", initialData.id)
            : supabase.from("colaboradores").insert(payload)

        const { error } = await query

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setLoading(false)
        onClose()
        router.refresh()
    }

    if (!isOpen || typeof document === "undefined") return null

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900">{initialData ? "Editar Colaborador" : "Novo Colaborador"}</h2>
                        <p className="text-sm text-neutral-500 mt-0.5">{initialData ? "Atualize os dados do colaborador" : "Preencha os dados do colaborador"}</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                            <div className="sm:col-span-3">
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
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                                <input
                                    type="email"
                                    value={form.e_mail}
                                    onChange={(e) => set("e_mail", e.target.value)}
                                    placeholder="email@empresa.com"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                                            <div className="sm:col-span-2">
                                <DatePickerInput
                                    label="Aniversário"
                                    value={form.aniversario}
                                    onChange={(value) => set("aniversario", value)}
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
                                <select
                                    value={form.produto}
                                    onChange={(e) => set("produto", e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Selecionar</option>
                                    <option>ZG</option>
                                    <option>ZGT</option>
                                    <option>ZG/ZGT</option>
                                </select>
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

                    {/* Remuneração  e Datas*/}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Remuneração e datas</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <DatePickerInput
                                    label="Data de Admissão"
                                    value={form.data_entrada}
                                    onChange={(value) => set("data_entrada", value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Salário (R$)</label>
                                <input
                                    type="text"
                                    value={form.salario}
                                    onChange={(e) => set("salario", e.target.value)}
                                    onBlur={(e) => set("salario", formatCurrencyInput(e.target.value))}
                                    placeholder="0,00"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <DatePickerInput
                                    label="Data Último Reajuste"
                                    value={form.data_ultimo_reajuste}
                                    onChange={(value) => set("data_ultimo_reajuste", value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Último Reajuste (R$)</label>
                                <input
                                    type="text"
                                    value={form.ultimo_reajuste}
                                    onChange={(e) => set("ultimo_reajuste", e.target.value)}
                                    onBlur={(e) => set("ultimo_reajuste", formatCurrencyInput(e.target.value))}
                                    placeholder="0,00"
                                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Outras informações */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Outras informações</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end h-10 mb-2">
                            <div className="flex items-center gap-3 sm:col-span-1 h-full">
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
                                <div className="flex items-center space-x-2 h-full">
                                    <label className="flex text-sm text-nowrap font-medium text-neutral-700 mb-1">Participação ZG</label>
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end h-11">
                            <div className="flex items-center gap-3 sm:col-span-1 h-full">
                                <button
                                    type="button"
                                    onClick={() => set("saiu_do_time", !form.saiu_do_time)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.saiu_do_time ? "bg-red-500" : "bg-neutral-200"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.saiu_do_time ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                                <span className="text-sm font-medium text-neutral-700">
                                    Saiu do time
                                </span>
                            </div>
                            {form.saiu_do_time && (
                                <div className="flex items-center space-x-2 h-full">
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
                            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {loading ? "Salvando..." : initialData ? "Atualizar" : "Salvar Colaborador"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
