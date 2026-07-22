import { useArticlePage } from "../hooks/useArticlePage";
import { ArticleInfo } from "../components/ArticleInfo";
import { PageLayout } from "../components/PageLayout";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { hiddenTimestamp } from "../utils/anki";

function ReadArticle() {
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
				<ArticleInfo article={article} />
			)}

			{article && (
				<div className={`px-4 ${hasSelection ? "pb-16" : "pb-6"}`}>
					<div className="prose prose-lg max-w-none text-gray-700">
						{article.content.split("\n").map((line, i) => (
							<p key={i}>{line}</p>
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

export default ReadArticle;
