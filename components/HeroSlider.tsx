'use client';

import React from 'react';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle,
  MapPin
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { info } = useMadrasah();

  return (
    <section className="relative bg-gradient-to-br from-[#002d18] via-[#004022] to-[#001f4d] text-white overflow-hidden py-14 lg:py-24 islamic-bg-pattern">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#006837]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#003580]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 text-center space-y-7">
        {/* Arabic Ayah Callout */}
        <div className="inline-flex flex-col items-center bg-[#002d18]/90 border border-[#DDAA00]/40 rounded-2xl px-6 py-3.5 shadow-xl backdrop-blur-md">
          <span className="font-arabic text-xl md:text-2xl lg:text-3xl text-[#DDAA00] font-bold tracking-wide">
            {info.bannerVerseArabic}
          </span>
          <span className="text-xs md:text-sm text-emerald-200 mt-1.5 font-medium">
            &quot;{info.bannerVerseBangla}&quot;
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#DDAA00] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2 shadow">
            <MapPin className="w-3.5 h-3.5" />
            <span>{info.location || "দুপচাঁচিয়া, বগুড়া"} • দ্বীনি শিক্ষার অনন্য প্রতিষ্ঠান</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            {info.name}
          </h1>
          <p className="text-lg md:text-2xl text-[#DDAA00] font-bold">
            {info.slogan}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
          ১৯৯৫ সাল থেকে নিষ্ঠা ও সুশৃঙ্খল পরিবেশে দুপচাঁচিয়া, বগুড়ায় দ্বীনি মূল্যবোধ, কুরআন-হাদিসের আদর্শ শিক্ষা এবং বোর্ড নির্ধারিত আধুনিক বিজ্ঞান ও প্রযুক্তির সমন্বয়ে গড়ে তুলছি সৎ, দক্ষ ও আলোকিত প্রজন্ম।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/admission"
            className="group inline-flex items-center gap-2 bg-[#DDAA00] hover:bg-[#c99a00] text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-xl hover:shadow-[#DDAA00]/30 transition-all hover:scale-105 text-sm sm:text-base"
          >
            <GraduationCap className="w-5 h-5 text-slate-950" />
            <span>অনলাইন ভর্তি আবেদন করুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/results"
            className="inline-flex items-center gap-2 bg-[#003580] hover:bg-[#002b66] text-white font-bold px-7 py-3.5 rounded-xl border border-[#DDAA00]/40 shadow-lg backdrop-blur-sm transition-all hover:scale-105 text-sm sm:text-base"
          >
            <Award className="w-5 h-5 text-[#DDAA00]" />
            <span>পরীক্ষার ফলাফল অনুসন্ধান</span>
          </Link>
        </div>

        {/* Quick check highlights */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-emerald-200 pt-3">
          <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
            <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
            <span>বোর্ড অনুমোদিত পূর্ণাঙ্গ মাদ্রাসা</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
            <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
            <span>হিফজ ও নূরানী আবাসিক সুবিধা</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
            <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
            <span>বিজ্ঞান ও কম্পিউটার ল্যাব</span>
          </span>
        </div>
      </div>
    </section>
  );
};
