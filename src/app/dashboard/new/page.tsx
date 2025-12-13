"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { resumeService, Resume } from "@/lib/resume-service";

// Custom SVG Icons
const BriefcaseIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const ResumeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const RobotIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
        <path d="M19 12l.5 1.5L21 14l-1.5.5L19 16l-.5-1.5L17 14l1.5-.5L19 12z" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

// Available AI Models with brand logo images
const AI_MODELS = [
    {
        id: "llama-3.1-8b-instant",
        name: "Llama 3.1 8B",
        description: "Fast",
        logo: "/meta.png",
        borderColor: "border-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70B",
        description: "Smart",
        logo: "/meta.png",
        borderColor: "border-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
        id: "qwen/qwen3-32b",
        name: "Qwen 32B",
        description: "Multilingual",
        logo: "/qwen.png",
        borderColor: "border-indigo-500",
        bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
        id: "openai/gpt-oss-120b",
        name: "GPT-OSS 120B",
        description: "Powerful",
        logo: "/openai-logo.png",
        borderColor: "border-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
];

export default function NewInterviewPage() {
    const router = useRouter();
    const [jobDescription, setJobDescription] = useState("");
    const [resume, setResume] = useState("");
    const [interviewType, setInterviewType] = useState("Behavioral");
    const [language, setLanguage] = useState("en-US");
    const [selectedModel, setSelectedModel] = useState("llama-3.1-8b-instant");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedResumes, setSavedResumes] = useState<Resume[]>([]);

    // Load saved resumes from Supabase
    useEffect(() => {
        const loadResumes = async () => {
            try {
                const data = await resumeService.getUserResumes();
                setSavedResumes(data);
            } catch (e: any) {
                if (e.message.includes("User not authenticated")) {
                    console.warn("Session expired, redirecting to login.");
                    router.push("/login");
                } else {
                    console.error("Failed to load resumes", e);
                }
            }
        };
        loadResumes();

        // Load saved model preference
        const savedModel = localStorage.getItem("selected_ai_model");
        if (savedModel) setSelectedModel(savedModel);
    }, []);

    // Validation - only need job description and resume now (no API key!)
    const isValid = jobDescription.trim().length > 10 && resume.trim().length > 10;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to parse PDF");

            setResume(data.text);
            setError(null);
            alert("Resume Uploaded & Parsed Successfully! 📄");
        } catch (err: any) {
            console.error(err);
            alert("Error: " + (err.message || "Upload Failed"));
        }
    };

    const handleStart = () => {
        if (!isValid) {
            setError("Please fill in Job Description and Resume to proceed.");
            return;
        }

        setIsLoading(true);
        // Save context to localStorage
        localStorage.setItem("interview_context_jd", jobDescription);
        localStorage.setItem("interview_context_resume", resume);
        localStorage.setItem("interview_context_type", interviewType);
        localStorage.setItem("interview_context_lang", language);
        localStorage.setItem("selected_ai_model", selectedModel);

        // Navigate to interview
        setTimeout(() => {
            router.push("/interview");
        }, 500);
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
                    <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25">
                            <BriefcaseIcon />
                        </div>
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

                {/* Resume & Settings */}
                <div className="space-y-6">
                    {/* Resume Section */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25">
                                    <ResumeIcon />
                                </div>
                                <h3>Your Resume <span className="text-red-500">*</span></h3>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {/* Resume Selection Dropdown */}
                                <select
                                    className="text-xs p-2 border rounded-lg bg-white dark:bg-zinc-800 dark:text-white border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        if (!selectedId) return;
                                        const selectedResume = savedResumes.find(r => r.id === selectedId);
                                        if (selectedResume) {
                                            setResume(selectedResume.content);
                                        }
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
                        <textarea
                            className="w-full h-32 p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder="Paste your full resume text here..."
                            value={resume}
                            onChange={(e) => { setResume(e.target.value); setError(null); }}
                        />
                    </div>

                    {/* AI Model Selection - with Brand Logo Images */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                        <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
                            <Image src="/AI.jpg" alt="AI Model" width={36} height={36} className="rounded-xl" />
                            <h3>AI Model</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Choose the AI model for your interview.</p>

                        <div className="grid grid-cols-2 gap-3">
                            {AI_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 text-left transition-all duration-200 group hover:scale-[1.02]",
                                        selectedModel === model.id
                                            ? `${model.borderColor} ${model.bgColor} shadow-lg`
                                            : "border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <Image
                                                src={model.logo}
                                                alt={model.name}
                                                width={36}
                                                height={36}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800 dark:text-white">{model.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{model.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Type & Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors">
                            <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25">
                                    <SparklesIcon />
                                </div>
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
                            <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25">
                                    <GlobeIcon />
                                </div>
                                <h3>Language</h3>
                            </div>
                            <select
                                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-colors"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.native}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
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
