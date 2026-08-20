"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Check, Download, Monitor, Shield, Info } from "lucide-react";
import Link from "next/link";
import { AnimatedOrb } from "@/components/animated-orb";

export default function DownloadPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "ZEDX AI Desktop",
                        "operatingSystem": "Windows 10, Windows 11",
                        "applicationCategory": "BusinessApplication",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "150"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "downloadUrl": "https://github.com/ziademad02153/zedx-ai-dist/releases/download/v1.1.3/ZEDX.AI.Setup.1.1.3.exe",
                        "featureList": "Real-time Meeting Simulation, Internal Audio Routing, Context Analysis, Practice Interface, AI Simulator",
                        "author": {
                            "@type": "Organization",
                            "name": "ZEDX AI"
                        }
                    })
                }}
            />
            <Navbar />

            <main className="flex-grow pt-32 pb-20 relative">
                {/* Background Glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">

                        <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight text-zinc-900 dark:text-white">
                            Choose Your Path <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 font-bold">To Mastery.</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            Whether you want a strict <strong className="text-emerald-500">testing environment</strong> or an <strong className="text-emerald-500">assisted training sandbox</strong>, we have the perfect tool for your level.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 items-stretch">
                        {/* Web Version Card */}
                        <div className="p-8 rounded-[2.5rem] border border-indigo-200/50 dark:border-indigo-500/20 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-indigo-500/10 flex flex-col group relative overflow-hidden bg-white/40 dark:bg-zinc-900/40">
                            {/* Animated Sand Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-purple-500/5 to-blue-500/10 dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-blue-500/20 animate-pulse opacity-70 blur-2xl z-0"></div>
                            
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-[2.5rem] shadow-md z-10">WEB SIMULATOR</div>
                            
                            <div className="flex items-center justify-between mb-8 mt-2 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 shadow-inner border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                        <AnimatedOrb className="w-20 h-20" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">AI Interviewer Robot</h3>
                                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">Web Simulator</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                                Designed for advanced candidates. Experience a strict, hyper-realistic interview environment powered by our most advanced autonomous models.
                            </p>
                            <ul className="space-y-4 mb-10 text-sm font-medium text-zinc-700 dark:text-zinc-300 flex-grow">
                                <li className="flex gap-3 items-center">
                                    <div className="bg-indigo-500/20 p-1 rounded-full shrink-0">
                                        <Check className="text-indigo-600 dark:text-indigo-400 w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Voice-to-Voice AI:</strong> True conversational partner</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <div className="bg-indigo-500/20 p-1 rounded-full shrink-0">
                                        <Check className="text-indigo-600 dark:text-indigo-400 w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Groq™ LPU:</strong> Instant, zero-latency processing</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <div className="bg-indigo-500/20 p-1 rounded-full shrink-0">
                                        <Check className="text-indigo-600 dark:text-indigo-400 w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Deep Analytics:</strong> Granular post-interview scorecard</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <div className="bg-indigo-500/20 p-1 rounded-full shrink-0">
                                        <Check className="text-indigo-600 dark:text-indigo-400 w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Unfiltered:</strong> No hints, simulating real pressure</span>
                                </li>
                            </ul>
                            <Link href="/dashboard" className="block mt-auto relative z-10">
                                <Button className="w-full rounded-2xl py-7 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 group relative overflow-hidden transition-all font-semibold border-none">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Launch Web Simulator
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                                </Button>
                            </Link>
                        </div>

                        {/* Desktop App Card */}
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-[#2ecc71] to-[#27ae60] dark:from-[#2ecc71] dark:to-[#1e8449] border-t border-white/20 shadow-[0_8px_30px_rgba(46,204,113,0.3)] relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] flex flex-col group">
                            <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-[2.5rem] shadow-sm">DESKTOP APP</div>
                            
                            <div className="flex items-center justify-between mb-8 mt-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 shadow-inner border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                        <CommandIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">AI Interview Mentor</h3>
                                        <p className="text-sm font-semibold text-emerald-100 mt-0.5">Desktop Sandbox</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-emerald-50 leading-relaxed mb-8">
                                Designed for skill improvement. The AI acts as your copilot, analyzing your screen and providing suggested answers in real-time to build your confidence.
                            </p>
                            
                            <ul className="space-y-4 mb-10 text-sm font-medium text-white flex-grow">
                                <li className="flex gap-3 items-center">
                                    <div className="bg-white/20 p-1 rounded-full shrink-0">
                                        <Check className="text-white w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Live AI Copilot:</strong> Get real-time answer suggestions</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <div className="bg-white/20 p-1 rounded-full shrink-0">
                                        <Check className="text-white w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Screen Capture (OCR):</strong> AI analyzes shared code/screens</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <div className="bg-white/20 p-1 rounded-full shrink-0">
                                        <Check className="text-white w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Internal Audio Routing:</strong> Flawless system audio capture</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <div className="bg-white/20 p-1 rounded-full shrink-0">
                                        <Check className="text-white w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span><strong>Manual Chat:</strong> Ask follow-up questions anytime</span>
                                </li>
                            </ul>

                            <div className="space-y-4 mt-auto">
                                <Link
                                    href="https://github.com/ziademad02153/zedx-ai-dist/releases/download/v1.1.3/ZEDX.AI.Setup.1.1.3.exe"
                                    className="block"
                                >
                                    <Button className="w-full rounded-2xl py-7 text-lg bg-white hover:bg-gray-50 text-emerald-700 shadow-lg group relative overflow-hidden transition-all font-bold border-none">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <Download size={20} strokeWidth={2.5} />
                                            Download for Windows
                                        </span>
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent z-0"></div>
                                    </Button>
                                </Link>
                                
                                <div className="p-4 rounded-2xl bg-black/10 border border-black/5 flex gap-3 text-left animate-fade-in items-start backdrop-blur-sm">
                                    <Info size={18} className="text-white shrink-0 mt-0.5" />
                                    <div className="text-xs leading-relaxed text-emerald-50 font-medium">
                                        <strong className="text-white block mb-0.5">Security Note:</strong>
                                        Click <strong>&quot;More info&quot;</strong> and <strong>&quot;Run anyway&quot;</strong> if Windows SmartScreen appears.
                                    </div>
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
                            <span className="block mt-1 font-medium text-emerald-500 cursor-pointer hover:underline">soon</span>
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

function CommandIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
    )
}
