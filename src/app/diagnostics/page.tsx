"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DiagnosticsPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [micStatus, setMicStatus] = useState("Untested");
    const [apiStatus, setApiStatus] = useState("Untested");
    const [storageStatus, setStorageStatus] = useState("Untested");

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const testStorage = () => {
        try {
            localStorage.setItem("test_key", "test_value");
            const val = localStorage.getItem("test_key");
            if (val === "test_value") {
                setStorageStatus("PASS");
                addLog("Storage: Read/Write OK");
            } else {
                setStorageStatus("FAIL");
                addLog("Storage: Read Mismatch");
            }
        } catch (e: any) {
            setStorageStatus("FAIL");
            addLog(`Storage Error: ${e.message}`);
        }
    };

    const testMic = () => {
        setMicStatus("Testing...");
        addLog("Requesting Mic Permission...");
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setMicStatus("PASS");
                addLog("Mic: Permission Granted");
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(err => {
                setMicStatus("FAIL");
                addLog(`Mic Error: ${err.message}`);
            });
    };

    const testApi = async () => {
        setApiStatus("Testing...");
        const apiKey = localStorage.getItem("gemini_api_key");
        if (!apiKey) {
            setApiStatus("FAIL (No Key)");
            addLog("API: No Key found in localStorage");
            return;
        }

        const MODELS = [
            "gemini-2.0-flash-lite-preview-02-05",
            "gemini-2.0-flash-lite",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro"
        ];

        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);

            for (const modelName of MODELS) {
                try {
                    addLog(`API: Trying ${modelName}...`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent("Ping");
                    const response = await result.response;
                    const text = response.text();
                    if (text) {
                        setApiStatus(`PASS (${modelName})`);
                        addLog(`API: Success with ${modelName}! Response: ${text}`);
                        localStorage.setItem("gemini_working_model", modelName);
                        return;
                    }
                } catch (e: any) {
                    addLog(`API: Failed ${modelName} - ${e.message}`);
                }
            }
            setApiStatus("FAIL (All Models)");
            addLog("API: All models failed.");
        } catch (e: any) {
            setApiStatus("FAIL");
            addLog(`API Error: ${e.message}`);
        }
    };

    const checkResume = () => {
        const resume = localStorage.getItem("interview_context_resume");
        if (resume && resume.length > 50) {
            addLog(`Resume: FOUND (${resume.length} chars). First 50 chars: ${resume.substring(0, 50)}...`);
        } else {
            addLog("Resume: MISSING or TOO SHORT. Please go to 'New Interview' and paste your resume.");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-6 text-red-600">Emergency Diagnostics</h1>

            <div className="space-y-4">
                <div className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                    <span>1. Local Storage</span>
                    <div className="flex gap-4 items-center">
                        <span className="font-bold">{storageStatus}</span>
                        <Button onClick={testStorage} size="sm">Test</Button>
                    </div>
                </div>

                <div className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                    <span>2. Microphone Access</span>
                    <div className="flex gap-4 items-center">
                        <span className="font-bold">{micStatus}</span>
                        <Button onClick={testMic} size="sm">Test</Button>
                    </div>
                </div>

                <div className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                    <span>3. Gemini API Connection</span>
                    <div className="flex gap-4 items-center">
                        <span className="font-bold">{apiStatus}</span>
                        <Button onClick={testApi} size="sm">Test</Button>
                    </div>
                </div>

                <div className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                    <span>4. Resume Data Check</span>
                    <div className="flex gap-4 items-center">
                        <Button onClick={checkResume} size="sm" variant="outline">Check Resume</Button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold mb-2">Logs:</h3>
                <div className="bg-black text-green-400 p-4 rounded h-64 overflow-y-auto text-xs font-mono">
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
            </div>
        </div>
    );
}
