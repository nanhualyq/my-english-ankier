import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type Breadcrumb = { label: string; path?: string };

export function PageLayout({ children, breadcrumbs = [] }: { children: ReactNode; breadcrumbs?: Breadcrumb[] }) {
	return (
		<div className="min-h-screen">
			{breadcrumbs.length > 0 && (
				<nav className="fixed top-0 left-0 right-0 h-10 bg-white border-b border-gray-200 flex items-center px-4 text-sm z-50">
					{breadcrumbs.map((crumb, i) => (
						<span key={i} className="flex items-center">
							{i > 0 && <span className="mx-2 text-gray-400">/</span>}
							{crumb.path ? (
								<Link to={crumb.path} className="text-primary-600 hover:text-primary-800">
									{crumb.label}
								</Link>
							) : (
								<span className="text-gray-500">{crumb.label}</span>
							)}
						</span>
					))}
				</nav>
			)}
			<div className={breadcrumbs.length > 0 ? "pt-10" : ""}>
				{children}
			</div>
		</div>
	);
}
