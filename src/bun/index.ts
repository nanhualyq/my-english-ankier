import { BrowserWindow, Updater, defineElectrobunRPC } from "electrobun/bun";
import type { MyRPCSchema } from "../shared/rpcSchema";
import { saveArticle, getArticles } from "./db";

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
		},
	},
});

const mainWindow = new BrowserWindow({
	title: "React + Tailwind + Vite",
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
