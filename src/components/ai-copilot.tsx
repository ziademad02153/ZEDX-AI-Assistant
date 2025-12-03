"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Send, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiCopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "ai", content: string }[]>([
        { role: "ai", content: "Hello! I'm your silent interview copilot. Ask me anything, and I'll help you discreetly." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const apiKey = localStorage.getItem("gemini_api_key");
            const provider = localStorage.getItem("gemini_api_provider") || "google";

            if (!apiKey) {
                setMessages(prev => [...prev, { role: "ai", content: "Please set your API Key in the settings first." }]);
                return;
            }

            // Use the unified server-side API
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider,
                    apiKey,
                    model: provider === "google" ? "gemini-1.5-flash" : undefined, // Default fast model for chat
                    messages: [
                        { role: "system", content: "You are a helpful interview assistant. Keep answers short, direct, and helpful." },
                        ...messages, // Include history for context
                        { role: "user", content: userMsg }
                    ]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to get response");
            }

            const responseText = data.content;

            setMessages(prev => [...prev, { role: "ai", content: responseText }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-96 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
                            <Sparkles size={16} className="text-yellow-400" />
                            AI Copilot
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10" onClick={() => setIsOpen(false)}>
                            <X size={14} />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-3 py-2 text-xs md:text-sm leading-relaxed shadow-sm",
                                    m.role === "user"
                                        ? "bg-blue-500 text-white rounded-tr-none"
                                        : "bg-white/80 dark:bg-zinc-800/80 text-gray-800 dark:text-gray-200 rounded-tl-none backdrop-blur-md"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/50 dark:bg-zinc-800/50 rounded-2xl px-3 py-2 rounded-tl-none">
                                    <Loader2 size={16} className="animate-spin text-gray-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white/5 border-t border-white/10">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-white/50 dark:bg-black/50 border border-white/20 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-500"
                                placeholder="Ask secretly..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 top-1 h-7 w-7 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                            >
                                <Send size={12} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "rounded-full h-14 w-14 shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-md",
                    isOpen
                        ? "bg-red-500/80 hover:bg-red-600/80 text-white rotate-90"
                        : "bg-white/20 dark:bg-black/40 hover:bg-white/40 text-gray-900 dark:text-white animate-pulse"
                )}
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} className="text-yellow-400" />}
            </Button>
        </div>
    );
}
