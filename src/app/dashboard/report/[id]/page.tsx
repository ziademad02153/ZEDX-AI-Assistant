"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { interviewService, Interview } from "@/lib/interview-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Target, MessageSquare, Brain, CheckCircle, AlertTriangle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";


// Define the expected structure of our AI scorecard
interface Scorecard {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    strengths: string[];
    improvements: string[];
    detailedFeedback: string;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap the params Promise (Next.js 15 requirement)
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [interview, setInterview] = useState<Interview | null>(null);
    const [scorecard, setScorecard] = useState<Scorecard | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const data = await interviewService.getInterviewById(id);
                setInterview(data);
                
                if (data.analysis?.scorecard) {
                    // Scorecard already exists!
                    setScorecard(data.analysis.scorecard as Scorecard);
                } else {
                    // Generate it!
                    generateScorecard(data);
                }
            } catch (err: unknown) {
                console.error(err);
                setError("Failed to load interview report.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const generateScorecard = async (data: Interview) => {
        setIsGenerating(true);
        try {
            const systemPrompt = `
You are an expert technical interviewer and HR assessor.
Your task is to analyze an interview transcript and provide a strict JSON scorecard.
Evaluate the candidate based on:
1. Technical Accuracy (0-100)
2. Communication Skills (0-100)
3. Overall Performance (0-100)

Return ONLY a valid JSON object matching this exact structure, with no markdown formatting or extra text:
{
    "overallScore": 85,
    "technicalScore": 80,
    "communicationScore": 90,
    "strengths": ["Clear communication", "Good problem solving"],
    "improvements": ["Needs to elaborate more on system design"],
    "detailedFeedback": "Overall, the candidate did a great job but should focus on..."
}
`;

            const userPrompt = `
Interview Type: ${data.analysis?.interview_type || "General"}
Questions and Transcript:
${data.transcript || "No transcript available."}

AI Responses generated during session:
${data.analysis?.ai_responses?.join("\n\n") || "None."}
`;

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    systemPrompt: systemPrompt,
                    messages: [{ role: "user", content: userPrompt }]
                })
            });

            if (!response.ok) throw new Error("Failed to generate scorecard");

            const resData = await response.json();
            
            // Clean up the JSON if the LLM added markdown backticks
            let jsonString = resData.content.trim();
            if (jsonString.startsWith("```json")) {
                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
            } else if (jsonString.startsWith("```")) {
                jsonString = jsonString.replace(/```/g, "").trim();
            }

            const parsedScorecard = JSON.parse(jsonString);

            // Update the state
            setScorecard(parsedScorecard);

            // Save back to DB
            const updatedAnalysis = { ...data.analysis, scorecard: parsedScorecard };
            await interviewService.updateInterview(id, { analysis: updatedAnalysis });

        } catch (err) {
            console.error("Error generating scorecard:", err);
            setError("Failed to generate AI analysis. The transcript might be too short.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                    <p className="animate-pulse">Loading meeting data...</p>
                </div>
            </div>
        );
    }

    if (error || !interview) {
        return (
            <div className="min-h-screen p-8 bg-gray-50 dark:bg-zinc-950">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Button>
                </Link>
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-2xl mx-auto">
                    {error || "Interview not found."}
                </div>
            </div>
        );
    }

    if (isGenerating && !scorecard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-950">
                <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 text-center max-w-md w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient-x"></div>
                    <Brain className="w-16 h-16 mx-auto mb-6 text-emerald-500 animate-bounce" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Analyzing Session...</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">ZEDX AI is processing your responses, evaluating technical accuracy, and calculating your final score.</p>
                    <div className="flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                </div>
            </div>
        );
    }

    // Helper for circular progress
    const CircularProgress = ({ value, label, icon: Icon, colorClass }: { value: number, label: string, icon: React.ElementType, colorClass: string }) => (
        <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full ${colorClass}`}></div>
            <div className="relative w-28 h-28 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                        className="text-gray-100 dark:text-zinc-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className={`${colorClass} transition-all duration-1000 ease-out`}
                        strokeWidth="3"
                        strokeDasharray={`${value}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
                </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
            </h3>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-8 pt-24 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="mb-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Performance Scorecard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {interview.title} • {new Date(interview.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {scorecard && (
                    <>
                        {/* Scores Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CircularProgress 
                                value={scorecard.overallScore} 
                                label="Overall Score" 
                                icon={Target}
                                colorClass="text-emerald-500" 
                            />
                            <CircularProgress 
                                value={scorecard.technicalScore} 
                                label="Technical Accuracy" 
                                icon={Brain}
                                colorClass="text-blue-500" 
                            />
                            <CircularProgress 
                                value={scorecard.communicationScore} 
                                label="Communication" 
                                icon={MessageSquare}
                                colorClass="text-purple-500" 
                            />
                        </div>

                        {/* Analysis Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-8">
                                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6" /> Key Strengths
                                </h3>
                                <ul className="space-y-4">
                                    {scorecard.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 text-emerald-900 dark:text-emerald-100">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                            <span className="leading-relaxed">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-3xl p-6 sm:p-8">
                                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-6 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6" /> Areas for Improvement
                                </h3>
                                <ul className="space-y-4">
                                    {scorecard.improvements.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3 text-amber-900 dark:text-amber-100">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                            <span className="leading-relaxed">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Detailed Feedback */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detailed Assessment</h3>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <ReactMarkdown>{scorecard.detailedFeedback}</ReactMarkdown>
                            </div>
                        </div>
                    </>
                )}

                {/* Transcript Archive */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Session Transcript Archive</h3>
                    <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 whitespace-pre-wrap font-mono text-sm text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-zinc-800 max-h-96 overflow-y-auto leading-relaxed">
                        {interview.transcript || "No transcript recorded for this session."}
                    </div>
                </div>

            </div>
        </div>
    );
}
