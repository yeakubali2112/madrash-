'use client';

import React, { useState } from 'react';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Calendar,
  Clock,
  Printer,
  Download,
  BookOpen,
  School,
  FileText
} from 'lucide-react';

export default function RoutinePage() {
  const { info } = useMadrasah();
  const [selectedClass, setSelectedClass] = useState('১০ম শ্রেণি (দাখিল)');

  const routineData: Record<string, Array<{ period: string; time: string; subject: string; teacher: string }>> = {
    '১০ম শ্রেণি (দাখিল)': [
      { period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন মাজীদ ও তাজবীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'হাদীস শরীফ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
      { period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'আরবি ১ম পত্র', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'সাধারণ গণিত / পদার্থ', teacher: 'মোঃ মাহবুবুল হক' },
      { period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও খাবার বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'ইংরেজি ১ম ও ২য় পত্র', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'বাংলা সাহিত্য ও ব্যাকরণ', teacher: 'মোছাঃ ফাতেমা আক্তার' },
      { period: '৭ম ঘণ্টা', time: '০২:৪৫ - ০৩:৩০', subject: 'আইসিটি ল্যাব প্র্যাকটিস', teacher: 'মোঃ আহসান উল্লাহ' },
    ],
    '৯ম শ্রেণি': [
      { period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'আকাইদ ও ফিকহ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
      { period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'কুরআন মাজীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
      { period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'ইংরেজি ১ম পত্র', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও খাবার বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'আরবি সাহিত্য', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'তথ্য ও যোগাযোগ প্রযুক্তি', teacher: 'মোঃ আহসান উল্লাহ' },
      { period: '৭ম ঘণ্টা', time: '০২:৪৫ - ০৩:৩০', subject: 'বাংলাদেশ ও বিশ্বপরিচয়', teacher: 'মোছাঃ ফাতেমা আক্তার' },
    ],
    'হিফজুল কুরআন বিভাগ': [
      { period: 'ফজরের পর', time: '০৫:৩০ - ০৭:০০', subject: 'সাবাখ (নতুন পড়া মুখস্থ ও তিলাওয়াত)', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { period: 'সকালের বিরতি', time: '০৭:০০ - ০৮:৩০', subject: 'নাশতা ও বিশ্রাম', teacher: 'হোস্টেল সুপারভাইজার' },
      { period: '১ম অধিবেশন', time: '০৮:৩০ - ১১:৩০', subject: 'সাবাখী (পূর্বের দিনের পাঠ মজবুতকরণ)', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { period: 'দুপুরের বিরতি', time: '১১:৩০ - ০২:০০', subject: 'গোসল, খাবার ও যোহরের সালাত', teacher: 'সকল শিক্ষক' },
      { period: '২য় অধিবেশন', time: '০২:০০ - আসর', subject: 'আমোকথা (পেছনের পারা রিভিশন)', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { period: 'মাগরিবের পর', time: 'মাগরিব - এশা', subject: 'দৈনিক পাঠের চূড়ান্ত যাচাই ও পরীক্ষা', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
    ]
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentRoutine = routineData[selectedClass] || routineData['১০ম শ্রেণি (দাখিল)'];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            একাডেমিক সময়সূচি
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            ক্লাস ও শিক্ষা রুটিন ২০২৬
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর নিয়মিত ক্লাস ও পাঠদান সময়সূচি
          </p>
        </div>

        {/* Class Selection Buttons (No Print) */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 no-print">
          {Object.keys(routineData).map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                selectedClass === cls
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Printable Routine Sheet */}
        <div className="bg-white rounded-2xl border-2 border-emerald-800 p-6 md:p-8 shadow-xl print-area">
          {/* Header */}
          <div className="text-center border-b-2 border-emerald-800 pb-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-emerald-900 leading-tight">
              {info.name}
            </h2>
            <p className="text-xs text-slate-600 font-medium">{info.address} • EIIN: {info.eiin}</p>
            <div className="inline-block bg-emerald-800 text-amber-300 text-xs md:text-sm font-extrabold px-6 py-1 rounded-full mt-2 shadow-sm">
              দৈনিক পাঠদান রুটিন — {selectedClass}
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs md:text-sm text-left">
              <thead className="bg-emerald-900 text-white font-bold">
                <tr>
                  <th className="py-3 px-4">ঘণ্টা / পিরিয়ড</th>
                  <th className="py-3 px-4">সময়সূচি</th>
                  <th className="py-3 px-4">বিষয়</th>
                  <th className="py-3 px-4">দায়িত্বপ্রাপ্ত শিক্ষক</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentRoutine.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      item.subject.includes('বিরতি')
                        ? 'bg-amber-50/80 font-bold text-amber-900'
                        : idx % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50'
                    }
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">{item.period}</td>
                    <td className="py-3 px-4 text-emerald-800 font-mono font-semibold">{item.time}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.subject}</td>
                    <td className="py-3 px-4 text-slate-600">{item.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
            <div>
              <p>রুটিন কার্যকরের তারিখ: ০১ জানুয়ারি ২০২৬</p>
              <p className="text-[11px] text-slate-500">বিশেষ প্রয়োজনে কর্তৃপক্ষ রুটিন পরিবর্তনের ক্ষমতা সংরক্ষণ করে।</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <p className="font-bold text-slate-900">{info.principalName}</p>
              <p>{info.principalTitle}</p>
            </div>
          </div>

          {/* Print button */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end no-print">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>রুটিন প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
