"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, VideoOff, Loader2, AlertCircle, Sparkles, Trash2, LogOut, Copy, RotateCcw, Monitor, MonitorOff, Scan } from "lucide-react";
import { createWorker } from 'tesseract.js';
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

import { useRouter } from "next/navigation";
import { SettingsDialog } from "@/components/settings-dialog";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { interviewService } from "@/lib/interview-service";

// --- Types for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

export default function InterviewPage() {
    const router = useRouter();
    const { showToast } = useConfirmDialog();
    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isAiSpeakingRef = useRef(false);
    const isRecognitionActiveRef = useRef(false);

    // API Key no longer needed - using server-side Groq
    const [showSettings, setShowSettings] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [aiResponse, setAiResponse] = useState("## Ready to Assist\n\nI am your Mock Assessor. I will listen to your session and provide real-time feedback.\n\n**Instructions:**\n1. Click the microphone to start listening.\n2. Speak your question or discussion point.\n3. When you need feedback, click **Get Feedback**.");
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [systemStatus, setSystemStatus] = useState({ browser: true, camera: false, mic: false });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ignoreStatus = systemStatus;
    const [interviewContext, setInterviewContext] = useState({ type: "", jd: "", resume: "", lang: "en-US" });
    const [isAutoMode, setIsAutoMode] = useState(true); // Auto Answer ON by default
    const [lastTranscript, setLastTranscript] = useState<string>(""); // For retry functionality
    const [allQAPairs, setAllQAPairs] = useState<{ question: string, answer: string }[]>([]); // Track Q&A pairs
    const [isSaving, setIsSaving] = useState(false);
    const [interviewStartTime] = useState<Date>(new Date()); // Track when interview started
    const [manualQuestion, setManualQuestion] = useState(""); // Manual input for coding questions
    const [isScreenAudioActive, setIsScreenAudioActive] = useState(false);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const screenSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const [isScannerActive, setIsScannerActive] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

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

    useEffect(() => {
        setHasMounted(true);
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

        // v18.0: Listen for scanner state changes (Atomic Sync)
        if (typeof window !== 'undefined' && window.electronAPI?.onScannerStateChange) {
            const cleanup = window.electronAPI.onScannerStateChange((active: boolean) => {
                console.log('[Sync] Scanner state changed:', active);
                setIsScannerActive(active);
            });
            return cleanup;
        }
    }, []);

    // Initialize Camera
    useEffect(() => {
        let currentStream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Camera API not supported in this browser.");
                }
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
        You are a top-tier professional candidate participating in a high-stakes job interview. Your goal is to provide the most logical, intelligent, and impressive answers that an interviewer expects to hear.

        CRITICAL RULES:
        1. **IDENTITY**: You are the candidate. Answer directly as "I". Never say "A good answer would be...".
        2. **CONTEXT AWARENESS**: 
           - Use the provided context (Resume/JD) for personal questions.
           - For technical or general questions, provide industry-leading, expert-level insights.
        3. **DYNAMIC LENGTH (CRITICAL)**:
           - Adjust your length based on the question. 
           - If the question is simple or introductory, be brief and punchy.
           - If the question is technical, architectural, or complex, provide a detailed, logical, and well-structured explanation that demonstrates deep expertise.
        4. **INTERVIEW STRATEGY**: Provide the "Benchmark Answer". Focus on what makes a candidate stand out: problem-solving, impact, and clarity.
        5. **LANGUAGE**: Strictly use ${interviewContext.lang}.
           - If 'ar-EG', use professional Egyptian Arabic (Ammiya) but keep technical terms in English where appropriate. Avoid overly formal Fusha.
           - If 'en-US', use professional corporate English.

        LANGUAGE SPECIFICS (ar-EG):
        - Use professional yet natural Egyptian terms like "حضرتك", "الفكرة إن", "بناءً على خبرتي".
        - Avoid stiff Standard Arabic.

        CONTEXT:
        - Meeting Type: ${interviewContext.type}
        - Meeting Notes/Agenda: ${interviewContext.jd || "Not provided"}
        - User Context File: ${interviewContext.resume || "Not provided"}
        `;

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
            // Broadcast to Electron Overlay
            if (window.electronAPI?.sendAnswer) {
                window.electronAPI.sendAnswer(text);
            }
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
        }, 800);

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [transcript, isAutoMode, isLoading, isRecording, getAiAnswer]);

    // Detect if running in Electron (Desktop App)
    const isElectron = hasMounted && typeof window !== 'undefined' && (window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron;

    // --- SCREEN AUDIO CAPTURE (ELECTRON ONLY) ---
    const stopScreenAudio = useCallback(() => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
        }
        if (screenSourceRef.current) {
            screenSourceRef.current.disconnect();
            screenSourceRef.current = null;
        }
        setIsScreenAudioActive(false);
        console.log("[Screen Audio] Stopped");
    }, []);

    const toggleScreenAudio = async () => {
        if (!isElectron) return;

        if (isScreenAudioActive) {
            stopScreenAudio();
            window.electronAPI?.stopSystemAudioCapture();
        } else {
            console.log("[Screen Audio] Requesting capture...");
            const result = await window.electronAPI?.startSystemAudioCapture();
            console.log("[Screen Audio] Capture request result:", result);
            if (result && !result.success) {
                console.error("[Screen Audio] Capture request failed:", result.error);
                setError(result.error || "Failed to start screen capture.");
            }
        }
    };

    useEffect(() => {
        if (!isElectron) return;

        const cleanup = window.electronAPI?.onAudioSourceReady(async (sourceId: string) => {
            console.log("[Screen Audio] Source ID received:", sourceId);
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Internal audio routing not supported.");
                }
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        // @ts-expect-error: mandatory is non-standard but required for Electron desktop capture
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sourceId
                        }
                    },
                    video: {
                        // @ts-expect-error: mandatory is non-standard but required for Electron desktop capture
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sourceId
                        }
                    }
                });

                screenStreamRef.current = stream;
                setIsScreenAudioActive(true);

                // If recording is already active, connect this new stream to existing context
                if (isRecording && audioContextRef.current && analyserRef.current) {
                    try {
                        const screenSource = audioContextRef.current.createMediaStreamSource(stream);
                        screenSource.connect(analyserRef.current);
                        screenSourceRef.current = screenSource;
                        console.log("[Screen Audio] Stream mixed into active recording");
                    } catch (e: unknown) {
                        console.error("[Screen Audio] Failed to mix stream:", e as Error);
                    }
                }

                // Monitor for capture stop (user clicks "Stop Sharing" in OS)
                stream.getVideoTracks()[0].onended = () => {
                    console.log("[Screen Audio] Capture stopped by OS");
                    stopScreenAudio();
                };

            } catch (err: unknown) {
                console.error("[Screen Audio] Failed to get stream:", err as Error);
                setIsScreenAudioActive(false);
                setError("Internal audio routing failed (Permission or selection issue).");
            }
        });

        return () => {
            // onAudioSourceReady doesn't return a cleanup in some versions, check if it does
            if (typeof cleanup === 'function') (cleanup as () => void)();
        };
    }, [isElectron, isRecording, stopScreenAudio]);

    // --- DESKTOP STT (Groq Whisper with Silence Detection) ---
    const activeStreamsRef = useRef<MediaStream[]>([]);
    const lastGroqTranscriptRef = useRef<string>("");

    // BANNED_PHRASES - Only filter CLEAR hallucinations (YouTube artifacts, never real speech)
    const BANNED_PHRASES = [
        "please subscribe", "like and subscribe", "subscribe to",
        "thanks for watching", "thank you for watching", "thanks for watching",
        "thank you very much", "i hope you enjoyed", "bye bye",
        "thank you", "thanks", "thank you.",
        "copyright", "subtitles by", "captioned by",
        "[music]", "[applause]", "(music)", "(applause)"
    ];

    const processGroqAudio = async (audioBlob: Blob) => {
        try {
            // Groq is picky about types. Ensure it's marked as webm.
            if (audioBlob.size < 2000) {
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
                formData.append('prompt', 'This is an English professional meeting conversation.');
            } else if (langCode === 'ar') {
                formData.append('prompt', 'هذه محادثة اجتماع عمل باللغة العربية.');
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

                // Filter: too short (Speed Mode)
                if (wordCount < 1) {
                    return;
                }

                // Filter: banned phrases (Case-insensitive)
                if (BANNED_PHRASES.some(b => clean.includes(b))) {
                    console.log(`[Desktop STT] Filtered: banned phrase: "${newText}"`);
                    return;
                }

                // Extra safety: Filter single word "Thank you" even if slightly different
                if (clean === "thank you" || clean === "thanks") {
                    console.log(`[Desktop STT] Filtered: single word hallucination`);
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

                setTranscript(prev => {
                    const prevTrimmed = prev.trim();


                    // Simple check: if the last few words of the transcript match the start of the new text, skip the overlap
                    // This is more basic than the onresult deduplication because Groq text is usually 
                    // more complete and we want to preserve its accuracy.

                    // But if the entire newText is already at the end of the transcript, skip it.
                    if (prevTrimmed.endsWith(newText)) return prev;

                    const finalTranscript = (prev + " " + newText).trim();
                    return finalTranscript.slice(-MAX_TRANSCRIPT_LENGTH);
                });

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

            // 1. Get Microphone stream
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            });
            activeStreamsRef.current = [micStream];

            // 2. Initialize Audio Context & Analyser (Saved to Refs for mixing)
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // 3. Connect Microphone
            const micSource = audioContext.createMediaStreamSource(micStream);
            micSource.connect(analyser);
            micSourceRef.current = micSource;

            // 4. Connect Screen Audio (if already active)
            if (isScreenAudioActive && screenStreamRef.current) {
                try {
                    const screenSource = audioContext.createMediaStreamSource(screenStreamRef.current);
                    screenSource.connect(analyser);
                    screenSourceRef.current = screenSource;
                    console.log("[Desktop STT] Screen audio mixed at start");
                } catch (e) {
                    console.warn("[Desktop STT] Failed to mix screen audio at start:", e);
                }
            }

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            // VAD Parameters (Ultra-Low Latency Mode)
            const SPEECH_THRESHOLD = 12;        // Increased sensitivity for internal audio
            const SILENCE_DURATION = 800;       // 0.8s silence = End of sentence (Fast & snappy)
            const MIN_SPEECH_DURATION = 500;    // Allow short sentences
            const MAX_RECORDING_TIME = 15000;   // Force send after 15s

            let mediaRecorder: MediaRecorder | null = null;
            let audioChunks: Blob[] = [];
            let isSpeaking = false;
            let silenceStart = 0;
            let speechStart = 0;
            let lastLogTime = 0;

            const checkAudioLevel = () => {
                if (!activeStreamsRef.current.length && !screenStreamRef.current) return;

                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

                // Log every 2.5s to reduce console noise
                if (Date.now() - lastLogTime > 2500) {
                    console.log(`[VAD] Avg: ${average.toFixed(1)} | Mic: ${!!micStream} | Screen: ${isScreenAudioActive}`);
                    lastLogTime = Date.now();
                }

                if (average > SPEECH_THRESHOLD) {
                    // SPEECH DETECTED
                    silenceStart = 0;
                    if (!isSpeaking) {
                        isSpeaking = true;
                        speechStart = Date.now();
                        audioChunks = [];
                        console.log("[VAD] ⚡ Speech detected!");

                        // Create a mixed stream for the MediaRecorder
                        const dest = audioContext.createMediaStreamDestination();
                        micSource.connect(dest);
                        if (screenSourceRef.current) {
                            screenSourceRef.current.connect(dest);
                        }

                        // Use standard webm to avoid header issues with Whisper
                        const mimeType = 'audio/webm';
                        mediaRecorder = new MediaRecorder(dest.stream, { mimeType });
                        mediaRecorder.ondataavailable = (e) => {
                            if (e.data.size > 0) audioChunks.push(e.data);
                        };

                        // IMPORTANT: Start without timeslice to get a single valid blob at onstop
                        // This produces a much more stable WebM file for Groq
                        mediaRecorder.start();
                    } else {
                        // Check Max Duration
                        if (Date.now() - speechStart > MAX_RECORDING_TIME) {
                            console.log("[VAD] Max duration reached, forcing stop.");
                            stopAndProcess();
                        }
                    }
                } else {
                    // SILENCE
                    if (isSpeaking) {
                        if (silenceStart === 0) {
                            silenceStart = Date.now();
                        } else if (Date.now() - silenceStart > SILENCE_DURATION) {
                            console.log("[VAD] End of sentence (Silence detected).");
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
                        if (duration < MIN_SPEECH_DURATION) {
                            console.log(`[VAD] Skipping: Too short (${duration}ms)`);
                            audioChunks = [];
                            return;
                        }

                        if (audioChunks.length > 0) {
                            const fullAudio = new Blob(audioChunks, { type: 'audio/webm' });
                            console.log(`[VAD] Sending ${(fullAudio.size / 1024).toFixed(1)}KB...`);
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

    const stopDesktopSTT = useCallback(() => {
        if (screenSourceRef.current) {
            screenSourceRef.current.disconnect();
            screenSourceRef.current = null;
        }

        if (micSourceRef.current) {
            micSourceRef.current.disconnect();
            micSourceRef.current = null;
        }

        const audioContext = audioContextRef.current;
        if (audioContext) {
            audioContext.close();
            audioContextRef.current = null;
        }

        activeStreamsRef.current.forEach(stream => {
            stream.getTracks().forEach(track => track.stop());
        });
        activeStreamsRef.current = [];
        console.log("[Desktop STT] Stopped");
    }, []);

    // --- TOGGLE RECORDING (UNIFIED) ---
    const toggleRecording = async () => {
        if (isRecording) {
            // STOP
            setIsRecording(false);
            setIsAutoMode(false);

            // 1. Stop Browser Recognition
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch { }
            }

            // 2. Stop Desktop VAD (if running)
            if (isElectron) {
                stopDesktopSTT();
            }

            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            console.log("[Interview] Recording stopped");
            return;
        }

        // START
        setError(null);
        setTranscript("");
        setInterimTranscript("");

        try {
            // STEP 1: Always start Fast Live Transcript (Web Speech API)
            // This provides the immediate visual feedback the user wants
            if (recognitionRef.current) {
                try {
                    if (!isRecognitionActiveRef.current) {
                        recognitionRef.current.start();
                        isRecognitionActiveRef.current = true;
                        console.log("[Speech] Fast Live Engine started successfully");
                    }
                } catch (e: unknown) {
                    const err = e as Error;
                    if (err.name === 'InvalidStateError') {
                        isRecognitionActiveRef.current = true; // Sync state
                    } else {
                        console.error("[Speech] Failed to start Web Speech API:", err);
                        if (!isElectron) {
                            setError("Microphone access is already in use or failed.");
                        }
                    }
                }
            } else {
                console.warn("[Speech] Web Speech API not initialized.");
                if (!isElectron) {
                    setError("Your browser does not support Live Speech. Use Chrome or Edge.");
                }
            }

            // STEP 2: Desktop Only - Start High-Quality mixed audio STT
            if (isElectron) {
                await startDesktopSTT();
            }

            setIsRecording(true);
            setIsAutoMode(true);
            console.log("[Interview] Recording started (Dual-Engine Mode)");
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Failed to start recording:", error);
            setError("Could not access microphone.");
        }
    };

    // Initialize Speech Recognition (WEBSITE ONLY - not in Electron)
    useEffect(() => {
        // Skip Web Speech API in Electron - it doesn't work there and causes network errors
        // The new toggleRecording handles Web Speech API for both desktop and web.

        const win = typeof window !== 'undefined' ? window as unknown as {
            webkitSpeechRecognition?: new () => SpeechRecognition;
            SpeechRecognition?: new () => SpeechRecognition;
        } : null;

        if (!win) return;

        const SpeechRecognitionClass = win.webkitSpeechRecognition || win.SpeechRecognition;
        if (SpeechRecognitionClass) {
            try {
                recognitionRef.current = new SpeechRecognitionClass();
            } catch (e) {
                console.error("[Speech] Failed to create instances:", e);
                return;
            }
            const rec = recognitionRef.current;
            if (rec) {
                rec.continuous = true;
                rec.interimResults = true;
                rec.lang = interviewContext.lang.startsWith('ar') ? 'ar-EG' : interviewContext.lang;
                rec.maxAlternatives = 3;
            }
        }

        if (recognitionRef.current) {
            recognitionRef.current.onstart = () => {
                isRecognitionActiveRef.current = true;
                setSystemStatus(prev => ({ ...prev, mic: true }));
                setError(null);
                console.log("[Speech] Recognition started");
            };
        }

        if (recognitionRef.current) {
            recognitionRef.current.onend = () => {
                isRecognitionActiveRef.current = false;
                console.log("[Speech] Recognition ended, isRecording:", isRecording, "isAiSpeaking:", isAiSpeakingRef.current);
                // Auto-restart ONLY if we are supposed to be recording AND AI is NOT speaking
                if (isRecording && !isAiSpeakingRef.current) {
                    console.log("[Speech] Auto-restarting...");
                    // Use a small delay to prevent rapid restart loops
                    setTimeout(() => {
                        if (recognitionRef.current && isRecording && !isAiSpeakingRef.current && !isRecognitionActiveRef.current) {
                            try {
                                recognitionRef.current.start();
                                isRecognitionActiveRef.current = true;
                            } catch (err: unknown) {
                                const error = err as Error;
                                if (error.name !== 'InvalidStateError') {
                                    console.error("[Speech] Failed to restart:", error);
                                } else {
                                    isRecognitionActiveRef.current = true;
                                }
                            }
                        }
                    }, 300); // Slightly longer delay for stability
                }
            };
        }

        if (recognitionRef.current) {
            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
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

                            // Broadcast to Electron Overlay
                            if (window.electronAPI?.sendTranscript) {
                                window.electronAPI.sendTranscript(textToAdd);
                            }

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
                    // Also broadcast interim if possible for smoother UI
                    if (window.electronAPI?.sendTranscript) {
                        window.electronAPI.sendTranscript(interim);
                    }
                }
            };

            recognitionRef.current.onerror = (event: { error: string; }) => {
                console.log("[Speech] Error:", event.error);
                if (event.error === 'not-allowed') {
                    setError("Microphone access blocked.");
                }
                // Sync state on abort/end
                if (event.error === 'aborted' || event.error === 'audio-capture') {
                    isRecognitionActiveRef.current = false;
                }

                // Still try to restart after minor errors if recording is active
                if ((event.error === 'no-speech' || event.error === 'aborted') && isRecording && !isAiSpeakingRef.current) {
                    setTimeout(() => {
                        if (recognitionRef.current && isRecording && !isRecognitionActiveRef.current) {
                            try {
                                recognitionRef.current.start();
                                isRecognitionActiveRef.current = true;
                            } catch { /* ignore */ }
                        }
                    }, 400);
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

                // v21.1: Silence transient errors that are already handled by the retry logic
                if (event.error === 'aborted' || event.error === 'no-speech') {
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


    useEffect(() => {
        if (!window.electronAPI) return;

        const cleanup = window.electronAPI.onProcessOcr(async (data) => {
            console.log("[Scanner] Received OCR request:", data);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        // @ts-expect-error: mandatory is a non-standard Chrome property for desktop capture
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: data.sourceId
                        }
                    }
                });

                const video = document.createElement('video');
                video.srcObject = stream;

                // Wait for video to be ready
                await new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        video.play().then(resolve);
                    };
                });

                const canvas = document.createElement('canvas');
                const scale = data.scaleFactor || 1;

                // Set capture resolution higher for better OCR accuracy
                canvas.width = data.bounds.width * scale;
                canvas.height = data.bounds.height * scale;

                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // CRITICAL: Millimeter precision filters
                    ctx.filter = 'grayscale(100%) contrast(150%) brightness(110%)';
                    ctx.imageSmoothingEnabled = false;

                    ctx.drawImage(video,
                        data.bounds.x * scale, data.bounds.y * scale, data.bounds.width * scale, data.bounds.height * scale,
                        0, 0, canvas.width, canvas.height
                    );

                    const imageData = canvas.toDataURL('image/png', 1.0);

                    // Stop the stream
                    stream.getTracks().forEach(track => track.stop());
                    video.srcObject = null;

                    // Process with Tesseract optimized for tech/code
                    const worker = await createWorker('eng', 1, {
                        logger: m => console.log("[Scanner] Progress:", m.status, Math.round(m.progress * 100) + "%"),
                    });

                    // Fine-tune parameters for technical/code text extraction
                    await worker.setParameters({
                        tessedit_pageseg_mode: '3', // PSM_AUTO
                        preserve_interword_spaces: '1',
                    } as unknown as Record<string, string>);

                    const ret = await worker.recognize(imageData);
                    const text = ret.data.text.trim();
                    await worker.terminate();

                    if (text) {
                        console.log("[Scanner] Extracted text:", text);
                        setManualQuestion(text);
                        showToast("Text captured from screen!", "success");
                    } else {
                        showToast("No text detected in the area.", "info");
                    }
                }
            } catch (err) {
                console.error("[Scanner] OCR processing failed:", err);
                showToast("Failed to process screen capture.", "error");
            }
        });

        return cleanup;
    }, [showToast]);

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
                ? `${interviewContext.type} Meeting`
                : "Meeting Session";

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
            showToast("Meeting saved to history", "success");
        } catch (error) {
            console.error("Failed to save interview:", error);
            // Still navigate even if save fails
        } finally {
            setIsSaving(false);
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row gap-4 p-2 sm:p-4 pt-20 transition-colors duration-300 bg-gray-50 dark:bg-zinc-950 overflow-auto">
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

                            {/* Camera Toggle Button (Web Only) */}
                            {!isElectron && (
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
                            )}

                            {/* Screen Audio Toggle Button (Electron Only) */}
                            {isElectron && (
                                <button
                                    onClick={toggleScreenAudio}
                                    className={cn(
                                        "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm",
                                        isScreenAudioActive
                                            ? "bg-blue-500 text-white scale-110 shadow-blue-500/40"
                                            : "bg-black/40 text-white hover:bg-black/60 border border-white/10"
                                    )}
                                    title={isScreenAudioActive ? "Stop Internal Audio" : "Start Internal Audio Routing"}
                                >
                                    {isScreenAudioActive ? <Monitor size={26} strokeWidth={2.5} /> : <MonitorOff size={26} strokeWidth={2} />}
                                </button>
                            )}

                            {/* End Interview Button - Far Right */}
                            <button
                                onClick={handleEndInterview}
                                disabled={isSaving}
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                                title="End Meeting"
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

                        {/* Camera Icon Button (Web Only) */}
                        {!isElectron && (
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
                        )}

                        {/* Screen Audio Toggle Button (Electron Only) */}
                        {isElectron && (
                            <button
                                onClick={toggleScreenAudio}
                                className={cn(
                                    "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                                    isScreenAudioActive
                                        ? "bg-blue-500 text-white scale-110 shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900/30"
                                        : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                )}
                                title={isScreenAudioActive ? "Stop Internal Audio" : "Start Internal Audio Routing"}
                            >
                                {isScreenAudioActive ? <Monitor size={26} strokeWidth={2.5} /> : <MonitorOff size={26} strokeWidth={2} />}
                            </button>
                        )}

                        {/* End Interview Button - Far Right */}
                        <button
                            onClick={handleEndInterview}
                            disabled={isSaving}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                            title="End Meeting"
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
                            Mock Assessor
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAutoMode(!isAutoMode)}
                                className={cn(
                                    "gap-2 text-xs sm:text-sm transition-all duration-300",
                                    isAutoMode
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                        : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700"
                                )}
                            >
                                <Sparkles size={14} />
                                <span className="hidden sm:inline">{isAutoMode ? "Auto Answer ON" : "Auto Answer OFF"}</span>
                                <span className="sm:hidden">{isAutoMode ? "Auto ON" : "Auto OFF"}</span>
                            </Button>

                            <Button
                                onClick={async () => {
                                    if (window.electronAPI) {
                                        const res = await window.electronAPI.toggleScannerFrame();
                                        setIsScannerActive(res.active);
                                    }
                                }}
                                variant={isScannerActive ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "gap-2 text-xs sm:text-sm transition-all duration-300",
                                    isScannerActive
                                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                                        : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700"
                                )}
                            >
                                <Scan size={14} />
                                <span className="hidden sm:inline">{isScannerActive ? "Close Scanner" : "Screen Capture"}</span>
                                <span className="sm:hidden">{isScannerActive ? "Close" : "Scanner"}</span>
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
                        Context Loaded: User File ({interviewContext.resume.length} chars) | Agenda ({interviewContext.jd.length} chars)
                    </div>

                </div>
            </div>

        </div>
    );
}
