'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  School,
  AlertCircle,
  KeyRound
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, isLoaded, loginAdmin, info } = useMadrasah();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('admin');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && isAdmin) {
      router.push('/admin');
    }
  }, [isLoaded, isAdmin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(password);
    if (success) {
      router.push('/admin');
    } else {
      setError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন। (ডেমো পাসওয়ার্ড: madrasah123)');
    }
  };

  const handleQuickLogin = () => {
    loginAdmin('madrasah123');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 islamic-bg-pattern">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header with Brand Gradient and Logo */}
        <div className="bg-gradient-to-br from-[#00341c] via-[#006837] to-[#003580] text-white p-8 text-center relative border-b-2 border-[#DDAA00]/40">
          <div className="relative w-20 h-20 mx-auto mb-3 drop-shadow-xl bg-white rounded-2xl p-1.5 border-2 border-[#DDAA00]">
            <Image
              src="/logo.png"
              alt={info.name}
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-xl md:text-2xl font-black">
            মাদ্রাসা অ্যাডমিন লগইন
          </h1>
          <p className="text-emerald-100 text-xs mt-1 font-semibold">
            {info.name}
          </p>
          <p className="text-[#DDAA00] text-xs font-bold mt-0.5">
            {info.location || "দুপচাঁচিয়া, বগুড়া"}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* Demo Credentials Helper Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>ডেমো অ্যাডমিন তথ্য:</span>
            </div>
            <p>ইউজারনেম: <strong className="font-mono">admin</strong></p>
            <p>পাসওয়ার্ড: <strong className="font-mono">madrasah123</strong> (অথবা <strong>admin</strong>)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                অ্যাডমিন ইউজারনেম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#006837] hover:bg-[#00542c] text-white font-black py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4 text-[#DDAA00]" />
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4 text-[#DDAA00]" />
            </button>
          </form>

          {/* Quick One-Click Demo Access */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickLogin}
              className="text-xs font-bold text-[#003580] hover:text-[#002b66] hover:underline"
            >
              ⚡ এক ক্লিকে ডেমো অ্যাডমিন হিসেবে প্রবেশ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
