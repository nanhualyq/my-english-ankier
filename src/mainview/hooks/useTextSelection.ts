import { useEffect, useState } from "react";

export function useTextSelection() {
	const [hasSelection, setHasSelection] = useState(false);

	useEffect(() => {
		function handleSelectionChange() {
			const selection = window.getSelection();
			setHasSelection(!(selection?.isCollapsed ?? true));
		}

		document.addEventListener("selectionchange", handleSelectionChange);
		return () => document.removeEventListener("selectionchange", handleSelectionChange);
	}, []);

	return { hasSelection };
}
