'use client';

import React, { useState, useMemo } from 'react';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Calendar,
  Clock,
  Printer,
  BookOpen,
  School,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RoutinePage() {
  const { info, routines } = useMadrasah();
  
  // Available classes list from routines
  const availableClasses = useMemo(() => {
    return routines.map((r) => r.className);
  }, [routines]);

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return availableClasses[0] || '১০ম শ্রেণি (দাখিল)';
  });

  // Ensure current class exists or fall back
  const effectiveClass = useMemo(() => {
    if (availableClasses.includes(selectedClass)) return selectedClass;
    return availableClasses[0] || '১০ম শ্রেণি (দাখিল)';
  }, [selectedClass, availableClasses]);

  const currentRoutine = useMemo(() => {
    return routines.find((r) => r.className === effectiveClass) || routines[0];
  }, [routines, effectiveClass]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="py-10 md:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-2xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>একাডেমিক সময়সূচি ও ক্লাস বণ্টন</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            ক্লাস ও শিক্ষা রুটিন ২০২৬
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর নিয়মিত ক্লাস, পিরিয়ড ও পাঠদান সময়সূচি
          </p>
        </div>

        {/* Class Selection Section (No Print) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm mb-8 no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                <School className="w-5 h-5" />
              </div>
              <div>
                <label
                  htmlFor="classSelect"
                  className="block text-xs font-black text-emerald-800 uppercase tracking-wider"
                >
                  শ্রেণি নির্বাচন করুন:
                </label>
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  যে শ্রেণির রুটিন দেখতে চান তা সিলেক্ট করুন
                </span>
              </div>
            </div>

            {/* Dropdown Selector */}
            <div className="w-full md:w-80">
              <div className="relative">
                <select
                  id="classSelect"
                  value={effectiveClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 font-bold text-sm px-4 py-3 rounded-xl border-2 border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 transition-all cursor-pointer shadow-2xs pr-10"
                >
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls} className="py-1">
                      {cls}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-emerald-700">
                  <Filter className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Selection Pills */}
          <div className="pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>দ্রুত শ্রেণি নির্বাচন:</span>
              <span className="text-emerald-700 font-black">({availableClasses.length}টি শ্রেণি উপলব্ধ)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableClasses.map((cls) => {
                const isSelected = effectiveClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/40 scale-102'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 hover:text-emerald-900'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                    <span>{cls}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Printable Routine Sheet */}
        <div className="bg-white rounded-2xl border-2 border-emerald-800 p-6 md:p-8 shadow-xl print-area">
          {/* Header */}
          <div className="text-center border-b-2 border-emerald-800 pb-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-emerald-900 leading-tight">
              {info.name}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              {info.address} • EIIN: {info.eiin} • কোড: {info.madrasahCode}
            </p>
            <div className="inline-block bg-emerald-800 text-amber-300 text-xs md:text-sm font-extrabold px-6 py-1.5 rounded-full mt-3 shadow-sm">
              দৈনিক পাঠদান রুটিন — {effectiveClass}
            </div>
          </div>

          {/* Routine Table */}
          {currentRoutine && currentRoutine.periods && currentRoutine.periods.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-2xs">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="bg-emerald-900 text-white font-bold">
                  <tr>
                    <th className="py-3.5 px-4">ঘণ্টা / অধিবেশন</th>
                    <th className="py-3.5 px-4">সময়সূচি</th>
                    <th className="py-3.5 px-4">বিষয়</th>
                    <th className="py-3.5 px-4">দায়িত্বপ্রাপ্ত শিক্ষক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentRoutine.periods.map((item, idx) => {
                    const isBreak =
                      item.subject.includes('বিরতি') ||
                      item.period.includes('বিরতি') ||
                      item.subject.includes('সালাত');

                    return (
                      <tr
                        key={item.id || idx}
                        className={
                          isBreak
                            ? 'bg-amber-50/90 font-bold text-amber-900'
                            : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-slate-50/70'
                        }
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                          {item.period}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-800 font-mono font-bold whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.subject}
                          {item.room && (
                            <span className="ml-2 text-[11px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {item.room}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {item.teacher}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 my-6">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-700">
                {effectiveClass}-এর জন্য রুটিন আপলোড করা হয়নি
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                কর্তৃপক্ষ কর্তৃক এই শ্রেণির সময়সূচি চূড়ান্ত হলে এখানে প্রকাশিত হবে।
              </p>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">
                রুটিন কার্যকরের তারিখ: {currentRoutine?.effectiveDate || '০১ জানুয়ারি ২০২৬'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentRoutine?.notes || 'বিশেষ প্রয়োজনে কর্তৃপক্ষ রুটিন পরিবর্তনের ক্ষমতা সংরক্ষণ করে।'}
              </p>
            </div>
            <div className="text-center sm:text-right self-end sm:self-auto">
              <div className="w-36 border-b border-slate-400 mb-1 ml-auto"></div>
              <p className="font-black text-slate-900">{info.principalName}</p>
              <p className="text-[11px] text-slate-600">{info.principalTitle}</p>
            </div>
          </div>

          {/* Print button (No Print) */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm cursor-pointer hover:shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{effectiveClass}-এর রুটিন প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
