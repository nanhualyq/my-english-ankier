import { useArticlePage } from "../hooks/useArticlePage";
import { useSelectionShortcuts } from "../hooks/useSelectionShortcuts";
import { ArticleInfo } from "../components/ArticleInfo";
import { PageLayout } from "../components/PageLayout";
import { TTSPlayer } from "../components/TTSPlayer";
import { hiddenTimestamp } from "../utils/anki";
import { getSelectedLine } from "../utils/textSelection";
import { lookupWord } from "../utils/dictionary";

function SpeakArticle() {
	const { article, hasSelection, rpc } = useArticlePage();

	async function addNote() {
		if (!article) return;
		const result = getSelectedLine();
		if (!result) return;
		const isFullLine = result.text === result.line.trim();
		const front = isFullLine ? result.line : result.markedLine;
		const back = isFullLine ? result.line : result.text;

		let phone = "";
		if (!isFullLine) {
			const entry = await lookupWord(rpc, result.text);
			if (entry && (entry.usphone || entry.ukphone)) {
				phone = `US: /${entry.usphone}/ UK: /${entry.ukphone}/`;
			}
		}

		rpc.request("add-anki-note", {
			fields: {
				Front: `${front}${hiddenTimestamp()}`,
				Back: back,
				Title: article.title,
				Url: article.url,
				Phone: phone,
			},
			deckName: "English",
			modelName: "@EnSpeak",
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
									<p className="text-sm text-gray-500">{line}</p>
									<TTSPlayer text={line} className="w-full" />
								</div>
								))}
					</div>
				</div>
			)}
		</PageLayout>
	);
}

export default SpeakArticle;
