import { useRef, useState, useCallback, useEffect } from "react";
import { useRPC } from "../RPCContext";

interface TTSPlayerProps {
	text: string;
	voice?: string;
	className?: string;
}

export function TTSPlayer({ text, voice, className }: TTSPlayerProps) {
	const rpc = useRPC();
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handlePlay = useCallback(async () => {
		if (audioUrl) return; // already loaded

		setLoading(true);
		try {
			const result = await rpc.request("tts-generate", { text, voice });
			if (result.audioBase64) {
				const binaryStr = atob(result.audioBase64);
				const bytes = new Uint8Array(binaryStr.length);
				for (let i = 0; i < binaryStr.length; i++) {
					bytes[i] = binaryStr.charCodeAt(i);
				}
				const blob = new Blob([bytes], { type: "audio/mpeg" });
				const url = URL.createObjectURL(blob);
				setAudioUrl(url);

				// Wait for React to set src, then play
				setTimeout(() => {
					audioRef.current?.play();
				}, 0);
			}
		} catch (err) {
			console.error("TTS generation failed:", err);
		} finally {
			setLoading(false);
		}
	}, [rpc, text, voice, audioUrl]);

	// Cleanup blob URL on unmount
	useEffect(() => {
		return () => {
			if (audioUrl) URL.revokeObjectURL(audioUrl);
		};
	}, [audioUrl]);

	return (
		<div className={className}>
			<audio
				ref={audioRef}
				controls
				src={audioUrl ?? undefined}
				onPlay={handlePlay}
				className="w-full"
			/>
			{loading && (
				<p className="text-xs text-gray-400 mt-1">Generating audio…</p>
			)}
		</div>
	);
}
