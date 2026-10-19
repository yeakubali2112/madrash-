'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import { ResultRecord, AdmissionApplication } from '@/lib/data';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Search,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Printer,
  LogOut,
  AlertCircle,
  KeyRound,
  FileText,
  School,
  Sparkles,
  Phone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { info, results, applications, isAdmin, loginAdmin } = useMadrasah();

  // Tab: 'student' or 'admin'
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // Student Login Form State
  const [studentClass, setStudentClass] = useState('১০ম শ্রেণি (দাখিল)');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentError, setStudentError] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<{
    result?: ResultRecord;
    application?: AdmissionApplication;
  } | null>(null);

  // Admin Login Form State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Normalize bangla to english digits for matching
  const normalizeDigits = (str: string) => {
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, (w) => bnToEn[w] || w).trim();
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setLoggedInStudent(null);

    const inputClean = studentRoll.trim();
    if (!inputClean) {
      setStudentError('অনুগ্রহ করে আপনার রোল নম্বর বা রেজি নম্বর দিন। (ডেমো: ১০১, ১০২ বা ১০৩)');
      return;
    }

    const normInput = normalizeDigits(inputClean);

    // Search in results database
    const foundResult = results.find(r => {
      const normRoll = normalizeDigits(r.rollNo);
      const normReg = normalizeDigits(r.regNo);
      return normRoll === normInput || normReg === normInput || r.rollNo === inputClean;
    });

    if (foundResult) {
      setLoggedInStudent({ result: foundResult });
      return;
    }

    // Search in admission applications
    const foundApp = applications.find(a => {
      const normId = a.id.toLowerCase();
      const normPhone = normalizeDigits(a.fatherPhone);
      return normId === inputClean.toLowerCase() || normPhone === normInput;
    });

    if (foundApp) {
      setLoggedInStudent({ application: foundApp });
      return;
    }

    setStudentError(`রোল/আইডি "${inputClean}" দিয়ে কোনো শিক্ষার্থী বা ভর্তি তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন (ডেমো শিক্ষার্থী দেখতে রোল: ১০১, ১০২ বা ১০৩ লিখুন)।`);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const success = loginAdmin(adminPassword);
    if (success) {
      router.push('/admin');
    } else {
      setAdminError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন। (ডেমো পাসওয়ার্ড: madrasah123)');
    }
  };

  const handleQuickAdminLogin = () => {
    loginAdmin('madrasah123');
    router.push('/admin');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-emerald-50/30 to-slate-100 py-12 px-4 flex items-center justify-center relative islamic-bg-pattern">
      <div className="max-w-xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
          {/* Card Header with Madrasah Brand Colors */}
          <div className="bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] text-white p-6 sm:p-8 text-center relative border-b-2 border-[#DDAA00]/40">
            <Link href="/" className="inline-block relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 drop-shadow-lg bg-white rounded-2xl p-1.5 border-2 border-[#DDAA00] hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt={info.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              মাদ্রাসা ডিজিটাল লগইন পোর্টাল
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
              {info.name} • {info.location || 'দুপচাঁচিয়া, বগুড়া'}
            </p>

            {/* Role Switcher Tabs */}
            <div className="mt-6 bg-black/25 backdrop-blur-sm p-1.5 rounded-2xl max-w-sm mx-auto flex items-center border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setLoggedInStudent(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'student'
                    ? 'bg-[#DDAA00] text-slate-950 shadow-md scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>শিক্ষার্থী ও অভিভাবক</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-[#DDAA00] text-slate-950 shadow-md scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>শিক্ষক ও প্রশাসন</span>
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            {/* TAB 1: STUDENT / GUARDIAN PORTAL */}
            {activeTab === 'student' && (
              <div>
                {!loggedInStudent ? (
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-[#006837]">
                        <Sparkles className="w-4 h-4 text-[#DDAA00]" />
                        <span>শিক্ষার্থী পোর্টাল সুবিধা:</span>
                      </div>
                      <p>রোল নম্বর দিয়ে লগইন করে আপনার ফলাফল, পরীক্ষার নম্বরপত্র ও ক্লাসের তথ্য দেখতে পারবেন।</p>
                      <p className="text-emerald-800 font-semibold pt-1">
                        💡 ডেমো শিক্ষার্থী হিসেবে দেখতে রোল নম্বর <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">১০১</strong>, <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">১০২</strong> বা <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">১০৩</strong> লিখুন।
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        অধ্যয়নরত শ্রেণি নির্বাচন করুন
                      </label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold bg-white"
                      >
                        <option value="১০ম শ্রেণি (দাখিল)">১০ম শ্রেণি (দাখিল)</option>
                        <option value="৯ম শ্রেণি">৯ম শ্রেণি</option>
                        <option value="৮ম শ্রেণি">৮ম শ্রেণি (জেডিসি)</option>
                        <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                        <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                        <option value="হিফজুল কুরআন বিভাগ">হিফজুল কুরআন বিভাগ</option>
                        <option value="ইবতেদায়ী শাখা">ইবতেদায়ী ১ম-৫ম শ্রেণি</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        শিক্ষার্থীর রোল নম্বর অথবা রেজি নম্বর
                      </label>
                      <div className="relative">
                        <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={studentRoll}
                          onChange={(e) => setStudentRoll(e.target.value)}
                          placeholder="যেমন: ১০১ (বা ২০২৬১০১০১)"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-sm font-semibold font-mono"
                        />
                      </div>
                    </div>

                    {studentError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{studentError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#006837] hover:bg-[#00542c] text-white font-black py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#DDAA00]" />
                      <span>শিক্ষার্থী প্রোফাইলে প্রবেশ করুন</span>
                      <ArrowRight className="w-4 h-4 text-[#DDAA00]" />
                    </button>
                  </form>
                ) : (
                  /* LOGGED IN STUDENT DASHBOARD VIEW */
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Welcome Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006837] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          শিক্ষার্থী প্রোফাইল
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-1">
                          {loggedInStudent.result?.studentName || loggedInStudent.application?.studentNameBn}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          শ্রেণি: {loggedInStudent.result?.classYear || loggedInStudent.application?.applyingClass} • রোল: {loggedInStudent.result?.rollNo || loggedInStudent.application?.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={handlePrint}
                          className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100 text-[#006837] text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>প্রিন্ট</span>
                        </button>
                        <button
                          onClick={() => setLoggedInStudent(null)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>লগআউট</span>
                        </button>
                      </div>
                    </div>

                    {/* Result Details if found */}
                    {loggedInStudent.result && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[10px] text-slate-500 font-bold">জিপিএ (GPA)</span>
                            <div className="text-xl font-black text-[#006837] mt-0.5">
                              {loggedInStudent.result.gpa.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[10px] text-slate-500 font-bold">প্রাপ্ত লেটার গ্রেড</span>
                            <div className="text-xl font-black text-amber-600 mt-0.5">
                              {loggedInStudent.result.grade}
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[10px] text-slate-500 font-bold">ফলাফল স্ট্যাটাস</span>
                            <div className="text-sm font-black text-emerald-800 mt-1 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{loggedInStudent.result.resultStatus}</span>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[10px] text-slate-500 font-bold">রেজিস্ট্রেশন</span>
                            <div className="text-xs font-bold text-slate-800 font-mono mt-1">
                              {loggedInStudent.result.regNo}
                            </div>
                          </div>
                        </div>

                        {/* Subject Marks Table */}
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                          <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 flex justify-between items-center">
                            <span>বিষয়ভিত্তিক পরীক্ষার নম্বরপত্র ({loggedInStudent.result.examName})</span>
                            <span className="text-[11px] text-slate-500 font-medium">প্রকাশ: {loggedInStudent.result.publishDate}</span>
                          </div>
                          <div className="divide-y divide-slate-100 text-xs">
                            {loggedInStudent.result.subjects.map((sub, idx) => (
                              <div key={idx} className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
                                <span className="font-semibold text-slate-800">{sub.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-slate-600">{sub.obtainedMarks} / {sub.fullMarks}</span>
                                  <span className="font-black text-[#006837] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                                    {sub.grade}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick links for student */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <Link
                            href="/routine"
                            className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center text-xs font-bold text-[#006837] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>ক্লাস রুটিন দেখুন</span>
                          </Link>
                          <Link
                            href="/notices"
                            className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-center text-xs font-bold text-[#003580] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>নোটিশ বোর্ড দেখুন</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADMIN & TEACHER LOGIN */}
            {activeTab === 'admin' && (
              <div className="space-y-4">
                {/* Demo Credentials Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>অ্যাডমিন তথ্য (প্রশাসন বিভাগ):</span>
                  </div>
                  <p>ইউজারনেম: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">admin</strong></p>
                  <p>পাসওয়ার্ড: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">madrasah123</strong> (অথবা <strong>admin</strong>)</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      অ্যাডমিন ইউজারনেম
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="admin"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-sm font-medium"
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
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-sm font-medium"
                      />
                    </div>
                  </div>

                  {adminError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#006837] hover:bg-[#00542c] text-white font-black py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#DDAA00]" />
                    <span>অ্যাডমিন প্যানেলে লগইন করুন</span>
                    <ArrowRight className="w-4 h-4 text-[#DDAA00]" />
                  </button>
                </form>

                {/* Quick 1-click Demo Admin Access */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="text-xs font-bold text-[#003580] hover:text-[#002456] hover:underline cursor-pointer"
                  >
                    ⚡ এক ক্লিকে ডেমো অ্যাডমিন হিসেবে প্রবেশ করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
