import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRPC } from "../RPCContext";
import { useTextSelection } from "./useTextSelection";
import type { Article } from "../../shared/rpcSchema";

interface UseArticlePageOptions {
	deckName?: string;
	modelName?: string;
	listenMode?: boolean;
}

export function useArticlePage(options: UseArticlePageOptions = {}) {
	const { deckName = "English", modelName = "@Basic", listenMode = false } = options;
	const rpc = useRPC();
	const { id } = useParams<{ id: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const { hasSelection, getCachedSelection } = useTextSelection();

	useEffect(() => {
		rpc.request("get-article", { id: Number(id) }).then(setArticle);
	}, [id, rpc]);

	function addNote(stripMarks: boolean) {
		if (!article) return;
		const result = getCachedSelection();
		if (!result) return;

		let frontContent: string;
		if (stripMarks && listenMode) {
			frontContent = "";
		} else if (stripMarks) {
			frontContent = result.line;
		} else {
			frontContent = result.markedLine;
		}

		const frontWithTimestamp = `${frontContent}<span style="display:none">${Date.now()}</span>`;

		rpc.request("add-anki-note", {
			front: frontWithTimestamp,
			back: listenMode ? (stripMarks ? result.line : result.text) : "",
			title: article.title,
			url: article.url,
			deckName: deckName,
			modelName: modelName,
		});
	}

	return { article, hasSelection, addNote };
}
