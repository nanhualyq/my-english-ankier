import { type ElectrobunRPCSchema } from "electrobun/bun";

export interface Article {
	id: number;
	title: string;
	url: string;
	content: string;
	translated_content: string | null;
	created_at: string;
}

export type ArticleFormData = Omit<Article, "id" | "created_at">;

export interface MyRPCSchema extends ElectrobunRPCSchema {
	bun: {
		requests: {
			"save-article": {
				params: ArticleFormData;
				response: { id: number };
			};
			"get-articles": {
				params: void;
				response: Article[];
			};
			"get-article": {
				params: { id: number };
				response: Article;
			};
			"update-article": {
				params: { id: number } & ArticleFormData;
				response: void;
			};
			"add-anki-note": {
				params: { front: string; back: string; title: string; url: string; deckName: string; modelName: string };
				response: { noteId: number | null };
			};
			"tts-generate": {
				params: { text: string; voice?: string };
				response: { audioBase64: string };
			};
		};
		messages: {};
	};
	webview: {
		requests: {};
		messages: {};
	};
}
