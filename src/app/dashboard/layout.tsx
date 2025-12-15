"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Video, FileText, Settings, LogOut, Clock, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SettingsDialog } from "@/components/settings-dialog";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSettings, setShowSettings] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const NavItems = () => (
        <>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <LayoutDashboard size={20} />
                    Dashboard
                </Button>
            </Link>
            <Link href="/dashboard/new" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Video size={20} />
                    New Interview
                </Button>
            </Link>
            <Link href="/dashboard/resumes" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <FileText size={20} />
                    My Resumes
                </Button>
            </Link>
            <Link href="/dashboard/history" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Clock size={20} />
                    Interview History
                </Button>
            </Link>
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => { setShowSettings(true); setMobileMenuOpen(false); }}
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
        </>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
            <Navbar />
            <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="w-14 h-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Menu Slide Panel */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-zinc-900 z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 pt-20">
                    <nav className="space-y-2">
                        <NavItems />
                    </nav>
                </div>
            </div>

            <div className="flex flex-1 pt-20 container mx-auto px-4 gap-8">
                {/* Desktop Sidebar */}
                <aside className="w-64 hidden md:block py-8">
                    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 sticky top-24 transition-colors duration-300">
                        <nav className="space-y-2">
                            <NavItems />
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
