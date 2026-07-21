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

	return { article, hasSelection, rpc, getCachedSelection };
}
