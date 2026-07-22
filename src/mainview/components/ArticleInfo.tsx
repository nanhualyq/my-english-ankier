import { Link } from "react-router-dom";
import type { Article } from "../../shared/rpcSchema";

export function ArticleInfo({ article }: { article: Article }) {
	return (
		<div className="px-4 py-3 flex items-center gap-4 text-sm border-b border-gray-200">
			{article.url && (
				<a href={article.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 truncate">
					{article.url}
				</a>
			)}
			<Link to={`/edit-article/${article.id}`} className="text-primary-600 hover:text-primary-800 ml-auto">
				Edit
			</Link>
		</div>
	);
}
