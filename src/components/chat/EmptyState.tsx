"use client";

import { Bot, Sparkles, BarChart3, Search } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onQuestionClick: (question: string) => void;
  userName?: string;
}

export default function EmptyState({
  onQuestionClick,
  userName,
}: EmptyStateProps) {
  const questions = [
    {
      icon: <BarChart3 className="w-5 h-5 text-green-600" />,
      text: "Ekspor data Indeks Ketahanan Gender Sumut tahun 2021 sampai 2023.",
      color: "bg-green-50 border-green-100 hover:border-green-300",
    },
    {
      icon: <Search className="w-5 h-5 text-blue-600" />,
      text: "Berapa jumlah penduduk di Sumatera Utara tahun 2025?",
      color: "bg-blue-50 border-blue-100 hover:border-blue-300",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      text: "Siapa kepala dan alamat dari BPS Sumatera Utara?",
      color: "bg-purple-50 border-purple-100 hover:border-purple-300",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-[#002B6A] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/20">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Halo, {userName || "Sobat Data"}! 👋
        </h2>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Saya asisten AI BPS Sumatera Utara. Ada yang bisa saya bantu terkait
          data statistik hari ini?
        </p>
      </motion.div>

      <div className="grid gap-4 w-full">
        {questions.map((q, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            onClick={() => onQuestionClick(q.text)}
            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md ${q.color} group`}
          >
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              {q.icon}
            </div>
            <span className="font-medium text-gray-700 group-hover:text-gray-900">
              {q.text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
