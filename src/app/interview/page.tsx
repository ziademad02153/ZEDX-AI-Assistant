"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, VideoOff, Loader2, AlertCircle, Sparkles, Trash2, LogOut, Copy, RotateCcw } from "lucide-react";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const [lastTranscript, setLastTranscript] = useState<string>(""); // For retry functionality
    const [allQAPairs, setAllQAPairs] = useState<{ question: string, answer: string }[]>([]); // Track Q&A pairs
    const [isSaving, setIsSaving] = useState(false);
    const [interviewStartTime] = useState<Date>(new Date()); // Track when interview started
    const [manualQuestion, setManualQuestion] = useState(""); // Manual input for coding questions

    // Constants
    const MAX_TRANSCRIPT_LENGTH = 4000; // Limit transcript to prevent API issues

    // --- DESK_TOP STT ---

    // Load Settings
    useEffect(() => {
        // Listen for changes from SettingsDialog
        const handleSettingsChange = () => {
            // Placeholder for responsive UI if needed
        };
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
        } catch {
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

        const videoElem = videoRef.current;
        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            // Fix: Use local variable for cleanup to avoid ref mutation issues
            if (videoElem) {
                videoElem.srcObject = null;
            }
        };
    }, [isCameraOn, isCameraVisible]);
    const getAiAnswer = useCallback(async (retryTranscript?: string) => {
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
            } catch { /* localStorage unavailable */ }

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

            // Construct the prompt (Unified for all providers)

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
            // Track Q&A pairs for saving to history - save question and answer together
            setAllQAPairs(prev => [...prev, { question: currentTranscript.trim(), answer: text }]);
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

        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error generating AI response:", err);
            let errorMessage = "Could not generate response.";
            if (err.message.includes("429")) {
                errorMessage = "AI is busy (Rate Limit). Please try again.";
            } else if (err.message.includes("configuration missing")) {
                errorMessage = "Server AI configuration error. Please contact support.";
            } else {
                errorMessage = err.message;
            }
            setAiResponse(`**Error:** ${errorMessage}`);
            setError(errorMessage);
            setTranscript(currentTranscript); // Restore transcript to allow retry
            isAiSpeakingRef.current = false;
            if (isRecording) recognitionRef.current?.start();
        } finally {
            setIsLoading(false);
        }
    }, [interviewContext, transcript, isAutoMode, isRecording, recognitionRef]);

    const handleManualSubmit = () => {
        if (!manualQuestion.trim()) return;
        getAiAnswer(manualQuestion);
    };

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
    }, [transcript, isAutoMode, isLoading, isRecording, getAiAnswer]);

    // Detect if running in Electron (Desktop App)
    const isElectron = typeof window !== 'undefined' && (window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron;

    // --- DESKTOP STT (Groq Whisper with Silence Detection) ---
    const activeStreamsRef = useRef<MediaStream[]>([]);
    const lastGroqTranscriptRef = useRef<string>("");

    // BANNED_PHRASES - Only filter CLEAR hallucinations (YouTube artifacts, never real speech)
    const BANNED_PHRASES = [
        "please subscribe", "like and subscribe", "subscribe to",
        "thanks for watching", "thank you for watching",
        "copyright", "subtitles by", "captioned by",
        "[music]", "[applause]", "(music)", "(applause)"
    ];

    const processGroqAudio = async (audioBlob: Blob) => {
        try {
            // Filter out tiny blobs (headers/noise) to prevent Groq 400 errors
            if (audioBlob.size < 5000) {
                console.log(`[Desktop STT] Skipped: audio too small (${audioBlob.size} bytes)`);
                return;
            }

            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-large-v3-turbo');

            // Get selected language
            const langCode = interviewContext.lang.split('-')[0];
            formData.append('language', langCode);

            // Add prompt to help Whisper understand the expected language
            if (langCode === 'en') {
                formData.append('prompt', 'This is an English job interview conversation.');
            } else if (langCode === 'ar') {
                formData.append('prompt', 'هذه محادثة مقابلة عمل باللغة العربية.');
            }

            console.log(`[Desktop STT] Sending audio with language: ${langCode}`);

            let response;
            let retries = 2; // Try up to 2 extra times
            let delay = 1000;

            while (retries >= 0) {
                response = await fetch('/api/transcribe', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) break;

                if (response.status === 503 || response.status === 429) {
                    console.warn(`[Desktop STT] Retrying due to ${response.status}... (${retries} left)`);
                    await new Promise(r => setTimeout(r, delay));
                    retries--;
                    delay *= 2;
                } else {
                    break;
                }
            }

            if (!response || !response.ok) {
                console.error(`[Desktop STT] API Error: ${response?.status}`);
                return;
            }

            const data = await response.json();
            console.log(`[Desktop STT] Groq returned: "${data.text || '(empty)'}"`);

            if (data.text && data.text.trim()) {
                const newText = data.text.trim();
                const clean = newText.toLowerCase().replace(/[.,!?]/g, '').trim();
                const wordCount = clean.split(/\s+/).length;

                // Filter: too short
                if (wordCount < 2) {
                    console.log(`[Desktop STT] Filtered: too short (${wordCount} words): "${newText}"`);
                    return;
                }

                // Filter: banned phrases
                if (BANNED_PHRASES.some(b => clean.includes(b))) {
                    console.log(`[Desktop STT] Filtered: banned phrase: "${newText}"`);
                    return;
                }

                // Filter: duplicate
                if (lastGroqTranscriptRef.current === clean) {
                    console.log(`[Desktop STT] Filtered: duplicate`);
                    return;
                }

                // Filter: unexpected languages
                const unexpectedCharsRegex = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;
                if (unexpectedCharsRegex.test(newText)) {
                    console.log(`[Desktop STT] Filtered: unexpected language: "${newText}"`);
                    return;
                }

                lastGroqTranscriptRef.current = clean;
                console.log(`[Desktop STT] ✅ Heard (${langCode}): "${newText}"`);

                setTranscript(prev => (prev + " " + newText).trim().slice(-MAX_TRANSCRIPT_LENGTH));

                if ((window as unknown as { electronAPI?: { sendTranscript: (t: string) => void } }).electronAPI?.sendTranscript) {
                    (window as unknown as { electronAPI: { sendTranscript: (t: string) => void } }).electronAPI.sendTranscript(newText);
                }
            } else {
                console.log("[Desktop STT] Groq returned empty response");
            }
        } catch (error) {
            console.error("[Desktop STT] Error:", error);
        }
    };

    const startDesktopSTT = async () => {
        try {
            console.log("[Desktop STT] Starting Smart VAD...");
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            });
            activeStreamsRef.current = [stream];

            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 512;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            (activeStreamsRef.current as unknown as { audioContext: AudioContext }).audioContext = audioContext;

            // VAD Parameters (Optimized to prevent 503 Rate Limiting)
            const SPEECH_THRESHOLD = 25;        // Volume threshold
            const SILENCE_DURATION = 2000;      // 2s silence = End of sentence (Reduces API calls)
            const MIN_SPEECH_DURATION = 1500;   // Ignore < 1.5s (Filters noise & hallucinations)
            const MAX_RECORDING_TIME = 20000;   // Force send after 20s

            let mediaRecorder: MediaRecorder | null = null;
            let audioChunks: Blob[] = [];
            let isSpeaking = false;
            let silenceStart = 0;
            let speechStart = 0;
            let lastLogTime = 0;

            const checkAudioLevel = () => {
                if (!activeStreamsRef.current.length) return;

                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

                // Log every 2s
                if (Date.now() - lastLogTime > 2000) {
                    console.log(`[Desktop STT] Level: ${average.toFixed(1)} | Speaking: ${isSpeaking}`);
                    lastLogTime = Date.now();
                }

                if (average > SPEECH_THRESHOLD) {
                    // SPEECH DETECTED
                    silenceStart = 0;
                    if (!isSpeaking) {
                        isSpeaking = true;
                        speechStart = Date.now();
                        audioChunks = [];
                        console.log("[Desktop STT] Speech detected! 🎙️");

                        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                        mediaRecorder.ondataavailable = (e) => {
                            if (e.data.size > 0) audioChunks.push(e.data);
                        };
                        mediaRecorder.start(50);
                    } else {
                        // Check Max Duration
                        if (Date.now() - speechStart > MAX_RECORDING_TIME) {
                            console.log("[Desktop STT] Max duration reached, forcing stop.");
                            stopAndProcess();
                        }
                    }
                } else {
                    // SILENCE
                    if (isSpeaking) {
                        if (silenceStart === 0) {
                            silenceStart = Date.now();
                        } else if (Date.now() - silenceStart > SILENCE_DURATION) {
                            console.log("[Desktop STT] Sentence finished (Silence).");
                            stopAndProcess();
                        }
                    }
                }
                requestAnimationFrame(checkAudioLevel);
            };

            const stopAndProcess = () => {
                isSpeaking = false;
                silenceStart = 0;

                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    mediaRecorder.onstop = async () => {
                        const duration = Date.now() - speechStart;
                        console.log(`[Desktop STT] Recording stopped. Duration: ${duration}ms`);

                        if (duration < MIN_SPEECH_DURATION) {
                            console.log(`[Desktop STT] 🚮 Discarded: Too short (<${MIN_SPEECH_DURATION}ms)`);
                            audioChunks = [];
                            return;
                        }

                        if (audioChunks.length > 0) {
                            const fullAudio = new Blob(audioChunks, { type: 'audio/webm' });
                            console.log(`[Desktop STT] 🚀 Sending ${(fullAudio.size / 1024).toFixed(1)}KB to Groq...`);
                            await processGroqAudio(fullAudio);
                        }
                        audioChunks = [];
                    };
                }
            };

            checkAudioLevel();
            setIsRecording(true);
            console.log("[Desktop STT] VAD Engine Started");

        } catch (err: unknown) {
            const error = err as Error;
            console.error("Desktop STT Error:", error);
            setError(error.message || "Recording failed.");
        }
    };

    const stopDesktopSTT = () => {
        const intervalId = (activeStreamsRef.current as unknown as { intervalId?: NodeJS.Timeout })?.intervalId;
        if (intervalId) clearInterval(intervalId);

        const audioContext = (activeStreamsRef.current as unknown as { audioContext?: AudioContext })?.audioContext;
        if (audioContext) audioContext.close();

        activeStreamsRef.current.forEach(stream => {
            stream.getTracks().forEach(track => track.stop());
        });
        activeStreamsRef.current = [];
        setIsRecording(false);
        console.log("[Desktop STT] Stopped");
    };

    // --- TOGGLE RECORDING (UNIFIED) ---
    const toggleRecording = () => {
        if (isRecording) {
            // STOP
            if (isElectron) {
                stopDesktopSTT();
            } else {
                setIsRecording(false);
                recognitionRef.current?.stop();
            }
        } else {
            // START
            if (isElectron) {
                // Desktop: Use Groq Whisper
                startDesktopSTT();
            } else {
                // Website: Use Web Speech API (original code)
                if (!systemStatus.browser) {
                    setError("Speech recognition not supported in this browser.");
                    return;
                }
                try {
                    if (recognitionRef.current) {
                        try { recognitionRef.current.abort(); } catch { }
                    }
                    setTimeout(() => {
                        if (!recognitionRef.current) return;
                        try {
                            recognitionRef.current.start();
                            setIsRecording(true);
                            setError(null);
                        } catch (err: unknown) {
                            const error = err as Error;
                            if (error.name === 'InvalidStateError') {
                                setIsRecording(true);
                            } else if (error.name === 'NotAllowedError') {
                                setError("Microphone access denied.");
                                setIsRecording(false);
                            } else {
                                setError("Could not start recording. Please refresh.");
                                setIsRecording(false);
                            }
                        }
                    }, 150);
                } catch {
                    setIsRecording(false);
                }
            }
        }
    };

    // Initialize Speech Recognition (WEBSITE ONLY - not in Electron)
    useEffect(() => {
        // Skip Web Speech API in Electron - it doesn't work there and causes network errors
        const isElectronApp = typeof window !== 'undefined' && (window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron;
        if (isElectronApp) {
            console.log("[Speech] Skipping Web Speech API in Electron - using Groq instead");
            return;
        }

        interface SpeechRecognitionWindow extends Window {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            webkitSpeechRecognition: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            SpeechRecognition: any;
        }
        const win = window as unknown as SpeechRecognitionWindow;
        const SpeechRecognition = win.webkitSpeechRecognition || win.SpeechRecognition;
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
                        } catch (err: unknown) {
                            const error = err as Error;
                            if (error.name !== 'InvalidStateError') {
                                console.error("[Speech] Failed to restart:", error);
                            }
                        }
                    }
                }, 100);
            }
        };

        recognitionRef.current.onresult = (event: { resultIndex: number; results: { [key: number]: { isFinal: boolean;[key: number]: { transcript: string; }; }; length: number; }; }) => {
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
                        // Enhanced deduplication: check if the new text overlaps with the end of existing transcript
                        const prevTrimmed = prev.trim();

                        // Check if this text is a repeat of what we just added
                        if (prevTrimmed.endsWith(cleanedFinal)) {
                            return prev; // Skip complete duplicate
                        }

                        // Check for partial overlap (last N words match first N words of new text)
                        const prevWords = prevTrimmed.split(' ').slice(-10); // Last 10 words
                        const newWords = cleanedFinal.split(' ');

                        // Find overlap: check if end of prev matches start of new
                        let overlapLength = 0;
                        for (let len = Math.min(prevWords.length, newWords.length); len > 0; len--) {
                            const prevEnd = prevWords.slice(-len).join(' ').toLowerCase();
                            const newStart = newWords.slice(0, len).join(' ').toLowerCase();
                            if (prevEnd === newStart) {
                                overlapLength = len;
                                break;
                            }
                        }

                        // Remove overlapping words from new text
                        const textToAdd = overlapLength > 0
                            ? newWords.slice(overlapLength).join(' ')
                            : cleanedFinal;

                        if (!textToAdd.trim()) {
                            return prev; // Nothing new to add
                        }

                        const newTranscript = prev + (prev ? ' ' : '') + textToAdd;
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

        recognitionRef.current.onerror = (event: { error: string; }) => {
            console.log("[Speech] Error:", event.error);

            // Ignore these non-critical errors and auto-restart
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // Still try to restart after no-speech error
                if (event.error === 'no-speech' && isRecording && !isAiSpeakingRef.current) {
                    setTimeout(() => {
                        if (recognitionRef.current && isRecording) {
                            try {
                                recognitionRef.current.start();
                            } catch { /* ignore */ }
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
                        } catch { /* ignore */ }
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
    }, [interviewContext.lang, isRecording]);


    // Handle End Interview - Save to history and navigate
    const handleEndInterview = async () => {
        // Only save if there's meaningful content
        if (transcript.length < 10 && allQAPairs.length === 0) {
            router.push("/dashboard");
            return;
        }

        setIsSaving(true);
        try {
            const title = interviewContext.type
                ? `${interviewContext.type} Interview`
                : "Interview Session";

            // Calculate interview duration in minutes
            const durationMinutes = Math.round((new Date().getTime() - interviewStartTime.getTime()) / 60000);

            // Format transcript with Q&A pairs for better history display
            const formattedTranscript = allQAPairs.length > 0
                ? allQAPairs.map((qa, idx) => `Q${idx + 1}: ${qa.question}\n\nA${idx + 1}: ${qa.answer}`).join('\n\n---\n\n')
                : transcript;

            await interviewService.saveInterview(
                title,
                formattedTranscript,
                {
                    job_description: interviewContext.jd,
                    interview_type: interviewContext.type,
                    language: interviewContext.lang,
                    ai_responses: allQAPairs.map(qa => qa.answer),
                    duration_minutes: durationMinutes,
                    questions: allQAPairs.map(qa => qa.question)
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

                    {/* Manual Input for Coding Questions */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Manual Question / Code
                            </label>
                            {manualQuestion && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setManualQuestion("")}
                                    className="h-6 px-2 text-gray-400 hover:text-red-500 text-[10px] gap-1"
                                >
                                    <Trash2 size={12} /> Clear
                                </Button>
                            )}
                        </div>
                        <div className="relative">
                            <textarea
                                value={manualQuestion}
                                onChange={(e) => setManualQuestion(e.target.value)}
                                placeholder="Paste coding question or type here... (Press Enter to ask)"
                                className="w-full p-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-y min-h-[120px] text-gray-800 dark:text-gray-200 shadow-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleManualSubmit();
                                    }
                                }}
                            />
                            <Button
                                size="icon"
                                onClick={handleManualSubmit}
                                disabled={isLoading || !manualQuestion.trim()}
                                className="absolute bottom-3 right-3 h-9 w-9 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md disabled:opacity-50 transition-all hover:scale-105"
                                title="Get Answer"
                            >
                                <Sparkles size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 rounded-xl p-6 overflow-y-auto prose prose-lg max-w-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors relative">
                        <div className="absolute top-2 right-2 flex gap-1">
                            {/* Retry Button - always shows when lastTranscript exists */}
                            {lastTranscript && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={() => getAiAnswer(lastTranscript)}
                                    disabled={isLoading}
                                    title="Retry last question"
                                >
                                    <RotateCcw size={16} />
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
