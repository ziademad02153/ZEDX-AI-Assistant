"use client";

import { useState, useEffect, useRef } from "react";


export default function OverlayPage() {
    const [transcript, setTranscript] = useState("");
    const [answer, setAnswer] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Start MINIMIZED as an icon by default
    const answerRef = useRef<HTMLDivElement>(null);

    // FORCE TRANSPARENT BACKGROUND
    // This is critical because globals.css sets body background to white/black
    // We override it locally here for the overlay window.
    useEffect(() => {
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
        return () => {
            document.documentElement.style.background = '';
            document.body.style.background = '';
        };
    }, []);


    // Handle Resize Effect
    useEffect(() => {
        if (window.electronAPI) {
            if (isExpanded) {
                window.electronAPI.resizeOverlay(420, 520);
            } else {
                window.electronAPI.resizeOverlay(60, 60);
            }
        }
    }, [isExpanded]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.electronAPI) {
            window.electronAPI.onTranscript((text: string) => {
                setTranscript(text);
                // Auto-expand if new transcript arrives? Maybe optional.
            });

            window.electronAPI.onAnswer((ans: string) => {
                setAnswer(ans);
                setIsLoading(false);
                // Auto-expand on answer
                setIsExpanded(true);
            });
        }
    }, []);

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="w-full h-full rounded-2xl bg-emerald-900/90 hover:bg-emerald-800 flex items-center justify-center border border-emerald-500/50 shadow-lg cursor-pointer transition-all group overflow-hidden"
            >
                <div className="text-white font-bold text-[10px] leading-tight group-hover:scale-110 transition-transform flex flex-col items-center">
                    <span>ZEDX</span>
                    <span className="text-emerald-400">AI</span>
                </div>
            </button>
        );
    }

    // EXPANDED MODE (Full UI)
    return (
        <div className="w-full h-full bg-transparent overflow-hidden flex flex-col p-2">
            <div className="flex-1 rounded-2xl overflow-hidden backdrop-blur-2xl bg-zinc-900/95 border border-zinc-700 shadow-2xl flex flex-col">

                {/* DRAGGABLE HEADER */}
                <div
                    className="px-3 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700 flex items-center justify-between"
                    style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
                >
                    <div className="flex items-center gap-2">
                        {/* Status Dot */}
                        <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'} shadow-lg`} />
                        <span className="text-zinc-100 font-bold text-sm tracking-wide">ZEDX SIMULATOR</span>
                    </div>

                    <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                        {/* Toggle Mic */}
                        <button
                            onClick={() => setIsListening(!isListening)}
                            className={`p-1.5 rounded-lg transition-colors ${isListening
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600"
                                }`}
                            title="Toggle Mic"
                        >
                            {isListening ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>

                        {/* Open Main App */}
                        <button
                            onClick={() => window.electronAPI?.showApp()}
                            className="p-1.5 rounded-lg bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600 transition-colors"
                            title="Open Main App"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>

                        {/* Minimize */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="p-1.5 rounded-lg bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600 transition-colors"
                            title="Minimize"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 py-3 bg-black/40 border-b border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2 flex justify-between">
                        <span>LIVE TRANSCRIPT</span>
                        {transcript && <span className="text-emerald-500">Active</span>}
                    </div>
                    <div className="text-sm text-zinc-300 font-medium leading-snug min-h-[40px] max-h-[60px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                        {transcript || <span className="text-zinc-600 italic">Listening for interview application...</span>}
                    </div>
                </div>

                <div className="flex-1 px-4 py-2 overflow-hidden flex flex-col bg-black/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-wider">SUGGESTED ANSWER</div>
                    </div>
                    <div
                        ref={answerRef}
                        className="text-sm text-zinc-100 h-full overflow-y-auto pr-1 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-600"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
                                <span>Generating smart response...</span>
                            </div>
                        ) : answer ? (
                            <div className="whitespace-pre-wrap font-light">{answer}</div>
                        ) : (
                            <span className="text-zinc-600 italic text-xs">Waiting for key question...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
