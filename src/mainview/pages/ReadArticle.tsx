import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRPC } from "../RPCContext";
import type { Article } from "../../shared/rpcSchema";

function ReadArticle() {
	const rpc = useRPC();
	const { id } = useParams<{ id: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [selectedText, setSelectedText] = useState("");
	const [currentLine, setCurrentLine] = useState("");
	const [showActionBar, setShowActionBar] = useState(false);

	useEffect(() => {
		rpc.request("get-article", { id: Number(id) }).then(setArticle);
	}, [id, rpc]);

	function handleTextSelect() {
		const selection = window.getSelection();
		const text = selection?.toString().trim();

		if (text && selection && contentRef.current && article) {
			setSelectedText(text);

			const range = selection.getRangeAt(0);
			const preRange = document.createRange();
			preRange.selectNodeContents(contentRef.current);
			preRange.setEnd(range.startContainer, range.startOffset);

			const preText = preRange.toString();
			const lineStart = preText.lastIndexOf("\n") + 1;
			const selectionEnd = preText.length + text.length;
			const lineEnd = article.content.indexOf("\n", selectionEnd);
			const end = lineEnd === -1 ? article.content.length : lineEnd;

			const line = article.content.substring(lineStart, end);
			const offsetInLine = preText.length - lineStart;
			const markedLine =
				line.substring(0, offsetInLine) +
				"<mark>" + text + "</mark>" +
				line.substring(offsetInLine + text.length);

			setCurrentLine(markedLine);
			setShowActionBar(true);
		} else {
			setShowActionBar(false);
		}
	}

	function addNote(stripMarks: boolean) {
		rpc.request("add-anki-note", {
			front: stripMarks ? currentLine.replace(/<\/?mark>/g, "") : currentLine,
			back: "",
			title: article!.title,
			url: article!.url,
			deckName: "English",
			modelName: "@Basic",
		});
	}

	return (
		<div className="h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
			<div className="container mx-auto px-4 pt-10 pb-4 max-w-3xl shrink-0">
				<Link to="/" className="text-white/80 hover:text-white text-sm mb-6 inline-block">
					&larr; Back to articles
				</Link>

				{article && (
					<>
						<h1 className="text-3xl font-bold text-white mb-2">{article.title}</h1>
						{article.url && (
							<a
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-white/60 hover:text-white mb-4 inline-block truncate max-w-full"
							>
								{article.url}
							</a>
						)}
					</>
				)}
			</div>

			{article && (
				<div className={`flex-1 overflow-y-auto px-4 ${showActionBar ? "pb-16" : "pb-10"}`}>
					<div className="container mx-auto max-w-3xl">
						<article className="bg-white rounded-xl shadow-xl p-8">
							<div
								ref={contentRef}
								onMouseUp={handleTextSelect}
								className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap"
							>
								{article.content}
							</div>
						</article>
					</div>
				</div>
			)}

			{showActionBar && (
				<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
					<div className="container mx-auto max-w-3xl flex items-center justify-between">
						<span className="text-sm text-gray-500 truncate max-w-md">
							"{selectedText}"
						</span>
						<div className="flex gap-2">
							<button
								accessKey="s"
								onClick={() => addNote(false)}
								className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
							>
								Add (with mark)
							</button>
							<button
								accessKey="f"
								onClick={() => addNote(true)}
								className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
							>
								Add (full line)
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ReadArticle;
