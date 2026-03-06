import PageHeader from "@/components/PageHeader";

export default function ContratadosPage() {
    return (
        <div className="w-full animate-fade-in-up">
            <PageHeader
                title="Gestão de Contratados"
                breadcrumbs={[
                    { name: "Home", href: "/" },
                    { name: "Contratados" }
                ]}
            />

            <div className="mt-6 p-12 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Lista de Colaboradores</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    O módulo de controle de contratados está sendo estruturado. Em breve você visualizará e gerenciará todos os funcionários por aqui.
                </p>
            </div>
        </div>
    );
}
