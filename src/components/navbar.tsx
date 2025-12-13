"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bird, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-gray-200 dark:border-gray-800 py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-sm">
                        <Image
                            src="/android-chrome-192x192.png"
                            alt="ZEDX-AI Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-green-600 dark:text-green-400 transition-colors">
                        ZEDX-AI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        How it Works
                    </Link>

                    <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                        <AuthButtons />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            href="/dashboard"
                            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/#features"
                            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            How it Works
                        </Link>
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                            <AuthButtons />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}



function AuthButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

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

        // Re-check periodically
        const interval = setInterval(checkAuth, 5000);
        return () => clearInterval(interval);
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

    if (isLoggedIn) {
        return (
            <div className="flex items-center gap-3">
                {userName && (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        👋 {userName}
                    </span>
                )}
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Dashboard
                    </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800">
                    Sign Out
                </Button>
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
