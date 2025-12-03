"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, FileText, Sparkles, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export default function NewInterviewPage() {
    const router = useRouter();
    const [jobDescription, setJobDescription] = useState("");
    const [resume, setResume] = useState("");
    const [interviewType, setInterviewType] = useState("Behavioral");
    const [language, setLanguage] = useState("en-US");
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState("google"); // Default to Google
    const [customModel, setCustomModel] = useState("");
    const [availableModels, setAvailableModels] = useState<{ id: string, name: string }[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [savedResumes, setSavedResumes] = useState<any[]>([]);

    // Load saved API key and provider on mount
    useEffect(() => {
        const savedKey = localStorage.getItem("gemini_api_key");
        if (savedKey) setApiKey(savedKey);

        const savedProvider = localStorage.getItem("gemini_api_provider");
        if (savedProvider) setProvider(savedProvider);

        // Load saved resumes
        try {
            const resumes = JSON.parse(localStorage.getItem("zedx_resumes") || "[]");
            setSavedResumes(resumes);
        } catch (e) { }
    }, []);

    // Validation State
    const isValid = jobDescription.trim().length > 10 && resume.trim().length > 10 && apiKey.trim().length > 10;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === "text/plain") {
            const text = await file.text();
            setResume(text);
        } else {
            // Alert user that PDF parsing is not supported client-side
            alert("Please COPY & PASTE the text from your PDF/Word document.\n\nDirect file upload is currently limited to .txt files only to ensure the AI reads your resume correctly.");
            e.target.value = ""; // Clear the input
        }
    };

    const fetchOpenRouterModels = async () => {
        // Sanitize key: remove whitespace and non-ASCII chars to prevent header errors
        const cleanKey = apiKey.trim().replace(/[^\x00-\x7F]/g, "");

        if (!cleanKey) {
            alert("Please enter a valid OpenRouter API Key first.");
            return;
        }
        setIsLoadingModels(true);
        try {
            const response = await fetch("https://openrouter.ai/api/v1/models", {
                headers: {
                    "Authorization": `Bearer ${cleanKey}`,
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "ZEDX-AI Assistant"
                }
            });
            if (!response.ok) throw new Error("Failed to fetch models");
            const data = await response.json();

            const models = data.data.map((m: any) => {
                const isFree = m.pricing?.prompt === "0" && m.pricing?.completion === "0";
                return {
                    id: m.id,
                    name: m.name || m.id,
                    isFree: isFree
                };
            }).sort((a: any, b: any) => {
                // Sort free models first, then alphabetical
                if (a.isFree && !b.isFree) return -1;
                if (!a.isFree && b.isFree) return 1;
                return a.name.localeCompare(b.name);
            });

            setAvailableModels(models);
            alert(`Loaded ${models.length} models! Free models are listed first.`);
        } catch (e: any) {
            console.error("Error fetching models:", e);
            alert("Could not load models. Please check your API Key.");
        } finally {
            setIsLoadingModels(false);
        }
    };

    const handleStart = () => {
        if (!isValid) {
            setError("Please fill in Job Description, Resume, and API Key to proceed.");
            return;
        }

        setIsLoading(true);
        // Save context and API key to localStorage
        localStorage.setItem("interview_context_jd", jobDescription);
        localStorage.setItem("interview_context_resume", resume);
        localStorage.setItem("interview_context_type", interviewType);
        localStorage.setItem("interview_context_lang", language);
        localStorage.setItem("gemini_api_key", apiKey);
        localStorage.setItem("gemini_api_provider", provider);

        // Simulate a small delay for better UX
        setTimeout(() => {
            router.push("/interview");
        }, 500);
    };

    const handleTestConnection = async () => {
        if (!apiKey.trim()) {
            setError("Please enter an API Key first.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Temporarily save key for testing
            localStorage.setItem("gemini_api_key", apiKey);
            localStorage.setItem("gemini_api_provider", provider);

            if (provider === "google") {
                // Dynamic import to avoid SSR issues with some libs if any
                const { GoogleGenerativeAI } = await import("@google/generative-ai");
                const genAI = new GoogleGenerativeAI(apiKey);

                const modelsToTry = [
                    "gemini-2.0-flash-lite-preview-02-05",
                    "gemini-2.0-flash-lite",
                    "gemini-1.5-flash",
                    "gemini-1.5-flash-8b",
                    "gemini-1.5-flash-001",
                    "gemini-1.5-flash-latest",
                    "gemini-1.5-pro",
                    "gemini-1.0-pro",
                    "gemini-pro"
                ];
                let success = false;
                let lastError;

                for (const modelName of modelsToTry) {
                    try {
                        console.log(`Testing model: ${modelName}`);
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const result = await model.generateContent("Hello, are you online?");
                        const response = await result.response;
                        const text = response.text();

                        if (text) {
                            alert(`Connection Successful! Connected using model: ${modelName}`);
                            // Save the working model to localStorage for other pages to use
                            localStorage.setItem("gemini_working_model", modelName);
                            success = true;
                            break;
                        }
                    } catch (e: any) {
                        console.warn(`Model ${modelName} failed:`, e.message);
                        lastError = e;
                    }
                }

                if (!success) {
                    throw lastError || new Error("All models failed to connect.");
                }
            } else {
                // OpenAI-compatible providers (OpenRouter, Grok, etc.) handled via server proxy
                // to avoid CORS and cookie issues.

                console.log(`[TestConnection] Sending request to /api/test-connection for provider: ${provider}`);

                const response = await fetch("/api/test-connection", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        provider,
                        apiKey,
                        model: provider === "grok" ? "grok-beta" : (provider === "openrouter" ? "meta-llama/llama-3-8b-instruct:free" : "gpt-3.5-turbo")
                    })
                });

                console.log(`[TestConnection] Proxy Response Status: ${response.status}`);

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    console.error(`[TestConnection] Proxy Error:`, errData);
                    throw new Error(errData.error?.message || `API Error: ${response.status}`);
                }

                const data = await response.json();
                if (data.choices && data.choices.length > 0) {
                    alert(`Connection Successful! Connected to ${provider.toUpperCase()}.`);
                } else {
                    throw new Error("No response from API.");
                }
            }

        } catch (err: any) {
            console.error("API Test Error:", err);
            setError(`Connection Failed: ${err.message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="dark:text-white dark:hover:bg-gray-800">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Setup New Interview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Provide context to get personalized AI coaching.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Job Description */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                        <Briefcase className="text-green-600 dark:text-green-400" size={20} />
                        <h3>Job Description <span className="text-red-500">*</span></h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Paste the job description you are applying for.</p>
                    <textarea
                        className="w-full h-64 p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="e.g. Senior Frontend Engineer at Google..."
                        value={jobDescription}
                        onChange={(e) => { setJobDescription(e.target.value); setError(null); }}
                    />
                </div>

                {/* Resume & Type */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                        <div className="flex items-center justify-between text-lg font-semibold text-gray-800 dark:text-white">
                            <div className="flex items-center gap-2">
                                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                                <h3>Your Resume <span className="text-red-500">*</span></h3>
                            </div>
                            <div className="flex gap-2">
                                {/* Resume Selection Dropdown */}
                                <select
                                    className="text-xs p-2 border rounded-lg bg-white dark:bg-zinc-800 dark:text-white border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        if (!selectedId) return;
                                        // Dynamic import or use local storage directly if store not available in client component easily without hook
                                        // We can just read from localStorage for simplicity here or use the store
                                        try {
                                            const resumes = JSON.parse(localStorage.getItem("zedx_resumes") || "[]");
                                            const resume = resumes.find((r: any) => r.id === selectedId);
                                            if (resume) {
                                                setResume(resume.content);
                                            }
                                        } catch (e) { }
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Saved Resume</option>
                                    {savedResumes.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>

                                <div className="relative">
                                    <input
                                        type="file"
                                        id="resume-upload"
                                        className="hidden"
                                        accept=".pdf,.txt,.doc,.docx"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="resume-upload">
                                        <Button variant="outline" size="sm" className="cursor-pointer dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700" asChild>
                                            <span>
                                                <Upload size={14} className="mr-2" />
                                                Upload File
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-xs flex gap-2 items-start">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <p><strong>Tip:</strong> For the best AI accuracy, please <strong>copy and paste your resume text</strong> below. PDF upload may not extract all details correctly.</p>
                        </div>
                        <textarea
                            className="w-full h-40 p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder="Paste your full resume text here for the AI to learn your background..."
                            value={resume}
                            onChange={(e) => { setResume(e.target.value); setError(null); }}
                        />
                    </div>

                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                            <span className="text-2xl">🔑</span>
                            <h3>AI Provider & Key <span className="text-red-500">*</span></h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Choose your AI provider and enter the API Key.</p>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <select
                                    className="w-1/3 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm dark:text-white transition-colors"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                >
                                    <option value="google">Google Gemini</option>
                                    <option value="openai">OpenAI (GPT)</option>
                                    <option value="grok">Grok (xAI)</option>
                                    <option value="openrouter">OpenRouter (All)</option>
                                </select>
                                <input
                                    type="password"
                                    className="w-2/3 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono text-sm dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder={
                                        provider === "google" ? "AIzaSy..." :
                                            provider === "openai" ? "sk-..." :
                                                provider === "grok" ? "xai-..." :
                                                    "sk-or-..."
                                    }
                                    value={apiKey}
                                    onChange={(e) => { setApiKey(e.target.value); setError(null); }}
                                />
                            </div>

                            {provider !== "google" && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Model ID:</span>
                                        <div className="relative w-full">
                                            <input
                                                type="text"
                                                list="models-list"
                                                className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                placeholder={
                                                    provider === "openrouter" ? "e.g. anthropic/claude-3-opus" :
                                                        provider === "grok" ? "e.g. grok-beta" :
                                                            "e.g. gpt-4-turbo"
                                                }
                                                value={customModel}
                                                onChange={(e) => setCustomModel(e.target.value)}
                                            />
                                            <datalist id="models-list">
                                                {availableModels.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {/* @ts-ignore */}
                                                        {m.isFree ? "✨ FREE - " : ""}{m.name}
                                                    </option>
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                    {provider === "openrouter" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={fetchOpenRouterModels}
                                            disabled={isLoadingModels || !apiKey}
                                            className="w-full text-xs h-7 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700"
                                        >
                                            {isLoadingModels ? "Loading Models..." : "Load Available Models"}
                                        </Button>
                                    )}
                                </div>
                            )}
                            {provider === "openrouter" && !customModel && <p className="text-[10px] text-gray-400">Leave blank to use default free model.</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                                <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
                                <h3>Type</h3>
                            </div>
                            <select
                                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
                                value={interviewType}
                                onChange={(e) => setInterviewType(e.target.value)}
                            >
                                <option value="Behavioral">Behavioral</option>
                                <option value="Technical">Technical</option>
                                <option value="System Design">System Design</option>
                            </select>
                        </div>

                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                                <span className="text-2xl">🌐</span>
                                <h3>Language</h3>
                            </div>


                            <select
                                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-colors"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.native} ({lang.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 gap-4">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleTestConnection}
                    disabled={isLoading}
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    Test Connection
                </Button>
                <Button
                    variant="gradient"
                    size="lg"
                    className={cn("w-full md:w-auto px-12 text-lg shadow-green-900/20 transition-all", !isValid && "opacity-50 cursor-not-allowed grayscale")}
                    onClick={handleStart}
                    disabled={isLoading || !isValid}
                >
                    {isLoading ? "Setting up..." : "Start Interview"}
                </Button>
            </div>
        </div>
    );
}
