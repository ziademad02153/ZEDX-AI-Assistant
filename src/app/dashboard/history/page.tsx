"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, FileText, AlertCircle, ChevronDown, ChevronUp, Trash } from "lucide-react";
import { interviewService, Interview } from "@/lib/interview-service";
import { cn } from "@/lib/utils";

export default function InterviewHistoryPage() {
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        loadInterviews();
    }, []);

    const loadInterviews = async () => {
        try {
            setIsLoading(true);
            const data = await interviewService.getUserInterviews();
            setInterviews(data);
            setError(null);
        } catch (e: any) {
            if (e.message.includes("User not authenticated")) {
                router.push("/login");
            } else {
                setError("Failed to load interviews");
                console.error(e);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this interview?")) return;

        try {
            await interviewService.deleteInterview(id);
            setInterviews(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            console.error("Failed to delete:", e);
            alert("Failed to delete interview");
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm("Are you sure you want to delete ALL interviews? This cannot be undone!")) return;

        try {
            for (const interview of interviews) {
                await interviewService.deleteInterview(interview.id);
            }
            setInterviews([]);
        } catch (e) {
            console.error("Failed to delete all:", e);
            alert("Failed to delete some interviews");
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="text-teal-500" />
                    Interview History
                </h1>
                <div className="flex gap-2">
                    {interviews.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteAll}
                            className="flex items-center gap-2"
                        >
                            <Trash size={16} />
                            Delete All
                        </Button>
                    )}
                    <Button onClick={() => router.push("/dashboard/new")}>
                        New Interview
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                    Loading interviews...
                </div>
            ) : interviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
                    <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No interviews yet</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push("/dashboard/new")}
                    >
                        Start Your First Interview
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {interviews.map((interview) => (
                        <div
                            key={interview.id}
                            className={cn(
                                "p-4 rounded-xl border transition-all cursor-pointer",
                                "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700",
                                expandedId === interview.id ? "shadow-lg ring-2 ring-teal-500" : "hover:shadow-md"
                            )}
                            onClick={() => toggleExpand(interview.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {interview.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {formatDate(interview.created_at)}
                                    </p>
                                    {interview.analysis?.interview_type && (
                                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                                            {interview.analysis.interview_type}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={(e) => handleDelete(interview.id, e)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                    {expandedId === interview.id ? (
                                        <ChevronUp size={20} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedId === interview.id && (
                                <div className="mt-4 space-y-4 border-t pt-4 border-gray-100 dark:border-zinc-700">
                                    {/* Transcript Section */}
                                    {interview.transcript && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                📝 Transcript
                                            </h4>
                                            <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg max-h-48 overflow-y-auto">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                    {interview.transcript}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* AI Responses Section */}
                                    {interview.analysis?.ai_responses && interview.analysis.ai_responses.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                🤖 AI Responses
                                            </h4>
                                            <div className="space-y-2">
                                                {interview.analysis.ai_responses.map((response, idx) => (
                                                    <div key={idx} className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                                        <p className="text-sm text-teal-800 dark:text-teal-300 whitespace-pre-wrap">
                                                            {response}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Job Description */}
                                    {interview.analysis?.job_description && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                💼 Job Description
                                            </h4>
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-h-32 overflow-y-auto">
                                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                                    {interview.analysis.job_description.slice(0, 500)}
                                                    {interview.analysis.job_description.length > 500 && "..."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
