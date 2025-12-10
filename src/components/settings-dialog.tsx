"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Moon, Sun, Volume2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const [apiKey, setApiKey] = useState("");
    const [groqKey, setGroqKey] = useState("");
    const [provider, setProvider] = useState("google");
    const [customModel, setCustomModel] = useState("");
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    const fetchModels = async () => {
        if (!apiKey || provider !== "google") return;
        setIsLoadingModels(true);
        try {
            const res = await fetch("/api/list-models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey })
            });
            const data = await res.json();
            if (data.models) {
                setAvailableModels(data.models);
                alert(`Found ${data.models.length} models!`);
            } else {
                alert("Could not fetch models: " + (data.error?.message || "Unknown error"));
            }
        } catch (e) {
            console.error("Fetch models failed", e);
            alert("Fetch failed. See console.");
        } finally {
            setIsLoadingModels(false);
        }
    };

    const [voiceSpeed, setVoiceSpeed] = useState(1.1);

    useEffect(() => {
        if (open) {
            // Load settings when dialog opens
            setApiKey(localStorage.getItem("gemini_api_key") || "");
            setGroqKey(localStorage.getItem("groq_api_key") || "");
            setProvider(localStorage.getItem("gemini_api_provider") || "google");
            setCustomModel(localStorage.getItem("gemini_custom_model") || "");

            const savedSpeed = localStorage.getItem("tts_speed");
            if (savedSpeed) setVoiceSpeed(parseFloat(savedSpeed));
        }
    }, [open]);

    const saveSettings = () => {
        localStorage.setItem("gemini_api_key", apiKey);
        if (groqKey) localStorage.setItem("groq_api_key", groqKey);
        localStorage.setItem("gemini_api_provider", provider);
        if (customModel) localStorage.setItem("gemini_custom_model", customModel);
        else localStorage.removeItem("gemini_custom_model");

        localStorage.setItem("tts_speed", voiceSpeed.toString());
        // Theme is saved immediately on toggle
        onOpenChange(false);
        // Dispatch a custom event so other components can react if needed
        window.dispatchEvent(new Event("settingsChanged"));
    };



    const resetAppData = () => {
        if (confirm("Are you sure? This will delete your API Key, Resume, and History. This cannot be undone.")) {
            localStorage.clear();
            window.location.href = "/";
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
            <div className={cn("p-6 rounded-2xl shadow-xl w-full max-w-md transition-colors border bg-white text-gray-900 border-gray-200")}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="text-gray-500" /> Settings
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>X</Button>
                </div>

                <div className="space-y-6">
                    {/* API Key Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium opacity-70">AI Provider & Key</label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <select
                                    className={cn("w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white border-gray-300")}
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                >
                                    <option value="google">Google</option>
                                    <option value="openai">OpenAI</option>
                                    <option value="grok">Grok</option>
                                    <option value="openrouter">OpenRouter</option>
                                </select>
                                <input
                                    type="password"
                                    placeholder={
                                        provider === "google" ? "AIzaSy..." :
                                            provider === "openai" ? "sk-..." :
                                                "sk-or-..."
                                    }
                                    className={cn("w-2/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm bg-white border-gray-300")}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    value={apiKey}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium opacity-70 whitespace-nowrap">Model:</span>
                                {provider === "google" ? (
                                    <div className="w-full flex gap-2">
                                        <select
                                            className={cn("w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono bg-white border-gray-300")}
                                            value={customModel}
                                            onChange={(e) => setCustomModel(e.target.value)}
                                        >
                                            <option value="">Default (Auto-Fallback)</option>
                                            {availableModels.length > 0 ? (
                                                availableModels.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="gemini-1.5-flash-001">Gemini 1.5 Flash (v1beta)</option>
                                                    <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                                                    <option value="gemini-pro">Gemini Pro (Legacy)</option>
                                                </>
                                            )}
                                        </select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={fetchModels}
                                            disabled={!apiKey || isLoadingModels}
                                            title="Check available models"
                                        >
                                            {isLoadingModels ? <span className="animate-spin">↻</span> : <RefreshCw size={14} />}
                                        </Button>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        className={cn("w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono bg-white border-gray-300")}
                                        placeholder="e.g. gpt-4-turbo"
                                        value={customModel}
                                        onChange={(e) => setCustomModel(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <p className="text-xs opacity-50">
                            {provider === "google" && <span>Get free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-500 hover:underline">Google AI Studio</a></span>}
                            {provider === "openai" && <span>Get key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-500 hover:underline">OpenAI Platform</a></span>}
                            {provider === "grok" && <span>Get key from <a href="https://console.x.ai/" target="_blank" className="text-blue-500 hover:underline">xAI Console</a></span>}
                            {provider === "openrouter" && <span>Get key from <a href="https://openrouter.ai/keys" target="_blank" className="text-blue-500 hover:underline">OpenRouter</a></span>}
                        </p>
                    </div>

                    {/* Groq Whisper Key Section */}
                    <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-sm font-medium opacity-70 flex items-center justify-between">
                            <span>Groq API Key (for Speech)</span>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
                        </label>
                        <input
                            type="password"
                            placeholder="gsk_..."
                            className={cn("w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm bg-white border-gray-300")}
                            onChange={(e) => setGroqKey(e.target.value)}
                            value={groqKey}
                        />
                        <p className="text-xs opacity-50">
                            Required for high-accuracy transcription. Get free key from <a href="https://console.groq.com/keys" target="_blank" className="text-blue-500 hover:underline">Groq Console</a>.
                        </p>
                    </div>

                    {/* Appearance Removed */}

                    {/* Voice Speed */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Volume2 size={18} />
                                <span className="font-medium">Voice Speed</span>
                            </div>
                            <span className="text-xs font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{voiceSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={voiceSpeed}
                            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                            className="w-full accent-green-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs opacity-50">
                            <span>Slow</span>
                            <span>Normal</span>
                            <span>Fast</span>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="destructive"
                            className="w-full gap-2"
                            onClick={resetAppData}
                        >
                            <RefreshCw size={16} /> Reset App Data
                        </Button>
                        <p className="text-[10px] text-center mt-2 opacity-50">Clears API Key, Resume, and History.</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="gradient" onClick={saveSettings}>Save & Close</Button>
                </div>
            </div>
        </div>
    );
}
