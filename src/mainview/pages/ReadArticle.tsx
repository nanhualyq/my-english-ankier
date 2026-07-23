import { useArticlePage } from "../hooks/useArticlePage";
import { useSelectionShortcuts } from "../hooks/useSelectionShortcuts";
import { ArticleInfo } from "../components/ArticleInfo";
import { PageLayout } from "../components/PageLayout";
import { hiddenTimestamp } from "../utils/anki";
import { getSelectedLine } from "../utils/textSelection";
import { lookupWord } from "../utils/dictionary";

function ReadArticle() {
	const { article, hasSelection, rpc } = useArticlePage();

	async function addNote() {
		if (!article) return;
		const result = getSelectedLine();
		if (!result) return;

		const isFullLine = result.text === result.line.trim();
		const front = isFullLine ? result.line : result.markedLine;

		let back: string;
		if (isFullLine) {
			const translatedLines = article.translated_content?.split("\n") ?? [];
			back = result.lineIndex !== undefined ? (translatedLines[result.lineIndex] ?? "") : "";
		} else {
			const entry = await lookupWord(rpc, result.text);
			back = [
				entry?.usphone && `US: /${entry.usphone}/`,
				entry?.ukphone && `UK: /${entry.ukphone}/`,
				...entry?.definitions.map(d => d.pos ? `${d.pos} ${d.meaning}` : d.meaning) ?? [],
			].filter(Boolean).join("<br>");
		}
		rpc.request("add-anki-note", {
			fields: {
				Front: `${front}${hiddenTimestamp()}`,
				Back: back,
				Title: article.title,
				Url: article.url,
			},
			deckName: "English",
			modelName: "@Basic",
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
						{(() => {
							const contentLines = article.content.split("\n");
							const translatedLines = article.translated_content?.split("\n") ?? [];
							return contentLines.map((line, i) => (
								<div key={i} className="space-y-2 border border-gray-200 rounded-lg p-3">
									<p data-line-index={i}>{line}</p>
									{translatedLines[i] && (
										<details className="text-sm text-gray-500">
											<summary className="cursor-pointer hover:text-gray-700">Show translation</summary>
											<p className="mt-1 pl-4 border-l-2 border-gray-200">{translatedLines[i]}</p>
										</details>
									)}
								</div>
							));
						})()}
					</div>
				</div>
			)}
		</PageLayout>
	);
}

export default ReadArticle;
