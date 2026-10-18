'use client';

import React from 'react';
import Link from 'next/link';
import { defaultDepartments } from '@/lib/data';
import {
  BookOpen,
  Award,
  GraduationCap,
  School,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Award,
  GraduationCap,
  School,
  Sparkles,
  CheckCircle2
};

export const Departments: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            শিক্ষা কার্যক্রম
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            আমাদের পাঠদান ও বিভাগসমূহ
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            নূরানী ও হেফজখানা থেকে শুরু করে দাখিল বিজ্ঞান ও সাধারণ বিভাগ পর্যন্ত পরিকল্পিত ও আধুনিক কারিকুলাম
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultDepartments.map((dept) => {
            const Icon = iconMap[dept.icon] || BookOpen;
            return (
              <div
                key={dept.id}
                className="group bg-slate-50 hover:bg-emerald-900/95 hover:text-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-700 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-amber-500 text-emerald-800 group-hover:text-slate-950 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-bold text-amber-600 group-hover:text-amber-300 tracking-wide uppercase block mb-1">
                    {dept.englishTitle}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">
                    {dept.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 group-hover:text-emerald-100 mb-4 leading-relaxed transition-colors">
                    {dept.description}
                  </p>

                  <div className="mb-4 pt-3 border-t border-slate-200 group-hover:border-emerald-800 transition-colors">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-amber-300 mb-2">
                      শ্রেণি: {dept.classes}
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 group-hover:text-emerald-200">
                      {dept.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href={`/admission?dept=${dept.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-300 hover:underline transition-colors"
                  >
                    <span>এই বিভাগে ভর্তি হতে চান?</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
