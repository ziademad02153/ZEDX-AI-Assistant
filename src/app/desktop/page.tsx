"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DesktopEntryPage() {
    const router = useRouter();
    const [status, setStatus] = useState("Checking authentication...");

    useEffect(() => {
        const checkAndRedirect = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    // User is logged in - go to dashboard
                    setStatus("Logged in! Redirecting to dashboard...");
                    router.replace("/dashboard");
                } else {
                    // User not logged in - go to login
                    setStatus("Please log in...");
                    router.replace("/login?desktop=true");
                }
            } catch (error) {
                console.error("Auth check error:", error);
                router.replace("/login?desktop=true");
            }
        };

        checkAndRedirect();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-white text-lg font-medium">{status}</p>
            </div>
        </div>
    );
}
