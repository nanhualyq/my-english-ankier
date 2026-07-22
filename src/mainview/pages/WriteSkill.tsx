import { useArticlePage } from "../hooks/useArticlePage";
import { useSelectionShortcuts } from "../hooks/useSelectionShortcuts";
import { ArticleInfo } from "../components/ArticleInfo";
import { PageLayout } from "../components/PageLayout";
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

	useSelectionShortcuts({
		hasSelection,
		onAddWithMark: () => addNote(false),
		onAddFullLine: () => addNote(true),
	});

	return (
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: article?.title ?? "..." }]}>

			{article && (
				<ArticleInfo article={article} />
			)}

			{article && (
				<div className="px-4 pb-6">
					<div className="prose prose-lg max-w-none text-gray-700 space-y-4">
								{(() => {
									const translatedLines = article.translated_content?.split("\n") ?? [];
									const contentLines = article.content.split("\n");
									return translatedLines.map((line, i) => (
										<div key={i} className="space-y-2 border border-gray-200 rounded-lg p-3">
											<p>{line}</p>
											<details className="text-sm text-gray-500">
												<summary className="cursor-pointer hover:text-gray-700">Show original</summary>
												<p className="mt-1 pl-4 border-l-2 border-gray-200">{contentLines[i]}</p>
											</details>
										</div>
									));
								})()}
					</div>
				</div>
			)}
		</PageLayout>
	);
}

export default WriteSkill;
