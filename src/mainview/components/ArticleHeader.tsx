import { Link } from "react-router-dom";
import type { Article } from "../../shared/rpcSchema";

interface ArticleHeaderProps {
	article: Article | null;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
	return (
		<div className="container mx-auto px-4 pt-10 pb-4 max-w-3xl shrink-0">
			<Link to="/" className="text-white/80 hover:text-white text-sm mb-6 inline-block">
				&larr; Back to articles
			</Link>

			{article && (
				<>
					<h1 className="text-3xl font-bold text-white mb-2">{article.title}</h1>
					{article.url && (
						<a
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-white/60 hover:text-white mb-4 inline-block truncate max-w-full"
						>
							{article.url}
						</a>
					)}
				</>
			)}
		</div>
	);
}
