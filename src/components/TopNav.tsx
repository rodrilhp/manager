"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { logout } from "@/app/login/actions";

export default function TopNav({ username }: { username?: string | null }) {
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isAdminMode = pathname.startsWith("/configuracoes")

    const normalTabs = [
        { name: "Home", href: "/" },
        { name: "Contratados", href: "/contratados" },
        { name: "Financeiro", href: "/financeiro" },
        { name: "Performance", href: "/performance" },
        { name: "Organograma", href: "/organograma" },
    ]

    const adminTabs = [
        { name: "Home", href: "/" },
        { name: "Colaboradores", href: "/configuracoes" },
        { name: "Salários", href: "/configuracoes/salarios" },
    ]

    const tabs = isAdminMode ? adminTabs : normalTabs;

    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
            {/* Logo Section */}
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg leading-none">ZG</span>
                        </div>
                        <span className="text-gray-900 font-semibold text-xl tracking-tight">ZG Pessoas</span>
                    </div>

                    {/* User Section */}
                    {username && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center border border-blue-100">
                                    <User size={16} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 capitalize hidden sm:block">{username}</span>
                                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Logado como</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize truncate mt-0.5">{username}</p>
                                    </div>
                                    <Link
                                        href="/configuracoes"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <Settings size={16} className="text-gray-400" /> Configurações
                                    </Link>
                                    <form action={logout}>
                                        <button
                                            type="submit"
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors mt-1 border-t border-gray-50 pt-3 cursor-pointer"
                                        >
                                            <LogOut size={16} className="text-red-400" /> Sair
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <div className={`border-t border-gray-100 bg-white`}>
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const isActive = tab.href === "/configuracoes"
                                ? pathname === tab.href
                                : pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href))
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    onClick={() => setIsDropdownOpen(false)}
                                    className={`
                                        mr-6 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2
                                        ${isActive
                                            ? isAdminMode
                                                ? "border-blue-600 text-blue-700"
                                                : "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                                        }
                                    `}
                                >
                                    {tab.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
