"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, AlertCircle, Sparkles, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { resumeService, Resume } from "@/lib/resume-service";
import { ModelChat } from "@/components/dashboard/model-chat";
import { motion } from "framer-motion";

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
        description: "Fast, efficient",
        logo: "/meta.png",
        gradient: "from-blue-500/20 to-cyan-500/20",
        border: "group-hover:border-blue-500/50"
    },
    {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70B",
        description: "Smart reasoning",
        logo: "/meta.png",
        gradient: "from-purple-500/20 to-pink-500/20",
        border: "group-hover:border-purple-500/50"
    },
    {
        id: "qwen/qwen3-32b",
        name: "Qwen 32B",
        description: "Multilingual pro",
        logo: "/qwen.png",
        gradient: "from-indigo-500/20 to-violet-500/20",
        border: "group-hover:border-indigo-500/50"
    },
    {
        id: "openai/gpt-oss-120b",
        name: "GPT-OSS 120B",
        description: "Max power",
        logo: "/openai-logo.png",
        gradient: "from-emerald-500/20 to-green-500/20",
        border: "group-hover:border-emerald-500/50"
    },
];

export default function NewInterviewPage() {
    const router = useRouter();
    const [jobDescription, setJobDescription] = useState("");
    const [resume, setResume] = useState("");
    const [interviewType, setInterviewType] = useState("Technical");
    const [language, setLanguage] = useState("en-US");
    const [selectedModel, setSelectedModel] = useState("llama-3.1-8b-instant");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [savedResumes, setSavedResumes] = useState<Resume[]>([]);
    const [showChat, setShowChat] = useState(true); // Default show chat for better engagement

    // Load saved resumes
    useEffect(() => {
        const loadResumes = async () => {
            try {
                const data = await resumeService.getUserResumes();
                setSavedResumes(data);
            } catch (e: unknown) {
                // Silent catch
            }
        };
        loadResumes();

        try {
            const savedModel = localStorage.getItem("selected_ai_model");
            if (savedModel) setSelectedModel(savedModel);
        } catch { }
    }, [router]);

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
            setSuccessMessage(`Resume "${file.name}" uploaded successfully!`);

            try {
                const fileName = file.name.replace('.pdf', '').replace('.PDF', '');
                await resumeService.createResume(fileName, data.text);
                const updatedResumes = await resumeService.getUserResumes();
                setSavedResumes(updatedResumes);
            } catch (saveErr) { console.warn(saveErr); }
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || "Upload Failed. Please try converting to .txt");
        }
    };

    const handleStart = () => {
        if (!isValid) {
            setError("Please fill in Job Description and Resume to proceed.");
            return;
        }

        setIsLoading(true);
        try {
            localStorage.setItem("interview_context_jd", jobDescription);
            localStorage.setItem("interview_context_resume", resume);
            localStorage.setItem("interview_context_type", interviewType);
            localStorage.setItem("interview_context_lang", language);
            localStorage.setItem("selected_ai_model", selectedModel);
        } catch (e) {
            console.warn(e);
        }

        setTimeout(() => {
            router.push("/interview");
        }, 800);
    };

    const currentModelData = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-12 h-12">
                                <ArrowLeft size={24} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Setup Interview
                            </h1>
                            <p className="text-gray-400 mt-1">Configure your AI copilot for the perfect session.</p>
                        </div>
                    </div>
                    {isValid && (
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-pulse">
                            <Zap size={16} className="fill-current" />
                            Ready to Start
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Configuration (8 cols) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Job Description Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="group relative bg-[#111111] border border-white/5 rounded-3xl p-1 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
                            <div className="relative bg-[#151515] rounded-[22px] p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                            <BriefcaseIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Job Description</h3>
                                            <p className="text-xs text-gray-500">Paste the target role details.</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-500/50 bg-emerald-500/5 px-2 py-1 rounded">REQUIRED</span>
                                </div>
                                <textarea
                                    className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all"
                                    placeholder="e.g. Senior React Developer at Netflix..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        {/* Resume Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-[#111111] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                        <ResumeIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Your Resume</h3>
                                        <p className="text-xs text-gray-500">Add your resume for tailored context.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                                        onChange={(e) => {
                                            const r = savedResumes.find(sr => sr.id === e.target.value);
                                            if (r) setResume(r.content);
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Saved Resumes</option>
                                        {savedResumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                    <label className="h-9 px-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors">
                                        <Upload size={14} />
                                        Upload
                                        <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>
                            <textarea
                                className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
                                placeholder="Paste resume text or upload PDF..."
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                            />
                            {successMessage && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</span>
                                    {successMessage}
                                </div>
                            )}
                        </motion.div>

                        {/* Settings Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Sparkles size={16} className="text-purple-400" /> Interview Type
                                </label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500/50"
                                    value={interviewType}
                                    onChange={(e) => setInterviewType(e.target.value)}
                                >
                                    <option>Technical</option>
                                    <option>System Design</option>
                                    <option>Behavioral</option>
                                    <option>HR Screening</option>
                                </select>
                            </div>
                            <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <GlobeIcon /> Language
                                </label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500/50"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {SUPPORTED_LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code}>{lang.native}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                    </div>


                    {/* Right Column: Model Selection & Chat (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Model Selection */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[#111111] border border-white/5 rounded-3xl p-6 sm:p-8"
                        >
                            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                <Zap size={18} className="text-yellow-400" />
                                AI Engine
                            </h3>
                            <p className="text-xs text-gray-500 mb-6">Choose the brain behind ZEDX</p>

                            <div className="space-y-3">
                                {AI_MODELS.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => setSelectedModel(model.id)}
                                        className={cn(
                                            "w-full group relative p-3 rounded-2xl border transition-all duration-300 flex items-center gap-4 text-left overflow-hidden",
                                            selectedModel === model.id
                                                ? "bg-white/5 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                                                : "bg-transparent border-white/5 hover:bg-white/[0.02]"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
                                            model.gradient,
                                            selectedModel === model.id ? "opacity-10" : "group-hover:opacity-5"
                                        )}></div>

                                        <div className="relative z-10 w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                                            <Image src={model.logo} alt={model.name} width={32} height={32} className="object-contain" />
                                        </div>
                                        <div className="relative z-10 flex-grow">
                                            <div className="flex items-center justify-between">
                                                <h4 className={cn("font-medium text-sm", selectedModel === model.id ? "text-white" : "text-gray-400")}>{model.name}</h4>
                                                {selectedModel === model.id && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>}
                                            </div>
                                            <p className="text-xs text-gray-500">{model.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Model Chat Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Test Drive Model
                                </h3>
                            </div>
                            <ModelChat
                                modelId={selectedModel}
                                modelName={currentModelData.name}
                                modelLogo={currentModelData.logo}
                            />
                        </motion.div>

                        {/* Start Action */}
                        <div className="pt-4 sticky bottom-6 z-20">
                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            )}
                            <Button
                                onClick={handleStart}
                                disabled={isLoading || !isValid}
                                className={cn(
                                    "w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl",
                                    isValid
                                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:shadow-emerald-500/30 hover:-translate-y-1"
                                        : "bg-white/5 text-gray-500 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Preparing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Zap className={cn("transition-transform", isValid ? "group-hover:scale-110" : "")} fill="currentColor" />
                                        Start Session
                                    </span>
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
