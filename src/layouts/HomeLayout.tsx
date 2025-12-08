"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Footer from "@/components/Footer";

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-white text-[#002B6A] overflow-x-hidden font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
