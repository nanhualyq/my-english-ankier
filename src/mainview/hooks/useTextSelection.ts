import { useEffect, useState, useRef } from "react";
import { getSelectedLine } from "../utils/textSelection";

export function useTextSelection() {
	const [hasSelection, setHasSelection] = useState(false);
	const cachedSelection = useRef<ReturnType<typeof getSelectedLine>>(null);

	useEffect(() => {
		function handleSelectionChange() {
			const text = window.getSelection()?.toString().trim();
			setHasSelection(!!text);
			cachedSelection.current = text ? getSelectedLine() : null;
		}

		document.addEventListener("selectionchange", handleSelectionChange);
		return () => document.removeEventListener("selectionchange", handleSelectionChange);
	}, []);

	return { hasSelection, getCachedSelection: () => cachedSelection.current };
}
