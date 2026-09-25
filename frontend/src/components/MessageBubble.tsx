import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import { ChatMessage } from "@/types/chat";

export default function MessageBubble({ role, content }: ChatMessage) {
    const isUser = role === "user";

    return (
        <div className={`flex items-end gap-3 animate-message-in ${isUser ? "flex-row-reverse" : ""}`}>
            {isUser ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                    U
                </div>
            ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                    <Sparkles size={15} className="text-white" />
                </div>
            )}

            <div
                className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${isUser
                    ? "max-w-[70%] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_4px_24px_rgba(99,102,241,0.35)] rounded-br-md"
                    : "max-w-[90%] glass-panel text-slate-100 rounded-bl-md"
                    }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">{content}</p>
                ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-table:my-2 prose-headings:my-3 prose-strong:text-white prose-a:text-cyan-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}