"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

                const systemPrompt = `You are an expert technical recruiter and AI evaluator.
You will be given a transcript of an interview. Your job is to evaluate the candidate's answers.
You MUST reply strictly in JSON format. Do NOT wrap it in markdown block quotes. Just raw JSON.
The JSON must be an array of objects, where each object has:
{
    "question": "The question asked",
    "answer": "The candidate's answer",
    "score": <number from 1 to 10>,
    "feedback": "1 sentence of what they did well, 1 sentence of what they missed",
    "ideal_answer": "A short example of a perfect answer"
}`;

                const prompt = `Here is the interview transcript: ${JSON.stringify(history)}`;

                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: model,
                        systemPrompt,
                        prompt
                    })
                });

                if (!res.ok) throw new Error("Failed to generate report");
                
                const data = await res.json();
                let content = data.content;
                // Clean up potential markdown formatting from LLM
                content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
                
                const parsedReport = JSON.parse(content);
                setReport(parsedReport);
            } catch (err) {
                console.error("Report generation failed:", err);
                setError("Failed to generate your scorecard. The AI returned an invalid format.");
            } finally {
                setIsLoading(false);
            }
        };

        generateReport();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Your Performance</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
                    ZEDX is evaluating your answers, checking technical accuracy, and generating your personalized scorecard...
                </p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
                <Link href="/dashboard">
                    <Button>Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const averageScore = Math.round(report.reduce((acc, curr) => acc + curr.score, 0) / report.length);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Interview Scorecard</h1>
                </div>

                <div className="bg-white dark:bg-[#111] rounded-3xl p-8 mb-8 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200 dark:text-gray-800"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-emerald-500"
                                strokeDasharray={`${averageScore * 10}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{averageScore}/10</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {averageScore >= 8 ? "Excellent Performance! 🎉" : averageScore >= 5 ? "Good Effort! 👍" : "Needs Practice 📚"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            You completed {report.length} questions. Review your feedback below to see where you excelled and where you can improve for the real thing.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {report.map((item, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={index} 
                            className="bg-white dark:bg-[#111] rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-white/5"
                        >
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <span className="text-sm font-bold text-emerald-500 mb-2 block">QUESTION {index + 1}</span>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{item.question}</h3>
                                </div>
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center font-bold text-lg text-emerald-500 border border-emerald-500/20">
                                    {item.score}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 sm:p-5 mb-6">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">Your Answer</span>
                                <p className="text-gray-700 dark:text-gray-300 italic">"{item.answer || '(No answer provided)'}"</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                        <CheckCircle2 className="w-5 h-5" /> Feedback
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.feedback}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold">
                                        <SparklesIcon className="w-5 h-5" /> Ideal Answer
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.ideal_answer}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <div className="mt-12 flex justify-center">
                    <Link href="/dashboard">
                        <Button className="h-14 px-8 text-lg font-bold rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}
