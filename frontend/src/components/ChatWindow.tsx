"use client";
import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "@/lib/api";
import { ChatMessage } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import { Sparkles, MessageCircle, SendHorizontal } from "lucide-react";

const MAX_CHARS = 2000;
const SUGGESTIONS = [
    "What's the latest AI news today?",
    "Explain how tool calling works",
    "Current price of Bitcoin",
    "Summarize today's top headlines",
];

export default function ChatWindow() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null)


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [input]);

    async function handleSend(overrideText?: string) {
        const text = (overrideText ?? input).trim();
        if (!text) return;

        const userMessage: ChatMessage = { role: "user", content: text };
        const updatedHistory = [...messages, userMessage];

        setMessages(updatedHistory);
        setInput("");
        setLoading(true);

        try {
            const response = await sendChatMessage(text, messages);
            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: response.reply,
            };
            setMessages([...updatedHistory, assistantMessage]);

        } catch (error) {
            console.error("Failed to get response:", error);
            const errorMessage: ChatMessage = {
                role: "assistant",
                content: "Something went wrong. Please try again.",
            };
            setMessages([...updatedHistory, errorMessage]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
    const nearLimit = input.length > MAX_CHARS * 0.9;
    return (
        <div className="bg-mesh h-full flex justify-center text-slate-100">
            <div className="flex flex-col w-full max-w-4xl h-full">
                <header className="glass-panel mx-4 mt-4 rounded-2xl px-5 py-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-shimmer text-base font-semibold">AI Assistant</h1>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="status-dot" />
                            Online
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 border border-white/10">
                                <MessageCircle size={28} className="text-indigo-300" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-slate-100">How can I help you today?</h2>
                                <p className="text-sm text-slate-400 mt-1">Ask me anything — I can search the web for current info.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleSend(s)}
                                        className="glass-panel rounded-xl px-3 py-2.5 text-xs text-slate-300 text-left hover:border-indigo-400/40 hover:text-white transition"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <MessageBubble key={index} role={msg.role} content={msg.content} />
                    ))}

                    {loading && (
                        <div className="flex items-end gap-3 animate-message-in">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                                <Sparkles size={15} className="text-white" />
                            </div>
                            <div className="glass-panel rounded-2xl rounded-bl-md px-4 py-3">
                                <span className="flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="glass-panel mx-4 mb-4 rounded-2xl px-4 py-3">
                    <div className="input-glow flex items-end gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-40"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none shadow-[0_0_16px_rgba(99,102,241,0.5)] hover:shadow-[0_0_24px_rgba(99,102,241,0.7)] transition"
                        >
                            <SendHorizontal size={16} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1">
                        <p className="text-[11px] text-slate-500">AI can make mistakes. Verify important information.</p>
                        <span className={`text-[11px] ${nearLimit ? "text-red-400" : "text-slate-500"}`}>
                            {input.length}/{MAX_CHARS}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}


