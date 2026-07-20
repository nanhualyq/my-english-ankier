import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRPC } from "../RPCContext";
import { useTextSelection } from "./useTextSelection";
import type { Article } from "../../shared/rpcSchema";

export function useArticlePage() {
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

		const frontContent = stripMarks ? result.line : result.markedLine;
		const frontWithTimestamp = `${frontContent}<span style="display:none">${Date.now()}</span>`;

		rpc.request("add-anki-note", {
			front: frontWithTimestamp,
			back: "",
			title: article.title,
			url: article.url,
			deckName: "English",
			modelName: "@Basic",
		});
	}

	return { article, hasSelection, addNote };
}
