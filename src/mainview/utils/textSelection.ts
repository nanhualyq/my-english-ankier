export function getSelectedLine() {
	const selection = window.getSelection();
	const text = selection?.toString().trim();
	if (!text || !selection) return null;

	const range = selection.getRangeAt(0);
	const startContainer = range.startContainer;
	const pElement =
		startContainer.nodeType === Node.ELEMENT_NODE
			? (startContainer as HTMLElement).closest("p")
			: startContainer.parentElement?.closest("p");
	if (!pElement) return null;

	const line = pElement.textContent ?? "";
	const offsetInLine = line.indexOf(text);
	const markedLine =
		line.substring(0, offsetInLine) +
		"<mark>" + text + "</mark>" +
		line.substring(offsetInLine + text.length);

	return { text, line, markedLine };
}
