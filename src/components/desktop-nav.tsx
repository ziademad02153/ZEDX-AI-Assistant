"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";


export function DesktopNavBar() {
    const [isDesktop, setIsDesktop] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string; user_metadata?: { avatar_url?: string; full_name?: string } } | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser(user);
                    setUserAvatar(user.user_metadata?.avatar_url || null);
                    setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || null);
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            }
        };

        if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsDesktop(true);
            loadUser();
        }
    }, []);



    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (!isDesktop) return null;

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleClose = () => {
        window.electronAPI?.hideApp();
    };

    return (
        <>
            <div
                className="h-11 bg-gradient-to-r from-emerald-900 to-emerald-800 flex items-center px-3 gap-2 shrink-0"
                style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
            >
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="w-7 h-7 rounded-md bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                    title="Back"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Account Actions */}
                {user ? (
                    <div className="relative" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 hover:border-white/70 transition-colors shadow-md"
                        >
                            {userAvatar ? (
                                <Image src={userAvatar} alt="User" width={36} height={36} className="w-full h-full object-cover" style={{ height: 'auto' }} />
                            ) : (
                                <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                                    {userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 py-1 z-50">
                                <div className="px-3 py-2 border-b border-zinc-700">
                                    <p className="text-white text-sm font-medium truncate">{userName}</p>
                                    <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => { window.location.href = '/interview'; setIsDropdownOpen(false); }}
                                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                >
                                    Interview Setup
                                </button>
                                <button
                                    onClick={() => { window.location.href = '/dashboard'; setIsDropdownOpen(false); }}
                                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleRefresh}
                                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                >
                                    Refresh
                                </button>
                                <div className="border-t border-zinc-700 mt-1 pt-1">
                                    <button
                                        onClick={handleClose}
                                        className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        Hide App
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-3 py-1.5 rounded-md bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors"
                        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                    >
                        Sign In
                    </button>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </>
    );
}
