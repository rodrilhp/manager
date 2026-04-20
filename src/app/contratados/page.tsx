import { supabase } from "@/lib/supabase"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { ContratadosTable } from "@/components/ContratadosTable"

export default async function ContratadosPage() {
    let colaboradores: Colaborador[] = []
    let errorMessage = ""

    try {
        const { data, error } = await supabase
            .from("colaboradores")
            .select("*")
            .order("nome", { ascending: true })

        if (error) {
            console.error("Erro ao buscar colaboradores:", error)
            errorMessage = `Erro ao buscar colaboradores: ${error.message}`
        } else {
            colaboradores = data || []
        }
    } catch (err) {
        console.error("Erro de conexão:", err)
        errorMessage = "Erro de conexão com o banco de dados. Verifique sua conexão com a internet ou as configurações do Supabase."
    }

    return (
        <div className="w-full animate-fade-in-up min-h-screen pb-12">
            <div className="mx-auto px-0 mt-6">
                <div className="rounded-lg">
                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}
                    <ContratadosTable data={colaboradores} />
                </div>
            </div>
        </div>
    );
}
