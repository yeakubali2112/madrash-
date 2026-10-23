'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import { academicClassesList } from '@/lib/data';
import {
  UserCheck,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const ParentAttendanceCta: React.FC = () => {
  const router = useRouter();
  const { info } = useMadrasah();
  const [selectedClass, setSelectedClass] = useState('১০ম শ্রেণি (দাখিল)');
  const [rollInput, setRollInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollInput.trim();
    if (!cleanRoll) {
      router.push(`/attendance?class=${encodeURIComponent(selectedClass)}`);
    } else {
      router.push(`/attendance?class=${encodeURIComponent(selectedClass)}&roll=${encodeURIComponent(cleanRoll)}`);
    }
  };

  const handleQuickSearch = (cls: string, roll: string) => {
    setSelectedClass(cls);
    setRollInput(roll);
    router.push(`/attendance?class=${encodeURIComponent(cls)}&roll=${encodeURIComponent(roll)}`);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-[#002816] to-[#001c38] text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#DDAA00]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
                <UserCheck className="w-4 h-4 text-[#DDAA00]" />
                <span>অভিভাবক সেবা • ডিজিটাল হাজিরা পোর্টাল</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                সন্তানের ক্লাসে দৈনিক ও মাসিক উপস্থিতি জানুন ঘরে বসেই
              </h2>

              <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
                {info.name}-এর সম্মানিত অভিভাবকদের সুবিধার্থে চালু রয়েছে অনলাইন ডিজিটাল হাজিরা পোর্টাল। আপনার সন্তানের রোল নম্বর দিয়ে ক্লাসে উপস্থিতি, সময়ানুবর্তিতা এবং শতকরা হার মুহূর্তেই অনুসন্ধান করুন।
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">আজকের উপস্থিতি</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">রিয়েল-টাইম ক্লাস স্থিতি</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#DDAA00]/20 text-[#DDAA00] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">মাসিক হার ও শিট</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">বিস্তারিত তারিখভিত্তিক হিসাব</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">বোর্ড নিয়মাবলি</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">ন্যূনতম ৭৫% উপস্থিতি নজরদারি</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quick Search Box (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-slate-900 shadow-2xl border-2 border-emerald-500/40 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        হাজিরা অনুসন্ধান ফরম
                      </h3>
                      <p className="text-xs text-slate-500">রোল নম্বর দিয়ে ফলাফল দেখুন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#DDAA00]/20 text-[#006837] px-2 py-0.5 rounded-full border border-[#DDAA00]/40">
                    তাৎক্ষণিক
                  </span>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      শ্রেণি নির্বাচন করুন
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                    >
                      {academicClassesList.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      শিক্ষার্থীর রোল নম্বর
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={rollInput}
                        onChange={(e) => setRollInput(e.target.value)}
                        placeholder="যেমন: ১০১ বা 1"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-black text-emerald-900 placeholder:font-normal placeholder:text-slate-400"
                      />
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#006837] hover:bg-[#00542c] active:scale-95 text-white font-black py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#DDAA00]" />
                    <span>উপস্থিতি বিবরণী দেখুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Sample demo buttons for instant testing */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold mb-2">
                    💡 এক ক্লিকে ডেমো যাচাই করুন:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickSearch('১০ম শ্রেণি (দাখিল)', '১০১')}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                    >
                      ১০ম - রোল ১০১
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSearch('১০ম শ্রেণি (দাখিল)', '১০২')}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                    >
                      ১০ম - রোল ১০২
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSearch('৯ম শ্রেণি (দাখিল)', '১০১')}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                    >
                      ৯ম - রোল ১০১
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSearch('৮ম শ্রেণি (জেডিসি)', '০১')}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                    >
                      ৮ম - রোল ০১
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
