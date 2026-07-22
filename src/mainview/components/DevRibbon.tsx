function DevRibbon() {
	if (!import.meta.env.DEV) return null;

	return (
		<div className="fixed top-0 right-0 z-[9999] pointer-events-none overflow-hidden" style={{ width: 120, height: 120 }}>
			<div
				className="absolute bg-red-600 text-white text-xs font-bold text-center leading-6"
				style={{
					width: 160,
					top: 22,
					right: -40,
					transform: "rotate(45deg)",
					boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
				}}
			>
				DEV
			</div>
		</div>
	);
}

export default DevRibbon;
