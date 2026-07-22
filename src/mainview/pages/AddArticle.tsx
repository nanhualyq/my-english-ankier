import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { useRPC } from "../RPCContext";
import ArticleForm from "../components/ArticleForm";
import type { ArticleFormData } from "../../shared/rpcSchema";

function AddArticle() {
	const rpc = useRPC();
	const navigate = useNavigate();
	const [submitted, setSubmitted] = useState(false);

	async function handleSubmit(data: ArticleFormData) {
		await rpc.request("save-article", data);
		setSubmitted(true);
		setTimeout(() => navigate("/"), 1500);
	}

	return (
		<PageLayout breadcrumbs={[{ label: "Articles", path: "/" }, { label: "Add Article" }]}>
			<div className="px-4 py-6">
				{submitted && (
					<div className="bg-green-500 text-white px-4 py-3 rounded-lg mb-4 text-center font-medium">
						Article saved!
					</div>
				)}

				<ArticleForm buttonText="Submit" onSubmit={handleSubmit} />
			</div>
		</PageLayout>
	);
}

export default AddArticle;
