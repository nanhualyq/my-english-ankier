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
	maxRequestTime: 120000,
	handlers: {
		requests: {
			"save-article": async (data) =>
				saveArticle(data),
			"get-articles": async () => getArticles(),
			"get-article": async ({ id }) => getArticle(id),
			"update-article": async ({ id, ...data }) =>
				updateArticle(id, data),
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
			"tts-generate": async ({ text, voice }) => {
				try {
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 90_000);
					const response = await fetch("http://localhost:8880/v1/audio/speech", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							input: text,
							model: "kokoro",
							voice: voice ?? "af_heart",
							response_format: "mp3",
							stream: false,
						}),
						signal: controller.signal,
					});
					clearTimeout(timeoutId);
					if (!response.ok) {
						console.error("Kokoro TTS error:", response.status, response.statusText);
						return { audioBase64: "" };
					}
					const arrayBuffer = await response.arrayBuffer();
					const audioBase64 = Buffer.from(arrayBuffer).toString("base64");
					return { audioBase64 };
				} catch (err) {
					console.error("Failed to connect to Kokoro TTS:", err);
					return { audioBase64: "" };
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

console.log("The app started!");
