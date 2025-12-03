"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Video, FileText, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SettingsDialog } from "@/components/settings-dialog";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
            <Navbar />
            <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />

            <div className="flex flex-1 pt-20 container mx-auto px-4 gap-8">
                {/* Sidebar */}
                <aside className="w-64 hidden md:block py-8">
                    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 sticky top-24 transition-colors duration-300">
                        <nav className="space-y-2">
                            <Link href="/dashboard">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                                    <LayoutDashboard size={20} />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/dashboard/new">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                                    <Video size={20} />
                                    New Interview
                                </Button>
                            </Link>
                            <Link href="/dashboard/resumes">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                                    <FileText size={20} />
                                    My Resumes
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={() => setShowSettings(true)}
                            >
                                <Settings size={20} />
                                Settings
                            </Button>
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <LogOut size={20} />
                                    Sign Out
                                </Button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
