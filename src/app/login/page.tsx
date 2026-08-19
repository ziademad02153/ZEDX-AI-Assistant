"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles, RefreshCw, Zap, Shield, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { generateStrongPassword } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
    // const router = useRouter();
    const { signIn, signUp, verifyOtp, signInWithGoogle } = useAuth();

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        otp: ""
    });

    // Password strength calculation
    const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
        if (!password) return { level: 0, text: "", color: "" };
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        if (score <= 1) return { level: 1, text: "Weak", color: "bg-red-500" };
        if (score <= 2) return { level: 2, text: "Fair", color: "bg-orange-500" };
        if (score <= 3) return { level: 3, text: "Good", color: "bg-yellow-500" };
        if (score <= 4) return { level: 4, text: "Strong", color: "bg-green-500" };
        return { level: 5, text: "Very Strong", color: "bg-emerald-600" };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Auto-clear success/error on mode switch
    useEffect(() => {
        setError(null);
        setSuccess(null);
    }, [mode]);

    // Check if user is already authenticated (for OAuth redirect)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsCheckingSession(true);
                const { supabase } = await import("@/lib/supabase");
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    // User is already logged in, set cookie and redirect
                    const sessionId = data.session.access_token.slice(0, 32);
                    const isSecure = window.location.protocol === 'https:';
                    document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax${isSecure ? '; Secure' : ''}`;
                    window.location.href = "/dashboard";
                } else {
                    setIsCheckingSession(false);
                }
            } catch (e) {
                console.error("Auth check error:", e);
                setIsCheckingSession(false);
            }
        };
        checkAuth();
    }, []);


    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Email validation
        if (mode !== "verify" && !validateEmail(formData.email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        try {
            if (mode === "signup") {
                try {
                    await signUp(formData.email, formData.password, formData.name);
                    setSuccess("Verification code sent! Check your email.");
                    setMode("verify");
                } catch (err: unknown) {
                    const error = err as Error;
                    setError(error.message || "Signup failed");
                }
            } else if (mode === "verify") {
                // Should not reach here typically due to separate handler
            } else {
                try {
                    const result = await signIn(formData.email, formData.password) as { session?: { access_token: string } };
                    // Generate unique session token using Supabase session ID + timestamp
                    const sessionId = result?.session?.access_token?.slice(0, 32) || crypto.randomUUID();
                    const isSecure = window.location.protocol === 'https:';
                    document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax${isSecure ? '; Secure' : ''}`;
                    window.location.href = "/dashboard";
                } catch (err: unknown) {
                    const error = err as Error;
                    setError(error.message || "Invalid credentials");
                }
            }
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Auth error:", error);
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signUp(formData.email, formData.password, formData.name);
            setSuccess("Verification code resent! Check your email.");
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || "Failed to resend code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const result = await verifyOtp(formData.email, formData.otp, 'signup') as { session?: { access_token: string } };
            // Generate unique session token from Supabase response
            const sessionId = result?.session?.access_token?.slice(0, 32) || crypto.randomUUID();
            const isSecure = window.location.protocol === 'https:';
            document.cookie = `auth_token=${sessionId}; path=/; max-age=86400; SameSite=Lax${isSecure ? '; Secure' : ''}`;
            window.location.href = "/dashboard";
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || "Invalid code");
        } finally {
            setIsLoading(false);
        }
    };

    const generatePassword = () => {
        const newPass = generateStrongPassword(16);
        setFormData(prev => ({ ...prev, password: newPass }));
        setShowPassword(true);
    };

    if (isCheckingSession) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative w-20 h-20">
                        <Image src="/zedx-logo.png" alt="ZEDX-AI" fill className="object-contain animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
                        <RefreshCw className="animate-spin" size={20} />
                        <span>Verifying Session...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full grid md:grid-cols-2">

            {/* Left Side - Brand/Marketing Area (Green/Teal Theme) */}
            <div className="hidden md:flex flex-col justify-between bg-zinc-950 relative overflow-hidden p-8 lg:p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-teal-950 z-0" />
                {/* Decorative circles */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10">
                    {/* Updated Logo Section */}
                    <div className="flex items-center">
                        <Image
                            src="/zedx-logo.png"
                            alt="ZEDX-AI Logo"
                            width={87}
                            height={87}
                            className="object-contain w-16 h-16 md:w-[87px] md:h-[87px]"
                        />
                    </div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <h2 className="text-5xl font-extrabold mb-8 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
                        Master Your Next Interview with <br /> Absolute Confidence.
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 flex items-center justify-center">
                                <Image src="/Instant Transcription.png" alt="Instant Transcription" width={40} height={40} className="object-contain drop-shadow-sm" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Real-Time Intelligence</h3>
                                <p className="text-gray-400 leading-relaxed">Get instant, AI-driven feedback on your tone, pace, and content while you speak.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 flex items-center justify-center -ml-2">
                                <Image src="/zedx-logo-for-v.png" alt="ZEDX Edge" width={64} height={64} className="object-contain drop-shadow-sm" />
                            </div>
                            <div className="mt-1">
                                <h3 className="font-bold text-lg text-white">Competitive Edge</h3>
                                <p className="text-gray-400 leading-relaxed">Access a curated database of top-tier example answers to train and prepare effectively.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 flex items-center justify-center">
                                <Image src="/Privacy First.png" alt="Privacy First" width={40} height={40} className="object-contain drop-shadow-sm" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Private & Secure</h3>
                                <p className="text-gray-400 leading-relaxed">Your data is encrypted and your assessment data is completely secure.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-sm text-gray-500 font-medium">
                    <span>© 2026 ZEDX AI Inc.</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>Privacy Policy</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>Terms of Service</span>
                </div>
            </div>

            {/* Right Side - Clean Login Form (Light Theme) */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                <div className="w-full max-w-sm space-y-8">

                    {/* Header Mobile Brand (visible only on small) */}
                    <div className="md:hidden text-center mb-6">
                        <div className="relative w-14 h-14 mx-auto mb-3 overflow-hidden rounded-lg">
                            <Image
                                src="/zedx-logo.png"
                                alt="ZEDX-AI Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">ZEDX-AI</h2>
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Get started free" : "Check your email"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-3">
                            {mode === "signin"
                                ? "Enter your email to sign in to your accounts"
                                : mode === "signup"
                                    ? "Create your account in seconds. No credit card required."
                                    : `We've sent a verification code to ${formData.email}`}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
                            >
                                <div className="w-1 h-1 rounded-full bg-red-600" />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3"
                            >
                                <div className="w-1 h-1 rounded-full bg-emerald-600" />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={mode === 'verify' ? handleVerifySubmit : handleAuth} className="space-y-5">

                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Mohamed Salah"
                                    className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm text-gray-900 dark:text-white ring-offset-white dark:ring-offset-zinc-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        {mode !== 'verify' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="mohamed@example.com"
                                    className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm text-gray-900 dark:text-white ring-offset-white dark:ring-offset-zinc-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        {mode !== 'verify' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    {mode === 'signup' && (
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1.5 transition-colors"
                                        >
                                            <Sparkles size={14} /> Generate Strong
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm text-gray-900 dark:text-white ring-offset-white dark:ring-offset-zinc-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 font-mono transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator - only show on signup */}
                                {mode === 'signup' && formData.password && (
                                    <div className="space-y-1 mt-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                            {passwordStrength.text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'verify' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="12345678"
                                        maxLength={8}
                                        inputMode="numeric"
                                        pattern="[0-9]{6,8}"
                                        className="flex h-12 w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm text-gray-900 dark:text-white ring-offset-white dark:ring-offset-zinc-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center tracking-[0.5em] font-mono text-xl transition-all"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    We sent a code to <span className="font-medium text-gray-900 dark:text-white">{formData.email}</span>. <br />Check your spam folder if it doesn&apos;t appear.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={isLoading}
                                    className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center gap-2 py-2 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                                    Resend Verification Code
                                </button>
                            </div>
                        )}

                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-semibold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                            ) : (
                                mode === 'signin' ? "Sign In" : mode === 'signup' ? "Create Account" : "Verify Email"
                            )}
                        </Button>

                        {mode !== 'verify' && (
                            <>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-zinc-900 px-2 text-gray-400">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11 rounded-xl border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-100 font-medium flex items-center justify-center gap-3"
                                    onClick={async () => {
                                        try {
                                            await signInWithGoogle();
                                        } catch (err: unknown) {
                                            const error = err as Error;
                                            setError(error.message || "Google sign-in failed");
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </>
                        )}
                    </form>

                    <div className="text-center text-sm text-gray-500">
                        {mode === 'signin' ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button onClick={() => setMode('signup')} className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
                                    Sign up
                                </button>
                            </>
                        ) : mode === 'signup' ? (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setMode('signin')} className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
                                    Sign in
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setMode('signup')} className="text-gray-500 hover:text-gray-900 underline transition-all">
                                Change email address
                            </button>
                        )}
                    </div>



                </div>
            </div>
        </div>
    );
}
