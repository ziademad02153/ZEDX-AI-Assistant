"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { history, InterviewSession } from "@/lib/history";

export default function DashboardPage() {
    const [stats, setStats] = useState({ totalInterviews: 0, totalMinutes: 0 });
    const [recentSessions, setRecentSessions] = useState<InterviewSession[]>([]);

    useEffect(() => {
        setStats(history.getStats());
        setRecentSessions(history.getSessions().slice(0, 3)); // Get top 3
    }, []);

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
                        <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">View All</Button>
                    )}
                </div>

                {recentSessions.length === 0 ? (
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
                            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{session.type} Interview</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(session.date).toLocaleDateString()} • {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ArrowRight size={18} className="text-gray-400 dark:text-gray-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
