import { useEffect } from "react";

export function useSelectionShortcuts({
	hasSelection,
	onAddWithMark,
	onAddFullLine,
}: {
	hasSelection: boolean;
	onAddWithMark: () => void;
	onAddFullLine: () => void;
}) {
	useEffect(() => {
		if (!hasSelection) return;

		function handleKeyDown(e: KeyboardEvent) {
			// Ignore if user is typing in an input/textarea
			const tag = (e.target as HTMLElement).tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;

			if (e.key === "s" || e.key === "S") {
				e.preventDefault();
				onAddWithMark();
			} else if (e.key === "f" || e.key === "F") {
				e.preventDefault();
				onAddFullLine();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hasSelection, onAddWithMark, onAddFullLine]);
}
