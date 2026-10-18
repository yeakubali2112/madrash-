'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  GraduationCap,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle,
  MapPin
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { info } = useMadrasah();

  return (
    <section className="relative bg-gradient-to-br from-[#002d18] via-[#004022] to-[#001f4d] text-white overflow-hidden py-12 lg:py-20 islamic-bg-pattern">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#006837]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#003580]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Arabic Ayah Callout */}
            <div className="inline-flex flex-col items-center lg:items-start bg-[#002d18]/90 border border-[#DDAA00]/40 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md">
              <span className="font-arabic text-xl md:text-2xl text-[#DDAA00] font-bold tracking-wide">
                {info.bannerVerseArabic}
              </span>
              <span className="text-xs md:text-sm text-emerald-200 mt-1 font-medium">
                &quot;{info.bannerVerseBangla}&quot;
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#DDAA00] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow">
                <MapPin className="w-3.5 h-3.5" />
                <span>{info.location || "দুপচাঁচিয়া, বগুড়া"} • দ্বীনি শিক্ষার অনন্য প্রতিষ্ঠান</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight">
                {info.name}
              </h1>
              <p className="text-lg md:text-xl text-[#DDAA00] font-bold">
                {info.slogan}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
              ১৯৯৫ সাল থেকে নিষ্ঠা ও সুশৃঙ্খল পরিবেশে দুপচাঁচিয়া, বগুড়ায় দ্বীনি মূল্যবোধ, কুরআন-হাদিসের আদর্শ শিক্ষা এবং বোর্ড নির্ধারিত আধুনিক বিজ্ঞান ও প্রযুক্তির সমন্বয়ে গড়ে তুলছি সৎ, দক্ষ ও আলোকিত প্রজন্ম।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/admission"
                className="group inline-flex items-center gap-2 bg-[#DDAA00] hover:bg-[#c99a00] text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-xl hover:shadow-[#DDAA00]/30 transition-all hover:scale-105 text-sm"
              >
                <GraduationCap className="w-5 h-5 text-slate-950" />
                <span>অনলাইন ভর্তি আবেদন করুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/results"
                className="inline-flex items-center gap-2 bg-[#003580] hover:bg-[#002b66] text-white font-bold px-6 py-3.5 rounded-xl border border-[#DDAA00]/40 shadow-lg backdrop-blur-sm transition-all hover:scale-105 text-sm"
              >
                <Award className="w-5 h-5 text-[#DDAA00]" />
                <span>পরীক্ষার ফলাফল অনুসন্ধান</span>
              </Link>
            </div>

            {/* Quick check highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200 pt-2">
              <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-2.5 py-1 rounded-md border border-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-[#DDAA00]" />
                <span>বোর্ড অনুমোদিত পূর্ণাঙ্গ মাদ্রাসা</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-2.5 py-1 rounded-md border border-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-[#DDAA00]" />
                <span>হিফজ ও নূরানী আবাসিক সুবিধা</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-2.5 py-1 rounded-md border border-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-[#DDAA00]" />
                <span>বিজ্ঞান ও কম্পিউটার ল্যাব</span>
              </span>
            </div>
          </div>

          {/* Right Highlights Card with Logo & Stats (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-[#003580]/90 to-[#001533]/95 border-2 border-[#DDAA00]/50 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6">
              {/* Logo and Name in Card Header */}
              <div className="flex items-center gap-3.5 border-b border-[#003580] pb-4">
                <div className="relative w-20 h-20 shrink-0 drop-shadow-xl bg-white rounded-2xl p-1 border-2 border-[#DDAA00]">
                  <Image
                    src="/logo.png"
                    alt={info.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="bg-[#DDAA00] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    EIIN: {info.eiin}
                  </span>
                  <h3 className="font-bold text-white text-sm md:text-base leading-snug mt-1">
                    {info.name}
                  </h3>
                  <p className="text-xs text-[#DDAA00] font-semibold">{info.location || "দুপচাঁচিয়া, বগুড়া"}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                  <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white">{info.stats.students}</div>
                  <div className="text-[11px] text-emerald-200 font-medium">বর্তমান শিক্ষার্থী</div>
                </div>

                <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                  <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white">{info.stats.teachers}</div>
                  <div className="text-[11px] text-emerald-200 font-medium">শিক্ষক ও স্টাফ</div>
                </div>

                <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                  <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#DDAA00]">{info.stats.passRate}</div>
                  <div className="text-[11px] text-emerald-200 font-medium">দাখিল পাশের গড় হার</div>
                </div>

                <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                  <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#DDAA00]">{info.stats.gpa5}</div>
                  <div className="text-[11px] text-emerald-200 font-medium">মোট জিপিএ-৫ প্রাপ্তি</div>
                </div>
              </div>

              {/* Fast links inside box */}
              <div className="pt-2 border-t border-[#003580] space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/routine"
                    className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#006837] hover:bg-[#00542c] text-white font-bold transition-colors shadow-sm"
                  >
                    ক্লাস রুটিন
                  </Link>
                  <Link
                    href="/notices"
                    className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#002b66] hover:bg-[#003580] text-[#DDAA00] font-bold transition-colors border border-[#DDAA00]/40"
                  >
                    সর্বশেষ নোটিশ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
