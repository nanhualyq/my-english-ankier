interface SelectionToolbarProps {
	addNote: (stripMarks: boolean) => void;
}

export function SelectionToolbar({ addNote }: SelectionToolbarProps) {
	return (
		<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50">
			<div className="container mx-auto max-w-3xl flex items-center justify-end">
				<div className="flex gap-2">
					<button
						accessKey="s"
						onClick={() => addNote(false)}
						className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Add (with mark)
					</button>
					<button
						accessKey="f"
						onClick={() => addNote(true)}
						className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
					>
						Add (full line)
					</button>
				</div>
			</div>
		</div>
	);
}
