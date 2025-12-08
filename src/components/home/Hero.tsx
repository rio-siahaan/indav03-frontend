"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Activity } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Hero() {
  return (
    <>
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-24 pb-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
              <Activity className="w-4 h-4 mr-2" />
              ✨ Analitik Berbasis AI
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-[#002B6A]">
              Jelajahi Kekuatan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002B6A] to-blue-600">
                Data BPS Sumut
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Rasakan cara baru berinteraksi dengan statistik. Ajukan pertanyaan, buat grafik, dan ekspor laporan menggunakan agen AI canggih kami.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/chat"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#002B6A] text-white rounded-full font-semibold text-lg hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Mulai Jelajahi
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
             <div className="relative w-full h-[500px] drop-shadow-2xl">
                <Image 
                  src="/Atlas_SMP_BIG_-_Sumatera_Utara.svg" 
                  alt="Map of Sumatera Utara" 
                  fill
                  className="object-contain"
                  priority
                />
             </div>
          </motion.div>
        </div>
      </header>

      {/* Stats Preview Section */}
      <section className="container mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#002B6A] rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="grid md:grid-cols-3 gap-8 relative z-10 text-center divide-y md:divide-y-0 md:divide-x divide-blue-800/50">
            <div className="p-4">
              <div className="text-5xl font-bold mb-2">33+</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">Kabupaten & Kota</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold mb-2">450+</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">Tabel Data</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">Ketersediaan AI</div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
