"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, PlayCircle, FolderOpen, History, HelpCircle, MonitorSmartphone, Info, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV_LINKS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "New Simulation", href: "/dashboard/new" },
    { label: "My Context Files", href: "/dashboard/resumes" },
    { label: "Training History", href: "/dashboard/history" },
    { label: "Pricing / Pro", href: "/pricing" },
    { label: "How it Works", href: "/#features" },
    { label: "Desktop App", href: "/download" },
    { label: "About ZEDX", href: "/about" },
];

const NavGroup = () => (
    <div className="flex gap-16 items-center px-8 w-max shrink-0">
        {NAV_LINKS.map((link, idx) => (
            <Link key={idx} href={link.href} className="whitespace-nowrap text-[15px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-300 shrink-0">
                {link.label}
            </Link>
        ))}
    </div>
);

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const router = useRouter();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        router.push(href);
    };

    useEffect(() => {
        if (typeof window !== "undefined" && (window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron) {
            setIsDesktop(true);
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isDesktop) return null;


    return (
        <nav className={cn(
            "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
            scrolled
                ? "top-4 w-[90%] max-w-[56.25rem] lg:max-w-[900px]"
                : "top-6 sm:top-8 w-[95%] max-w-[65.625rem] lg:max-w-[1050px]"
        )}>
            <div className={cn(
                "flex items-center justify-between rounded-full border transition-all duration-500 ease-out",
                scrolled
                    ? "bg-white/90 dark:bg-[#0a0a0a]/85 backdrop-blur-3xl border-zinc-200/80 dark:border-white/15 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.8)] px-3 sm:px-6 h-14 sm:h-16"
                    : "bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border-zinc-200/40 dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-3 sm:px-8 h-16 sm:h-[76px]"
            )}>
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <Image
                        src="/zedx-logo.png"
                        alt="ZEDX-AI Logo"
                        width={120}
                        height={120}
                        className={cn(
                            "object-contain transition-all duration-500 group-hover:scale-105",
                            scrolled ? "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" : "w-11 h-11 sm:w-14 sm:h-14 md:w-[68px] md:h-[68px]"
                        )}
                        priority
                    />
                </Link>

                {/* Desktop & Mobile Marquee Links */}
                <div className="flex flex-1 overflow-hidden relative w-full min-w-[70px] max-w-[130px] xs:max-w-[180px] sm:max-w-[25rem] lg:max-w-[700px] mx-2 sm:mx-8 h-full items-center justify-center [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                    <motion.div
                        className="flex w-max items-center cursor-pointer"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
                        whileHover={{ animationPlayState: "paused" }}
                    >
                        <NavGroup />
                        <NavGroup />
                        <NavGroup />
                        <NavGroup />
                    </motion.div>
                </div>

                {/* Right Side (Auth) */}
                <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
                    <div className="block">
                        <AuthButtons scrolled={scrolled} />
                    </div>
                </div>

            </div>
        </nav>
    );
}

function AuthButtons({ isMobile, scrolled, onSheetClose }: { isMobile?: boolean, scrolled?: boolean, onSheetClose?: () => void }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userTier, setUserTier] = useState<string>('free');
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
            if (hasToken) setIsLoggedIn(true);

            try {
                const { supabase } = await import("@/lib/supabase");
                const { data } = await supabase.auth.getSession();

                if (data.session) {
                    setIsLoggedIn(true);
                    setUserName(data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || null);
                    setUserEmail(data.session.user.email || null);
                    setUserAvatar(data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture || null);
                    
                    const { data: profile } = await supabase.from('profiles').select('tier').eq('id', data.session.user.id).single();
                    if (profile?.tier) setUserTier(profile.tier);
                }
            } catch (e) {
                console.error("Auth check error:", e);
            }
        };

        checkAuth();
        const interval = setInterval(checkAuth, 60000);
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
        if (isMobile) {
            return (
                <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center gap-3 p-2 mb-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                        <div className="relative shrink-0 flex items-center justify-center">
                            <div className={cn(
                                "w-12 h-12 rounded-full overflow-hidden shrink-0 transition-all",
                                userTier === 'pro' ? "ring-2 ring-[#a3e635] ring-offset-2 ring-offset-white dark:ring-offset-zinc-800" : "border border-zinc-200 dark:border-zinc-700"
                            )}>
                                {userAvatar ? (
                                    <Image src={userAvatar} alt="Avatar" width={48} height={48} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xl">
                                        {userName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            {(userTier === 'pro' || userTier === 'ultra') && (
                                <div className={cn(
                                    "absolute -bottom-3.5 text-black text-[9px] tracking-wider font-extrabold px-2 py-0.5 rounded-full border-[1.5px] shadow-md z-10 uppercase",
                                    userTier === 'ultra' ? "bg-gradient-to-r from-amber-500 to-yellow-300 border-white dark:border-zinc-800" : "bg-gradient-to-r from-emerald-500 to-[#a3e635] border-white dark:border-zinc-800"
                                )}>
                                    {userTier.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pl-1">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{userName || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                        </div>
                    </div>
                    <Button onClick={() => { router.push('/dashboard'); onSheetClose?.(); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
                        Go to Dashboard
                    </Button>
                    <button onClick={() => { handleLogout(); onSheetClose?.(); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-3">
                <DesktopUserDropdown 
                    userAvatar={userAvatar}
                    userName={userName}
                    userEmail={userEmail}
                    userTier={userTier}
                    handleLogout={handleLogout}
                    scrolled={scrolled}
                    router={router}
                />
            </div>
        );
    }

    return (
        <div className={cn("flex gap-1.5 sm:gap-2", isMobile ? "flex-col" : "items-center")}>
            <Button asChild variant="ghost" className="text-[12px] sm:text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white px-2 sm:px-4 rounded-full">
                <Link href="/login" onClick={onSheetClose}>Sign in</Link>
            </Button>
            <Button asChild className="text-[12px] sm:text-[13px] font-semibold bg-gradient-to-r from-[#047857] to-[#bef264] text-white px-3 sm:px-5 rounded-full transition-all hover:scale-105 border-none shadow-none">
                <Link href="/login" onClick={onSheetClose}>Try Free</Link>
            </Button>
        </div>
    );
}

function DesktopUserDropdown({ userAvatar, userName, userEmail, userTier, handleLogout, scrolled, router }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative shrink-0 flex items-center justify-center">
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "rounded-full overflow-hidden cursor-pointer transition-all duration-300 shadow-sm shrink-0",
                        userTier === 'pro' ? "ring-2 ring-[#a3e635] ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]" : 
                        userTier === 'ultra' ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]" : "border border-zinc-200 dark:border-zinc-700 hover:ring-2 hover:ring-emerald-500/50",
                        scrolled ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-12 sm:h-12"
                    )}
                >
                    {userAvatar ? (
                        <Image src={userAvatar} alt="Avatar" width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-base">
                            {userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
                {(userTier === 'pro' || userTier === 'ultra') && (
                    <div className={cn(
                        "absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-black text-[9px] tracking-wider font-extrabold px-2 py-0.5 rounded-full border-[1.5px] shadow-md z-10 uppercase whitespace-nowrap pointer-events-none",
                        userTier === 'ultra' ? "bg-gradient-to-r from-amber-500 to-yellow-300 border-white dark:border-[#0a0a0a]" : "bg-gradient-to-r from-emerald-500 to-[#a3e635] border-white dark:border-[#0a0a0a]"
                    )}>
                        {userTier.toUpperCase()}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-3xl border border-zinc-200/80 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-50 p-2"
                    >
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-white/5 mb-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">{userName || 'User'}</p>
                                {(userTier === 'pro' || userTier === 'ultra') && (
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                        userTier === 'ultra' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {userTier.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                        </div>

                        <button 
                            onClick={() => { setIsOpen(false); handleLogout(); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors w-full text-left"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
