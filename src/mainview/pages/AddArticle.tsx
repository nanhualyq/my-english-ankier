import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRPC } from "../RPCContext";
import ArticleForm from "../components/ArticleForm";

function AddArticle() {
	const rpc = useRPC();
	const navigate = useNavigate();
	const [submitted, setSubmitted] = useState(false);

	async function handleSubmit(data: { title: string; url: string; content: string }) {
		await rpc.request("save-article", data);
		setSubmitted(true);
		setTimeout(() => navigate("/"), 1500);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
			<div className="container mx-auto px-4 py-10 max-w-3xl">
				<h1 className="text-3xl font-bold text-white mb-6">Add Article</h1>

				{submitted && (
					<div className="bg-green-500 text-white px-4 py-3 rounded-lg mb-4 text-center font-medium">
						Article saved!
					</div>
				)}

				<ArticleForm buttonText="Submit" onSubmit={handleSubmit} />
			</div>
		</div>
	);
}

export default AddArticle;
