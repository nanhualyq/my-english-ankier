import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { useRPC } from "../RPCContext";
import ArticleForm from "../components/ArticleForm";
import type { Article, ArticleFormData } from "../../shared/rpcSchema";

function EditArticle() {
	const rpc = useRPC();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		rpc.request("get-article", { id: Number(id) }).then(setArticle);
	}, [id, rpc]);

	async function handleSubmit(data: ArticleFormData) {
		await rpc.request("update-article", { id: Number(id), ...data });
		setSubmitted(true);
		setTimeout(() => navigate("/"), 1500);
	}

	return (
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: "Edit Article" }]}>
			<div className="px-4 py-6">
				{submitted && (
					<div className="bg-green-500 text-white px-4 py-3 rounded-lg mb-4 text-center font-medium">
						Article updated!
					</div>
				)}

				{article && (
					<ArticleForm
						defaultTitle={article.title}
						defaultUrl={article.url}
						defaultContent={article.content}
						defaultTranslatedContent={article.translated_content ?? ""}
						buttonText="Update"
						onSubmit={handleSubmit}
					/>
				)}
			</div>
		</PageLayout>
	);
}

export default EditArticle;
