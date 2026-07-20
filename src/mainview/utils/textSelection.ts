function getTextOffset(container: Node, offset: number, pElement: HTMLElement): number {
	if (container.nodeType === Node.TEXT_NODE) {
		let precedingLength = 0;
		const walker = document.createTreeWalker(pElement, NodeFilter.SHOW_TEXT);
		let node: Text | null;
		while ((node = walker.nextNode() as Text | null)) {
			if (node === container) break;
			precedingLength += node.length;
		}
		return precedingLength + offset;
	}
	let length = 0;
	const children = Array.from(container.childNodes);
	for (let i = 0; i < offset && i < children.length; i++) {
		length += children[i].textContent?.length ?? 0;
	}
	return length;
}

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
	const offsetInLine = getTextOffset(startContainer, range.startOffset, pElement);
	const markedLine =
		line.substring(0, offsetInLine) +
		"<mark>" + text + "</mark>" +
		line.substring(offsetInLine + text.length);

	return { text, line, markedLine };
}
