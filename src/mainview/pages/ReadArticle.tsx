import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRPC } from "../RPCContext";
import { useTextSelection } from "../hooks/useTextSelection";
import type { Article } from "../../shared/rpcSchema";

function ReadArticle() {
	const rpc = useRPC();
	const { id } = useParams<{ id: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const { hasSelection, getCachedSelection } = useTextSelection();

	useEffect(() => {
		rpc.request("get-article", { id: Number(id) }).then(setArticle);
	}, [id, rpc]);

	function addNote(stripMarks: boolean) {
		if (!article) return;
		const result = getCachedSelection();
		if (!result) return;

		const frontContent = stripMarks ? result.line : result.markedLine;
		const frontWithTimestamp = `${frontContent}<span style="display:none">${Date.now()}</span>`;

		rpc.request("add-anki-note", {
			front: frontWithTimestamp,
			back: "",
			title: article.title,
			url: article.url,
			deckName: "English",
			modelName: "@Basic",
		});
	}

	return (
		<div className="h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
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

			{article && (
				<div className={`flex-1 overflow-y-auto px-4 ${hasSelection ? "pb-16" : "pb-10"}`}>
					<div className="container mx-auto max-w-3xl">
						<article className="bg-white rounded-xl shadow-xl p-8">
					<div
						className="prose prose-lg max-w-none text-gray-700"
					>
							{article.content.split("\n").map((line, i) => (
								<p key={i}>{line}</p>
							))}
						</div>
						</article>
					</div>
				</div>
			)}

			{hasSelection && (
				<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
					<div className="container mx-auto max-w-3xl flex items-center justify-end">
						<div className="flex gap-2">
							<button
								accessKey="s"
								onClick={() => addNote(false)}
								className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
							>
								Add (with mark)
							</button>
							<button
								accessKey="f"
								onClick={() => addNote(true)}
								className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
							>
								Add (full line)
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ReadArticle;
