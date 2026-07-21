import { useArticlePage } from "../hooks/useArticlePage";
import { ArticleHeader } from "../components/ArticleHeader";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { hiddenTimestamp } from "../utils/anki";

function WriteSkill() {
	const { article, hasSelection, rpc, getCachedSelection } = useArticlePage();

	function addNote(isFullLine: boolean) {
		if (!article) return;
		const result = getCachedSelection();
		if (!result) return;
		const front = isFullLine ? result.line : result.markedLine;
		rpc.request("add-anki-note", {
			front: `${front}${hiddenTimestamp()}`,
			back: "",
			title: article.title,
			url: article.url,
			deckName: "English",
			modelName: "@Basic",
		});
	}

	return (
		<div className="h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
			<ArticleHeader article={article} />

			{article && (
				<div className={`flex-1 overflow-y-auto px-4 ${hasSelection ? "pb-16" : "pb-10"}`}>
					<div className="container mx-auto max-w-3xl">
						<article className="bg-white rounded-xl shadow-xl p-8">
							<div className="prose prose-lg max-w-none text-gray-700">
								{(() => {
									const translatedLines = article.translated_content?.split("\n") ?? [];
									const contentLines = article.content.split("\n");
									return translatedLines.map((line, i) => (
										<div key={i} className="mb-2">
											<p>{line}</p>
											<details className="text-sm text-gray-500">
												<summary className="cursor-pointer hover:text-gray-700">Show original</summary>
												<p className="mt-1 pl-4 border-l-2 border-gray-200">{contentLines[i]}</p>
											</details>
										</div>
									));
								})()}
							</div>
						</article>
					</div>
				</div>
			)}

			{hasSelection && (
				<SelectionToolbar
					onAddWithMark={() => addNote(false)}
					onAddFullLine={() => addNote(true)}
				/>
			)}
		</div>
	);
}

export default WriteSkill;
