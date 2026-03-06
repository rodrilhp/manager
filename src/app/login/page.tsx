"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Lock } from "lucide-react";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-4 relative overflow-hidden h-[calc(100vh-65px)]">

            {/* Fake UI Background to simulate overlay over the app */}
            <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
                <div className="max-w-7xl mx-auto px-8 pt-24 space-y-8 blur-[8px]">
                    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-10"></div>
                    <div className="h-64 bg-white border border-gray-200 rounded-xl shadow-sm"></div>
                </div>
            </div>

            {/* Modal - Strong Blur Overlay */}
            <div className="absolute inset-0 bg-gray-50/60 backdrop-blur-xl z-10" />

            {/* Login Card */}
            <div className="relative z-20 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mb-4">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Acesso Restrito</h2>
                    <p className="text-gray-500 text-sm mt-1 text-center">
                        Esta área é protegida. Insira suas credenciais para continuar.
                    </p>
                </div>

                <form action={formAction} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                            Usuário
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Ex: rodrigo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                        {isPending ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : "Entrar na Aplicação"}
                    </button>
                </form>
            </div>
        </div>
    );
}
