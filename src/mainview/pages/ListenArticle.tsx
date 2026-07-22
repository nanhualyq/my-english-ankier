import { useArticlePage } from "../hooks/useArticlePage";
import { useSelectionShortcuts } from "../hooks/useSelectionShortcuts";
import { ArticleInfo } from "../components/ArticleInfo";
import { PageLayout } from "../components/PageLayout";
import { TTSPlayer } from "../components/TTSPlayer";
import { hiddenTimestamp } from "../utils/anki";
import { getSelectedLine } from "../utils/textSelection";

function ListenArticle() {
	const { article, hasSelection, rpc } = useArticlePage();

	function addNote() {
		if (!article) return;
		const result = getSelectedLine();
		if (!result) return;
		const isFullLine = result.text === result.line.trim();
		const front = isFullLine ? "" : result.markedLine.replace(/<mark>.*?<\/mark>/, "<mark>???</mark>");
		const back = isFullLine ? result.line : result.text;
		rpc.request("add-anki-note", {
			front: `${front}${hiddenTimestamp()}`,
			back,
			title: article.title,
			url: article.url,
			deckName: "English",
			modelName: "@EnListen",
		});
	}

	useSelectionShortcuts({ hasSelection, onAddNote: addNote });

	return (
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: article?.title ?? "..." }]}>

			{article && (
				<ArticleInfo article={article} />
			)}

			{article && (
				<div className="px-4 pb-6">
					<div className="prose prose-lg max-w-none text-gray-700 space-y-4">
					{article.content.split("\n").map((line, i) => (
						<div key={i} className="space-y-2 border border-gray-200 rounded-lg p-3">
							<TTSPlayer text={line} className="w-full" />
							<details className="text-sm text-gray-500">
								<summary className="cursor-pointer hover:text-gray-700">Show original</summary>
								<p className="mt-1 pl-4 border-l-2 border-gray-200">{line}</p>
							</details>
						</div>
					))}
					</div>
				</div>
			)}
		</PageLayout>
	);
}

export default ListenArticle;
