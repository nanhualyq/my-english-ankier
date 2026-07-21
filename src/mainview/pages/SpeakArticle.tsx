import { useArticlePage } from "../hooks/useArticlePage";
import { ArticleHeader } from "../components/ArticleHeader";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { TTSPlayer } from "../components/TTSPlayer";
import { hiddenTimestamp } from "../utils/anki";

function SpeakArticle() {
	const { article, hasSelection, rpc, getCachedSelection } = useArticlePage();

	function addNote(isFullLine: boolean) {
		if (!article) return;
		const result = getCachedSelection();
		if (!result) return;
		const front = isFullLine ? result.line : result.markedLine;
		const back = isFullLine ? result.line : result.text;
		rpc.request("add-anki-note", {
			front: `${front}${hiddenTimestamp()}`,
			back,
			title: article.title,
			url: article.url,
			deckName: "English",
			modelName: "@EnSpeak",
		});
	}

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
									<p className="text-sm text-gray-500">{line}</p>
									<TTSPlayer text={line} className="w-full" />
								</div>
								))}
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

export default SpeakArticle;
