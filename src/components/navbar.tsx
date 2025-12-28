"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Check if running in Electron desktop mode
        if (typeof window !== "undefined" && (window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsDesktop(true);
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide full navbar in desktop mode - DesktopNavBar handles navigation
    if (isDesktop) return null;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "py-3 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
                    : "py-4 bg-transparent"
            )}
        >
            <div className="w-full max-w-[75vw] mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <Image
                        src="/zedx-logo.png"
                        alt="ZEDX-AI Logo"
                        width={110}
                        height={110}
                        className="object-contain w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[110px] lg:h-[110px] transition-transform group-hover:scale-105"
                        style={{ height: 'auto' }}
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-5">
                    <Link
                        href="/#features"
                        className="flex items-center gap-1.5 text-lg font-bold text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={(e) => {
                            if (window.location.pathname === '/') {
                                e.preventDefault();
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all shadow-sm">
                            How it Works
                        </span>
                    </Link>
                    <Link
                        href="/download"
                        className="flex items-center gap-1.5 text-lg font-bold text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group relative"
                    >
                        <span className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all shadow-sm flex items-center gap-2">
                            Desktop App
                            <span className="bg-emerald-500 text-white text-xs font-extra-bold px-2.5 py-1 rounded-full animate-pulse shadow-md shadow-emerald-500/20">NEW</span>
                        </span>
                    </Link>
                    <Link
                        href="/about"
                        className="text-lg font-bold transition-colors"
                    >
                        <span className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all shadow-sm text-gray-700 dark:text-gray-200">
                            About ZEDX AI
                        </span>
                    </Link>

                    <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                        <AuthButtons />
                    </div>
                </div>

                {/* Mobile Menu (Sheet) */}
                <div className="md:hidden flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
                                <Menu size={24} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
                            <SheetHeader>
                                <SheetTitle className="text-left text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Image src="/favicon.png" alt="Logo" width={24} height={24} />
                                    Menu
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 mt-8">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/dashboard/new">
                                    <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        New Interview
                                    </Button>
                                </Link>
                                <Link href="/dashboard/resumes">
                                    <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        My Resumes
                                    </Button>
                                </Link>
                                <Link href="/dashboard/history">
                                    <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        Interview History
                                    </Button>
                                </Link>

                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

                                <Link href="/#features">
                                    <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        How it Works
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        About ZEDX AI
                                    </Button>
                                </Link>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <AuthButtons />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}

function AuthButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // First check cookie
            const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));

            if (hasToken) {
                setIsLoggedIn(true);
            }

            // Also check Supabase session
            try {
                const { supabase } = await import("@/lib/supabase");
                const { data } = await supabase.auth.getSession();

                if (data.session) {
                    setIsLoggedIn(true);
                    setUserName(data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || null);
                    setUserEmail(data.session.user.email || null);
                    setUserAvatar(data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture || null);

                    // Ensure cookie is set
                    if (!hasToken) {
                        const sessionId = data.session.access_token.slice(0, 32);
                        document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;
                    }
                }
            } catch (e) {
                console.error("Auth check error:", e);
            }
        };

        checkAuth();

        // Re-check less frequently to reduce resource usage
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const { supabase } = await import("@/lib/supabase");
            await supabase.auth.signOut();
        } catch (e) {
            console.error("Logout error:", e);
        }
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setIsLoggedIn(false);
        window.location.href = "/login";
    };

    const handleSwitchAccount = async () => {
        // Sign out first, then redirect to login
        try {
            const { supabase } = await import("@/lib/supabase");
            await supabase.auth.signOut();
        } catch (e) {
            console.error("Switch account error:", e);
        }
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
    };

    if (isLoggedIn) {
        return (
            <div className="relative user-dropdown">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        <div className="w-10.5 h-10.5 rounded-full overflow-hidden border-2 border-green-500 shadow-md">
                            {userAvatar ? (
                                <Image
                                    src={userAvatar}
                                    alt="User Avatar"
                                    width={42}
                                    height={42}
                                    className="w-full h-full object-cover"
                                    style={{ height: 'auto' }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                    {userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-black/20 border border-gray-200 dark:border-zinc-700 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info Header */}
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                                        {userAvatar ? (
                                            <Image
                                                src={userAvatar}
                                                alt="User Avatar"
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                                style={{ height: 'auto' }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                                                {userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                            {userName || 'User'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {userEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <button
                                    onClick={handleSwitchAccount}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Switch Account
                                </button>

                                <div className="my-2 border-t border-gray-100 dark:border-zinc-700"></div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <Link href="/login">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                    Sign in
                </Button>
            </Link>
            <Link href="/login">
                <Button variant="gradient" className="shadow-lg shadow-green-900/20">
                    Try For Free
                </Button>
            </Link>
        </>
    );
}
