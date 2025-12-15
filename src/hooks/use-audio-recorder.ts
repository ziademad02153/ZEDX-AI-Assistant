"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioRecorderProps {
    onTranscript: (text: string) => void;
    language?: string;
}

export function useAudioRecorder({ onTranscript, language = "en" }: UseAudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const isRecordingRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const processAudio = useCallback(async (blob: Blob) => {
        if (blob.size < 1000) return;

        const formData = new FormData();
        formData.append("file", blob, "audio.webm");
        formData.append("model", "whisper-large-v3");
        formData.append("language", language.split("-")[0]);

        try {
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                console.error("Transcription failed:", await response.text());
                return;
            }

            const data = await response.json();
            if (data.text && data.text.trim()) {
                onTranscript(data.text.trim());
            }
        } catch (err) {
            console.error("Transcription error:", err);
        }
    }, [language, onTranscript]);

    const startSlice = useCallback(() => {
        if (!isRecordingRef.current || !mediaRecorderRef.current) return;

        chunksRef.current = [];
        try {
            mediaRecorderRef.current.start();

            timerRef.current = setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                }
            }, 6000);
        } catch (e) {
            console.error("Error starting slice:", e);
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            mediaRecorderRef.current = recorder;

            isRecordingRef.current = true;
            setIsRecording(true);
            setError(null);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                if (chunksRef.current.length > 0) {
                    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                    processAudio(blob);
                }

                if (isRecordingRef.current) {
                    startSlice();
                }
            };

            startSlice();

        } catch (err: any) {
            console.error("Error starting microphone:", err);
            setError("Microphone access denied or not supported.");
            setIsRecording(false);
        }
    }, [startSlice, processAudio]);

    const stopRecording = useCallback(() => {
        isRecordingRef.current = false;
        setIsRecording(false);

        if (timerRef.current) clearTimeout(timerRef.current);

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (isRecordingRef.current) stopRecording();
        };
    }, [stopRecording]);

    return {
        isRecording,
        error,
        startRecording,
        stopRecording
    };
}
