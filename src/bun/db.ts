import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { Utils } from "electrobun/bun";
import type { Article } from "../shared/rpcSchema";

mkdirSync(Utils.paths.userData, { recursive: true });
const DB_PATH = Utils.paths.userData + "/data.db";
const db = new Database(DB_PATH, { create: true });

console.log(`Database at: ${DB_PATH}`);

db.run(`CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
)`);

export function saveArticle(
	title: string,
	url: string,
	content: string,
): { id: number } {
	return db
		.query(
			"INSERT INTO articles (title, url, content) VALUES ($title, $url, $content) RETURNING id",
		)
		.get({ $title: title, $url: url, $content: content }) as { id: number };
}

export function getArticles(): Article[] {
	return db.query("SELECT * FROM articles ORDER BY created_at DESC").all() as Article[];
}
