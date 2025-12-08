"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, CheckCircle2, Loader2, AlertCircle, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [namaFocused, setNamaFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid =
      password &&
      password.length >= 5 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true)
    

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try{
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({nama, email, password}),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.ok){
        setSuccess(true)
        window.location.href = '/login'
      }else{
        const data = await res.json()
        setError('Terdapat kesalahan pada register: ' + data.error)
      }
    }catch(err){
      setError('Terjadi kesalahan pada register!')
    }   

    // console.log("Register:", { email, password });
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-white text-[#002B6A] overflow-hidden font-sans flex items-center justify-center relative py-12">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Register Card */}
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
            <h1 className="text-3xl font-bold text-[#002B6A] mb-2">Buat Akun</h1>
            <p className="text-gray-600 text-sm">Bergabung dengan platform Data BPS Sumut</p>
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
              Registrasi berhasil! Mengalihkan ke halaman login...
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Input */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300" />
              <input
                type="text"
                id="email"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                onFocus={() => setNamaFocused(true)}
                onBlur={() => setNamaFocused(false)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#002B6A] focus:outline-none transition-all duration-300 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="nama"
                className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                  namaFocused || nama
                    ? "-top-2.5 text-xs bg-white px-2 text-[#002B6A] font-medium"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
              >
                Nama Anda
              </label>
            </div>

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
            
            {passwordValid ? (
              <div className="text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Kata sandi Anda diterima
              </div>
            ) : (
              <div className="text-sm text-red-500">
                Kata sandi Anda harus lebih dari 5 karakter dan ada huruf besar dan kecil!
              </div>
            )}

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 peer ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-[#002B6A]"
                }`}
                placeholder=" "
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#002B6A] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <label
                htmlFor="confirmPassword"
                className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                  confirmPasswordFocused || confirmPassword
                    ? `-top-2.5 text-xs bg-white px-2 font-medium ${
                        confirmPassword && !passwordsMatch ? "text-red-500" : "text-[#002B6A]"
                      }`
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
              >
                Konfirmasi Kata Sandi
              </label>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="text-sm">
                {passwordsMatch ? (
                  <p className="text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Kata sandi cocok
                  </p>
                ) : (
                  <p className="text-red-500">Kata sandi tidak cocok</p>
                )}
              </div>
            )}

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
                  Buat Akun
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#002B6A] font-semibold hover:underline">
              Masuk
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
