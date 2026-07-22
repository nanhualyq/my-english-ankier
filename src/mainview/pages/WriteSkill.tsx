import { useArticlePage } from "../hooks/useArticlePage";
import { PageLayout } from "../components/PageLayout";
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
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: article?.title ?? "..." }]}>

			{article && (
				<div className={`px-4 ${hasSelection ? "pb-16" : "pb-6"}`}>
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

export default WriteSkill;
