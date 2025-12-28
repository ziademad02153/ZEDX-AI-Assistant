import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Zap, Mic, Globe, Cpu, Layers } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "About ZEDX AI - The Ultimate Interview Copilot",
    description: "Discover ZEDX AI, the next-gen interview assistant. Features system audio capture, stealth overlay, and real-time AI coaching to help you land your dream job.",
    keywords: ["ZEDX AI", "interview copilot", "AI interview assistant", "stealth overlay", "system audio capture"],
};

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-black font-sans text-foreground dark:text-gray-100 overflow-x-hidden selection:bg-emerald-500/30">
            <Navbar />

            {/* Global Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[150px]"></div>
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
                            Revolutionizing Interview Prep
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                            The Future of <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400">Career Success</span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            ZEDX AI isn't just a tool; it's your unfair advantage. Engineered for stealth, speed, and precision to help you dominate every interview.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 px-4 relative">
                    <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/60 border-y border-gray-100 dark:border-white/5"></div>
                    <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Beyond Standard Assistants
                            </h2>
                            <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                <p>
                                    Most interview tools rely on browser extensions that can be detected or fail to capture audio correctly. <strong className="text-gray-900 dark:text-white">ZEDX AI is different.</strong>
                                </p>
                                <p>
                                    We built a native desktop application that captures <span className="text-emerald-600 dark:text-emerald-400 font-medium">System Audio</span> directly from the visible sound stream, meaning it works with headphones and is completely invisible to screen-sharing detection agents.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-white/70 dark:bg-zinc-900/80 border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-zinc-50/80 dark:bg-black/40 rounded-xl border border-zinc-100 dark:border-white/5">
                                        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Real-Time Intelligence</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Zero latency answers streaming.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-zinc-50/80 dark:bg-zinc-950/40 rounded-xl border border-zinc-100 dark:border-white/5">
                                        <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Undetectable Overlay</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Safe for all conferencing tools.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-zinc-50/80 dark:bg-zinc-950/40 rounded-xl border border-zinc-100 dark:border-white/5">
                                        <div className="p-3 bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-lg">
                                            <Cpu size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">System Audio Core</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Captures output directly from OS.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features */}
                <section className="py-24 px-4 bg-white dark:bg-black transition-colors duration-300">
                    <div className="max-w-6xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Engineered for <span className="text-emerald-600 dark:text-emerald-400">Performance</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                            A suite of powerful features designed to give you the confidence of an expert.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <Mic />, title: "Voice Capture", desc: "Advanced VAD (Voice Activity Detection) filters noise and captures questions instantly." },
                            { icon: <Layers />, title: "Context Aware", desc: "Analyzes your resume and job description to tailor answers specifically to you." },
                            { icon: <Globe />, title: "Multi-Language", desc: "Native support for English, Arabic, Spanish, and 30+ other global languages." },
                            { icon: <Zap />, title: "Instant Transcription", desc: "Powered by Groq™ for ultra-fast speech-to-text conversion with 99% accuracy." },
                            { icon: <Shield />, title: "Privacy First", desc: "Your audio data is processed ephemerally and never stored on our servers." },
                            { icon: <Cpu />, title: "Model Agnostic", desc: "Switch between Llama 3, GPT-4, and Qwen models on the fly for best results." }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-lg dark:hover:bg-zinc-900 transition-all duration-300 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-sm dark:shadow-emerald-900/20">
                                    {item.icon}
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
                                    Ready to upgrade your career?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
                                    Join thousands of engineers, managers, and executives using ZEDX AI to secure their next role.
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
