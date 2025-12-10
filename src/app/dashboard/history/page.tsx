"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, FileText, AlertCircle } from "lucide-react";
import { interviewService, Interview } from "@/lib/interview-service";
import { cn } from "@/lib/utils";

export default function InterviewHistoryPage() {
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this interview?")) return;

        try {
            await interviewService.deleteInterview(id);
            setInterviews(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            console.error("Failed to delete:", e);
            alert("Failed to delete interview");
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="text-teal-500" />
                    Interview History
                </h1>
                <Button onClick={() => router.push("/dashboard/new")}>
                    New Interview
                </Button>
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
                                "p-4 rounded-xl border transition-all hover:shadow-md",
                                "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700"
                            )}
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
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(interview.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>

                            {interview.transcript && (
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                        {interview.transcript.slice(0, 200)}
                                        {interview.transcript.length > 200 && "..."}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
