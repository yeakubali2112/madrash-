'use client';

import React, { useState, useEffect } from 'react';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  getHijriDate,
  getBengaliDate,
  getGregorianDate,
  toBengaliDigits,
  parsePrayerTimeToMinutes,
  formatMinutesToBengaliCountdown
} from '@/lib/islamicCalendar';
import {
  Clock,
  Calendar,
  Sparkles,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  Compass,
  Bell,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';

export const PrayerTimesWidget: React.FC = () => {
  const { prayerConfig, info } = useMadrasah();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{
    currentName: string;
    nextName: string;
    nextTime: string;
    countdown: string;
    isIqamah: boolean;
  }>({
    currentName: 'ফজর',
    nextName: 'যোহর',
    nextTime: '০১:১৫',
    countdown: '',
    isIqamah: true
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute active & next prayer
  useEffect(() => {
    if (!prayerConfig) return;

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Prayers in chronological order (in minutes from midnight)
    const prayers = [
      {
        name: 'ফজর',
        iqamahTime: prayerConfig.fajrIqamah,
        athanTime: prayerConfig.fajrAthan,
        minutes: parsePrayerTimeToMinutes(prayerConfig.fajrIqamah, false)
      },
      {
        name: 'সূর্যোদয় (ইশরাক)',
        iqamahTime: prayerConfig.sunrise,
        athanTime: prayerConfig.sunrise,
        minutes: parsePrayerTimeToMinutes(prayerConfig.sunrise, false)
      },
      {
        name: 'যোহর',
        iqamahTime: prayerConfig.dhuhrIqamah,
        athanTime: prayerConfig.dhuhrAthan,
        minutes: parsePrayerTimeToMinutes(prayerConfig.dhuhrIqamah, true)
      },
      {
        name: 'আসর',
        iqamahTime: prayerConfig.asrIqamah,
        athanTime: prayerConfig.asrAthan,
        minutes: parsePrayerTimeToMinutes(prayerConfig.asrIqamah, true)
      },
      {
        name: 'মাগরিব',
        iqamahTime: prayerConfig.maghribIqamah,
        athanTime: prayerConfig.maghribAthan,
        minutes: parsePrayerTimeToMinutes(prayerConfig.maghribIqamah, true)
      },
      {
        name: 'এশা',
        iqamahTime: prayerConfig.ishaIqamah,
        athanTime: prayerConfig.ishaAthan,
        minutes: parsePrayerTimeToMinutes(prayerConfig.ishaIqamah, true)
      }
    ];

    let current = prayers[prayers.length - 1].name;
    let next = prayers[0];

    for (let i = 0; i < prayers.length; i++) {
      if (currentMinutes < prayers[i].minutes) {
        next = prayers[i];
        current = i === 0 ? 'এশা (শেষ রাত)' : prayers[i - 1].name;
        break;
      }
    }

    // Minutes diff
    let diff = next.minutes - currentMinutes;
    if (diff < 0) {
      diff += 24 * 60; // Next day's fajr
    }

    setNextPrayerInfo({
      currentName: current,
      nextName: next.name,
      nextTime: next.iqamahTime,
      countdown: formatMinutesToBengaliCountdown(diff),
      isIqamah: true
    });
  }, [currentTime, prayerConfig]);

  if (!prayerConfig || !prayerConfig.isEnabled) {
    return null;
  }

  const hijri = mounted ? getHijriDate(currentTime) : { day: '৯', month: 'জমাদিউল আউয়াল', year: '১৪৪৮', full: '৯ জমাদিউল আউয়াল, ১৪৪৮ হিজরি' };
  const bengali = mounted ? getBengaliDate(currentTime) : { day: '৪', month: 'কার্তিক', year: '১৪৩৩', season: 'হেমন্তকাল', full: '৪ কার্তিক, ১৪৩৩ বঙ্গাব্দ (হেমন্তকাল)' };
  const gregorian = mounted ? getGregorianDate(currentTime) : { day: '২০', month: 'অক্টোবর', year: '২০২৬', weekday: 'মঙ্গলবার', full: 'মঙ্গলবার, ২০ অক্টোবর ২০২৬' };

  // Live time string in Bengali
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const isPm = hours >= 12;
  const h12 = hours % 12 || 12;
  const timeStr = `${toBengaliDigits(h12)}:${toBengaliDigits(String(minutes).padStart(2, '0'))}:${toBengaliDigits(String(seconds).padStart(2, '0'))} ${isPm ? 'অপরাহ্ন' : 'পূর্বাহ্ন'}`;

  const isFriday = currentTime.getDay() === 5;

  const prayerCards = [
    {
      id: 'fajr',
      name: 'ফজর',
      arabic: 'الفجر',
      athan: prayerConfig.fajrAthan,
      iqamah: prayerConfig.fajrIqamah,
      icon: Moon,
      color: 'from-indigo-600/10 to-indigo-50 border-indigo-200 text-indigo-900',
      badgeColor: 'bg-indigo-600 text-white',
      desc: 'ভোরের সালাত'
    },
    {
      id: 'sunrise',
      name: 'সূর্যোদয় ও ইশরাক',
      arabic: 'الشروق',
      athan: prayerConfig.sunrise,
      iqamah: prayerConfig.sunrise,
      icon: Sunrise,
      color: 'from-amber-600/10 to-amber-50 border-amber-200 text-amber-950',
      badgeColor: 'bg-amber-600 text-white',
      desc: 'নফল নামাযের সময়',
      isSingleTime: true
    },
    {
      id: 'dhuhr',
      name: isFriday ? 'জুমুআ' : 'যোহর',
      arabic: isFriday ? 'الجمعة' : 'الظهر',
      athan: isFriday ? prayerConfig.jumuahBayan : prayerConfig.dhuhrAthan,
      iqamah: isFriday ? prayerConfig.jumuahIqamah : prayerConfig.dhuhrIqamah,
      icon: Sun,
      color: 'from-emerald-600/10 to-emerald-50 border-emerald-300 text-emerald-950',
      badgeColor: 'bg-[#006837] text-white',
      desc: isFriday ? 'বয়ান ও জামাত' : 'মধ্যাহ্ন সালাত'
    },
    {
      id: 'asr',
      name: 'আসর',
      arabic: 'العصر',
      athan: prayerConfig.asrAthan,
      iqamah: prayerConfig.asrIqamah,
      icon: Sunset,
      color: 'from-orange-600/10 to-orange-50 border-orange-200 text-orange-950',
      badgeColor: 'bg-orange-600 text-white',
      desc: 'অপরাহ্নের সালাত'
    },
    {
      id: 'maghrib',
      name: 'মাগরিব',
      arabic: 'المغرب',
      athan: prayerConfig.maghribAthan,
      iqamah: prayerConfig.maghribIqamah,
      icon: Sunset,
      color: 'from-rose-600/10 to-rose-50 border-rose-200 text-rose-950',
      badgeColor: 'bg-rose-600 text-white',
      desc: 'সূর্যাস্ত ও ইফতার'
    },
    {
      id: 'isha',
      name: 'এশা ও বিতর',
      arabic: 'العشاء',
      athan: prayerConfig.ishaAthan,
      iqamah: prayerConfig.ishaIqamah,
      icon: Moon,
      color: 'from-blue-600/10 to-blue-50 border-blue-200 text-blue-950',
      badgeColor: 'bg-blue-700 text-white',
      desc: 'রাত্রিকালীন সালাত'
    }
  ];

  return (
    <section className="relative py-10 bg-gradient-to-b from-[#f4f8f5] via-white to-slate-50 border-y border-emerald-100/70 overflow-hidden">
      {/* Subtle Islamic Geometry Background Details */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-bg-pattern" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Top Header Card with Real-time Clock and 3 Dates */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100/80 mb-8 transition-all hover:shadow-md">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title & Location */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#006837]/10 text-[#006837] text-xs font-bold px-3.5 py-1.5 rounded-full mb-2.5">
                <Compass className="w-3.5 h-3.5 text-[#006837] animate-spin" style={{ animationDuration: '16s' }} />
                <span>দৈনিক সালাত ও ইসলামিক ক্যালেন্ডার</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                <span className="text-[#00542c]">{prayerConfig.areaNote || 'দুপচাঁচিয়া, বগুড়া'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>আজকের সালাতের সময়সূচি</span>
                <Sparkles className="w-5 h-5 text-[#DDAA00]" />
              </h2>
              <p className="text-slate-600 text-xs md:text-sm mt-1">
                মাদ্রাসা মসজিদ ও স্থানীয় মুসল্লিদের সুবিধার্থে ওয়াক্ত ও জামাতের নিয়মিত সময়
              </p>
            </div>

            {/* Live Clock & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
              {/* Live Digital Clock */}
              <div className="bg-gradient-to-br from-[#00341c] to-[#00542c] text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3 border border-emerald-700">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Clock className="w-5 h-5 text-[#DDAA00]" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">
                    বর্তমান স্থানীয় সময়
                  </div>
                  <div suppressHydrationWarning className="text-sm md:text-base font-black font-mono tracking-wide text-white">
                    {mounted ? timeStr : '--:--:--'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Dates Banner (Hijri + Bengali + English) */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Hijri Calendar */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/60 rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.01]">
              <div className="w-10 h-10 rounded-xl bg-[#006837] text-[#DDAA00] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                🌙
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#006837] block">
                  হিজরি বর্ষপঞ্জি
                </span>
                <p className="text-xs md:text-sm font-bold text-slate-900 truncate">
                  {hijri.full}
                </p>
              </div>
            </div>

            {/* Bengali Calendar */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-200/60 rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.01]">
              <div className="w-10 h-10 rounded-xl bg-[#DDAA00] text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                🌾
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900 block">
                  বাংলা বর্ষপঞ্জি (বঙ্গাব্দ)
                </span>
                <p className="text-xs md:text-sm font-bold text-slate-900 truncate">
                  {bengali.full}
                </p>
              </div>
            </div>

            {/* Gregorian Calendar */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 border border-blue-200/60 rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.01]">
              <div className="w-10 h-10 rounded-xl bg-[#003580] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                📅
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#003580] block">
                  ইংরেজি ও জাতীয় তারিখ
                </span>
                <p className="text-xs md:text-sm font-bold text-slate-900 truncate">
                  {gregorian.full}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Next Prayer Alert Banner */}
        <div className="bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] rounded-2xl p-4 md:p-5 text-white shadow-md border-2 border-[#DDAA00]/40 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDAA00] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#DDAA00]" />
              </span>
            </div>
            <div>
              <div className="text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
                <span>বর্তমান ওয়াক্ত:</span>
                <strong className="text-white bg-white/20 px-2 py-0.5 rounded text-[11px]">
                  {nextPrayerInfo.currentName}
                </strong>
              </div>
              <div className="text-base md:text-lg font-black tracking-tight text-white mt-0.5">
                পরবর্তী জামাত: <span className="text-[#DDAA00]">{nextPrayerInfo.nextName}</span> ({nextPrayerInfo.nextTime})
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-right self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
            <span className="text-[10px] text-emerald-200 font-semibold uppercase">জামাতের বাকি সময়</span>
            <span className="text-xs md:text-sm font-black text-[#DDAA00] font-mono">
              {nextPrayerInfo.countdown || 'সময় গণনা হচ্ছে...'}
            </span>
          </div>
        </div>

        {/* 6 Grid Prayer Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
          {prayerCards.map((card) => {
            const Icon = card.icon;
            const isNext = nextPrayerInfo.nextName.includes(card.name);

            return (
              <div
                key={card.id}
                className={`relative rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between ${
                  isNext
                    ? 'bg-gradient-to-b from-amber-50 to-emerald-50/60 border-[#DDAA00] ring-2 ring-[#DDAA00]/50 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm hover:shadow'
                }`}
              >
                {/* Active Indicator Pin */}
                {isNext && (
                  <div className="absolute -top-2.5 right-3 bg-[#DDAA00] text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                    পরবর্তী
                  </div>
                )}

                {/* Card Header: Icon & Arabic Name */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.badgeColor} shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-serif font-bold text-slate-400">
                      {card.arabic}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 leading-tight">
                    {card.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mb-3">
                    {card.desc}
                  </p>
                </div>

                {/* Times Area */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {card.isSingleTime ? (
                    <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-semibold">ওয়াক্ত শুরু</div>
                      <div className="text-sm font-black text-slate-900 font-mono">
                        {card.athan}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[10px] text-slate-500 font-medium">আযান:</span>
                        <span className="font-bold text-slate-700 font-mono text-xs">
                          {card.athan}
                        </span>
                      </div>
                      <div className="bg-emerald-50/80 rounded-lg p-1.5 flex justify-between items-center border border-emerald-100">
                        <span className="text-[10px] text-[#006837] font-bold">জামাত:</span>
                        <span className="font-black text-[#006837] font-mono text-sm">
                          {card.iqamah}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sahri, Iftar & Quranic Verse Footer Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#004d28] to-[#00341c] text-white rounded-2xl p-5 shadow-sm border border-emerald-700/60 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Sahri & Tahajjud Info */}
          <div className="flex items-center gap-3.5 border-b md:border-b-0 md:border-r border-emerald-700/60 pb-4 md:pb-0 md:pr-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Moon className="w-5 h-5 text-[#DDAA00]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                সাহরি ও তাহাজ্জুদ শেষ
              </span>
              <div className="text-sm md:text-base font-black text-white font-mono">
                {prayerConfig.tahajjudEnd} <span className="text-xs text-emerald-300 font-normal">(ভোর)</span>
              </div>
            </div>
          </div>

          {/* Iftar Time */}
          <div className="flex items-center gap-3.5 border-b md:border-b-0 md:border-r border-emerald-700/60 pb-4 md:pb-0 md:pr-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Sunset className="w-5 h-5 text-[#DDAA00]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                ইফতারের সময় (আজকের)
              </span>
              <div className="text-sm md:text-base font-black text-white font-mono">
                {prayerConfig.iftarTime} <span className="text-xs text-emerald-300 font-normal">(সন্ধ্যা)</span>
              </div>
            </div>
          </div>

          {/* Quranic Verse */}
          <div className="text-left md:text-right">
            <p className="text-xs text-emerald-100 font-medium italic leading-relaxed">
              &quot;{prayerConfig.prayerQuoteBangla || 'নিশ্চয়ই সালাত মুমিনদের ওপর নির্দিষ্ট সময়ে ফরয করা হয়েছে।'}&quot;
            </p>
            <span className="text-[10px] text-[#DDAA00] font-bold block mt-1">
              — {prayerConfig.prayerQuoteSource || 'আল-কুরআন (সূরা আন-নিসা: ১০৩)'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
