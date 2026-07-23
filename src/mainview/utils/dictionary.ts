import type { MyRPCSchema } from "../../shared/rpcSchema";
import type { Electroview } from "electrobun/view";

type RPC = ReturnType<typeof Electroview.defineRPC<MyRPCSchema>>;

export interface DictionaryEntry {
	word: string;
	usphone: string;
	ukphone: string;
	definitions: Array<{ pos: string; meaning: string }>;
}

function formatYoudaoResponse(data: Record<string, unknown>): DictionaryEntry {
	const word = (data.input as string) ?? "";
	const ec = data.ec as {
		word?: {
			usphone?: string;
			ukphone?: string;
			trs?: Array<{ pos?: string; tran?: string }>;
		};
	} | undefined;
	const entry = ec?.word;

	const usphone = entry?.usphone ?? "";
	const ukphone = entry?.ukphone ?? "";
	const definitions: Array<{ pos: string; meaning: string }> = [];

	if (entry?.trs) {
		for (const tr of entry.trs) {
			if (tr.pos && tr.tran) {
				definitions.push({ pos: tr.pos, meaning: tr.tran });
			} else if (tr.tran) {
				definitions.push({ pos: "", meaning: tr.tran });
			}
		}
	}

	return { word, usphone, ukphone, definitions };
}

export async function lookupWord(
	rpc: RPC,
	word: string,
): Promise<DictionaryEntry | null> {
	try {
		const result = await rpc.request("lookup-word", { word });
		return formatYoudaoResponse(result);
	} catch (err) {
		console.error("Dictionary lookup failed:", err);
		alert(`Failed to look up "${word}". Please try again.`);
		return null;
	}
}
