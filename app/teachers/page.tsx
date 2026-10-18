'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Users,
  Search,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Award
} from 'lucide-react';

export default function TeachersPage() {
  const { teachers, info } = useMadrasah();
  const [search, setSearch] = useState('');

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            সম্মানিত শিক্ষকবৃন্দ
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            শিক্ষক ও কর্মচারী পরিচিতি
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর উচ্চশিক্ষিত, অভিজ্ঞ ও আন্তরিক শিক্ষকমণ্ডলীর তালিকা
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষকের নাম বা বিষয় দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden mb-4 border-3 border-emerald-600 shadow-md group-hover:scale-105 transition-transform">
                  <Image
                    src={teacher.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'}
                    alt={teacher.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="text-center mb-3">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {teacher.designation}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {teacher.name}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-start gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-700">যোগ্যতা:</strong> {teacher.qualification}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-700">বিষয়:</strong> {teacher.subject}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                {teacher.phone && (
                  <a
                    href={`tel:${teacher.phone}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono">{teacher.phone}</span>
                  </a>
                )}
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">{teacher.email}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
