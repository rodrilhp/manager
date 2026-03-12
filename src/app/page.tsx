export default function Home() {
  return (
    <div className="w-full animate-fade-in-up">
      <div className="mt-6 p-12 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Visão Geral</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Os dados consolidados da empresa aparecerão aqui em breve, com gráficos e relatórios detalhados.
        </p>
      </div>
    </div>
  );
}
