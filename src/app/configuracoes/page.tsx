import { supabase } from "@/lib/supabase"
import { ColaboradoresTable } from "@/components/ColaboradoresTable"
import { columns, Colaborador } from "@/components/ColaboradoresTable/columns"


export default async function ConfiguracoesPage() {
    // Fetch data from Supabase
    const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("nome", { ascending: true })

    if (error) {
        console.error("Erro ao buscar colaboradores:", error)
    }

    const colaboradores: Colaborador[] = data || []

    return (
        <div className="w-full animate-fade-in-up space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900">
                    Configurações
                </h1>
                <p className="text-neutral-500">
                    Gerencie sua equipe, integre dados via CSV e configure os parâmetros do sistema.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-800">
                    Colaboradores ({colaboradores.length})
                </h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors">
                        Importar CSV
                    </button>
                    <button className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors">
                        Adicionar Colaborador
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
                <ColaboradoresTable columns={columns} data={colaboradores} />
            </div>
        </div>
    )
}
