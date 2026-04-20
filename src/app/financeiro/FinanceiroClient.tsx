"use client"

import React, { useState, useCallback } from "react"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { Salario } from "@/components/SalariosTable"
import { SomaWidget } from "@/app/financeiro/components/SomaWidget"
import { OrcamentoWidget } from "@/app/financeiro/components/OrcamentoWidget"
import { SaldoWidget } from "@/app/financeiro/components/SaldoWidget"
import { FinanceiroTable } from "@/app/financeiro/components/FinanceiroTable"

interface Props {
    colaboradores: Colaborador[]
    salarios: Salario[]
    orcamentoInicial: number
}

export function FinanceiroClient({ colaboradores, salarios, orcamentoInicial }: Props) {
    const [orcamento, setOrcamento] = useState(() => {
        // Carregar do localStorage se existir, senão usar o inicial
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('financeiro-orcamento')
            return saved ? parseFloat(saved) : orcamentoInicial
        }
        return orcamentoInicial
    })
    const [novosSalarios, setNovosSalarios] = useState<Record<string, number>>({})

    // Salvar orçamento no localStorage sempre que mudar
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('financeiro-orcamento', orcamento.toString())
        }
    }, [orcamento])

    // Calcula a soma atual dos salários (original + novos se existirem)
    const calculaSomaAtual = useCallback(() => {
        return colaboradores.reduce((total, colab) => {
            const salarioAtual = novosSalarios[colab.id] || colab.salario || 0
            return total + salarioAtual
        }, 0)
    }, [colaboradores, novosSalarios])

    const somaAtual = calculaSomaAtual()
    const saldo = orcamento - somaAtual

    // Função para normalizar cargo para busca de salários
    const normalizarCargo = useCallback((cargo: string | null): string | null => {
        if (!cargo) return null
        const cargoLower = cargo.toLowerCase().trim()

        // Todos os analistas são considerados analistas de TI
        if (cargoLower.includes('analista')) {
            return 'Analista de TI'
        }

        // Outros cargos especiais - fazer correspondência mais flexível
        if (cargoLower.includes('squad') && cargoLower.includes('leader')) {
            return 'Squad Leader'
        }
        if (cargoLower.includes('product') && cargoLower.includes('designer')) {
            return 'Product Designer'
        }
        if (cargoLower.includes('tribe') && cargoLower.includes('leader')) {
            return 'Tribe Leader'
        }

        return cargo
    }, [])

    // Busca o próximo step salarial para um colaborador
    const buscaProximoStep = useCallback((colaborador: Colaborador): number | null => {
        const cargoNormalizado = normalizarCargo(colaborador.cargo)
        const salariosDoCargu = salarios.filter(
            s => {
                const salarioCargo = s.cargo?.toLowerCase().trim()
                const colaboradorCargo = cargoNormalizado?.toLowerCase().trim()
                return salarioCargo === colaboradorCargo
            }
        )

        if (salariosDoCargu.length === 0) {
            // Tentar busca mais flexível se não encontrou correspondência exata
            const cargoBase = cargoNormalizado?.toLowerCase().split(' ')[0] // primeira palavra
            const salariosFlexiveis = salarios.filter(s =>
                s.cargo?.toLowerCase().includes(cargoBase || '')
            )
            if (salariosFlexiveis.length > 0) {
                // Usar os salários encontrados na busca flexível
                const salariosOrdenados = salariosFlexiveis.sort((a, b) => (a.salario || 0) - (b.salario || 0))
                const salarioAtual = novosSalarios[colaborador.id] || colaborador.salario || 0
                const proximoStep = salariosOrdenados.find(s => (s.salario || 0) > salarioAtual)
                return proximoStep?.salario || null
            }
            return null
        }

        const salariosOrdenados = salariosDoCargu.sort((a, b) => (a.salario || 0) - (b.salario || 0))
        const salarioAtual = novosSalarios[colaborador.id] || colaborador.salario || 0

        // Encontra o próximo step maior que o salário atual
        const proximoStep = salariosOrdenados.find(s => (s.salario || 0) > salarioAtual)
        return proximoStep?.salario || null
    }, [salarios, novosSalarios, normalizarCargo])

    // Busca o step salarial anterior para um colaborador
    const buscaStepAnterior = useCallback((colaborador: Colaborador): number | null => {
        const cargoNormalizado = normalizarCargo(colaborador.cargo)
        const salariosDoCargu = salarios.filter(
            s => s.cargo?.toLowerCase() === cargoNormalizado?.toLowerCase()
        )
        if (salariosDoCargu.length === 0) return null

        const salariosOrdenados = salariosDoCargu.sort((a, b) => (a.salario || 0) - (b.salario || 0))
        const salarioAtual = novosSalarios[colaborador.id] || colaborador.salario || 0

        // Encontra o step anterior menor que o salário atual
        const stepsAnteriores = salariosOrdenados.filter(s => (s.salario || 0) < salarioAtual)
        return stepsAnteriores.length > 0 ? stepsAnteriores[stepsAnteriores.length - 1].salario || null : null
    }, [salarios, novosSalarios, normalizarCargo])

    // Handler para avançar step
    const handleAvancarStep = useCallback((colaboradorId: string) => {
        const colaborador = colaboradores.find(c => c.id === colaboradorId)
        if (!colaborador) return

        const proximoStep = buscaProximoStep(colaborador)
        if (proximoStep !== null) {
            setNovosSalarios(prev => ({
                ...prev,
                [colaboradorId]: proximoStep
            }))
        }
    }, [colaboradores, buscaProximoStep])

    // Handler para voltar step
    const handleVoltarStep = useCallback((colaboradorId: string) => {
        const colaborador = colaboradores.find(c => c.id === colaboradorId)
        if (!colaborador) return

        const stepAnterior = buscaStepAnterior(colaborador)
        if (stepAnterior !== null) {
            setNovosSalarios(prev => ({
                ...prev,
                [colaboradorId]: stepAnterior
            }))
        } else {
            // Se não há step anterior, volta ao salário original
            setNovosSalarios(prev => {
                const newState = { ...prev }
                delete newState[colaboradorId]
                return newState
            })
        }
    }, [colaboradores, buscaStepAnterior])

    return (
        <div className="space-y-6">
            {/* Widgets superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SomaWidget valorTotal={somaAtual} />
                <OrcamentoWidget 
                    valor={orcamento}
                    onChange={setOrcamento}
                />
                <SaldoWidget 
                    saldo={saldo}
                    orcamento={orcamento}
                    somaAtual={somaAtual}
                />
            </div>

            {/* Tabela */}
            <FinanceiroTable 
                colaboradores={colaboradores}
                novosSalarios={novosSalarios}
                buscaProximoStep={buscaProximoStep}
                buscaStepAnterior={buscaStepAnterior}
                onAvancarStep={handleAvancarStep}
                onVoltarStep={handleVoltarStep}
            />
        </div>
    )
}
