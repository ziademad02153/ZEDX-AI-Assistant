"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState("جاري تسجيل الدخول...");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get session from URL hash (Supabase PKCE flow)
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth error:", error);
                    setStatus("فشل تسجيل الدخول");
                    setTimeout(() => router.push("/login?error=auth_failed"), 2000);
                    return;
                }

                if (data.session) {
                    // Set auth cookie
                    const sessionId = data.session.access_token.slice(0, 32) || crypto.randomUUID();
                    document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax; Secure`;

                    setStatus("تم تسجيل الدخول بنجاح! جاري التحويل...");
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1000);
                } else {
                    setStatus("لم يتم العثور على جلسة");
                    setTimeout(() => router.push("/login"), 2000);
                }
            } catch (e) {
                console.error("Callback error:", e);
                setStatus("حدث خطأ");
                setTimeout(() => router.push("/login?error=unknown"), 2000);
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700 text-lg">{status}</p>
            </div>
        </div>
    );
}
