import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRPC } from "../RPCContext";
import ArticleForm from "../components/ArticleForm";

function EditArticle() {
	const rpc = useRPC();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [article, setArticle] = useState<{ title: string; url: string; content: string } | null>(null);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		rpc.request("get-article", { id: Number(id) }).then(setArticle);
	}, [id, rpc]);

	async function handleSubmit(data: { title: string; url: string; content: string }) {
		await rpc.request("update-article", { id: Number(id), ...data });
		setSubmitted(true);
		setTimeout(() => navigate("/"), 1500);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
			<div className="container mx-auto px-4 py-10 max-w-3xl">
				<h1 className="text-3xl font-bold text-white mb-6">Edit Article</h1>

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
						buttonText="Update"
						onSubmit={handleSubmit}
					/>
				)}
			</div>
		</div>
	);
}

export default EditArticle;
