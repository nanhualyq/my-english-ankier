import type { FormEvent } from "react";
import { useRef } from "react";
import type { ArticleFormData } from "../../shared/rpcSchema";

interface ArticleFormProps {
	defaultTitle?: string;
	defaultUrl?: string;
	defaultContent?: string;
	defaultTranslatedContent?: string;
	buttonText: string;
	onSubmit: (data: ArticleFormData) => void;
}

function ArticleForm({
	defaultTitle = "",
	defaultUrl = "",
	defaultContent = "",
	defaultTranslatedContent = "",
	buttonText,
	onSubmit,
}: ArticleFormProps) {
	const titleRef = useRef<HTMLInputElement>(null);
	const urlRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);
	const translatedContentRef = useRef<HTMLTextAreaElement>(null);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		onSubmit({
			title: titleRef.current!.value,
			url: urlRef.current!.value,
			content: contentRef.current!.value,
			translated_content: translatedContentRef.current!.value,
		});
	}

	return (
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
					defaultValue={defaultTitle}
					className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
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
					defaultValue={defaultUrl}
					className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
					placeholder="https://example.com/article"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Content
				</label>
				<textarea
					ref={contentRef}
					defaultValue={defaultContent}
					className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
					placeholder="Paste article content here..."
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Translated Content
				</label>
				<textarea
					ref={translatedContentRef}
					defaultValue={defaultTranslatedContent}
					className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
					placeholder="Paste translated content here (optional)..."
				/>
			</div>
			<button
				type="submit"
				className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md"
			>
				{buttonText}
			</button>
		</form>
	);
}

export default ArticleForm;
