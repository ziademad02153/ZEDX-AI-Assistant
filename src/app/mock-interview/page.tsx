"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export default function MockInterviewPage() {
    const router = useRouter();
    const [isSetup, setIsSetup] = useState(false);
    
    // Context State
    const [jd, setJd] = useState("");
    const [resume, setResume] = useState("");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [interviewType, setInterviewType] = useState("Technical");
    const [questionCount, setQuestionCount] = useState(10);
    const [language, setLanguage] = useState("en-US");
    const [model, setModel] = useState("llama-3.1-8b-instant");

    // Interview State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsAsked, setQuestionsAsked] = useState<{ q: string, a: string }[]>([]);
    const [zedxText, setZedxText] = useState("Initializing interview...");
    const [userTranscript, setUserTranscript] = useState("");
    
    const [isSpeaking, setIsSpeaking] = useState(false); // Is ZEDX speaking?
    const [isListening, setIsListening] = useState(false); // Are we listening to user?
    const [audioLevel, setAudioLevel] = useState(0);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const finalTranscriptRef = useRef("");

    // Track latest state to avoid stale closures in event listeners and timeouts
    const stateRef = useRef({
        isListening,
        questionsAsked,
        currentQuestionIndex,
        userTranscript
    });

    useEffect(() => {
        stateRef.current = {
            isListening,
            questionsAsked,
            currentQuestionIndex,
            userTranscript
        };
    }, [isListening, questionsAsked, currentQuestionIndex, userTranscript]);

    // Initialize context from localStorage
    useEffect(() => {
        const _jd = localStorage.getItem("interview_context_jd") || "";
        const _resume = localStorage.getItem("interview_context_resume") || "";
        const _diff = localStorage.getItem("interview_context_difficulty") || "Intermediate";
        const _type = localStorage.getItem("interview_context_type") || "Technical";
        const _count = parseInt(localStorage.getItem("interview_context_question_count") || "10", 10);
        const _lang = localStorage.getItem("interview_context_lang") || "en-US";
        const _model = localStorage.getItem("selected_ai_model") || "llama-3.1-8b-instant";

        if (!_jd || !_resume) {
            router.push("/dashboard/new");
            return;
        }

        setJd(_jd);
        setResume(_resume);
        setDifficulty(_diff);
        setInterviewType(_type);
        setQuestionCount(_count);
        setLanguage(_lang);
        setModel(_model);
        setIsSetup(true);
    }, [router]);

    // Setup Webcam & Speech Recognition
    useEffect(() => {
        if (!isSetup) return;

        // 1. Setup Webcam
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                
                // Setup Audio Context for Mic Level indicator
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
                
                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;
                
                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);
                
                javascriptNode.onaudioprocess = () => {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    let values = 0;
                    const length = array.length;
                    for (let i = 0; i < length; i++) {
                        values += (array[i]);
                    }
                    const average = values / length;
                    setAudioLevel(average);
                };
            })
            .catch(err => console.error("Webcam error:", err));

        // 2. Setup Speech Recognition
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognitionClass) {
            const recognition = new SpeechRecognitionClass();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;
            
            recognition.onresult = (event: any) => {
                let interimTranscript = "";
                let hasValidSpeech = false;
                
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const result = event.results[i][0];
                    // Filter out obvious background noise (low confidence)
                    if (event.results[i].isFinal && result.confidence < 0.5) continue;
                    
                    if (event.results[i].isFinal) {
                        finalTranscriptRef.current += result.transcript;
                        hasValidSpeech = true;
                    } else {
                        interimTranscript += result.transcript;
                        if (result.transcript.trim().length > 3) hasValidSpeech = true;
                    }
                }
                
                const currentText = finalTranscriptRef.current + interimTranscript;
                setUserTranscript(currentText);

                // Reset Silence Timer
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                
                // If they spoke something meaningful, start the 3 second silence countdown
                if (currentText.trim().length > 0 && hasValidSpeech) {
                    silenceTimerRef.current = setTimeout(() => {
                        handleUserFinishedSpeaking(currentText);
                    }, 3000); // 3 seconds of silence = auto submit
                } else if (currentText.trim().length > 0) {
                    // Fallback for very short noises so it doesn't hang forever if it was actually speech
                    silenceTimerRef.current = setTimeout(() => {
                        handleUserFinishedSpeaking(currentText);
                    }, 6000);
                }
            };
            
            let fatalError = false;
            recognition.onerror = (event: any) => {
                console.warn("Speech error:", event.error);
                if (event.error === 'not-allowed' || event.error === 'audio-capture') {
                    fatalError = true;
                    alert("Microphone access denied or not found. Please check permissions.");
                }
            };
            recognition.onend = () => {
                // If we are still supposed to be listening, restart it (avoiding stale closure)
                if (stateRef.current.isListening && !fatalError) {
                    try { recognition.start(); } catch (e) {}
                }
            };
            
            recognitionRef.current = recognition;
        }

        // Start Interview
        generateNextQuestion(0, []);

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
            }
            if (audioRef.current) {
                audioRef.current.onended = null;
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isSetup]);

    const handleUserFinishedSpeaking = async (transcript: string) => {
        const { isListening: currentIsListening, questionsAsked: currentQuestions, currentQuestionIndex: currentIndex } = stateRef.current;
        
        if (!currentIsListening) return;
        setIsListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        const newHistory = [...currentQuestions];
        if (newHistory.length > 0) {
            newHistory[newHistory.length - 1].a = transcript;
        }
        setQuestionsAsked(newHistory);
        setUserTranscript(""); // Clear UI
        finalTranscriptRef.current = ""; // Reset stable transcript for next question

        // Generate next question
        await generateNextQuestion(currentIndex + 1, newHistory);
    };

    const generateNextQuestion = async (index: number, history: any[]) => {
        if (index >= questionCount) {
            setZedxText("The interview is complete. Generating your report...");
            speakText("The interview is complete. Generating your report...");
            setTimeout(() => {
                localStorage.setItem("interview_results", JSON.stringify(history));
                router.push("/dashboard/report"); // We will build this later
            }, 4000);
            return;
        }

        setZedxText("Thinking...");
        setIsSpeaking(true);

        // Determine if this question should focus on JD or Resume (50/50)
        const focusArea = index % 2 === 0 ? "Job Description" : "Resume";
        
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
        let nextQuestionText = "";

        if (index === 0) {
            nextQuestionText = langObj.q1;
        } else if (index === 1) {
            nextQuestionText = langObj.q2;
        } else {
            const previousQ = history[index - 1].q;
            const previousA = history[index - 1].a;
            
            const askedQuestions = history.map(h => h.q).join(" | ");
            const randomAngle = ["leadership skills", "problem solving", "technical depth", "past challenges", "teamwork and communication", "adaptability"][Math.floor(Math.random() * 6)];

            const prompt = `The candidate just answered your previous question ("${previousQ}") with: "${previousA}".
First, analyze their answer. Then, craft your next question.
You are a highly intelligent, conversational interviewer. Do NOT just read off a script. 
Either ask a smart follow-up question that probes deeper into what they just said, OR smoothly transition to a new topic focusing on their ${focusArea} (framed around ${randomAngle}).
Keep it conversational and natural.
CRITICAL RULE: DO NOT ask any of these previously asked questions again: [${askedQuestions}].
IMPORTANT: DO NOT ask the candidate if they have any questions for you. Only ask questions that test the candidate's qualifications.
Job Description Context: ${jd.substring(0, 500)}...
Resume Context: ${resume.substring(0, 500)}...`;

            try {
                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: model,
                        promptType: 'mock_interview',
                        promptContext: { interviewType, difficulty, language },
                        prompt
                    })
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.error?.message || "API request failed");
                }
                
                nextQuestionText = data.content;
            } catch (err) {
                console.error("AI Generation Failed:", err);
                nextQuestionText = "I apologize, but I have lost connection to my AI servers. Please check your Groq API key and rate limits.";
                // Optional: We could forcefully end the interview here
            }
        }
        
        // Save to history
        const newHistory = [...history, { q: nextQuestionText, a: "" }];
        setQuestionsAsked(newHistory);
        setCurrentQuestionIndex(index);
        
        // Play TTS
        await speakText(nextQuestionText);
    };

    const speakText = async (text: string) => {
        setIsSpeaking(true);
        // We set text empty until audio starts playing for perfect sync
        setZedxText(""); 

        try {
            const res = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!res.ok) throw new Error("TTS failed");

            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onplay = () => {
                // Sync text with audio start
                setZedxText(text);
            };

            audio.onended = () => {
                setIsSpeaking(false);
                // Start listening to user
                setIsListening(true);
                setUserTranscript("");
                if (recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch (e) {}
                }
            };

            audio.play();

        } catch (err) {
            console.error("TTS Error", err);
            // Fallback to browser TTS if ElevenLabs fails
            setZedxText(text);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            utterance.onend = () => {
                setIsSpeaking(false);
                setIsListening(true);
                if (recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch (e) {}
                }
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    const endInterview = () => {
        if (confirm("Are you sure you want to end the interview early? Your current progress will be saved.")) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            localStorage.setItem("interview_results", JSON.stringify(stateRef.current.questionsAsked));
            router.push("/dashboard/report");
        }
    };

    if (!isSetup) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-12 h-12" /></div>;

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
            {/* Top Bar */}
            <div className="w-full p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-4">
                    <Image
                        src="/zedx-logo.png"
                        alt="ZEDX-AI Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                    <div>
                        <h2 className="font-bold text-lg leading-none">ZEDX Interviewer</h2>
                        <p className="text-emerald-400 text-xs">Question {currentQuestionIndex + 1} of {questionCount}</p>
                    </div>
                </div>
                <Button onClick={endInterview} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <X className="mr-2 w-4 h-4" /> End Interview
                </Button>
            </div>

            {/* Main Center (Glowing Orb) */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-12 z-10">
                
                {/* AI Orb */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 flex items-center justify-center">
                    <motion.div 
                        animate={{ 
                            scale: isSpeaking ? [1, 1.1, 1] : 1,
                            opacity: isSpeaking ? [0.7, 1, 0.7] : 0.5
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500 rounded-full blur-[80px]"
                    ></motion.div>
                    
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-gray-900 to-black border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] z-10 overflow-hidden">
                        {isSpeaking ? (
                            <div className="flex gap-2 items-center h-12">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: ["20%", "100%", "20%"] }}
                                        transition={{ duration: Math.random() * 0.5 + 0.5, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-2 sm:w-3 bg-emerald-400 rounded-full"
                                    ></motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-emerald-500/50 text-6xl">Z</div>
                        )}
                    </div>
                </div>

                {/* AI Text Bubble */}
                <AnimatePresence mode="wait">
                    {zedxText && (
                        <motion.div 
                            key={zedxText}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
                        >
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-white/5 border-b-[10px] border-b-transparent hidden md:block"></div>
                            <p className="text-xl sm:text-2xl text-emerald-50 leading-relaxed">
                                {zedxText}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Section: Webcam & User Speech */}
            <div className="w-full p-6 flex items-end justify-between z-20 gap-6">
                
                {/* Webcam Box */}
                <div className="relative w-48 sm:w-64 rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-xl flex-shrink-0 aspect-[4/3]">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100" />
                    
                    {/* Mic Indicator inside webcam */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10">
                        <div className="flex items-center gap-2">
                            {isListening ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                            <span className="text-xs font-medium text-gray-300">{isListening ? "Listening..." : "Muted"}</span>
                        </div>
                        {/* Simple audio visualizer based on audioLevel */}
                        <div className="flex gap-1 h-3 items-end">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 bg-emerald-500 rounded-t-sm transition-all duration-75" style={{ height: isListening ? `${Math.min(100, Math.max(20, audioLevel * (i/2))) }%` : '20%' }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Transcript Bubble (Only shows when listening & speaking) */}
                <div className="flex-1 max-w-2xl justify-self-end">
                    <AnimatePresence>
                        {isListening && userTranscript && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-emerald-900/30 border border-emerald-500/30 backdrop-blur-md rounded-2xl p-4 text-emerald-100 text-lg shadow-lg"
                            >
                                {userTranscript}
                                <span className="animate-pulse ml-1">|</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-900/10 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
