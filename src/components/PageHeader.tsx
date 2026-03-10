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
        </div>
    );
}
