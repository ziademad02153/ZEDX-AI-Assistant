"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Send, Loader2, AlertCircle, CheckCircle, Settings, Eye, EyeOff, Sparkles, Trash2, StopCircle, Moon, Sun, RefreshCw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { SettingsDialog } from "@/components/settings-dialog";
import { AiCopilot } from "@/components/ai-copilot";

export default function InterviewPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isAiSpeakingRef = useRef(false);

    const [apiKey, setApiKey] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [aiResponse, setAiResponse] = useState("## Ready to Interview\n\nI am your AI Copilot. I will listen to your interview and provide real-time answers.\n\n**Instructions:**\n1. Enter your Gemini API Key.\n2. Click the microphone to start listening.\n3. When you need an answer, click **Get Answer**.");
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [systemStatus, setSystemStatus] = useState({ browser: true, camera: false, mic: false });
    const [interviewContext, setInterviewContext] = useState({ type: "", jd: "", resume: "", lang: "en-US" });
    const [isAutoMode, setIsAutoMode] = useState(false);
    const [debugLog, setDebugLog] = useState<string[]>([]);

    // Settings State
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [voiceSpeed, setVoiceSpeed] = useState(1.1); // Default slightly faster for fluency

    const addDebugLog = (msg: string) => {
        setDebugLog(prev => [msg, ...prev].slice(0, 5)); // Keep last 5 logs
        console.log(`[Debug]: ${msg}`);
    };

    // Load API Key & Settings
    useEffect(() => {
        const loadSettings = () => {
            const key = localStorage.getItem("gemini_api_key");
            if (key) setApiKey(key);
            else setShowSettings(true);

            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark") setIsDarkMode(true);
            else setIsDarkMode(false);

            const savedSpeed = localStorage.getItem("tts_speed");
            if (savedSpeed) setVoiceSpeed(parseFloat(savedSpeed));
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
        const savedType = localStorage.getItem("interview_context_type") || "General";
        const savedJD = localStorage.getItem("interview_context_jd") || "";
        const savedResume = localStorage.getItem("interview_context_resume") || "";
        const savedLang = localStorage.getItem("interview_context_lang") || "en-US";
        setInterviewContext({ type: savedType, jd: savedJD, resume: savedResume, lang: savedLang });
    }, []);

    // Initialize Camera
    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setSystemStatus(prev => ({ ...prev, camera: true }));
                setError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setSystemStatus(prev => ({ ...prev, camera: false }));
                // Don't show error if camera is just hidden or denied, unless user explicitly tried to turn it on
            }
        };

        if (isCameraOn && isCameraVisible) {
            startCamera();
        } else {
            setSystemStatus(prev => ({ ...prev, camera: false }));
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
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
                // Ensure it's stopped before starting to prevent InvalidStateError
                try {
                    recognitionRef.current?.stop();
                } catch (e) { /* Ignore stop error */ }

                // Small delay to allow stop to process
                setTimeout(() => {
                    try {
                        setIsRecording(true);
                        recognitionRef.current?.start();
                        setError(null);
                    } catch (err: any) {
                        console.error("Error starting recognition:", err);
                        if (err.name === 'InvalidStateError') {
                            console.warn("Recognition already started. Syncing state.");
                            setIsRecording(true);
                        } else {
                            setError("Could not start recording. Please refresh.");
                            setIsRecording(false);
                        }
                    }
                }, 100);
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
            recognitionRef.current.lang = interviewContext.lang;

            recognitionRef.current.onstart = () => {
                setSystemStatus(prev => ({ ...prev, mic: true }));
                setError(null);
            };

            recognitionRef.current.onend = () => {
                // Auto-restart ONLY if we are supposed to be recording AND AI is NOT speaking
                if (isRecording && !isAiSpeakingRef.current) {
                    console.log("Recognition ended, restarting...");
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
                        console.error("Failed to restart recognition:", e);
                    }
                }
            };

            recognitionRef.current.onresult = (event: any) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                if (final) {
                    setTranscript(prev => prev + " " + final);
                    setInterimTranscript(""); // Clear interim when final is added
                } else {
                    setInterimTranscript(interim);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'no-speech' || event.error === 'aborted') {
                    return;
                }
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setIsRecording(false);
                    setError("Microphone access denied. Please allow microphone permissions.");
                    setSystemStatus(prev => ({ ...prev, mic: false }));
                }
            };
        }
    }, [interviewContext.lang, isRecording]);

    const getAiAnswer = async () => {
        if (!apiKey) {
            setShowSettings(true);
            return;
        }
        if (!transcript.trim()) {
            if (!isAutoMode) setError("No transcript to analyze. Please speak first.");
            return;
        }

        const currentTranscript = transcript;
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
            const provider = localStorage.getItem("gemini_api_provider") || "google";
            const savedModel = localStorage.getItem("gemini_working_model") || localStorage.getItem("gemini_custom_model");

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
          5. LANGUAGE INSTRUCTION: Answer in the language: ${interviewContext.lang}. If the language is 'ar-SA' or 'ar', answer in Arabic. If 'en-US', answer in English. Match the language of the interviewer if unsure.
          
          CONTEXT:
          - Interview Type: ${interviewContext.type}
          - Job Description: ${interviewContext.jd || "Not provided"}
          - Candidate Resume: ${interviewContext.resume || "Not provided"}
            `;

            const fullPrompt = `${systemPrompt}\n\nTRANSCRIPT (Interviewer):\n"${currentTranscript}"\n\nYOUR RESPONSE (Candidate):`;

            // Call Server-Side API
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider,
                    apiKey,
                    model: savedModel,
                    prompt: fullPrompt, // For Google
                    messages: [ // For OpenAI/Others
                        { role: "system", content: systemPrompt },
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
            speakResponse(text);

        } catch (error: any) {
            console.error("Error generating AI response:", error);
            let errorMessage = "Could not generate response.";
            if (error.message.includes("429")) {
                errorMessage = "AI is busy (Rate Limit). Please try again.";
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

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 p-4 transition-colors duration-300 bg-gray-100 dark:bg-black">
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
            <div className={cn("flex flex-col gap-4 transition-all duration-300", isCameraVisible ? "w-full md:w-1/2" : "w-full md:w-1/3")}>
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
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsCameraVisible(false)}>
                                <EyeOff size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setShowSettings(true)}>
                                <Settings size={20} />
                            </Button>
                        </div>

                        {/* System Status Indicators */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <div className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", systemStatus.browser ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                {systemStatus.browser ? <CheckCircle size={12} /> : <AlertCircle size={12} />} Browser
                            </div>
                            <div className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", systemStatus.camera ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                {systemStatus.camera ? <CheckCircle size={12} /> : <AlertCircle size={12} />} Camera
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md p-3 rounded-full">
                            <Button
                                variant={isCameraOn ? "default" : "destructive"}
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIsCameraOn(!isCameraOn)}
                            >
                                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                            </Button>
                            <Button
                                variant={isRecording ? "destructive" : "default"}
                                size="lg"
                                className={cn("rounded-full w-16 h-16 transition-all", isRecording && "animate-pulse ring-4 ring-red-500/30")}
                                onClick={toggleRecording}
                                disabled={!systemStatus.browser}
                            >
                                {isRecording ? <StopCircle size={32} /> : <Mic size={32} />}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Hidden Camera State Controls */}
                {!isCameraVisible && (
                    <div className="p-4 rounded-2xl shadow-sm border flex items-center justify-between bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-full", isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")}>
                                {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Camera Hidden</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={isRecording ? "destructive" : "default"}
                                size="sm"
                                onClick={toggleRecording}
                            >
                                {isRecording ? "Stop" : "Record"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setIsCameraVisible(true)} className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                <Eye size={16} className="mr-2" /> Show Camera
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="dark:text-white">
                                <Settings size={20} />
                            </Button>
                        </div>
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
                    <div className="flex-1 rounded-xl p-4 overflow-y-auto text-sm font-mono leading-relaxed bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
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
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="p-6 rounded-2xl shadow-sm border flex-1 flex flex-col bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            AI Copilot
                        </h3>
                        <div className="flex gap-2">
                            <Button
                                variant={isAutoMode ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsAutoMode(!isAutoMode)}
                                className={cn("gap-2 dark:text-white dark:border-gray-700", isAutoMode && "bg-green-600 hover:bg-green-700")}
                            >
                                <Sparkles size={16} />
                                {isAutoMode ? "Auto Answer ON" : "Auto Answer OFF"}
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    import("@/lib/history").then(({ history }) => {
                                        history.saveSession({
                                            jobDescription: interviewContext.jd,
                                            type: interviewContext.type,
                                            transcript: transcript,
                                            durationSeconds: 300, // Mock duration for now, or track real time
                                        });
                                        window.location.href = "/dashboard";
                                    });
                                }}
                            >
                                End Interview
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={getAiAnswer}
                                disabled={isLoading || !transcript}
                                className="shadow-green-900/20"
                            >
                                {isLoading ? "Thinking..." : "Get Answer"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 rounded-xl p-6 overflow-y-auto prose prose-sm max-w-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300 prose-invert transition-colors">
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {aiResponse}
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-center text-gray-400">
                        {isAutoMode ? "AI will answer automatically after you stop speaking." : "Press Space to generate answer"}
                    </div>

                    {/* Debug Info */}
                    <div className="mt-2 text-[10px] text-gray-300 text-center">
                        Context Loaded: Resume ({interviewContext.resume.length} chars) | JD ({interviewContext.jd.length} chars)
                    </div>

                </div>
            </div>


            {/* AI Copilot Floating Widget */}
            <AiCopilot />
        </div>
    );
}
