"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle, Calendar, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { interviewService, Interview } from "@/lib/interview-service";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({ totalInterviews: 0, totalMinutes: 0 });
    const [recentSessions, setRecentSessions] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const interviews = await interviewService.getUserInterviews();
            setRecentSessions(interviews.slice(0, 3)); // Get top 3
            setStats({
                totalInterviews: interviews.length,
                totalMinutes: interviews.length * 5 // Estimate 5 min per interview
            });
        } catch (e: any) {
            if (e.message.includes("User not authenticated")) {
                router.push("/login");
            }
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Delete this interview?")) return;

        try {
            await interviewService.deleteInterview(id);
            setRecentSessions(prev => prev.filter(s => s.id !== id));
            setStats(prev => ({ ...prev, totalInterviews: prev.totalInterviews - 1 }));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back! Ready for your next interview?</p>
                </div>
                <Link href="/dashboard/new">
                    <Button variant="gradient" className="shadow-lg shadow-green-900/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Start New Interview
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Time</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMinutes}m</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Interviews Completed</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInterviews}</h3>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-colors">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent History</h3>
                    {recentSessions.length > 0 && (
                        <Link href="/dashboard/history">
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                                View All
                            </Button>
                        </Link>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : recentSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No interviews yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Start your first mock interview to see your history and analytics here.</p>
                        <Link href="/dashboard/new">
                            <Button variant="outline" className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">Start Interview</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentSessions.map((session) => (
                            <Link href="/dashboard/history" key={session.id}>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{session.title}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(session.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={(e) => handleDelete(session.id, e)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                        <ArrowRight size={18} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
