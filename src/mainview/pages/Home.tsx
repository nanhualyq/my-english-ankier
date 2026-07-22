import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { useRPC } from "../RPCContext";
import type { Article } from "../../shared/rpcSchema";

function Home() {
	const rpc = useRPC();
	const [articles, setArticles] = useState<Article[]>([]);

	useEffect(() => {
		rpc.request("get-articles").then(setArticles);
	}, []);

	return (
		<PageLayout breadcrumbs={[{ label: "Articles" }]}>
			<div className="px-4 py-6">
				<div className="flex items-center mb-6">
					<Link
						to="/add-article"
						className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
					>
						Add Article
					</Link>
				</div>

				<div className="bg-white rounded-xl shadow-xl overflow-hidden">
					<table className="w-full">
						<thead>
							<tr className="bg-primary-50">
								<th className="text-left px-6 py-3 text-sm font-semibold text-primary-600">Title</th>
								<th className="text-left px-6 py-3 text-sm font-semibold text-primary-600">Time</th>
								<th className="text-left px-6 py-3 text-sm font-semibold text-primary-600">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{articles.map((a) => (
								<tr key={a.id} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4">
											<Link to={`/edit-article/${a.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
											{a.title}
										</Link>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">{a.created_at}</td>
									<td className="px-6 py-4">
										<div className="flex gap-2">
												<Link to={`/read-article/${a.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
													Read
												</Link>
												<Link to={`/write-skill/${a.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
													Write
												</Link>
												<Link to={`/listen-article/${a.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
													Listen
												</Link>
												<Link to={`/speak-article/${a.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
													Speak
												</Link>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	);
}

export default Home;
