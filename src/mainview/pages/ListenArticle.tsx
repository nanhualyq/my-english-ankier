import { useArticlePage } from "../hooks/useArticlePage";
import { PageLayout } from "../components/PageLayout";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { TTSPlayer } from "../components/TTSPlayer";
import { hiddenTimestamp } from "../utils/anki";

function ListenArticle() {
	const { article, hasSelection, rpc, getCachedSelection } = useArticlePage();

	function addNote(isFullLine: boolean) {
		if (!article) return;
		const result = getCachedSelection();
		if (!result) return;
		const front = isFullLine ? "" : result.markedLine;
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

	return (
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: article?.title ?? "..." }]}>

			{article && (
				<div className={`px-4 ${hasSelection ? "pb-16" : "pb-6"}`}>
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

export default ListenArticle;
