import { useArticlePage } from "../hooks/useArticlePage";
import { ArticleInfo } from "../components/ArticleInfo";
import { PageLayout } from "../components/PageLayout";
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
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: article?.title ?? "..." }]}>

			{article && (
				<ArticleInfo article={article} />
			)}

			{article && (
				<div className={`px-4 ${hasSelection ? "pb-16" : "pb-6"}`}>
					<div className="prose prose-lg max-w-none text-gray-700 space-y-4">
								{article.content.split("\n").map((line, i) => (
								<div key={i} className="space-y-2 border border-gray-200 rounded-lg p-3">
									<p className="text-sm text-gray-500">{line}</p>
									<TTSPlayer text={line} className="w-full" />
								</div>
								))}
					</div>
				</div>
			)}
			{hasSelection && (
				<SelectionToolbar
					onAddWithMark={() => addNote(false)}
					onAddFullLine={() => addNote(true)}
				/>
			)}
		</PageLayout>
	);
}

export default SpeakArticle;
