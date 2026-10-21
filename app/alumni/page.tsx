'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  GraduationCap,
  Search,
  Phone,
  Mail,
  Award,
  Calendar,
  Briefcase,
  MapPin,
  Eye,
  X,
  Printer,
  ChevronRight,
  School,
  ExternalLink
} from 'lucide-react';
import { AlumniStudent } from '@/lib/data';

export default function AlumniPage() {
  const { alumniStudents, info } = useMadrasah();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('সকল');
  const [selectedGroup, setSelectedGroup] = useState('সকল');
  const [selectedStudent, setSelectedStudent] = useState<AlumniStudent | null>(null);

  // Available unique passing years
  const availableYears = React.useMemo(() => {
    const years = Array.from(new Set((alumniStudents || []).map(s => s.passingYear).filter(Boolean)));
    return years.sort().reverse();
  }, [alumniStudents]);

  // Filtered list
  const filteredStudents = (alumniStudents || []).filter(student => {
    const q = search.toLowerCase().trim();
    const searchMatch = !q ||
      (student.name || '').toLowerCase().includes(q) ||
      (student.nameEn || '').toLowerCase().includes(q) ||
      (student.currentStatus || '').toLowerCase().includes(q) ||
      (student.presentInstitute || '').toLowerCase().includes(q) ||
      (student.address || '').toLowerCase().includes(q) ||
      (student.rollNo || '').toLowerCase().includes(q);

    const yearMatch = selectedYear === 'সকল' || student.passingYear === selectedYear;
    const groupMatch = selectedGroup === 'সকল' || student.group === selectedGroup;

    return searchMatch && yearMatch && groupMatch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-[#002b17] via-[#006837] to-[#004d28] text-white py-14 px-4 overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#DDAA00] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full mb-3 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span>অ্যালামনাই ও প্রাক্তন শিক্ষার্থী কর্নার</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            মাদ্রাসার প্রাক্তন শিক্ষার্থী তালিকা
          </h1>
          
          <p className="text-emerald-100 text-sm md:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            {info.name}-এর বিভিন্ন শিক্ষাবর্ষের উত্তীর্ণ ও কৃতি শিক্ষার্থীদের তথ্যভাণ্ডার। দেশ ও বিদেশে উচ্চশিক্ষা, শিক্ষকতা ও বিভিন্ন পেশায় মাদ্রাসার সুনাম বৃদ্ধিকারী অ্যালামনাইবৃন্দ।
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-4 py-2 text-center">
              <span className="text-[11px] text-emerald-200 block">মোট নিবন্ধিত প্রাক্তন শিক্ষার্থী</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">{alumniStudents.length} জন</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-4 py-2 text-center">
              <span className="text-[11px] text-emerald-200 block">নিবন্ধিত ব্যাচ</span>
              <span className="text-xl sm:text-2xl font-black text-white">{availableYears.length} টি ব্যাচ</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-4 py-2 text-center">
              <span className="text-[11px] text-emerald-200 block">দাখিল উত্তীর্ণ</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-200">
                {alumniStudents.filter(s => (s.examType || '').includes('দাখিল')).length} জন
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Search & Filter Container */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="শিক্ষার্থীর নাম, ইংরেজি নাম, পেশা, বিশ্ববিদ্যালয় বা এলাকা দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Batch / Year Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap pl-1">ব্যাচ:</span>
              <button
                type="button"
                onClick={() => setSelectedYear('সকল')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedYear === 'সকল'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সকল
              </button>
              {availableYears.map(year => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedYear === year
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Group Dropdown */}
            <div className="shrink-0">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                <option value="সকল">সকল বিভাগ</option>
                <option value="সাধারণ বিভাগ">সাধারণ বিভাগ</option>
                <option value="বিজ্ঞান বিভাগ">বিজ্ঞান বিভাগ</option>
                <option value="মুজাব্বিদ বিভাগ">মুজাব্বিদ বিভাগ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>প্রাক্তন শিক্ষার্থীদের তালিকা</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {filteredStudents.length} জন
            </span>
          </h2>

          {(search || selectedYear !== 'সকল' || selectedGroup !== 'সকল') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedYear('সকল');
                setSelectedGroup('সকল');
              }}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              ফিল্টার রিসেট ✕
            </button>
          )}
        </div>

        {/* Alumni Cards Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-emerald-300 relative overflow-hidden"
              >
                {/* Accent Banner */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-[#DDAA00] to-emerald-800" />

                <div>
                  {/* Top Header with Avatar */}
                  <div className="flex items-start gap-3.5 mb-3.5 pt-1">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-300 shrink-0 relative flex items-center justify-center font-black text-emerald-900 text-xl shadow-xs group-hover:scale-105 transition-transform">
                      {student.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{student.name ? student.name.charAt(0) : 'শি'}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          ব্যাচ {student.passingYear}
                        </span>
                        {student.bloodGroup && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-md">
                            {student.bloodGroup}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mt-1 leading-snug group-hover:text-emerald-800 transition-colors truncate">
                        {student.name}
                      </h3>
                      {student.nameEn && (
                        <p className="text-xs text-slate-400 font-mono truncate">{student.nameEn}</p>
                      )}
                    </div>
                  </div>

                  {/* Academic Highlights */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>উত্তীর্ণ পরীক্ষা:</span>
                      <span className="font-bold text-slate-800">{student.examType}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>শাখা / বিভাগ:</span>
                      <span className="font-semibold text-slate-700">{student.group || 'সাধারণ বিভাগ'}</span>
                    </div>
                    {student.gpa && (
                      <div className="flex justify-between items-center text-slate-600">
                        <span>ফলাফল:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                          {student.gpa}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Career & Higher Education Status */}
                  {student.currentStatus && (
                    <div className="mb-3 text-xs bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1 mb-0.5">
                        <Briefcase className="w-3 h-3 text-emerald-700" />
                        <span>বর্তমান অবস্থান / ক্যারিয়ার</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{student.currentStatus}</div>
                      {student.presentInstitute && (
                        <div className="text-[11px] text-slate-600 mt-0.5">{student.presentInstitute}</div>
                      )}
                    </div>
                  )}

                  {/* Achievements note */}
                  {student.achievements && (
                    <div className="text-[11px] text-slate-600 italic bg-amber-50/50 border border-amber-100 rounded-lg p-2 mb-3">
                      &quot;{student.achievements}&quot;
                    </div>
                  )}

                  {/* Address */}
                  {student.address && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{student.address}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    রোল: {student.rollNo || '—'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>পরিচিতি দেখুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">কোনো প্রাক্তন শিক্ষার্থী পাওয়া যায়নি</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              আপনার দেওয়া সার্চ বা ফিল্টারের সাথে মিল রেখে কোনো রেকর্ড খুঁজে পাওয়া যায়নি।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedYear('সকল');
                setSelectedGroup('সকল');
              }}
              className="px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                <span>প্রাক্তন শিক্ষার্থী পরিচিতিপত্র</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-emerald-700/60 rounded-2xl p-5 bg-gradient-to-b from-white to-slate-50 space-y-4">
              <div className="text-center border-b pb-3">
                <h4 className="font-black text-[#006837] text-lg">{info.name}</h4>
                <p className="text-xs text-slate-500">প্রাক্তন শিক্ষার্থী তথ্যপত্র</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-100 border-2 border-emerald-600 shrink-0 relative flex items-center justify-center font-black text-2xl text-emerald-900 shadow-sm">
                  {selectedStudent.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedStudent.name ? selectedStudent.name.charAt(0) : 'শি'}</span>
                  )}
                </div>

                <div>
                  <span className="bg-[#DDAA00] text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    ব্যাচ {selectedStudent.passingYear}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedStudent.name}</h3>
                  {selectedStudent.nameEn && (
                    <p className="text-xs text-slate-500 font-mono">{selectedStudent.nameEn}</p>
                  )}
                  {selectedStudent.bloodGroup && (
                    <p className="text-xs text-rose-700 font-bold mt-1">রক্তের গ্রুপ: {selectedStudent.bloodGroup}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                <div><strong>উত্তীর্ণ পরীক্ষা:</strong> {selectedStudent.examType}</div>
                <div><strong>বিভাগ:</strong> {selectedStudent.group || 'সাধারণ'}</div>
                <div><strong>বোর্ড রোল:</strong> {selectedStudent.rollNo || '—'}</div>
                <div><strong>ফলাফল:</strong> <span className="text-emerald-700 font-bold">{selectedStudent.gpa || '—'}</span></div>
              </div>

              {selectedStudent.currentStatus && (
                <div className="bg-emerald-50 rounded-xl p-3 text-xs border border-emerald-200">
                  <strong className="text-emerald-900 block mb-0.5">বর্তমান পেশা ও উচ্চশিক্ষা:</strong>
                  <div className="text-slate-900 font-bold">{selectedStudent.currentStatus}</div>
                  {selectedStudent.presentInstitute && (
                    <div className="text-slate-600 mt-0.5">{selectedStudent.presentInstitute}</div>
                  )}
                </div>
              )}

              {selectedStudent.achievements && (
                <div className="bg-amber-50 rounded-xl p-3 text-xs border border-amber-200">
                  <strong className="text-amber-900 block mb-0.5">কৃতিত্ব ও স্মৃতিচারণ:</strong>
                  <p className="text-slate-700">{selectedStudent.achievements}</p>
                </div>
              )}

              {selectedStudent.address && (
                <div className="text-xs text-slate-600 pt-1">
                  <strong>ঠিকানা:</strong> {selectedStudent.address}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 cursor-pointer"
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
