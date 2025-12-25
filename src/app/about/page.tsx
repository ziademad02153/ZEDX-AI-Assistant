import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "About ZEDX AI - AI Interview Assistant | Who We Are",
    description: "Learn about ZEDX AI, the free AI-powered interview copilot. Discover how ZEDX AI helps job seekers ace their interviews with real-time AI assistance.",
    keywords: ["ZEDX AI", "zedx", "zedx ai", "about ZEDX", "AI interview assistant", "interview copilot"],
};

// Premium Duotone Icon Components
function IconRealTime() {
    return (
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-xl bg-emerald-400/30 blur-sm"></div>
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M13 2L4.09 12.11c-.42.5-.05 1.27.59 1.32L10 14l-1.7 6.62c-.18.7.74 1.13 1.21.57l9.58-11.89c.42-.52.04-1.3-.62-1.3H13.5L15 2.38c.12-.71-.73-1.1-1.2-.49L13 2z" />
                </svg>
            </div>
        </div>
    );
}



function IconLanguage() {
    return (
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-xl bg-emerald-400/30 blur-sm"></div>
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            </div>
        </div>
    );
}

function IconVoice() {
    return (
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-xl bg-emerald-400/30 blur-sm"></div>
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            </div>
        </div>
    );
}

function IconResume() {
    return (
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-xl bg-emerald-400/30 blur-sm"></div>
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                </svg>
            </div>
        </div>
    );
}

function IconSmart() {
    return (
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-xl bg-emerald-400/30 blur-sm"></div>
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6L12 2z" />
                </svg>
            </div>
        </div>
    );
}



export default function AboutPage() {
    const features = [
        { icon: <IconRealTime />, title: "Real-Time AI", description: "Get instant AI-powered answers during live interviews." },
        { icon: <IconLanguage />, title: "Multi-Language", description: "Supports English and Arabic." },
        { icon: <IconVoice />, title: "Voice Recognition", description: "Captures questions in real-time." },
        { icon: <IconResume />, title: "Resume Analysis", description: "Personalized, relevant answers." },
        { icon: <IconSmart />, title: "Smart Answers", description: "Context-aware responses." }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
            {/* Global Background - Same as Homepage */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-100/40 dark:bg-green-900/20 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-teal-50/40 dark:bg-teal-900/20 rounded-full blur-[120px] animate-float-delayed"></div>
                <div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[40%] bg-emerald-50/30 dark:bg-emerald-900/15 rounded-full blur-[100px]"></div>
            </div>

            <main className="flex-grow pt-32 relative z-10">
                {/* Hero Section */}
                <section className="pb-20 text-center container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-green-100 dark:border-green-800 shadow-sm text-green-700 dark:text-green-400 font-semibold text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            About Us
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                            Meet <span className="text-gradient-fusion">ZEDX AI</span>
                        </h1>

                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Your free AI-powered interview copilot. We help job seekers ace their interviews with real-time AI assistance.
                        </p>
                    </div>
                </section>

                {/* What is ZEDX AI - Gradient Section */}
                <section className="py-16 px-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-600 dark:via-green-600 dark:to-teal-600"></div>
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                What is ZEDX AI?
                            </h2>
                            <p className="text-white/80">The future of interview preparation</p>
                        </div>
                        <div className="space-y-4 text-white/90 text-lg leading-relaxed">
                            <p>
                                <span className="font-semibold text-white">ZEDX AI</span> (also known as ZEDX or ZedX AI) is a revolutionary AI interview assistant that provides real-time answers during job interviews.
                            </p>
                            <p>
                                Unlike traditional interview prep tools, ZEDX AI works alongside you during live interviews, listening to questions and providing instant, tailored responses that showcase your experience and skills.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Why Choose <span className="text-gradient-fusion">ZEDX AI</span>?
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
                                Powerful features designed to help you succeed
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-20 px-4 bg-gray-50/50 dark:bg-zinc-900/50">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                How It Works
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Three simple steps to ace your next interview
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { step: "01", title: "Upload Your Resume", desc: "Add your resume and job description so ZEDX AI understands your background.", color: "from-emerald-400 to-green-500" },
                                { step: "02", title: "Start Your Interview", desc: "Launch ZEDX AI during your interview - it listens to questions in real-time.", color: "from-green-400 to-teal-500" },
                                { step: "03", title: "Get AI Answers", desc: "Receive professional answers tailored to your experience instantly.", color: "from-teal-400 to-emerald-500" }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-5 items-start p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-all">
                                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg`}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl p-12 md:p-16 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                                    <CheckCircle className="w-4 h-4" />
                                    100% Free
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Ready to Ace Your Interview?
                                </h2>
                                <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">
                                    Join thousands of job seekers using ZEDX AI to land their dream jobs.
                                </p>
                                <Link href="/dashboard">
                                    <Button className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold transition-all hover:scale-105 shadow-xl">
                                        Get Started Free
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <section className="py-8 px-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-sm text-gray-400">
                            ZEDX AI • ZEDX • ZedX AI • AI Interview Assistant
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
