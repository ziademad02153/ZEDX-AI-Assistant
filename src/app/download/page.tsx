"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Check, Download, Monitor, Shield, Zap, Info } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 relative">
                {/* Background Glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-6 animate-fade-in-up">
                            <Zap size={16} className="fill-current" />
                            <span>Pro Level Access</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Unlock the Full Power of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">ZEDX Desktop</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Don't rely on your browser microphone. The desktop app captures <strong>System Audio</strong> directly, so you can hear the interviewer clearly without them knowing.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                        {/* Web Version Card */}
                        <div className="p-8 rounded-3xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 opacity-70 hover:opacity-100 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gray-200 dark:bg-zinc-800">
                                    <GlobeIcon />
                                </div>
                                <h3 className="text-xl font-bold">Web Version</h3>
                            </div>
                            <ul className="space-y-4 mb-8 text-gray-600 dark:text-gray-400">
                                <li className="flex gap-3">
                                    <Check className="text-green-500 shrink-0" />
                                    <span>Works in any browser</span>
                                </li>
                                <li className="flex gap-3">
                                    <Check className="text-green-500 shrink-0" />
                                    <span>No installation needed</span>
                                </li>
                                <li className="flex gap-3 opacity-50">
                                    <Shield className="text-red-400 shrink-0" />
                                    <span><strong>Risk:</strong> Visible in Screen Share</span>
                                </li>
                                <li className="flex gap-3 opacity-50">
                                    <Monitor className="text-red-400 shrink-0" />
                                    <span>Cannot capture System Audio (Headphones)</span>
                                </li>
                            </ul>
                            <Link href="/dashboard" className="block">
                                <Button variant="outline" className="w-full rounded-xl py-6">
                                    Continue on Web
                                </Button>
                            </Link>
                        </div>

                        {/* Desktop App Card (Highlighed) */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 relative overflow-hidden transform hover:-translate-y-1 transition-all">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <MonitorIcon />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Windows Desktop App</h3>
                                    <p className="text-sm text-emerald-500 font-medium">For Professional Use</p>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                                        <Check size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                                        <strong>Stealth Overlay:</strong> Runs invisibly over Zoom/Teams. Safe for Screen Sharing.
                                    </span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                                        <Check size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                                        <strong>System Audio Capture:</strong> Hear the interviewer perfectly even with headphones.
                                    </span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                                        <Check size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">Global Keyboard Shortcuts (Alt+Space)</span>
                                </li>
                            </ul>

                            <div className="space-y-3">
                                <Link
                                    href="/ZEDX%20AI%20Setup%201.0.5.exe"
                                    className="block"
                                >
                                    <Button className="w-full rounded-xl py-7 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <Download size={20} />
                                            Download for Windows
                                            <span className="text-xs opacity-80 font-normal ml-1">(.exe)</span>
                                        </span>
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                                    </Button>
                                </Link>
                                <p className="text-center text-xs text-gray-400">
                                    v1.0.0 Stable • Windows 10/11 • 64-bit
                                </p>
                            </div>

                            {/* Security Note for Unsigned App */}
                            <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3 text-left animate-fade-in">
                                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                <div className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    <strong className="text-gray-900 dark:text-white block mb-1">Security Note:</strong>
                                    Windows might show a "Protected your PC" warning because ZEDX AI is currently an independent developer app.
                                    To install, simply click <strong>"More info"</strong> and then <strong>"Run anyway"</strong>.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mac Coming Soon */}
                    <div className="max-w-md mx-auto text-center p-6 rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                        <div className="flex items-center justify-center gap-3 mb-2 opacity-50">
                            <AppleIcon />
                            <span className="font-semibold text-gray-900 dark:text-white">macOS Version</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            We are currently polishing the Mac version.
                            <span className="block mt-1 font-medium text-emerald-500 cursor-pointer hover:underline">Notify me when it's ready</span>
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}

function GlobeIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

function MonitorIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    )
}

function AppleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.82 3.8-.74 2.07.11 3.2.74 4.1 1.74-2.86 1.83-2.3 4.8.46 6.08a4.12 4.12 0 0 1-.95 2.15l-.01.01c-.13.16-.16.2-.24.28l-.24.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
    )
}
