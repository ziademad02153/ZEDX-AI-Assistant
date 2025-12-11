"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const [status, setStatus] = useState("جاري معالجة تسجيل الدخول...");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processAuth = async () => {
            try {
                // Check URL for error params first
                const urlParams = new URLSearchParams(window.location.search);
                const urlError = urlParams.get('error');
                const urlErrorDescription = urlParams.get('error_description');

                if (urlError) {
                    setError(urlErrorDescription || urlError);
                    setTimeout(() => {
                        window.location.href = "/login?error=" + encodeURIComponent(urlError);
                    }, 3000);
                    return;
                }

                // Check for hash fragment (implicit flow tokens)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');

                if (accessToken) {
                    // We have tokens in the hash, set session
                    const { data, error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: hashParams.get('refresh_token') || '',
                    });

                    if (sessionError) {
                        setError(sessionError.message);
                        setTimeout(() => {
                            window.location.href = "/login?error=session_failed";
                        }, 3000);
                        return;
                    }

                    if (data.session) {
                        const sessionId = data.session.access_token.slice(0, 32);
                        document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;
                        setStatus("تم تسجيل الدخول بنجاح!");
                        window.location.href = "/dashboard";
                        return;
                    }
                }

                // Check for code (PKCE flow)
                const code = urlParams.get('code');
                if (code) {
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        setError(exchangeError.message);
                        setTimeout(() => {
                            window.location.href = "/login?error=exchange_failed";
                        }, 3000);
                        return;
                    }

                    if (data.session) {
                        const sessionId = data.session.access_token.slice(0, 32);
                        document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;
                        setStatus("تم تسجيل الدخول بنجاح!");
                        window.location.href = "/dashboard";
                        return;
                    }
                }

                // Fallback: check if session already exists
                const { data: sessionData } = await supabase.auth.getSession();

                if (sessionData.session) {
                    const sessionId = sessionData.session.access_token.slice(0, 32);
                    document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax`;
                    setStatus("جلسة موجودة! جاري التحويل...");
                    window.location.href = "/dashboard";
                } else {
                    setError("لم يتم العثور على جلسة أو رمز مصادقة");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 3000);
                }
            } catch (e: any) {
                console.error("Auth callback error:", e);
                setError(e.message || "حدث خطأ غير متوقع");
                setTimeout(() => {
                    window.location.href = "/login?error=unknown";
                }, 3000);
            }
        };

        processAuth();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                {error ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-red-500 text-3xl">✕</span>
                        </div>
                        <p className="text-red-600 text-lg font-medium mb-2">فشل تسجيل الدخول</p>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <p className="text-gray-400 text-xs mt-4">جاري التحويل لصفحة تسجيل الدخول...</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-gray-700 text-lg font-medium">{status}</p>
                        <p className="text-gray-400 text-sm mt-2">يرجى الانتظار...</p>
                    </>
                )}
            </div>
        </div>
    );
}
