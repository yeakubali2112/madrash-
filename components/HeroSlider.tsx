'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import { defaultHeroSettings } from '@/lib/data';
import { NoticeTicker } from './NoticeTicker';
import {
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle,
  MapPin,
  Users,
  BookOpen,
  Sparkles
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { info, heroSettings } = useMadrasah();
  const hero = heroSettings || defaultHeroSettings;

  return (
    <section className="relative bg-gradient-to-br from-[#002d18] via-[#004022] to-[#001f4d] text-white overflow-hidden islamic-bg-pattern">
      {/* Notice Ticker if enabled */}
      {hero.showNoticeTicker && <NoticeTicker />}

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#006837]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#003580]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 lg:py-24">
        <div className={`grid grid-cols-1 ${hero.showStatsCard ? 'lg:grid-cols-12 gap-10 items-center' : 'max-w-4xl mx-auto text-center'}`}>
          {/* Main Hero Column */}
          <div className={`${hero.showStatsCard ? 'lg:col-span-7 space-y-6 text-center lg:text-left' : 'space-y-8'}`}>
            {/* Arabic Ayah Callout */}
            {hero.showAyahCallout && (
              <div className="inline-flex flex-col items-center bg-[#002d18]/90 border border-[#DDAA00]/40 rounded-2xl px-6 py-3.5 shadow-xl backdrop-blur-md">
                <span className="font-arabic text-xl md:text-2xl lg:text-3xl text-[#DDAA00] font-bold tracking-wide">
                  {hero.ayahArabic}
                </span>
                <span className="text-xs md:text-sm text-emerald-200 mt-1.5 font-medium">
                  &quot;{hero.ayahBangla}&quot;
                </span>
              </div>
            )}

            {/* Location Pill */}
            {hero.showLocationBadge && (
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#DDAA00] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2 shadow">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{hero.locationBadgeText || `${info.location || "দুপচাঁচিয়া, বগুড়া"} • দ্বীনি শিক্ষার অনন্য প্রতিষ্ঠান`}</span>
                </div>
              </div>
            )}

            {/* Main Headline & Slogan */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                {hero.headline || info.name}
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#DDAA00] font-bold">
                {hero.slogan || info.slogan}
              </p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {hero.description}
            </p>

            {/* Action Buttons */}
            {(hero.showButton1 || hero.showButton2) && (
              <div className={`flex flex-wrap items-center gap-4 pt-3 ${hero.showStatsCard ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                {hero.showButton1 && (
                  <Link
                    href={hero.button1Link || "/admission"}
                    className="group inline-flex items-center gap-2 bg-[#DDAA00] hover:bg-[#c99a00] text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-xl hover:shadow-[#DDAA00]/30 transition-all hover:scale-105 text-sm sm:text-base"
                  >
                    <GraduationCap className="w-5 h-5 text-slate-950" />
                    <span>{hero.button1Text || "অনলাইন ভর্তি আবেদন করুন"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {hero.showButton2 && (
                  <Link
                    href={hero.button2Link || "/results"}
                    className="inline-flex items-center gap-2 bg-[#003580] hover:bg-[#002b66] text-white font-bold px-7 py-3.5 rounded-xl border border-[#DDAA00]/40 shadow-lg backdrop-blur-sm transition-all hover:scale-105 text-sm sm:text-base"
                  >
                    <Award className="w-5 h-5 text-[#DDAA00]" />
                    <span>{hero.button2Text || "পরীক্ষার ফলাফল অনুসন্ধান"}</span>
                  </Link>
                )}
              </div>
            )}

            {/* Highlights checkmarks */}
            {hero.showHighlights && (
              <div className={`flex flex-wrap items-center gap-3 text-xs md:text-sm text-emerald-200 pt-3 ${hero.showStatsCard ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
                  <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
                  <span>{hero.highlight1}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
                  <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
                  <span>{hero.highlight2}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#002d18]/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
                  <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
                  <span>{hero.highlight3}</span>
                </span>
              </div>
            )}
          </div>

          {/* Right Highlights Card if enabled */}
          {hero.showStatsCard && (
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-[#003580]/90 to-[#001533]/95 border-2 border-[#DDAA00]/50 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6">
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
          )}
        </div>
      </div>
    </section>
  );
};
