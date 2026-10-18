'use client';

import React, { useState } from 'react';
import { useMadrasah } from '@/context/MadrasahContext';
import { Notice } from '@/lib/data';
import {
  FileText,
  Calendar,
  Pin,
  Search,
  Filter,
  Eye,
  Printer,
  X,
  UserCheck
} from 'lucide-react';

export default function NoticesPage() {
  const { notices, info } = useMadrasah();
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const categories = ['সকল', 'পরীক্ষা', 'ভর্তি', 'ছুটি', 'সাধারণ', 'জরুরি'];

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'সকল' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'পরীক্ষা':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ভর্তি':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ছুটি':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'জরুরি':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            সর্বশেষ আপডেট
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            নোটিশ বোর্ড ও সার্কুলার
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর সকল পরীক্ষা, ভর্তি, ছুটি ও প্রশাসনিক গুরুত্বপূর্ণ নোটিশসমূহ
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নোটিশ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> ক্যাটাগরি:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notices Count */}
        <div className="text-xs text-slate-500 mb-3 px-1">
          মোট {filteredNotices.length}টি নোটিশ পাওয়া গেছে
        </div>

        {/* Notices Cards List */}
        <div className="space-y-3.5">
          {filteredNotices.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-base">কোনো নোটিশ পাওয়া যায়নি!</p>
              <p className="text-xs mt-1">অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন অথবা ক্যাটাগরি পরিবর্তন করুন।</p>
            </div>
          ) : (
            filteredNotices.map((n) => (
              <div
                key={n.id}
                id={n.id}
                className={`bg-white rounded-xl p-5 border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  n.isPinned
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center shrink-0 border border-emerald-200">
                    <FileText className="w-5 h-5 text-emerald-700" />
                    <span className="text-[9px] font-bold text-emerald-900 uppercase">নোটিশ</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(n.category)}`}>
                        {n.category}
                      </span>
                      {n.isPinned && (
                        <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                          <Pin className="w-3 h-3 fill-slate-950" />
                          <span>পিন করা নোটিশ</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{n.date}</span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        • {n.author}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedNotice(n)}
                      className="text-base md:text-lg font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                    >
                      {n.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  <button
                    onClick={() => setSelectedNotice(n)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>বিস্তারিত পড়ুন</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto print-area">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(selectedNotice.category)}`}>
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>প্রকাশ: {selectedNotice.date}</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mt-1">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold">
                  {info.name} • {selectedNotice.author}
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
              <h1 className="text-2xl font-black">{info.name}</h1>
              <p className="text-sm">{info.address}</p>
              <p className="text-xs">EIIN: {info.eiin} | কোড: {info.madrasahCode} | ফোন: {info.phone}</p>
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
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
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
    </div>
  );
}
