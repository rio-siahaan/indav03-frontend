"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import RateLimitIndicator from "./RateLimitIndicator";

import { RateLimitInfo } from "@/types/rate-limit";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  conversationId: string | null;
  rateLimit?: RateLimitInfo | null;
  toolStatus?: string | null;
}

export default function ChatArea({
  messages,
  isLoading,
  onSendMessage,
  conversationId,
  rateLimit,
  toolStatus,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, toolStatus]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {!conversationId || messages.length === 0 ? (
          <EmptyState
            onQuestionClick={(text) => setInput(text)}
            userName={session?.user?.name || undefined}
          />
        ) : (
          <>
            {messages.map((m) => {
              // Skip rendering AI messages with empty content
              if (m.role === "assistant" && !m.content.trim()) {
                return null;
              }

              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex w-full max-w-4xl mx-auto gap-4",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-[#002B6A] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative px-5 py-3.5 max-w-[85%] md:max-w-[75%] shadow-sm",
                      m.role === "user"
                        ? "bg-[#002B6A] text-white rounded-2xl rounded-tr-sm"
                        : "bg-gray-50 text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                    )}
                  >
                    <div
                      className={cn(
                        "prose prose-sm max-w-none break-words",
                        m.role === "user" ? "prose-invert" : ""
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors cursor-pointer"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    {m.role === "assistant" && m.usage && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-400 flex gap-3 font-mono">
                        <span>In: {m.usage.prompt_tokens}</span>
                        <span>Out: {m.usage.completion_tokens}</span>
                        <span className="font-medium text-gray-500">
                          Total: {m.usage.total_tokens}
                        </span>
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1 border border-blue-200">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tool Status Indicator */}
            {toolStatus && (
              <div className="flex w-full max-w-4xl mx-auto gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#002B6A] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-blue-50 border border-blue-200 px-5 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <p className="text-sm text-blue-700 font-medium animate-pulse">
                    {toolStatus}
                  </p>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !toolStatus && (
              <div className="flex w-full max-w-4xl mx-auto gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#002B6A] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya sesuatu tentang data BPS Provinsi Sumatera Utara"
              className="flex-1 max-h-[200px] min-h-[44px] py-2.5 px-2 bg-transparent border-none focus:ring-0 resize-none text-gray-800 placeholder:text-gray-400 leading-relaxed scrollbar-thin scrollbar-thumb-gray-300"
              rows={1}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm",
                input.trim() && !isLoading
                  ? "bg-[#002B6A] text-white hover:bg-blue-900 hover:scale-105 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <StopCircle className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          <div className="mt-2 space-y-1">
            <RateLimitIndicator rateLimit={rateLimit} />
            <p className="text-xs text-gray-400 text-center">
              AI dapat membuat kesalahan. Mohon verifikasi informasi penting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
