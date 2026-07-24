import type { MyRPCSchema } from "../../shared/rpcSchema";
import type { Electroview } from "electrobun/view";

type RPC = ReturnType<typeof Electroview.defineRPC<MyRPCSchema>>;

export interface DictionaryEntry {
	word: string;
	usphone: string;
	ukphone: string;
	definitions: Array<{ pos: string; meaning: string }>;
}

function formatYoudaoResponse(data: Record<string, unknown>, originalWord: string): DictionaryEntry {
	const word = originalWord;
	const ec = data.ec as
		| {
				word?:
					| {
							usphone?: string;
							ukphone?: string;
							trs?: Array<{ tr?: Array<{ l?: { i?: string[] } }> }>;
					  }
					| Array<{
							usphone?: string;
							ukphone?: string;
							trs?: Array<{ tr?: Array<{ l?: { i?: string[] } }> }>;
					  }>;
		  }
		| undefined;

	// word may be an object (old format) or an array (new format)
	const entry = Array.isArray(ec?.word) ? ec.word[0] : ec?.word;
	const usphone = entry?.usphone ?? "";
	const ukphone = entry?.ukphone ?? "";
	const definitions: Array<{ pos: string; meaning: string }> = [];

	if (entry?.trs) {
		for (const tr of entry.trs) {
			// New format: { tr: [{ l: { i: ["n. xxx"] } }] }
			const inner = tr.tr?.[0]?.l?.i?.[0];
			if (inner) {
				definitions.push({ pos: "", meaning: inner });
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
		return formatYoudaoResponse(result, word);
	} catch (err) {
		console.error("Dictionary lookup failed:", err);
		alert(`Failed to look up "${word}". Please try again.`);
		return null;
	}
}
