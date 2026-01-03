"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ModelChatProps {
    modelId: string;
    modelName: string;
    modelLogo: string;
}

export function ModelChat({ modelId, modelName, modelLogo }: ModelChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: `Hello! I'm ${modelName}. Ask me anything to test my capabilities before your interview.` }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset chat when model changes
    useEffect(() => {
        setMessages([
            { role: "assistant", content: `Hello! I'm ${modelName}. Ask me anything to test my capabilities before your interview.` }
        ]);
    }, [modelId, modelName]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Simulate API latency for "realism" (since we don't have a dedicated test endpoint yet)
            // In a real implementation, this would hit /api/chat-test or similar
            await new Promise(resolve => setTimeout(resolve, 1500));

            let responseContent = `I am running on **${modelName}**. I can help you practice for your interview!`;

            if (input.toLowerCase().includes("job")) {
                responseContent = "I can analyze job descriptions to find key requirements.";
            } else if (input.toLowerCase().includes("code")) {
                responseContent = "I can help you optimize your code and explain complex algorithms.";
            }

            const aiMessage = { role: "assistant" as const, content: responseContent };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered a connection error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[400px] border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/40 backdrop-blur-xl overflow-hidden shadow-xl dark:shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-black p-1 flex items-center justify-center border border-gray-100 dark:border-white/10">
                        <img
                            src={modelLogo}
                            alt={modelName}
                            className={cn("w-full h-full object-contain", modelLogo.includes('openai') && "dark:invert")}
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Test {modelName}
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </h3>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setMessages([{ role: "assistant", content: `Hello! I'm ${modelName}. Ready to help.` }])}
                >
                    <RefreshCw size={14} />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex items-start gap-3 max-w-[85%]",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === "user" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/70"
                            )}>
                                {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-emerald-600 text-white rounded-tr-sm"
                                    : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-tl-sm"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-xs text-gray-400 ml-12"
                        >
                            <Loader2 size={12} className="animate-spin" />
                            {modelName} is typing...
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={`Message ${modelName}...`}
                        className="w-full bg-white dark:bg-black/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                    <Button
                        size="icon"
                        className="absolute right-1.5 h-8 w-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                    >
                        <Send size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
