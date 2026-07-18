import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRPC } from "../RPCContext";
import type { Article } from "../../shared/rpcSchema";

function Home() {
	const rpc = useRPC();
	const [articles, setArticles] = useState<Article[]>([]);

	useEffect(() => {
		rpc.request("get-articles").then(setArticles);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
			<div className="container mx-auto px-4 py-10 max-w-3xl">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-white">Articles</h1>
					<Link
						to="/add-article"
						className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
					>
						Add Article
					</Link>
				</div>

				<div className="space-y-4">
					{articles.map((a) => (
						<div key={a.id} className="bg-white rounded-xl shadow-xl p-6">
							<h2 className="text-xl font-semibold text-indigo-600 mb-1">
								{a.title}
							</h2>
							{a.url && (
								<p className="text-sm text-gray-500 mb-2 truncate">{a.url}</p>
							)}
							<p className="text-gray-700 line-clamp-3">{a.content}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Home;
