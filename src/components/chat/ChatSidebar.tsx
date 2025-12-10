"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  deletingId: string | null;
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  setIsOpen,
  deletingId,
}: ChatSidebarProps) {
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full bg-white border-r border-gray-200 shadow-xl md:shadow-none transition-all duration-300 ease-in-out",
          isOpen
            ? "w-72 translate-x-0"
            : "w-0 -translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden"
        )}
        initial={false}
        animate={{ width: isOpen ? 288 : 0 }}
      >
        <div className={`${isOpen ? "flex flex-col h-full w-72" : "hidden"}`}>
          {" "}
          {/* Fixed width container to prevent content squishing */}
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[#002B6A]">
              <Image
                src="/logo-bps.webp"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span>BPS Assistant</span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#002B6A] text-white rounded-xl hover:bg-blue-900 transition-all shadow-md hover:shadow-lg group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="font-medium">Percakapan Baru</span>
            </button>
          </div>
          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-10 px-4">
                Belum ada riwayat percakapan. Mulai baru sekarang!
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors relative",
                      currentConversationId === conv.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      deletingId === conv.id &&
                        "opacity-50 pointer-events-none bg-red-50"
                    )}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium truncate flex-1">
                      {conv.title || "Percakapan Baru"}
                    </span>

                    {deletingId === conv.id ? (
                      <div className="p-1.5">
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-md transition-all"
                        title="Hapus percakapan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {/* User Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {session?.user?.name || "Pengguna"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {session?.user?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Button (Visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-40 p-2 bg-white border border-gray-200 shadow-md rounded-lg hover:bg-gray-50 text-gray-600 md:hidden"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-40 p-2 bg-white border border-gray-200 shadow-md rounded-r-lg hover:bg-gray-50 text-gray-600 hidden md:flex items-center justify-center transition-all duration-300",
          isOpen
            ? "left-72 top-1/2 -translate-y-1/2 translate-x-0"
            : "left-0 top-1/2 -translate-y-1/2"
        )}
        style={{ width: "24px", height: "48px" }}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </>
  );
}
