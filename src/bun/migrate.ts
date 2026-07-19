import type { Database } from "bun:sqlite";

const migrations = [
	{
		version: 1,
		up: `CREATE TABLE articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      content TEXT NOT NULL,
      translated_content TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
	},
];

export function migrate(db: Database) {
	const { user_version } = db.query("PRAGMA user_version").get() as { user_version: number };
	for (const m of migrations) {
		if (m.version > user_version) {
			db.run(m.up);
			db.run(`PRAGMA user_version = ${m.version}`);
			console.log(`Migration ${m.version} applied`);
		}
	}
}
