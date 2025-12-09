"use client";

import { useState, useEffect, Suspense } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import { useRouter, useSearchParams } from "next/navigation";
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

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
}

function ChatUI() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [processingTime, setProcessingTime] = useState<number | undefined>(
    undefined
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toolStatus, setToolStatus] = useState<string | null>(null); // Track tool usage
  const router = useRouter();
  const searchParams = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7860";

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle URL query param for conversation
  useEffect(() => {
    const convId = searchParams.get("c");
    if (convId && convId !== currentConversationId) {
      setCurrentConversationId(convId);
      fetchMessages(convId);
    } else if (!convId && currentConversationId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [searchParams]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        const uiMessages = data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.message
            .replace(/```json[\s\S]*?```/g, "")
            .replace(/\[\s*\{[\s\S]*?\}\s*\]/g, "")
            .replace(/```/g, "")
            .trim(),
          created_at: m.created_at,
        }));
        setMessages(uiMessages);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleSelectConversation = (id: string) => {
    router.push(`/chat?c=${id}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewConversation = () => {
    router.push("/chat");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus percakapan ini?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (currentConversationId === id) {
          router.push("/chat");
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    const tempId = Date.now().toString();
    const userMessage: Message = {
      id: tempId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let conversationId = currentConversationId;

      // 1. Create Conversation if not exists
      if (!conversationId) {
        const convRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: content.slice(0, 30) + "..." }),
        });

        if (convRes.ok) {
          const newConv = await convRes.json();
          conversationId = newConv.id;
          setCurrentConversationId(conversationId);
          setConversations((prev) => [newConv, ...prev]);
          router.push(`/chat?c=${conversationId}`);
        } else {
          throw new Error("Failed to create conversation");
        }
      }

      // 2. Save User Message to DB
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          role: "user",
          message: content,
        }),
      });

      // 3. Call AI Backend with Streaming
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          thread_id: conversationId,
        }),
      });

      if (!response.ok) throw new Error("AI Service Error");
      if (!response.body) throw new Error("No response body");

      // Create a placeholder for AI message
      const aiMsgId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Stream Reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";
      let finalUsage = { prompt_tokens: 0, completion_tokens: 0 };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;

            try {
              const data = JSON.parse(dataStr);

              if (data.type === "token") {
                aiContent += data.content;

                // Filter out JSON arrays and code blocks
                let cleanedContent = aiContent;
                cleanedContent = cleanedContent.replace(
                  /```json[\s\S]*?```/g,
                  ""
                );
                cleanedContent = cleanedContent.replace(
                  /\[\s*\{[\s\S]*?\}\s*\]/g,
                  ""
                );
                cleanedContent = cleanedContent.replace(/```/g, "");
                cleanedContent = cleanedContent.trim();

                // Update UI incrementally
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, content: cleanedContent } : m
                  )
                );
              }

              // Handle tool usage indicators
              else if (data.type === "tool_start") {
                const toolName = data.name;
                let statusMessage = "🤔 Sedang berpikir...";

                if (toolName === "rag_tool") {
                  statusMessage = "🔍 Mencari data di database...";
                } else if (toolName === "search_tool") {
                  statusMessage = "🌐 Mencari informasi di web...";
                } else if (toolName === "rag_excel_tool") {
                  statusMessage = "📊 Membuat file Excel...";
                }

                setToolStatus(statusMessage);
              } else if (data.type === "tool_end") {
                setToolStatus(null); // Clear status when tool finishes
              } else if (data.type === "usage") {
                const usageData = data.content;
                finalUsage = usageData; // Capture for saving
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, usage: usageData } : m
                  )
                );
              } else if (data.type === "error") {
                const errorContent = data.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, content: errorContent } : m
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }

      // Clear tool status
      setToolStatus(null);

      // 4. Save Final AI Message to DB
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          role: "assistant",
          message: aiContent,
          inputToken: finalUsage.prompt_tokens,
          outputToken: finalUsage.completion_tokens,
        }),
      });
    } catch (error) {
      console.error("Error in chat flow:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Maaf, terjadi kesalahan jaringan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setToolStatus(null);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        deletingId={deletingId}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          conversationId={currentConversationId}
          rateLimit={rateLimit}
          toolStatus={toolStatus}
        />
      </main>
    </div>
  );
}

export default function ChatLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatUI />
    </Suspense>
  );
}
