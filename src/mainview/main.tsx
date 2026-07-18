import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Electroview } from "electrobun/view";
import { rpc } from "./rpc";
import { RPCProvider } from "./RPCContext";
import "./index.css";
import App from "./App";

new Electroview({ rpc });

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<RPCProvider>
				<App />
			</RPCProvider>
		</HashRouter>
	</StrictMode>,
);
