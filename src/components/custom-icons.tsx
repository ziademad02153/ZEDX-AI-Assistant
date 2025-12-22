"use client";

// Premium Custom Icons with modern design and glassmorphism effects
// Clean, minimal, professional icons for ZEDX AI

interface IconProps {
    className?: string;
}

export function BrainIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                        <path d="M12 18v4" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export function LightningIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                        <path d="M13 2L4.09 12.11c-.42.5-.05 1.27.59 1.32L10 14l-1.7 6.62c-.18.7.74 1.13 1.21.57l9.58-11.89c.42-.52.04-1.3-.62-1.3H13.5L15 2.38c.12-.71-.73-1.1-1.2-.49L13 2z" />
                    </svg>
                </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl -z-10"></div>
        </div>
    );
}

export function ShieldIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export function GlobeIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export function MicIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                </div>
            </div>
            {/* Sound wave animation hint */}
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                <div className="w-1 h-2 rounded-full bg-emerald-400/60"></div>
                <div className="w-1 h-3 rounded-full bg-emerald-400/80"></div>
                <div className="w-1 h-2 rounded-full bg-emerald-400/60"></div>
            </div>
        </div>
    );
}

export function DocumentIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" x2="8" y1="13" y2="13" />
                        <line x1="16" x2="8" y1="17" y2="17" />
                        <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export function SparkleIcon({ className = "" }: IconProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                        <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
                    </svg>
                </div>
            </div>
            {/* Sparkle dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse delay-300"></div>
        </div>
    );
}
