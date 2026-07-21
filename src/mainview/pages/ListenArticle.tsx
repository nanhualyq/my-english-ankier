import { useArticlePage } from "../hooks/useArticlePage";
import { ArticleHeader } from "../components/ArticleHeader";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { TTSPlayer } from "../components/TTSPlayer";

function ListenArticle() {
	const { article, hasSelection, addNote } = useArticlePage({
		modelName: "@EnListen",
		listenMode: true,
	});

	return (
		<div className="h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
			<ArticleHeader article={article} />

			{article && (
				<div className={`flex-1 overflow-y-auto px-4 ${hasSelection ? "pb-16" : "pb-10"}`}>
					<div className="container mx-auto max-w-3xl">
						<article className="bg-white rounded-xl shadow-xl p-8">
							<div className="prose prose-lg max-w-none text-gray-700 space-y-4">
								{article.content.split("\n").map((line, i) => (
								<div key={i} className="space-y-2">
									<TTSPlayer text={line} className="w-full" />
									<details className="text-sm text-gray-500">
										<summary className="cursor-pointer hover:text-gray-700">Show original</summary>
										<p className="mt-1 pl-4 border-l-2 border-gray-200">{line}</p>
									</details>
								</div>
								))}
							</div>
						</article>
					</div>
				</div>
			)}

			{hasSelection && <SelectionToolbar addNote={addNote} />}
		</div>
	);
}

export default ListenArticle;
