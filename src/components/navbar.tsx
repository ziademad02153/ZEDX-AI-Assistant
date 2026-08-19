"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

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
                scrolled ? "py-3" : "py-4"
            )}
        >
            {/* Seamless Fade-out Glass Background */}
            <div 
                className={cn(
                    "absolute inset-0 -bottom-8 pointer-events-none transition-opacity duration-300",
                    scrolled ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-full md:max-w-[75vw] mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <Image
                        src="/zedx-logo.png"
                        alt="ZEDX-AI Logo"
                        width={90}
                        height={90}
                        className="object-contain w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[85px] lg:h-[85px] transition-transform group-hover:scale-105"
                        style={{ height: 'auto' }}
                        priority
                    />
                </Link>



                {/* Mobile & Desktop Menu (Sheet) */}
                <div className="flex items-center gap-4">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-90 transition-all">
                                <Menu size={24} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[350px] border-l border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-3xl p-0 rounded-l-[2rem] shadow-2xl">
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-gray-200/30 dark:border-white/5 flex items-center justify-between">
                                    <SheetTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Image src="/favicon.png" alt="Logo" width={24} height={24} />
                                        Menu
                                    </SheetTitle>
                                </div>
                                <div className="flex flex-col flex-1 gap-2 p-4 overflow-y-auto justify-between">
                                    <div className="flex flex-col gap-1.5">
                                        <Link href="/dashboard" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/new" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                New Simulation
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/resumes" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                My Context Files
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/history" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                Training History
                                            </Button>
                                        </Link>

                                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-2" />

                                        <Link href="/#features" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                How it Works
                                            </Button>
                                        </Link>
                                        <Link href="/download" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                Desktop App
                                            </Button>
                                        </Link>
                                        <Link href="/about" onClick={() => setIsSheetOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl active:scale-[0.98] transition-all">
                                                About ZEDX AI Simulator
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <AuthButtons onSheetClose={() => setIsSheetOpen(false)} />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}

function AuthButtons({ onSheetClose }: { onSheetClose?: () => void }) {
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
            <div className="w-full flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 mb-2 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shrink-0">
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

                <button
                    onClick={() => {
                        handleSwitchAccount();
                        onSheetClose?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors font-medium"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Switch Account
                </button>

                <button
                    onClick={() => {
                        handleLogout();
                        onSheetClose?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link href="/login" onClick={onSheetClose}>
                <Button variant="ghost" className="w-full sm:w-auto text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                    Sign in
                </Button>
            </Link>
            <Link href="/login" onClick={onSheetClose}>
                <Button variant="gradient" className="w-full sm:w-auto shadow-lg shadow-green-900/20">
                    Try For Free
                </Button>
            </Link>
        </div>
    );
}
