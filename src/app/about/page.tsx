import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Mic, Timer, MessageSquare, BarChart, Zap } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedOrb } from "@/components/animated-orb";
import {
    GoogleStyleMicIcon,
    PrivacyShieldIcon,
    PremiumContextAwareIcon,
    PremiumMultiLangIcon,
    PremiumInstantTransIcon,
    PremiumModelAgnosticIcon,
    PremiumGranularScorecardsIcon,
    PremiumSmartSilenceDetectionIcon,
    PremiumFocusedPracticeWorkspaceIcon,
    PremiumVoiceToVoiceSimulationIcon
} from "@/components/premium-icons";

export const metadata: Metadata = {
    title: "About ZEDX AI Simulator - The Ultimate Interview Training Coach",
    description: "Learn about the mission behind ZEDX AI Simulator, a free tool designed to help developers and job seekers master real-time interviews with privacy-first AI.",
    keywords: ["ZEDX AI Simulator", "mock interview coach", "AI training", "assessment interface", "internal audio routing"],
};

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-emerald-500/30">
            <Navbar />

            {/* Global Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-100/40 dark:bg-emerald-900/10 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-teal-50/40 dark:bg-teal-900/10 rounded-full blur-[120px] animate-float-delayed"></div>
            </div>

            <main className="flex-grow pt-32 relative z-10">
                {/* Hero Section */}
                <section className="pb-24 text-center container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/30 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 backdrop-blur-md text-emerald-700 dark:text-emerald-400 font-bold text-sm animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Revolutionizing Interview Training
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                            The Future of <br className="hidden sm:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400">Interview Simulation</span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            ZEDX AI Simulator is your ultimate interview mastery platform. Choose the <strong>Web Simulator</strong> for rigorous, unassisted testing, or the <strong>Desktop Sandbox</strong> for real-time AI copilot assistance and training.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 px-4 relative">
                    <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/60 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"></div>
                    <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                A Comprehensive Dual-Mode Platform
                            </h2>
                            <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                <p>
                                    Most training tools rely on rigid generic questionnaires or bots that join calls awkwardly. <strong className="text-gray-900 dark:text-white">ZEDX AI Simulator is different.</strong>
                                </p>
                                <p>
                                    We built a complete suite featuring a <span className="text-emerald-600 dark:text-emerald-400 font-medium">native desktop application</span> for high-fidelity Sandbox training using Internal Audio Routing, AND an advanced <span className="text-emerald-600 dark:text-emerald-400 font-medium">Web-based Voice-to-Voice Simulator</span> for rigorous, multi-lingual mock interviews.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-white/5 shadow-sm">
                                        <div className="flex items-center justify-center p-2">
                                            <AnimatedOrb className="w-16 h-16 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Real-Time Intelligence</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Instant coaching and explanations during simulation.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-white/5 shadow-sm">
                                        <div className="flex items-center justify-center p-2 w-20 h-20 -ml-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                            <PremiumFocusedPracticeWorkspaceIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Focused Practice Workspace</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Minimal UI for focused practice sessions.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-white/5 shadow-sm">
                                        <div className="flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                                            <PremiumVoiceToVoiceSimulationIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Voice-to-Voice Simulation</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Autonomous Web Agent powered by ElevenLabs.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Dedicated Robot Section */}
                <section className="py-24 px-4 relative">
                    <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/30 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"></div>
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Meet Your AI Interviewer
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                                The Web-based Mock Interview Simulator isn't just a text bot. It's a fully autonomous Voice-to-Voice AI recruiter designed to push your limits.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="mb-6 flex items-center justify-start relative">
                                    <div className="absolute w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                                    <div className="relative z-10">
                                        <PremiumSmartSilenceDetectionIcon />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Dynamic Interview Modes</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Choose from Technical, Behavioral, or Project Deep Dive modes. The AI dynamically adapts its questioning style to grill you on your specific CV projects or soft skills.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <AnimatedOrb className="w-20 h-20 -ml-2 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Multi-Lingual Voice (TTS)</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Powered by ElevenLabs Multilingual V2, the robot speaks to you with human-like intonation in over 30 global languages, adapting to the language you choose for your interview.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="mb-6 flex items-center justify-start relative">
                                    <div className="absolute w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                                    <div className="relative z-10">
                                        <PremiumGranularScorecardsIcon />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Granular Scorecards</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    At the end of the session, the AI evaluates your exact spoken transcript, scoring each answer out of 10 and providing you with an ideal benchmark response.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features */}
                <section className="py-24 px-4 relative transition-colors duration-300">
                    <div className="absolute inset-0 bg-white dark:bg-zinc-900/50 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"></div>
                    <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Engineered for <span className="text-emerald-600 dark:text-emerald-400">Performance</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                            A suite of powerful features designed to give you the confidence of an expert.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 relative z-10">
                        {[
                            { icon: <GoogleStyleMicIcon />, title: "Voice Capture", desc: "Advanced VAD (Voice Activity Detection) filters noise and captures your spoken answers instantly and accurately." },
                            { icon: <PremiumContextAwareIcon />, title: "Context Aware", desc: "Analyzes your uploaded CV and job descriptions to tailor answers specifically to your profile." },
                            { icon: <PremiumMultiLangIcon />, title: "Multi-Language", desc: "Native support for English, Arabic, Spanish, and 30+ other global languages." },
                            { icon: <PremiumInstantTransIcon />, title: "Instant Transcription", desc: "Powered by Groq™ for ultra-fast speech-to-text conversion with 99% accuracy." },
                            { icon: <PrivacyShieldIcon />, title: "Privacy First", desc: "Your audio data is processed ephemerally and never stored on our servers." },
                            { icon: <PremiumModelAgnosticIcon />, title: "Ultra-Fast Intelligence", desc: "Powered by Groq's LPU inference, featuring GPT-OSS 120B & Qwen for instantaneous conversational responses." }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-lg dark:hover:bg-zinc-900 transition-all duration-300 backdrop-blur-sm">
                                <div className="mb-8 flex items-center justify-start relative">
                                    <div className="absolute w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                                    <div className="relative z-10">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-12 md:p-20 text-center shadow-xl dark:shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-5"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                                    Ready to empower your workflow?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
                                    Join thousands of job seekers and fresh graduates using ZEDX AI Simulator to elevate their interview skills.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/download">
                                        <Button className="h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/20 transition-all hover:-translate-y-1">
                                            Download for Windows
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button variant="outline" className="h-14 px-8 rounded-full border-zinc-200 dark:border-white/20 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-white font-semibold text-lg backdrop-blur-sm transition-all hover:-translate-y-1">
                                            Try Web Version
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
