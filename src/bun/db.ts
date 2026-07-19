import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { Utils } from "electrobun/bun";
import type { Article, ArticleFormData } from "../shared/rpcSchema";
import { migrate } from "./migrate";

mkdirSync(Utils.paths.userData, { recursive: true });
const DB_PATH = Utils.paths.userData + "/data.db";
const db = new Database(DB_PATH, { create: true });

console.log(`Database at: ${DB_PATH}`);

migrate(db);

export function saveArticle(data: ArticleFormData): { id: number } {
	return db
		.query(
			"INSERT INTO articles (title, url, content, translated_content) VALUES ($title, $url, $content, $translated_content) RETURNING id",
		)
		.get({ $title: data.title, $url: data.url, $content: data.content, $translated_content: data.translated_content }) as { id: number };
}

export function getArticles(): Article[] {
	return db.query("SELECT * FROM articles ORDER BY created_at DESC").all() as Article[];
}

export function getArticle(id: number): Article {
	return db.query("SELECT * FROM articles WHERE id = $id").get({ $id: id }) as Article;
}

export function updateArticle(id: number, data: ArticleFormData): void {
	db.query("UPDATE articles SET title = $title, url = $url, content = $content, translated_content = $translated_content WHERE id = $id").run({
		$id: id,
		$title: data.title,
		$url: data.url,
		$content: data.content,
		$translated_content: data.translated_content,
	});
}
