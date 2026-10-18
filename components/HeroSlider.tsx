'use client';

import React from 'react';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import { NoticeTicker } from './NoticeTicker';
import {
  GraduationCap,
  Award,
  ArrowRight
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { info } = useMadrasah();

  return (
    <section className="relative bg-gradient-to-br from-[#002d18] via-[#004022] to-[#001f4d] text-white overflow-hidden islamic-bg-pattern">
      {/* Notice Ticker seamlessly embedded with transparent background */}
      <NoticeTicker />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#006837]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#003580]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8 py-16 lg:py-24">
        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            {info.name}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-[#DDAA00] font-bold">
            {info.slogan}
          </p>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
          ১৯৯৫ সাল থেকে নিষ্ঠা ও সুশৃঙ্খল পরিবেশে দুপচাঁচিয়া, বগুড়ায় দ্বীনি মূল্যবোধ, কুরআন-হাদিসের আদর্শ শিক্ষা এবং বোর্ড নির্ধারিত আধুনিক বিজ্ঞান ও প্রযুক্তির সমন্বয়ে গড়ে তুলছি সৎ, দক্ষ ও আলোকিত প্রজন্ম।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
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
      </div>
    </section>
  );
};
