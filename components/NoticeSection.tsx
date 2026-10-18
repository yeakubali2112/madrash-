'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import { Notice } from '@/lib/data';
import {
  FileText,
  Calendar,
  Pin,
  ChevronRight,
  Printer,
  X,
  Eye
} from 'lucide-react';

export const NoticeSection: React.FC = () => {
  const { notices, info } = useMadrasah();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const pinned = notices.filter(n => n.isPinned);
  const regular = notices.filter(n => !n.isPinned).slice(0, 4);
  const displayNotices = [...pinned, ...regular].slice(0, 5);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'পরীক্ষা':
        return 'bg-blue-100 text-[#003580] border-blue-200 font-bold';
      case 'ভর্তি':
        return 'bg-emerald-100 text-[#006837] border-emerald-300 font-bold';
      case 'ছুটি':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'জরুরি':
        return 'bg-[#DDAA00]/20 text-[#997500] border-[#DDAA00] font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 font-bold';
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-block bg-[#006837]/10 text-[#006837] text-xs font-bold px-3 py-1 rounded-full mb-2">
              বিজ্ঞপ্তি ও সার্কুলার
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              জরুরি নোটিশ বোর্ড
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              মাদ্রাসার অভ্যন্তরীণ পরীক্ষা, ভর্তি, ছুটি ও প্রশাসনিক সকল তথ্যাদি
            </p>
          </div>

          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#006837] hover:bg-[#00542c] text-white px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <span>সকল নোটিশ দেখুন</span>
            <ChevronRight className="w-4 h-4 text-[#DDAA00]" />
          </Link>
        </div>

        {/* Notices List */}
        <div className="grid grid-cols-1 gap-3.5">
          {displayNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 md:p-5 rounded-xl border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                notice.isPinned
                  ? 'bg-amber-50/50 border-[#DDAA00]'
                  : 'bg-slate-50 border-slate-200 hover:border-[#006837]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006837] flex flex-col items-center justify-center shrink-0 border border-emerald-200">
                  <FileText className="w-5 h-5 text-[#006837]" />
                  <span className="text-[9px] font-bold text-[#006837] uppercase">নোটিশ</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 bg-[#DDAA00] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                        <Pin className="w-3 h-3 fill-slate-950" />
                        <span>পিন করা নোটিশ</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Calendar className="w-3 h-3 text-[#006837]" />
                      <span>{notice.date}</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedNotice(notice)}
                    className="text-base md:text-lg font-bold text-slate-900 hover:text-[#006837] cursor-pointer transition-colors leading-snug"
                  >
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {notice.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006837] bg-white hover:bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#003580]" />
                  <span>বিস্তারিত পড়ুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Detail Modal with Official Memo & Logo */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-2 border-[#006837] relative max-h-[90vh] overflow-y-auto print-area">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${getCategoryColor(selectedNotice.category)}`}>
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#006837]" />
                    <span>প্রকাশ: {selectedNotice.date}</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mt-1">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs text-[#006837] font-semibold">
                  {info.name} • {info.location || "দুপচাঁচিয়া, বগুড়া"}
                </p>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors no-print"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official memo header shown on print */}
            <div className="hidden print:block text-center border-b-2 border-slate-800 pb-3 mb-4">
              <div className="flex justify-center mb-2">
                <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-contain" />
              </div>
              <h1 className="text-xl font-black">{info.name}</h1>
              <p className="text-xs">{info.address}</p>
              <p className="text-xs font-mono">EIIN: {info.eiin} | কোড: {info.madrasahCode} | ফোন: {info.phone}</p>
            </div>

            {/* Content Body */}
            <div className="py-4 text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line border-b border-slate-100">
              {selectedNotice.content}
            </div>

            {/* Authority Signoff */}
            <div className="pt-6 flex justify-between items-end text-xs text-slate-600">
              <div>
                <p>স্মারক নং: পআম/বিজ্ঞপ্তি/{selectedNotice.id}/২০২৬</p>
                <p>তারিখ: {selectedNotice.date}</p>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">{info.principalName}</p>
                <p>{info.principalTitle}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3 no-print">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 bg-[#003580] hover:bg-[#002b66] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 text-[#DDAA00]" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
