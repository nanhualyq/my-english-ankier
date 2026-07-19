import { type ElectrobunRPCSchema } from "electrobun/bun";

export interface Article {
	id: number;
	title: string;
	url: string;
	content: string;
	created_at: string;
}

export interface MyRPCSchema extends ElectrobunRPCSchema {
	bun: {
		requests: {
			"save-article": {
				params: { title: string; url: string; content: string };
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
				params: { id: number; title: string; url: string; content: string };
				response: void;
			};
			"add-anki-note": {
				params: { front: string; back: string; title: string; url: string; deckName: string; modelName: string };
				response: { noteId: number | null };
			};
		};
		messages: {};
	};
	webview: {
		requests: {};
		messages: {};
	};
}
