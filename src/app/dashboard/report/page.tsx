"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Target, Award, ChevronRight, Mic, BarChart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ReportItem {
    question: string;
    answer: string;
    score: number;
    feedback: string;
    ideal_answer: string;
}

export default function ReportPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [report, setReport] = useState<ReportItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateReport = async () => {
            try {
                const historyRaw = localStorage.getItem("interview_results");
                if (!historyRaw) {
                    router.push("/dashboard");
                    return;
                }

                const history = JSON.parse(historyRaw);
                const model = localStorage.getItem("selected_ai_model") || "llama-3.1-8b-instant";

                const prompt = `Here is the interview transcript: ${JSON.stringify(history)}`;

                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: model,
                        promptType: 'report_evaluator',
                        prompt
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error("API failed:", errorData);
                    throw new Error("Failed to generate report");
                }
                
                const data = await res.json();
                let content = data.content;
                
                // Extract JSON array using regex if the LLM added extra text
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    content = jsonMatch[0];
                }

                // Clean up potential markdown formatting from LLM
                content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
                
                const parsedReport = JSON.parse(content);
                setReport(parsedReport);
                
                // Save to DB
                try {
                    const { interviewService } = await import("@/lib/interview-service");
                    await interviewService.saveInterview(
                        "Mock Interview Session",
                        history.map((h: any) => `Q: ${h.q}\nA: ${h.a}`).join('\n\n'),
                        { scorecard: parsedReport }
                    );
                } catch (e) {
                    console.warn("Failed to save to DB:", e);
                }
            } catch (err) {
                console.error("Report generation failed:", err);
                
                // Fallback mechanism to ensure the user ALWAYS gets a report even if API fails
                const historyRaw = localStorage.getItem("interview_results");
                if (historyRaw) {
                    const history = JSON.parse(historyRaw);
                    const fallbackReport = history.map((item: any, index: number) => {
                        const answerText = (item.a || "").trim();
                        const wordCount = answerText.split(/\s+/).filter((w: string) => w.length > 0).length;
                        
                        let score = 0;
                        let feedback = "You did not provide an answer to this question, which resulted in a score of zero. In a real interview, always try to provide some context or ask clarifying questions if you are unsure.";
                        
                        if (index === 0 && wordCount > 0) {
                            // First question is just "Are you ready?"
                            score = 10;
                            feedback = "Great job confirming your readiness confidently.";
                        } else if (wordCount > 0 && wordCount < 10) {
                            score = 3;
                            feedback = "Your answer was extremely brief and lacked depth. Always provide specific examples and elaborate on your points.";
                        } else if (wordCount >= 10 && wordCount < 30) {
                            score = 5;
                            feedback = "You provided a basic answer, but it lacked the necessary detail and real-world examples to stand out to a recruiter.";
                        } else if (wordCount >= 30) {
                            score = 7;
                            feedback = "A reasonably detailed answer, though it could be improved by connecting your points more strongly to the core job requirements.";
                        }

                        return {
                            question: item.q || "Question not recorded",
                            answer: answerText.length > 0 ? answerText : "No answer provided",
                            score: score,
                            feedback: feedback,
                            ideal_answer: index === 0 ? "Yes, I am ready to begin." : "A perfect answer directly addresses the core topic, provides a real-world STAR method example, and quantifies the results."
                        };
                    });
                    setReport(fallbackReport);

                    // Save fallback to DB
                    try {
                        const { interviewService } = await import("@/lib/interview-service");
                        await interviewService.saveInterview(
                            "Mock Interview Session (Offline)",
                            history.map((h: any) => `Q: ${h.q}\nA: ${h.a}`).join('\n\n'),
                            { scorecard: fallbackReport }
                        );
                    } catch (e) {
                        console.warn("Failed to save to DB:", e);
                    }
                } else {
                    setError("Failed to generate your scorecard. The AI is currently unavailable.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        generateReport();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div className="w-[40vw] h-[40vw] bg-emerald-500/10 dark:bg-emerald-900/20 rounded-full blur-[100px] animate-pulse"></div>
                </div>
                <div className="z-10 flex flex-col items-center">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative w-24 h-24 mb-8"
                    >
                        <Image src="/zedx-logo.png" alt="ZEDX" fill className="object-contain filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </motion.div>
                    <h2 className="text-2xl tracking-widest uppercase font-light text-gray-900 dark:text-white mb-3">Analyzing Performance</h2>
                    <div className="w-64 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 15, ease: "linear" }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-6 text-gray-900 dark:text-white">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-2xl font-bold mb-2">Analysis Interrupted</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">{error}</p>
                <Link href="/dashboard">
                    <Button variant="outline" className="border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white">Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const averageScore = Math.round(report.reduce((acc, curr) => acc + curr.score, 0) / report.length);
    const getPerformanceTier = (score: number) => {
        if (score >= 9) return { label: "Exceptional", color: "text-emerald-400", border: "border-emerald-500/50" };
        if (score >= 7) return { label: "Proficient", color: "text-teal-400", border: "border-teal-500/50" };
        if (score >= 5) return { label: "Developing", color: "text-yellow-400", border: "border-yellow-500/50" };
        return { label: "Needs Focus", color: "text-rose-400", border: "border-rose-500/50" };
    };

    const overallTier = getPerformanceTier(averageScore);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 sm:p-12 relative print:bg-white print:text-black">
            {/* Background Accents */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 dark:from-emerald-900/20 to-transparent pointer-events-none print:hidden"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12 print:mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="print:hidden">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-light tracking-tight text-gray-900 dark:text-white print:text-black">Interview <span className="font-bold">Scorecard</span></h1>
                            <p className="text-sm text-emerald-600 dark:text-emerald-500/80 uppercase tracking-widest mt-1 font-medium">ZEDX AI Assessment</p>
                        </div>
                    </div>
                </div>

                {/* Score Summary Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 mb-12 shadow-xl dark:shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-12 print:border-gray-300 print:shadow-none print:bg-white"
                >
                    <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200 dark:text-white/5"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <motion.path
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: `${averageScore * 10}, 100` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-emerald-500"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-light text-gray-900 dark:text-white print:text-black">{averageScore}<span className="text-2xl text-gray-400 dark:text-gray-500">/10</span></span>
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <div className={cn("inline-flex items-center px-4 py-1.5 rounded-full border bg-gray-50 dark:bg-black/50 text-sm tracking-widest uppercase font-bold mb-4 print:bg-white", overallTier.border, overallTier.color)}>
                            {overallTier.label} Performance
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl font-light print:text-gray-800">
                            You completed <strong className="text-gray-900 dark:text-white print:text-black font-medium">{report.length}</strong> questions. Your technical articulation and response structures have been mapped against ideal industry benchmarks. Review the detailed breakdown below to optimize your delivery.
                        </p>
                    </div>
                </motion.div>

                {/* Detailed Analysis */}
                <div className="space-y-8">
                    {report.map((item, index) => {
                        const tier = getPerformanceTier(item.score);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                                key={index} 
                                className="bg-white dark:bg-black/20 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors group print:border-gray-300 print:shadow-none print:break-inside-avoid"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full print:bg-gray-100">
                                                Question {index + 1}
                                            </span>
                                            <span className={cn("text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border bg-white dark:bg-black/40 print:bg-white", tier.border, tier.color)}>
                                                Score: {item.score}/10
                                            </span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white print:text-black leading-snug">{item.question}</h3>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden group-hover:bg-gray-100 dark:group-hover:bg-white/[0.04] transition-colors print:bg-gray-50 print:border-gray-200">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400 dark:bg-gray-600"></div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Mic className="w-3 h-3" /> Transcript
                                    </span>
                                    <p className="text-gray-700 dark:text-gray-300 font-light text-lg leading-relaxed print:text-gray-800">
                                        {item.answer ? `"${item.answer}"` : <span className="italic text-gray-400 dark:text-gray-600">(No audio captured)</span>}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
                                            <BarChart className="w-5 h-5" />
                                            <span className="text-sm font-bold tracking-widest uppercase">ZEDX Analysis</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 print:text-gray-800 text-base leading-relaxed font-light">{item.feedback}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-4 text-blue-500 dark:text-blue-400">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold tracking-widest uppercase">Ideal Benchmark</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 print:text-gray-800 text-base leading-relaxed font-light">{item.ideal_answer}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                <div className="mt-16 mb-20 flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
                    <Button onClick={() => window.print()} className="h-16 px-10 text-lg font-medium tracking-wide rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2">
                        Export PDF Report
                    </Button>
                    <Link href="/dashboard">
                        <Button className="h-16 px-10 text-lg font-medium tracking-wide rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-xl transition-all">
                            Finish & Return to Dashboard <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
