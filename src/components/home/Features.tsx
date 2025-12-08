"use client";

import { Database, MessageSquare, BarChart3, Search, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Database className="h-6 w-6" />,
    title: "Data Komprehensif",
    description: "Akses jutaan titik data dari BPS Sumatera Utara langsung melalui pertanyaan bahasa alami.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Data Terbaru",
    description: "Data yang terbaru dapat diakses langsung melalui pertanyaan bahasa alami.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Konteks Cerdas",
    description: "Didukung oleh AI canggih, agen kami memahami konteks dan memberikan wawasan analitis mendalam.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Pencarian Web",
    description: "Beralih secara mulus ke pencarian web real-time ketika data tidak tersedia di database.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6" />,
    title: "Ekspor Excel",
    description: "Butuh data mentah? Ekspor dataset atau hasil query ke Excel dengan satu perintah.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Aman & Andal",
    description: "Dibangun dengan Supabase dan Qdrant untuk keamanan tingkat enterprise dan pengambilan data super cepat.",
    color: "bg-red-100 text-red-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-6 py-24 bg-gray-50/50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-[#002B6A]">Semua yang Anda Butuhkan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Agen kami menggabungkan kekuatan Model Bahasa Besar dengan data statistik yang presisi untuk memberikan wawasan yang akurat dan dapat ditindaklanjuti.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
          >
            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
