"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Send, Loader2, AlertCircle, CheckCircle, Settings, Eye, EyeOff, Sparkles, Trash2, StopCircle, Copy, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

import { useRouter } from "next/navigation";
import { SettingsDialog } from "@/components/settings-dialog";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { interviewService } from "@/lib/interview-service";

export default function InterviewPage() {
    const router = useRouter();
    const { showToast } = useConfirmDialog();
    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isAiSpeakingRef = useRef(false);

    // API Key no longer needed - using server-side Groq
    const [showSettings, setShowSettings] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [aiResponse, setAiResponse] = useState("## Ready to Interview\n\nI am your AI Copilot. I will listen to your interview and provide real-time answers.\n\n**Instructions:**\n1. Click the microphone to start listening.\n2. Speak your interview question.\n3. When you need an answer, click **Get Answer**.");
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [systemStatus, setSystemStatus] = useState({ browser: true, camera: false, mic: false });
    const [interviewContext, setInterviewContext] = useState({ type: "", jd: "", resume: "", lang: "en-US" });
    const [isAutoMode, setIsAutoMode] = useState(true); // Auto Answer ON by default
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const [lastTranscript, setLastTranscript] = useState<string>(""); // For retry functionality
    const [allAiResponses, setAllAiResponses] = useState<string[]>([]); // Track all AI responses for saving
    const [isSaving, setIsSaving] = useState(false);

    // Constants
    const MAX_TRANSCRIPT_LENGTH = 4000; // Limit transcript to prevent API issues

    // Settings State
    const [isDarkMode, setIsDarkMode] = useState(false);
    const voiceSpeed = 2.0; // Fixed fastest speed

    const addDebugLog = (msg: string) => {
        setDebugLog(prev => [msg, ...prev].slice(0, 5)); // Keep last 5 logs
        console.log(`[Debug]: ${msg}`);
    };

    // Load Settings
    useEffect(() => {
        const loadSettings = () => {
            try {
                const savedTheme = localStorage.getItem("theme");
                if (savedTheme === "dark") setIsDarkMode(true);
                else setIsDarkMode(false);
            } catch (e) {
                // localStorage unavailable
                setIsDarkMode(false);
            }
        };

        loadSettings();

        // Listen for changes from SettingsDialog
        const handleSettingsChange = () => loadSettings();
        window.addEventListener("settingsChanged", handleSettingsChange);
        window.addEventListener("themeChanged", handleSettingsChange);

        return () => {
            window.removeEventListener("settingsChanged", handleSettingsChange);
            window.removeEventListener("themeChanged", handleSettingsChange);
        };
    }, []);

    // Load context from local storage
    useEffect(() => {
        try {
            const savedType = localStorage.getItem("interview_context_type") || "General";
            const savedJD = localStorage.getItem("interview_context_jd") || "";
            const savedResume = localStorage.getItem("interview_context_resume") || "";
            const savedLang = localStorage.getItem("interview_context_lang") || "en-US";
            setInterviewContext({ type: savedType, jd: savedJD, resume: savedResume, lang: savedLang });
        } catch (e) {
            // localStorage unavailable (private mode)
            setInterviewContext({ type: "General", jd: "", resume: "", lang: "en-US" });
        }
    }, []);

    // Initialize Camera
    useEffect(() => {
        let currentStream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                }
                setSystemStatus(prev => ({ ...prev, camera: true }));
                setError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setSystemStatus(prev => ({ ...prev, camera: false }));
                // Cleanup any partial stream on error
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                }
            }
        };

        if (isCameraOn && isCameraVisible) {
            startCamera();
        } else {
            setSystemStatus(prev => ({ ...prev, camera: false }));
        }

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [isCameraOn, isCameraVisible]);

    // Silence Detection for Auto-Answer
    useEffect(() => {
        if (!isAutoMode || !isRecording || isLoading || !transcript.trim()) return;

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        silenceTimerRef.current = setTimeout(() => {
            console.log("Auto-answering due to silence...");
            getAiAnswer();
        }, 1200);

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [transcript, isAutoMode, isLoading, isRecording]);

    const toggleRecording = () => {
        if (!systemStatus.browser) {
            setError("Speech recognition not supported in this browser.");
            return;
        }

        if (isRecording) {
            setIsRecording(false);
            recognitionRef.current?.stop();
        } else {
            try {
                // Abort any existing recognition first (more reliable than stop)
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.abort();
                    } catch (e) { /* Ignore abort error */ }
                }

                // Small delay to allow abort to process
                setTimeout(() => {
                    if (!recognitionRef.current) return;

                    try {
                        recognitionRef.current.start();
                        setIsRecording(true);
                        setError(null);
                    } catch (err: any) {
                        console.error("Error starting recognition:", err);
                        if (err.name === 'InvalidStateError') {
                            // Already running, just sync state
                            console.warn("Recognition already running. Syncing state.");
                            setIsRecording(true);
                        } else if (err.name === 'NotAllowedError') {
                            setError("Microphone access denied. Please allow microphone permissions.");
                            setIsRecording(false);
                        } else {
                            setError("Could not start recording. Please refresh.");
                            setIsRecording(false);
                        }
                    }
                }, 150);
            } catch (err) {
                console.error("Error in toggleRecording:", err);
                setIsRecording(false);
            }
        }
    };

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            // Force ar-EG for better Egyptian recognition if generic Arabic is selected
            recognitionRef.current.lang = interviewContext.lang.startsWith('ar') ? 'ar-EG' : interviewContext.lang;
            recognitionRef.current.maxAlternatives = 3; // Get more alternatives for better accuracy

            recognitionRef.current.onstart = () => {
                setSystemStatus(prev => ({ ...prev, mic: true }));
                setError(null);
                console.log("[Speech] Recognition started");
            };

            recognitionRef.current.onend = () => {
                console.log("[Speech] Recognition ended, isRecording:", isRecording, "isAiSpeaking:", isAiSpeakingRef.current);
                // Auto-restart ONLY if we are supposed to be recording AND AI is NOT speaking
                if (isRecording && !isAiSpeakingRef.current) {
                    console.log("[Speech] Auto-restarting...");
                    // Use a small delay to prevent rapid restart loops
                    setTimeout(() => {
                        if (recognitionRef.current && isRecording && !isAiSpeakingRef.current) {
                            try {
                                recognitionRef.current.start();
                            } catch (e: any) {
                                if (e.name !== 'InvalidStateError') {
                                    console.error("[Speech] Failed to restart:", e);
                                }
                            }
                        }
                    }, 100);
                }
            };

            recognitionRef.current.onresult = (event: any) => {
                let interim = '';
                let finalText = '';

                // Process only new results
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const result = event.results[i];
                    const transcript = result[0].transcript;

                    if (result.isFinal) {
                        finalText += transcript;
                    } else {
                        interim = transcript; // Only keep the latest interim
                    }
                }

                // Add final text to transcript
                if (finalText) {
                    const cleanedFinal = finalText.trim();
                    if (cleanedFinal) {
                        setTranscript(prev => {
                            // Prevent adding duplicate text
                            const words = cleanedFinal.split(' ');
                            const lastWord = words[words.length - 1];
                            if (prev.trim().endsWith(lastWord) && words.length === 1) {
                                return prev; // Skip single word that already exists
                            }
                            const newTranscript = prev + (prev ? ' ' : '') + cleanedFinal;
                            // Limit transcript length
                            if (newTranscript.length > MAX_TRANSCRIPT_LENGTH) {
                                return newTranscript.slice(-MAX_TRANSCRIPT_LENGTH); // Keep last 4000 chars
                            }
                            return newTranscript;
                        });
                    }
                    setInterimTranscript('');
                } else if (interim) {
                    setInterimTranscript(interim);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.log("[Speech] Error:", event.error);

                // Ignore these non-critical errors and auto-restart
                if (event.error === 'no-speech' || event.error === 'aborted') {
                    // Still try to restart after no-speech error
                    if (event.error === 'no-speech' && isRecording && !isAiSpeakingRef.current) {
                        setTimeout(() => {
                            if (recognitionRef.current && isRecording) {
                                try {
                                    recognitionRef.current.start();
                                } catch (e) { /* ignore */ }
                            }
                        }, 200);
                    }
                    return;
                }

                // Handle network errors with auto-retry
                if (event.error === 'network') {
                    console.log("[Speech] Network error, will retry...");
                    setTimeout(() => {
                        if (recognitionRef.current && isRecording) {
                            try {
                                recognitionRef.current.start();
                            } catch (e) { /* ignore */ }
                        }
                    }, 1000);
                    return;
                }

                console.error("[Speech] Recognition error:", event.error);
                if (event.error === 'not-allowed') {
                    setIsRecording(false);
                    setError("Microphone access denied. Please allow microphone permissions.");
                    setSystemStatus(prev => ({ ...prev, mic: false }));
                }
            };
        }
    }, [interviewContext.lang, isRecording]);

    const getAiAnswer = async (retryTranscript?: string) => {
        const transcriptToUse = retryTranscript || transcript;

        // No API key check needed - server has Groq configuration
        if (!transcriptToUse.trim()) {
            if (!isAutoMode) setError("No transcript to analyze. Please speak first.");
            return;
        }

        // Limit transcript length
        const currentTranscript = transcriptToUse.slice(0, MAX_TRANSCRIPT_LENGTH);
        setLastTranscript(currentTranscript); // Save for retry
        setTranscript("");
        setInterimTranscript(""); // Clear interim too

        setIsLoading(true);
        setError(null);

        // Stop listening while thinking/speaking to prevent picking up self
        if (isRecording) {
            recognitionRef.current?.stop();
            isAiSpeakingRef.current = true;
        }

        try {
            // Get user's selected model
            let selectedModel = "llama-3.1-8b-instant";
            try {
                selectedModel = localStorage.getItem("selected_ai_model") || "llama-3.1-8b-instant";
            } catch (e) { /* localStorage unavailable */ }

            // Construct the prompt (Unified for all providers)
            const systemPrompt = `
          SYSTEM INSTRUCTION:
          You are the candidate in a job interview. You are NOT a coach. You are NOT an assistant.
          Your name is Ziad (or whatever name is in the resume).
          
          CRITICAL RULES:
          1. Answer the question DIRECTLY. Do not say "Here is how I would answer". Just answer.
          2. USE THE RESUME DATA. Do not use placeholders like "[insert date]" or "[mention project]". If the specific date or detail is missing in the resume, estimate it reasonably or speak generally about the experience, but NEVER output bracketed placeholders.
          3. If the resume is empty or missing, say: "I apologize, I don't have my resume details in front of me. Could you ask me about a specific technology?"
          4. Keep answers concise (2-3 sentences max) and conversational.
          5. LANGUAGE INSTRUCTION: Answer in the language: ${interviewContext.lang}. 
          - If the language is 'ar-EG', **YOU MUST ANSWER IN EGYPTIAN ARABIC DIALECT (اللهجة المصرية العامية فقط)**.
          - **FORBIDDEN**: Do NOT speak Standard Arabic (Fusha). Do NOT use words like "حسناً", "لماذا", "أريد", "سوف".
          - **REQUIRED**: Speak like a local Egyptian in Cairo. Use words like: "يا فندم", "يا باشا", "حضرتك", "عايز", "عشان", "إيه", "كده", "طب".
          - Example: "أقدر اساعد حضرتك إزاي؟", "هعمل كده".
          
          - If the language is 'ar-SA', **YOU MUST ANSWER IN STANDARD ARABIC (اللغة العربية الفصحى)**.
          - Speak professionally and formally. Use words like "حسناً", "كيف يمكنني مساعدتك", "سوف نقوم".
          
          - If 'en-US', answer in English.
          
          CONTEXT:
          - Interview Type: ${interviewContext.type}
          - Job Description: ${interviewContext.jd || "Not provided"}
          - Candidate Resume: ${interviewContext.resume || "Not provided"}
            `;

            const fullPrompt = `${systemPrompt}\n\nTRANSCRIPT (Interviewer):\n"${currentTranscript}"\n\nYOUR RESPONSE (Candidate):`;

            // Call Server-Side API (Groq powered - no API key needed)
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: selectedModel,
                    systemPrompt: systemPrompt,
                    messages: [
                        { role: "user", content: currentTranscript }
                    ]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `API Error: ${response.status}`);
            }

            const text = data.content;
            if (!text) throw new Error("Empty response from AI.");

            setAiResponse(text);
            // Track AI responses for saving to history
            setAllAiResponses(prev => [...prev, text]);
            // Text-to-speech disabled - text only mode
            isAiSpeakingRef.current = false;

            // Restart speech recognition after AI finishes
            if (isRecording && recognitionRef.current) {
                setTimeout(() => {
                    try {
                        recognitionRef.current?.start();
                        console.log("[Speech] Restarted after AI response");
                    } catch (e) {
                        console.log("[Speech] Could not restart:", e);
                    }
                }, 300);
            }

        } catch (error: any) {
            console.error("Error generating AI response:", error);
            let errorMessage = "Could not generate response.";
            if (error.message.includes("429")) {
                errorMessage = "AI is busy (Rate Limit). Please try again.";
            } else if (error.message.includes("configuration missing")) {
                errorMessage = "Server AI configuration error. Please contact support.";
            } else {
                errorMessage = error.message;
            }
            setAiResponse(`**Error:** ${errorMessage}`);
            setError(errorMessage);
            setTranscript(currentTranscript); // Restore transcript to allow retry
            isAiSpeakingRef.current = false;
            if (isRecording) recognitionRef.current?.start();
        } finally {
            setIsLoading(false);
        }
    };

    const speakResponse = (text: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));

            // Advanced Voice Selection
            const voices = window.speechSynthesis.getVoices();
            // Prioritize "Google" voices, then "Premium", then "Enhanced"
            const preferredVoice = voices.find(v =>
                (v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Enhanced")) &&
                v.lang.startsWith(interviewContext.lang.split('-')[0])
            ) || voices.find(v => v.lang.startsWith(interviewContext.lang.split('-')[0]));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
                addDebugLog(`Using voice: ${preferredVoice.name}`);
            }

            utterance.lang = interviewContext.lang;
            utterance.rate = voiceSpeed; // Use user-defined speed

            utterance.onstart = () => {
                isAiSpeakingRef.current = true;
            };

            utterance.onend = () => {
                isAiSpeakingRef.current = false;
                if (isRecording) {
                    console.log("Speech ended, resuming recognition...");
                    try {
                        recognitionRef.current?.start();
                    } catch (e) {
                        console.error("Failed to resume recognition:", e);
                    }
                }
            };

            window.speechSynthesis.speak(utterance);
        } else {
            isAiSpeakingRef.current = false;
            if (isRecording) recognitionRef.current?.start();
        }
    };

    // Handle End Interview - Save to history and navigate
    const handleEndInterview = async () => {
        // Only save if there's meaningful content
        if (transcript.length < 10 && allAiResponses.length === 0) {
            router.push("/dashboard");
            return;
        }

        setIsSaving(true);
        try {
            const title = interviewContext.type
                ? `${interviewContext.type} Interview`
                : "Interview Session";

            await interviewService.saveInterview(
                title,
                transcript,
                {
                    job_description: interviewContext.jd,
                    interview_type: interviewContext.type,
                    language: interviewContext.lang,
                    ai_responses: allAiResponses
                }
            );
            showToast("Interview saved to history", "success");
        } catch (error) {
            console.error("Failed to save interview:", error);
            // Still navigate even if save fails
        } finally {
            setIsSaving(false);
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row gap-4 p-2 sm:p-4 pt-20 transition-colors duration-300 bg-gray-100 dark:bg-black overflow-auto">
            {/* Error Banner */}
            {error && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-lg">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-2 h-6 w-6 p-0 rounded-full hover:bg-red-200">
                        X
                    </Button>
                </div>
            )}

            {/* Settings Modal */}
            <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />

            {/* Left Panel: Video & Transcript */}
            <div className={cn("flex flex-col gap-4 transition-all duration-300 w-full", isCameraVisible ? "lg:w-1/2" : "lg:w-1/3")}>
                {/* Video Feed */}
                {isCameraVisible && (
                    <div className="flex-1 bg-black rounded-2xl overflow-hidden relative shadow-lg min-h-[300px]">
                        {isCameraOn ? (
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
                                <VideoOff size={48} />
                            </div>
                        )}

                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={() => setIsCameraVisible(!isCameraVisible)}
                                title={isCameraVisible ? "Hide Camera" : "Show Camera"}
                            >
                                {isCameraVisible ? <VideoOff size={20} /> : <Video size={20} />}
                            </Button>
                        </div>

                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-6">
                            {/* Microphone Button */}
                            <button
                                onClick={toggleRecording}
                                className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm",
                                    isRecording
                                        ? "bg-[#00D95A] text-white scale-110 shadow-green-500/40"
                                        : "bg-black/40 text-white hover:bg-black/60 border border-white/10"
                                )}
                                title={isRecording ? "Stop Recording" : "Start Recording"}
                            >
                                <Mic size={26} strokeWidth={isRecording ? 2.5 : 2} />
                            </button>

                            {/* Camera Toggle Button */}
                            <button
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm",
                                    isCameraOn
                                        ? "bg-[#00D95A] text-white scale-110 shadow-green-500/40"
                                        : "bg-black/40 text-white hover:bg-black/60 border border-white/10"
                                )}
                                title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                            >
                                {isCameraOn ? <Video size={26} strokeWidth={2.5} /> : <VideoOff size={26} strokeWidth={2} />}
                            </button>

                            {/* End Interview Button */}
                            <button
                                onClick={handleEndInterview}
                                disabled={isSaving}
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                                title="End Interview"
                            >
                                {isSaving ? <Loader2 size={26} className="animate-spin" /> : <LogOut size={26} strokeWidth={2} />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden Camera State Controls */}
                {!isCameraVisible && (
                    <div className="flex justify-center gap-6 my-6 flex-wrap">
                        {/* Microphone Icon Button */}
                        <button
                            onClick={toggleRecording}
                            className={cn(
                                "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                                isRecording
                                    ? "bg-[#00D95A] text-white scale-110 shadow-green-500/30 ring-4 ring-green-100 dark:ring-green-900/30"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                            title={isRecording ? "Stop Recording" : "Start Recording"}
                        >
                            <Mic size={26} strokeWidth={isRecording ? 2.5 : 2} />
                        </button>

                        {/* Camera Icon Button */}
                        <button
                            onClick={() => setIsCameraVisible(true)}
                            className={cn(
                                "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                                isCameraOn
                                    ? "bg-[#00D95A] text-white scale-110 shadow-green-500/30 ring-4 ring-green-100 dark:ring-green-900/30"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                            title={isCameraOn ? "Camera On - Show" : "Camera Off - Show"}
                        >
                            {isCameraOn ? <Video size={26} strokeWidth={2.5} /> : <VideoOff size={26} strokeWidth={2} />}
                        </button>

                        {/* End Interview Button */}
                        <button
                            onClick={handleEndInterview}
                            disabled={isSaving}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                            title="End Interview"
                        >
                            {isSaving ? <Loader2 size={26} className="animate-spin" /> : <LogOut size={26} strokeWidth={2} />}
                        </button>
                    </div>
                )}

                {/* Transcript Area */}
                <div className="h-1/3 p-4 rounded-2xl shadow-sm border flex flex-col bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <span className={cn("w-2 h-2 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300")}></span>
                            Live Transcript
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setTranscript("")} className="text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </Button>
                    </div>
                    <div className="flex-1 rounded-xl p-4 overflow-y-auto text-base font-sans leading-loose bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors">
                        {transcript}
                        {interimTranscript && (
                            <span className="text-gray-500 dark:text-gray-400 italic">
                                {interimTranscript}
                                <span className="animate-pulse">|</span>
                            </span>
                        )}
                        {!transcript && !interimTranscript && "Click the microphone to start listening..."}
                    </div>
                </div>
            </div>

            {/* Right Panel: AI Response */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="p-6 rounded-2xl shadow-sm border flex-1 flex flex-col bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <h3 className="font-bold flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            AI Copilot
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={isAutoMode ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsAutoMode(!isAutoMode)}
                                className={cn("gap-2 dark:text-white dark:border-gray-700 text-xs sm:text-sm", isAutoMode && "bg-green-600 hover:bg-green-700")}
                            >
                                <Sparkles size={14} />
                                <span className="hidden sm:inline">{isAutoMode ? "Auto Answer ON" : "Auto Answer OFF"}</span>
                                <span className="sm:hidden">{isAutoMode ? "Auto ON" : "Auto OFF"}</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 rounded-xl p-6 overflow-y-auto prose prose-lg max-w-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors relative">
                        <div className="absolute top-2 right-2 flex gap-1">
                            {/* Retry Button - only shows when lastTranscript exists and there was an error */}
                            {lastTranscript && error && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                    onClick={() => getAiAnswer(lastTranscript)}
                                    disabled={isLoading}
                                    title="Retry last question"
                                >
                                    <AlertCircle size={16} />
                                </Button>
                            )}
                            {/* Copy Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                onClick={() => {
                                    navigator.clipboard.writeText(aiResponse.replace(/\*\*/g, '').replace(/\*/g, ''));
                                    showToast("Copied to clipboard!", "success");
                                }}
                                title="Copy to clipboard"
                            >
                                <Copy size={16} />
                            </Button>
                        </div>
                        <div className="leading-loose text-lg">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Debug Info */}
                    <div className="mt-4 text-xs text-center text-gray-400">
                        {isAutoMode ? "AI will answer automatically after you stop speaking." : "Press Space to generate answer"}
                    </div>

                    {/* Debug Info */}
                    <div className="mt-2 text-[10px] text-gray-300 text-center">
                        Context Loaded: Resume ({interviewContext.resume.length} chars) | JD ({interviewContext.jd.length} chars)
                    </div>

                </div>
            </div>

        </div>
    );
}
