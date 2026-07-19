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

				<div className="bg-white rounded-xl shadow-xl overflow-hidden">
					<table className="w-full">
						<thead>
							<tr className="bg-indigo-50">
								<th className="text-left px-6 py-3 text-sm font-semibold text-indigo-600">Title</th>
								<th className="text-left px-6 py-3 text-sm font-semibold text-indigo-600">Time</th>
								<th className="text-left px-6 py-3 text-sm font-semibold text-indigo-600">Read</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{articles.map((a) => (
								<tr key={a.id} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4">
										<Link to={`/edit-article/${a.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
											{a.title}
										</Link>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">{a.created_at}</td>
									<td className="px-6 py-4">
										<Link to={`/read-article/${a.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
											Read
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Home;
