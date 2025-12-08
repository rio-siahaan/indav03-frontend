"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Chrome, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const {push} = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      callbackUrl,
      redirect : false,
    })

    if (res?.error) {
      setError("Email atau password Anda salah");
    } else {
      setSuccess(true);
      push(callbackUrl)
    }

    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-white text-[#002B6A] overflow-hidden font-sans flex items-center justify-center relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-bps.webp"
                alt="Logo BPS"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#002B6A] mb-2">Selamat Datang Kembali</h1>
            <p className="text-gray-600 text-sm">Masuk untuk mengakses Data BPS Sumut</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-600 text-sm"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Login berhasil! Mengalihkan...
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#002B6A] focus:outline-none transition-all duration-300 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                  emailFocused || email
                    ? "-top-2.5 text-xs bg-white px-2 text-[#002B6A] font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
              >
                Alamat Email
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-[#002B6A] focus:outline-none transition-all duration-300 peer"
                placeholder=" "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#002B6A] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <label
                htmlFor="password"
                className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                  passwordFocused || password
                    ? "-top-2.5 text-xs bg-white px-2 text-[#002B6A] font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
              >
                Kata Sandi
              </label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#002B6A] hover:underline">
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full bg-[#002B6A] text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          {/* Google Login Button */}
          <motion.button
            type="button"
            onClick={() => 
              signIn('google', {
                callbackUrl : callbackUrl,
                redirect : false,
              })
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5 text-blue-600" />
            Masuk dengan Google
          </motion.button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#002B6A] font-semibold hover:underline">
              Buat akun
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-[#002B6A] transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
