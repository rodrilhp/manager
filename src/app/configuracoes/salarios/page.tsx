import { supabase } from "@/lib/supabase"
import { SalariosTable, Salario } from "@/components/SalariosTable"

export default async function SalariosPage() {
  const { data, error } = await supabase
    .from("salarios")
    .select("*")
    .order("created_at", { ascending: false })

  const salarios: Salario[] = (data as Salario[] | null) || []

  const fetchError = error ? `${error.message || "Erro desconhecido"} (${JSON.stringify(error)})` : null
  if (error) {
    console.error("Erro ao buscar salários:", error)
  }

  return (
    
    <div className="w-full animate-fade-in-up min-h-screen pb-12">

      {fetchError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4 text-sm text-red-700">
          Erro ao buscar salários: <strong>{fetchError}</strong>. Verifique se a tabela `salarios` existe no Supabase.
        </div>
      ) : null}

      <SalariosTable data={salarios} />
    </div>
  )
}
