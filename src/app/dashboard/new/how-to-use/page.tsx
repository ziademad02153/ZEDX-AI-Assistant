"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Mic,
    Monitor,
    Scan,
    LogOut,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Video,
    Info,
    Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleStyleMicIcon } from "@/components/premium-icons";

export default function HowToUsePage() {
    const router = useRouter();
    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
        if (window.electronAPI) {
            // Deferred to next tick to avoid synchronous state update warning
            setTimeout(() => setIsElectron(true), 0);
        }
    }, []);

    const instructions = [
        ...(isElectron ? [{
            title: "Smart Mic Control",
            description: "Listen when the interviewer asks, then STOP the mic when you start answering. This prevents the AI from hearing your own voice and getting confused.",
            icon: <Mic className="w-8 h-8" />,
            color: "from-emerald-500 to-green-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        {
            title: "Internal Audio Routing",
            description: "Capture the interviewer's voice directly from your system. Best for high-quality transcription in noiseless environments.",
            icon: <Monitor className="w-8 h-8" />,
            color: "from-teal-500 to-emerald-600",
            bg: "bg-teal-500/10",
            border: "border-teal-500/20"
        },
        {
            title: "Assessment Interface",
            description: "Use the scanner for code snippets or text you can't copy. The AI will analyze the screenshot in real-time.",
            icon: <Scan className="w-8 h-8" />,
            color: "from-green-600 to-emerald-700",
            bg: "bg-green-600/10",
            border: "border-green-600/20"
        },
        {
            title: "AI Coaching Suggestions",
            description: "Enable Auto-Answer to get suggestions instantly after the question ends. Precision is key.",
            icon: <Sparkles className="w-8 h-8" />,
            color: "from-lime-500 to-emerald-500",
            bg: "bg-lime-500/10",
            border: "border-lime-500/20"
        }] : [
        {
            title: "Voice-to-Voice AI Recruiter",
            description: "The AI conducts the interview verbally in your selected language. Listen carefully to the question before answering.",
            icon: <Image src="/zedx-logo.png" alt="ZEDX Logo" width={48} height={48} className="object-contain" />,
            color: "bg-transparent shadow-none from-transparent to-transparent",
            bg: "bg-teal-500/10",
            border: "border-teal-500/20"
        },
        {
            title: "Smart Silence Detection",
            description: "Speak naturally. If you pause for more than 3 seconds, ZEDX will automatically submit your answer and move to the next question.",
            icon: <GoogleStyleMicIcon width={40} height={40} className="drop-shadow-sm" />,
            color: "bg-white dark:bg-[#111] shadow-none",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        {
            title: "Performance Scorecard",
            description: "After finishing, you will receive a granular benchmark report scoring your exact verbal answers against industry standards.",
            icon: <Image src="/Granular Scorecards.png" alt="Granular Scorecards" width={56} height={56} className="object-contain drop-shadow-sm" />,
            color: "bg-white dark:bg-[#111] shadow-none",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        }]),
        {
            title: "End Session",
            description: "Use the End Interview button to safely finalize your session and generate your scorecard.",
            icon: <LogOut className="w-12 h-12 text-red-600 dark:text-red-500" />,
            color: "bg-transparent shadow-none from-transparent to-transparent",
            bg: "bg-red-500/10",
            border: "border-red-500/20"
        }
    ];

    const handleStart = () => {
        if (isElectron) {
            router.push("/interview");
        } else {
            router.push("/mock-interview");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-foreground relative overflow-hidden flex flex-col items-center justify-center px-6 py-12">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex justify-center sm:justify-end px-4 mb-8"
                >
                    <Link 
                        href="mailto:ziademadbts@gmail.com" 
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 group"
                    >
                        <Image 
                            src="/suggestion logo.png" 
                            alt="Suggestion" 
                            width={22} 
                            height={22} 
                            className="dark:invert opacity-80 group-hover:opacity-100 transition-opacity object-contain" 
                        />
                        <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Have a suggestion?
                        </span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-16 px-4"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white pb-4 leading-[1.2] sm:leading-tight">
                        Mastering the Simulator
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-xl max-w-2xl mx-auto">
                        Quick guide to ensure a flawless interview session with maximum precision.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12 w-full">
                    {instructions.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "p-6 sm:p-8 rounded-[32px] border transition-all duration-500 hover:scale-[1.02] bg-white dark:bg-[#111] shadow-xl dark:shadow-none flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6",
                                item.border
                            )}
                        >
                            <div className={cn(
                                "p-5 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg shrink-0",
                                item.color
                            )}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 dark:text-white uppercase tracking-tight">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base italic">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center gap-6"
                >
                    <Button
                        onClick={handleStart}
                        className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group"
                    >
                        Got it, Start Interview!
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 size={18} />
                        <span>Setup Complete • Simulation Mode Active</span>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
}
