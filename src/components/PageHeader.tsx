import Link from "next/link";

interface PageHeaderProps {
    title: string;
    breadcrumbs: { name: string; href?: string }[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            <nav className="flex mb-3" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <li key={crumb.name} className="inline-flex items-center">
                                {index > 0 && (
                                    <svg
                                        className="w-4 h-4 text-gray-400 mx-1"
                                        aria-hidden="true"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                )}
                                {crumb.href && !isLast ? (
                                    <Link
                                        href={crumb.href}
                                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        {crumb.name}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-medium text-gray-900">
                                        {crumb.name}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Em Construção
                </div>
            </div>
        </div>
    );
}
