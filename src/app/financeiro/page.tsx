import { supabase } from "@/lib/supabase"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { Salario } from "@/components/SalariosTable"
import { FinanceiroClient } from "./FinanceiroClient"

export default async function FinanceiroPage() {
    let colaboradores: Colaborador[] = []
    let salarios: Salario[] = []
    let orcamento = 0
    let errorMessage = ""

    try {
        // Buscar colaboradores ativos
        const { data: colaboradoresData, error: colaboradoresError } = await supabase
            .from("colaboradores")
            .select("*")
            .eq("saiu_do_time", false)
            .order("nome", { ascending: true })

        if (colaboradoresError) {
            console.error("Erro ao buscar colaboradores:", colaboradoresError)
            errorMessage = `Erro ao buscar colaboradores: ${colaboradoresError.message}`
        } else {
            colaboradores = (colaboradoresData as Colaborador[] | null) || []
        }

        // Buscar tabela de salários
        const { data: salariosData, error: salariosError } = await supabase
            .from("salarios")
            .select("*")
            .order("cargo", { ascending: true })

        if (salariosError) {
            console.error("Erro ao buscar salários:", salariosError)
        } else {
            salarios = (salariosData as Salario[] | null) || []
        }

        // Buscar orçamento (supondo que existe uma tabela "orcamento")
        const { data: orcamentoData, error: orcamentoError } = await supabase
            .from("orcamento")
            .select("valor")
            .single()

        if (!orcamentoError && orcamentoData) {
            orcamento = (orcamentoData as any).valor || 0
        }
    } catch (err) {
        console.error("Erro de conexão:", err)
        errorMessage = "Erro de conexão com o banco de dados. Verifique sua conexão com a internet."
    }

    return (
        <div className="w-full animate-fade-in-up min-h-screen pb-12">
            <div className="mx-auto px-0 mt-6">
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errorMessage}
                    </div>
                )}
                <FinanceiroClient 
                    colaboradores={colaboradores}
                    salarios={salarios}
                    orcamentoInicial={orcamento}
                />
            </div>
        </div>
    )
}
