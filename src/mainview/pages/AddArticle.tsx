import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRPC } from "../RPCContext";

function AddArticle() {
	const rpc = useRPC();
	const navigate = useNavigate();
	const titleRef = useRef<HTMLInputElement>(null);
	const urlRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);
	const [submitted, setSubmitted] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		await rpc.request("save-article", {
			title: titleRef.current!.value,
			url: urlRef.current!.value,
			content: contentRef.current!.value,
		});
		titleRef.current!.value = "";
		urlRef.current!.value = "";
		contentRef.current!.value = "";
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

				<form
					className="bg-white rounded-xl shadow-xl p-8 space-y-4"
					onSubmit={handleSubmit}
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Title
						</label>
						<input
							ref={titleRef}
							type="text"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
							placeholder="Article title"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							URL
						</label>
						<input
							ref={urlRef}
							type="url"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
							placeholder="https://example.com/article"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Content
						</label>
						<textarea
							ref={contentRef}
							className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
							placeholder="Paste article content here..."
						/>
					</div>
					<button
						type="submit"
						className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default AddArticle;
