import { createContext, useContext } from "react";
import { rpc } from "./rpc";

const RPCContext = createContext(rpc);

export function RPCProvider({ children }: { children: React.ReactNode }) {
	return <RPCContext.Provider value={rpc}>{children}</RPCContext.Provider>;
}

export function useRPC() {
	return useContext(RPCContext);
}
