"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, AlertCircle, Sparkles, Loader2 } from "lucide-react";
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

// ParticleWave removed to improve mobile performance/clarity
// import { ParticleWave } from "@/components/ui/particle-wave";

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

    // Load saved resumes
    useEffect(() => {
        const loadResumes = async () => {
            try {
                const data = await resumeService.getUserResumes();
                setSavedResumes(data);
            } catch {
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
            router.push("/dashboard/new/how-to-use");
        }, 800);
    };

    const currentModelData = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];



    return (
        <div className="min-h-screen bg-white dark:bg-black text-foreground selection:bg-emerald-500/30">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 w-full mx-auto px-6 py-8 sm:py-12 pb-32">
                {/* Header */}
                <div className="flex flex-col items-start gap-4 mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full w-10 h-10 sm:w-14 sm:h-14">
                                <ArrowLeft size={20} className="sm:size-[28px]" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 mb-1 sm:mb-2">
                                Setup Interview
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400">Configure your AI simulator for the perfect session.</p>
                        </div>
                    </div>
                </div>

                {/* Practice Mode Alert */}
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start sm:items-center gap-4 animate-fade-in-up">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-1">PRACTICE MODE</h3>
                        <p className="text-amber-700/80 dark:text-amber-400/80 text-sm">
                            This is a simulated interview environment designed to help you practice, build confidence, and improve your performance.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-250px)]">
                    {/* Left Column: Configuration (8 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-8 h-full">

                        {/* Job Description Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="group relative bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-3xl p-1 shadow-xl dark:shadow-2xl overflow-hidden flex-1 flex flex-col"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
                            <div className="relative bg-white dark:bg-[#151515] rounded-[22px] p-6 sm:p-10 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <div className="flex items-center gap-4 sm:gap-5">
                                        <div className="p-3 sm:p-4 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl sm:rounded-2xl text-emerald-700 dark:text-emerald-400">
                                            <BriefcaseIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg sm:text-2xl text-gray-900 dark:text-white mb-0.5 sm:mb-1">Job Description</h3>
                                            <p className="text-sm sm:text-base text-gray-500 font-medium">Paste the target role details.</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] sm:text-sm font-bold font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl tracking-wider uppercase">REQUIRED</span>
                                </div>
                                <textarea
                                    className="w-full flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 text-base sm:text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all min-h-[180px] sm:min-h-[220px] leading-relaxed"
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
                            className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg dark:shadow-none flex-1 flex flex-col"
                        >
                            <div className="flex flex-col gap-6 mb-8">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="p-3 sm:p-4 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl sm:rounded-2xl text-emerald-700 dark:text-emerald-400">
                                        <ResumeIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg sm:text-2xl text-gray-900 dark:text-white">Resume</h3>
                                        <p className="text-sm sm:text-base text-gray-500">Add your CV for tailored context and better results.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <label className="h-11 sm:h-12 px-6 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors w-full sm:w-auto shadow-lg shadow-emerald-500/20 order-1">
                                        <Upload size={18} />
                                        Upload New CV
                                        <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} />
                                    </label>
                                    <select
                                        className="h-11 sm:h-12 px-4 w-full sm:w-56 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:border-emerald-500/50 truncate order-2"
                                        onChange={(e) => {
                                            const r = savedResumes.find(sr => sr.id === e.target.value);
                                            if (r) setResume(r.content);
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Saved Resumes</option>
                                        {savedResumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <textarea
                                className="w-full flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 text-base sm:text-lg text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all min-h-[180px] sm:min-h-[220px]"
                                placeholder="Paste resume text or upload PDF..."
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                            />
                            {successMessage && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">✓</span>
                                    {successMessage}
                                </div>
                            )}
                        </motion.div>

                        {/* Settings Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                                <label className="flex items-center gap-3 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                                    <Sparkles size={18} className="text-emerald-500 dark:text-emerald-400 sm:size-[20px]" /> Interview Type
                                </label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                                    value={interviewType}
                                    onChange={(e) => setInterviewType(e.target.value)}
                                >
                                    <option>Technical</option>
                                    <option>System Design</option>
                                    <option>Behavioral</option>
                                    <option>HR Screening</option>
                                </select>
                            </div>
                            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                                <label className="flex items-center gap-3 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                                    <div className="text-emerald-600 dark:text-emerald-500"><GlobeIcon /></div> Language
                                </label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
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
                    <div className="lg:col-span-5 relative flex flex-col h-full">

                        {/* Model Selection Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-3xl p-6 sm:p-10 shadow-lg dark:shadow-none flex-grow flex flex-col h-full"
                        >
                            {/* AI Model Header with AI.jpg */}
                            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                                    <Image src="/AI.jpg" alt="AI Model" width={48} height={48} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">AI Model</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Choose the brain behind ZEDX</p>
                                </div>
                            </div>

                            {/* Models List */}
                            <div className="space-y-3 sm:space-y-4 mb-8">
                                {AI_MODELS.map((model) => (
                                    <div
                                        key={model.id}
                                        onClick={() => setSelectedModel(model.id)}
                                        className={cn(
                                            "relative p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 sm:gap-5 group/item",
                                            selectedModel === model.id
                                                ? "bg-white dark:bg-white/5 border-emerald-500 shadow-sm"
                                                : "bg-gray-50 dark:bg-black/20 border-transparent hover:bg-gray-100 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-black p-1.5 sm:p-2 shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-center">
                                            <Image
                                                src={model.logo}
                                                alt={model.name}
                                                width={40}
                                                height={40}
                                                className={cn("w-full h-full object-contain", model.logo.includes('openai') && "dark:invert")}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                                <h4 className={cn("font-bold text-sm sm:text-base", selectedModel === model.id ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400")}>
                                                    {model.name}
                                                </h4>
                                                {selectedModel === model.id && (
                                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                                                )}
                                            </div>
                                            <p className="text-[10px] sm:text-sm text-gray-400 dark:text-gray-500">{model.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Preview */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-base font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                                            <Image src="/AI2.png" alt="AI" width={24} height={24} className="w-full h-full object-cover" />
                                        </div>
                                        Test Drive Model
                                    </h3>
                                </div>
                                <div className="flex-1 min-h-[400px] mb-6">
                                    <ModelChat
                                        modelId={selectedModel}
                                        modelName={currentModelData.name}
                                        modelLogo={currentModelData.logo}
                                    />
                                </div>

                                {/* Static Start Interview Button */}
                                <div className="mt-auto pt-6">
                                    {error && (
                                        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-bottom-2">
                                            <AlertCircle size={18} />
                                            {error}
                                        </div>
                                    )}
                                    <Button
                                        onClick={handleStart}
                                        disabled={isLoading || !isValid}
                                        className={cn(
                                            "w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300 shadow-xl",
                                            isValid
                                                ? "bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
                                                : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                        )}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <Loader2 size={20} className="animate-spin sm:size-[24px]" />
                                                Preparing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                Start Interview
                                                <ArrowLeft className="rotate-180 sm:size-[24px]" size={20} />
                                            </span>
                                        )}
                                    </Button>

                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Premium Floating Action Bar */}

        </div>
    );
}

