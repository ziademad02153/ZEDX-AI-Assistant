"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const [status, setStatus] = useState("جاري تسجيل الدخول...");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Listen for auth state change (this handles the hash fragment automatically)
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    console.log("Auth event:", event, session);

                    if (event === 'SIGNED_IN' && session) {
                        // Set auth cookie
                        const sessionId = session.access_token.slice(0, 32) || crypto.randomUUID();
                        document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;

                        setStatus("تم تسجيل الدخول بنجاح! جاري التحويل...");

                        // Unsubscribe and redirect
                        subscription.unsubscribe();
                        window.location.href = "/dashboard";
                    }
                });

                // Also check if session already exists
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth error:", error);
                    setStatus("فشل تسجيل الدخول: " + error.message);
                    setTimeout(() => {
                        window.location.href = "/login?error=auth_failed";
                    }, 3000);
                    return;
                }

                if (data.session) {
                    // Session already exists, set cookie and redirect
                    const sessionId = data.session.access_token.slice(0, 32) || crypto.randomUUID();
                    document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;

                    setStatus("تم تسجيل الدخول بنجاح! جاري التحويل...");
                    window.location.href = "/dashboard";
                } else {
                    // Wait a bit for hash fragment processing
                    setTimeout(async () => {
                        const { data: retryData } = await supabase.auth.getSession();
                        if (retryData.session) {
                            const sessionId = retryData.session.access_token.slice(0, 32) || crypto.randomUUID();
                            document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;
                            window.location.href = "/dashboard";
                        } else {
                            setStatus("لم يتم العثور على جلسة");
                            setTimeout(() => {
                                window.location.href = "/login";
                            }, 2000);
                        }
                    }, 2000);
                }
            } catch (e) {
                console.error("Callback error:", e);
                setStatus("حدث خطأ غير متوقع");
                setTimeout(() => {
                    window.location.href = "/login?error=unknown";
                }, 3000);
            }
        };

        handleCallback();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-700 text-lg font-medium">{status}</p>
                <p className="text-gray-400 text-sm mt-2">يرجى الانتظار...</p>
            </div>
        </div>
    );
}
