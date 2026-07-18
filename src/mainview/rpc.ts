import { Electroview } from "electrobun/view";
import type { MyRPCSchema } from "../shared/rpcSchema";

export const rpc = Electroview.defineRPC<MyRPCSchema>({
	handlers: { requests: {}, messages: {} },
});
