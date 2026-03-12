export default function FinanceiroPage() {
    return (
        <div className="w-full animate-fade-in-up">
            <div className="mt-6 p-12 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Operações Financeiras</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    Em breve você poderá gerenciar pagamentos, folha de pagamento e faturamento por aqui.
                </p>
            </div>
        </div>
    );
}
