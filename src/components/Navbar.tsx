"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Title */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-bps.webp"
              alt="Logo BPS"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-lg tracking-wide hidden sm:block text-[#002B6A]">
              BADAN PUSAT STATISTIK
            </span>
          </Link>

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-6">
            <a
              href="/#features"
              className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block text-[#002B6A]"
            >
              Fitur
            </a>
            {session ? (
              <div className="relative flex">
                <a
                  href="/chat"
                  className="flex items-center gap-2 text-[#002B6A] hover:bg-gray-100 px-3 py-2 rounded-full bg-[#002B6A] text-white hover:text-black transition-colors"
                >
                  <span className="font-medium text-sm">Percakapan</span>
                </a>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-[#002B6A] hover:bg-gray-100 px-3 py-2 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">
                    {session.user?.name}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-blue-600 transition-colors text-[#002B6A]"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#002B6A] text-white rounded-full text-sm font-medium hover:bg-blue-900 transition-all"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
