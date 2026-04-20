"use client"

interface Props {
    saldo: number
    orcamento: number
    somaAtual: number
}

export function SaldoWidget({ saldo, orcamento, somaAtual }: Props) {
    const percentualUtilizado = orcamento > 0 ? (somaAtual / orcamento) * 100 : 0
    const isPositivo = saldo >= 0

    return (
        <div className={`bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow ${
            isPositivo
                ? "border-green-200"
                : "border-red-200"
        }`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-600 mb-1">Saldo Disponível</p>
                    <p className={`text-3xl font-bold ${
                        isPositivo
                            ? "text-green-600"
                            : "text-red-600"
                    }`}>
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(saldo)}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isPositivo
                        ? "bg-green-100"
                        : "bg-red-100"
                }`}>
                    <svg className={`w-6 h-6 ${
                        isPositivo
                            ? "text-green-600"
                            : "text-red-600"
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7H6v10m0 0l3-3m-3 3l-3-3m0 0V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v10" />
                    </svg>
                </div>
            </div>

            {/* Barra de progresso */}
            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-medium text-neutral-700">Utilização</p>
                    <p className="text-xs font-medium text-neutral-600">{percentualUtilizado.toFixed(1)}%</p>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all ${
                            percentualUtilizado <= 80
                                ? "bg-green-500"
                                : percentualUtilizado <= 100
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(percentualUtilizado, 100)}%` }}
                    />
                </div>
            </div>

            <p className="text-xs text-neutral-500 mt-3">
                Orçamento: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(orcamento)}
            </p>
        </div>
    )
}
