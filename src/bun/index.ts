import { BrowserWindow, Updater, defineElectrobunRPC } from "electrobun/bun";
import type { MyRPCSchema } from "../shared/rpcSchema";
import { saveArticle, getArticles, getArticle, updateArticle } from "./db";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === "dev") {
		try {
			await fetch(DEV_SERVER_URL, { method: "HEAD" });
			console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
			return DEV_SERVER_URL;
		} catch {
			console.log(
				"Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
			);
		}
	}
	return "views://mainview/index.html";
}

const url = await getMainViewUrl();

const rpc = defineElectrobunRPC<MyRPCSchema, "bun">("bun", {
	handlers: {
		requests: {
			"save-article": async ({ title, url, content }) =>
				saveArticle(title, url, content),
			"get-articles": async () => getArticles(),
			"get-article": async ({ id }) => getArticle(id),
			"update-article": async ({ id, title, url, content }) =>
				updateArticle(id, title, url, content),
			"add-anki-note": async ({ front, back, title, url, deckName, modelName }) => {
				try {
					const response = await fetch("http://localhost:8765", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							action: "guiAddCards",
							version: 6,
							params: {
								note: {
									deckName,
									modelName,
									fields: { Front: front, Back: back, Title: title, Url: url },
								},
							},
						}),
					});
					const data = await response.json();
					if (data.error) {
						console.error("AnkiConnect error:", data.error);
						return { noteId: null };
					}
					return { noteId: data.result };
				} catch (err) {
					console.error("Failed to connect to AnkiConnect:", err);
					return { noteId: null };
				}
			},
		},
	},
});

const mainWindow = new BrowserWindow({
	title: "my-english-ankier",
	url,
	frame: {
		width: 900,
		height: 700,
		x: 200,
		y: 200,
	},
});

const transport = mainWindow.webview.createTransport();
rpc.setTransport(transport);

console.log("React Tailwind Vite app started!");
