import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase"
import { Colaborador } from "@/components/ColaboradoresTable/columns"
import { ContratadosTable } from "@/components/ContratadosTable"

export default async function ContratadosPage() {
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
        <div className="w-full animate-fade-in-up min-h-screen pb-12">
            <PageHeader
                title="Gestão de Contratados"
                breadcrumbs={[
                    { name: "Home", href: "/" },
                    { name: "Contratados" }
                ]}
            />

            <div className="mx-auto px-0 mt-6">
                <div className="rounded-lg">
                    <ContratadosTable data={colaboradores} />
                </div>
            </div>
        </div>
    );
}
