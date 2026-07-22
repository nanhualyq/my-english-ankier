import { useEffect } from "react";

export function useSelectionShortcuts({
	hasSelection,
	onAddNote,
}: {
	hasSelection: boolean;
	onAddNote: () => void;
}) {
	useEffect(() => {
		if (!hasSelection) return;

		function handleKeyDown(e: KeyboardEvent) {
			// Ignore if user is typing in an input/textarea
			const tag = (e.target as HTMLElement).tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;

			if (e.key === "a" || e.key === "A") {
				e.preventDefault();
				onAddNote();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hasSelection, onAddNote]);
}
