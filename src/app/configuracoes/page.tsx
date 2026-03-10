import { supabase } from "@/lib/supabase"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { ConfiguracoesClient } from "./ConfiguracoesClient"

export default async function ConfiguracoesPage() {
    const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("nome", { ascending: true })

    if (error) {
        console.error("Erro ao buscar colaboradores:", error)
    }

    const colaboradores: Colaborador[] = data || []

    return (
        <div className="w-full animate-fade-in-up">
            <ConfiguracoesClient data={colaboradores} />
        </div>
    )
}
