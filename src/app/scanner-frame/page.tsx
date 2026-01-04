"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Scan, X, Loader2, Target, ChevronDown } from "lucide-react";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;

export default function ScannerFrame() {
    const [isScanning, setIsScanning] = useState(false);
    const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
    const [isMoving, setIsMoving] = useState(false);
    const initialPos = useRef({ x: 0, y: 0, width: 0, height: 0, mouseX: 0, mouseY: 0 });
    const lastUpdate = useRef<number>(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.background = 'transparent';
        document.documentElement.style.background = 'transparent';

        const style = document.createElement('style');
        style.innerHTML = `* { cursor: auto !important; } .drag-handle { cursor: move !important; } button { cursor: pointer !important; } .resize-cursor-nwse { cursor: nwse-resize !important; } .resize-cursor-nesw { cursor: nesw-resize !important; } .resize-cursor-ns { cursor: ns-resize !important; } .resize-cursor-ew { cursor: ew-resize !important; }`;
        document.head.appendChild(style);
    }, []);

    const handleScan = async () => {
        if (isScanning) return;
        setIsScanning(true);
        try {
            const bounds = {
                x: window.screenX,
                y: window.screenY,
                width: window.innerWidth,
                height: window.innerHeight
            };
            if (window.electronAPI) {
                await window.electronAPI.captureScannerArea(bounds);
            }
        } catch (err) {
            console.error("Scan failed:", err);
        } finally {
            setTimeout(() => setIsScanning(false), 2000);
        }
    };

    // --- MANUAL MOVE LOGIC ---
    const startMoving = (e: React.MouseEvent) => {
        if (isResizing) return;
        setIsMoving(true);
        initialPos.current = {
            x: window.screenX,
            y: window.screenY,
            width: window.innerWidth,
            height: window.innerHeight,
            mouseX: e.screenX,
            mouseY: e.screenY
        };
    };

    // --- MANUAL RESIZE LOGIC ---
    const startResizing = (dir: ResizeDirection, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(dir);

        initialPos.current = {
            x: window.screenX,
            y: window.screenY,
            width: window.innerWidth,
            height: window.innerHeight,
            mouseX: e.screenX,
            mouseY: e.screenY
        };
    };

    const doInteraction = useCallback((e: MouseEvent) => {
        if ((!isResizing && !isMoving) || !window.electronAPI) return;

        const now = Date.now();
        if (now - lastUpdate.current < 16) return;
        lastUpdate.current = now;

        const deltaX = (e.screenX - initialPos.current.mouseX);
        const deltaY = (e.screenY - initialPos.current.mouseY);

        if (isMoving) {
            window.electronAPI.updateScannerBounds({
                x: initialPos.current.x + deltaX,
                y: initialPos.current.y + deltaY,
                width: initialPos.current.width,
                height: initialPos.current.height
            });
            return;
        }

        if (isResizing) {
            let newX = initialPos.current.x;
            let newY = initialPos.current.y;
            let newWidth = initialPos.current.width;
            let newHeight = initialPos.current.height;

            if (isResizing.includes("e")) newWidth = Math.max(200, initialPos.current.width + deltaX);
            if (isResizing.includes("w")) {
                const potentialWidth = initialPos.current.width - deltaX;
                if (potentialWidth >= 200) {
                    newWidth = potentialWidth;
                    newX = initialPos.current.x + deltaX;
                }
            }
            if (isResizing.includes("s")) newHeight = Math.max(150, initialPos.current.height + deltaY);
            if (isResizing.includes("n")) {
                const potentialHeight = initialPos.current.height - deltaY;
                if (potentialHeight >= 150) {
                    newHeight = potentialHeight;
                    newY = initialPos.current.y + deltaY;
                }
            }

            window.electronAPI.updateScannerBounds({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight
            });
        }
    }, [isResizing, isMoving]);

    const stopInteraction = useCallback(() => {
        setIsResizing(null);
        setIsMoving(false);
    }, []);

    useEffect(() => {
        if (isResizing || isMoving) {
            window.addEventListener("mousemove", doInteraction);
            window.addEventListener("mouseup", stopInteraction);
            return () => {
                window.removeEventListener("mousemove", doInteraction);
                window.removeEventListener("mouseup", stopInteraction);
            };
        }
    }, [isResizing, isMoving, doInteraction, stopInteraction]);

    return (
        <div className="w-screen h-screen bg-transparent p-0 flex flex-col select-none overflow-hidden relative border-none">

            {/* --- MAIN UI FRAME --- */}
            <div className={`
                flex-1 flex flex-col bg-black/60 backdrop-blur-md relative overflow-hidden
                border-2 ${isResizing ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]' : 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
                rounded-md transition-all duration-100 m-1
            `}>
                {/* Header - v17.0 Fix: Manual drag handle for ultra-stability */}
                <div
                    onMouseDown={startMoving}
                    className="h-9 bg-emerald-600/20 border-b border-emerald-500/40 flex items-center justify-between px-3 drag-handle"
                >
                    <div className="flex items-center gap-2">
                        <Target size={14} className="text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-emerald-400 tracking-[0.2em] uppercase">
                            STABLE v17.0
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); window.electronAPI?.toggleScannerFrame(); }}
                            className="p-1 hover:bg-red-600 rounded transition-all text-emerald-400 hover:text-white"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center">
                    {/* Scanning Animation */}
                    {isScanning && (
                        <div className="absolute inset-0 z-50 pointer-events-none">
                            <div className="absolute inset-x-0 h-[2px] bg-red-500 shadow-[0_0_20px_rgba(255,0,0,1)] animate-[scan_1.3s_linear_infinite]" />
                            <div className="absolute inset-0 bg-red-950/30 backdrop-blur-[2px] flex flex-col items-center justify-center">
                                <Loader2 size={32} className="text-red-500 animate-spin" />
                                <span className="text-[12px] font-mono text-white font-black tracking-[0.3em] mt-3">ANALYZING</span>
                            </div>
                        </div>
                    )}

                    <div className="z-40">
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={handleScan}
                            disabled={isScanning || !!isResizing || isMoving}
                            className={`
                                flex items-center gap-3 px-10 py-3 rounded-full border-2 transition-all duration-300 shadow-2xl active:scale-95
                                ${isScanning
                                    ? 'bg-red-700 border-red-500 text-white'
                                    : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500'
                                }
                            `}
                        >
                            <Scan size={20} strokeWidth={3} />
                            <span className="text-[14px] font-mono font-black uppercase tracking-widest leading-none">
                                {isScanning ? 'WAIT' : 'CAPTURE'}
                            </span>
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40">
                        <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Grab Edges to Resize</span>
                        <ChevronDown size={12} className="text-emerald-400 animate-bounce mt-1" />
                    </div>
                </div>
            </div>

            {/* --- RESIZE HANDLES (PLACED LAST TO BE ON TOP) --- */}
            <div className="absolute inset-0 pointer-events-none z-[9999]">
                {/* 4 Corners - Visible for feedback */}
                <div onMouseDown={(e) => startResizing("nw", e)} className="absolute top-0 left-0 w-8 h-8 resize-cursor-nwse pointer-events-auto z-[1001] bg-emerald-500/5 hover:bg-emerald-500/40 border-t border-l border-emerald-500/20" />
                <div onMouseDown={(e) => startResizing("ne", e)} className="absolute top-0 right-0 w-8 h-8 resize-cursor-nesw pointer-events-auto z-[1001] bg-emerald-500/5 hover:bg-emerald-500/40 border-t border-r border-emerald-500/20" />
                <div onMouseDown={(e) => startResizing("sw", e)} className="absolute bottom-0 left-0 w-8 h-8 resize-cursor-nesw pointer-events-auto z-[1001] bg-emerald-500/5 hover:bg-emerald-500/40 border-b border-l border-emerald-500/20" />
                <div onMouseDown={(e) => startResizing("se", e)} className="absolute bottom-0 right-0 w-8 h-8 resize-cursor-nwse pointer-events-auto z-[1001] bg-emerald-500/5 hover:bg-emerald-500/40 border-b border-r border-emerald-500/20" />

                {/* 4 Sides */}
                <div onMouseDown={(e) => startResizing("n", e)} className="absolute top-0 inset-x-8 h-4 resize-cursor-ns pointer-events-auto z-[1000] hover:bg-emerald-500/20" />
                <div onMouseDown={(e) => startResizing("s", e)} className="absolute bottom-0 inset-x-8 h-4 resize-cursor-ns pointer-events-auto z-[1000] hover:bg-emerald-500/20" />
                <div onMouseDown={(e) => startResizing("e", e)} className="absolute right-0 inset-y-8 w-4 resize-cursor-ew pointer-events-auto z-[1000] hover:bg-emerald-500/20" />
                <div onMouseDown={(e) => startResizing("w", e)} className="absolute left-0 inset-y-8 w-4 resize-cursor-ew pointer-events-auto z-[1000] hover:bg-emerald-500/20" />
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-50px); }
                    100% { transform: translateY(100vh); }
                }
                body {
                    background: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                }
            `}</style>
        </div>
    );
}
