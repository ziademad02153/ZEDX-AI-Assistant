"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Lock, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        console.log("Authenticating...", { mode, formData });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            if (mode === "signup") {
                const result = await auth.signUp(formData.email, formData.password, formData.name);
                if (result.success) {
                    setSuccess("Account created! Please sign in.");
                    setMode("signin");
                    setFormData(prev => ({ ...prev, password: "" }));
                } else {
                    setError(result.message);
                }
            } else {
                const result = await auth.signIn(formData.email, formData.password);
                if (result.success) {
                    console.log("Login successful, redirecting...");
                    document.cookie = "auth_token=valid_session_token; path=/; max-age=86400; SameSite=Strict";
                    window.location.href = "/dashboard";
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {mode === "signin" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-gray-500">
                        {mode === "signin" ? "Sign in to continue your interview preparation." : "Join us to start your AI interview journey."}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                        className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-all", mode === "signin" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700")}
                        onClick={() => { setMode("signin"); setError(null); setSuccess(null); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-all", mode === "signup" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700")}
                        onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 text-center">
                        {success}
                    </div>
                )}

                <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">
                        {mode === "signin" ? "Enter your credentials to access your account." : "Fill in your details to create a new account."}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleAuth}>
                    {mode === "signup" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="gradient"
                        className="w-full h-12 text-base shadow-lg shadow-green-900/20"
                        disabled={isLoading}
                    >
                        {isLoading ? (mode === "signin" ? "Signing in..." : "Creating account...") : (mode === "signin" ? "Sign In" : "Create Account")}
                        {!isLoading && <ArrowRight className="ml-2" size={18} />}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            if (confirm("Are you sure? This will clear all accounts and data.")) {
                                localStorage.clear();
                                document.cookie = "auth_token=; path=/; max-age=0";
                                window.location.reload();
                            }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                        Reset App Data (Debug)
                    </button>
                </div>
            </div>
        </div>
    );
}
