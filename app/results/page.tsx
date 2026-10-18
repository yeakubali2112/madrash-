'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import { ResultRecord } from '@/lib/data';
import {
  Award,
  Search,
  Printer,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Calendar,
  Sparkles,
  School
} from 'lucide-react';

export default function ResultsPage() {
  const { results, info } = useMadrasah();
  const [selectedExam, setSelectedExam] = useState('দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬');
  const [selectedClass, setSelectedClass] = useState('১০ম শ্রেণি (দাখিল)');
  const [rollInput, setRollInput] = useState('');
  const [foundResult, setFoundResult] = useState<ResultRecord | null>(null);
  const [searchError, setSearchError] = useState('');

  // Normalize bangla to english digits for matching
  const normalizeDigits = (str: string) => {
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, (w) => bnToEn[w] || w).trim();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setFoundResult(null);

    const normRoll = normalizeDigits(rollInput);
    if (!normRoll) {
      setSearchError('অনুগ্রহ করে সঠিক রোল নম্বর দিন। (ডেমো দেখতে রোল ১০১, ১০২ বা ১০৩ দিয়ে চেষ্টা করুন)');
      return;
    }

    const match = results.find(r => {
      const rNorm = normalizeDigits(r.rollNo);
      return rNorm === normRoll || r.rollNo === rollInput.trim();
    });

    if (match) {
      setFoundResult(match);
    } else {
      setSearchError(`রোল "${rollInput}"-এর জন্য এই পরীক্ষায় কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে সঠিক রোল নম্বর দিন (ডেমো রোল: ১০১, ১০২ বা ১০৩)।`);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            পরীক্ষা ও মূল্যায়ন
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            অনলাইন পরীক্ষার ফলাফল ও মার্কশিট
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর পরীক্ষার ফলাফল ও বিষয়ভিত্তিক গ্রেড পয়েন্টসহ পূর্ণাঙ্গ একাডেমিক মার্কশিট ডাউনলোড করুন।
          </p>
        </div>

        {/* Search Panel (Hidden on Print) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-8 no-print">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পরীক্ষার নাম নির্বাচন করুন
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm font-medium"
                >
                  <option value="দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬">দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬</option>
                  <option value="বার্ষিক পরীক্ষা ২০২৫">বার্ষিক পরীক্ষা ২০২৫</option>
                  <option value="অর্ধ-বার্ষিক পরীক্ষা ২০২৬">অর্ধ-বার্ষিক পরীক্ষা ২০২৬</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  শ্রেণি নির্বাচন করুন
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm font-medium"
                >
                  <option value="১০ম শ্রেণি (দাখিল)">১০ম শ্রেণি (দাখিল)</option>
                  <option value="৯ম শ্রেণি (সাধারণ/বিজ্ঞান)">৯ম শ্রেণি (সাধারণ/বিজ্ঞান)</option>
                  <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                  <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                  <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
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
                    placeholder="রোল নম্বর (যেমন: ১০১)"
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm font-bold text-emerald-900"
                  />
                </div>
              </div>
            </div>

            {searchError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {searchError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <span className="text-xs text-slate-500 font-medium">
                💡 নমুনা রোল নম্বর: <button type="button" onClick={() => setRollInput('১০১')} className="text-emerald-700 font-bold hover:underline">১০১</button>, <button type="button" onClick={() => setRollInput('১০২')} className="text-emerald-700 font-bold hover:underline">১০২</button>, <button type="button" onClick={() => setRollInput('১০৩')} className="text-emerald-700 font-bold hover:underline">১০৩</button>
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-xs md:text-sm"
              >
                <Search className="w-4 h-4" />
                <span>ফলাফল অনুসন্ধান করুন</span>
              </button>
            </div>
          </form>
        </div>

        {/* Marksheet Display */}
        {foundResult && (
          <div className="bg-white rounded-2xl border-2 border-[#006837] p-6 md:p-8 shadow-xl print-area">
            {/* Header / Letterhead */}
            <div className="text-center border-b-2 border-[#006837] pb-4 mb-6">
              <div className="flex justify-center items-center gap-4 mb-2">
                <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 drop-shadow-md">
                  <Image
                    src="/logo.png"
                    alt={info.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#006837] leading-tight">
                    {info.name}
                  </h2>
                  <p className="text-xs font-bold text-[#003580]">{info.location || "দুপচাঁচিয়া, বগুড়া"} • {info.englishName}</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {info.address} • EIIN: {info.eiin} • মাদ্রাসা কোড: {info.madrasahCode}
              </p>
              <div className="inline-block bg-[#006837] text-[#DDAA00] text-sm font-black px-6 py-1 rounded-full mt-3 shadow-sm border border-[#DDAA00]/40">
                অফিসিয়াল একাডেমিক মার্কশিট ও গ্রেড বিবরণী
              </div>
            </div>

            {/* Student & Exam Info */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm">
                <div>
                  <span className="text-slate-500 block text-[11px]">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-slate-900">{foundResult.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">রোল নম্বর:</span>
                  <span className="font-mono font-bold text-emerald-800 text-base">{foundResult.rollNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">রেজিস্ট্রেশন নং:</span>
                  <span className="font-mono text-slate-800 font-semibold">{foundResult.regNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">শ্রেণি ও সেশন:</span>
                  <span className="font-semibold text-slate-800">{foundResult.classYear} ({foundResult.session})</span>
                </div>
              </div>
            </div>

            {/* GPA Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <span className="text-[11px] text-emerald-800 font-bold block">প্রাপ্ত জিপিএ (GPA)</span>
                <span className="text-2xl md:text-3xl font-black text-emerald-900">{foundResult.gpa.toFixed(2)}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <span className="text-[11px] text-amber-800 font-bold block">প্রাপ্ত লেটার গ্রেড</span>
                <span className="text-2xl md:text-3xl font-black text-amber-900">{foundResult.grade}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <span className="text-[11px] text-blue-800 font-bold block">ফলাফলের অবস্থা</span>
                <span className="text-xl md:text-2xl font-black text-blue-900 flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{foundResult.resultStatus}</span>
                </span>
              </div>
            </div>

            {/* Subject-wise Marks Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="bg-emerald-900 text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">ক্রমিক</th>
                    <th className="py-2.5 px-3">বিষয়ের নাম</th>
                    <th className="py-2.5 px-3 text-center">পূর্ণমান</th>
                    <th className="py-2.5 px-3 text-center">প্রাপ্ত নম্বর</th>
                    <th className="py-2.5 px-3 text-center">লেটার গ্রেড</th>
                    <th className="py-2.5 px-3 text-center">গ্রেড পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {foundResult.subjects.map((sub, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                      <td className="py-2 px-3 text-center text-slate-600">{sub.fullMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.obtainedMarks}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">{sub.point.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="pt-8 mt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-700">
              <div className="text-center">
                <div className="w-36 border-b border-slate-400 mb-1.5"></div>
                <p className="font-semibold">শ্রেণি শিক্ষকের স্বাক্ষর</p>
                <p className="text-[10px] text-slate-500">তারিখ: {foundResult.publishDate}</p>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-slate-400 mb-1.5"></div>
                <p className="font-bold text-slate-900">{info.principalName}</p>
                <p>{info.principalTitle}</p>
              </div>
            </div>

            {/* Print Button */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3 no-print">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>মার্কশিট প্রিন্ট / ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
