'use client';

import React from 'react';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  School,
  Award,
  BookOpen,
  Users,
  Target,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function AboutPage() {
  const { info } = useMadrasah();

  const committeeMembers = [
    { name: "হাজী মোঃ নুরুল ইসলাম", role: "সভাপতি", title: "বিশিষ্ট শিক্ষানুরাগী ও সমাজসেবক" },
    { name: info.principalName, role: "সদস্য সচিব", title: info.principalTitle },
    { name: "আলহাজ্ব মোঃ সামসুল হক", role: "সহ-সভাপতি", title: "প্রতিষ্ঠাতা সদস্য" },
    { name: "মোঃ রফিকুল আলম", role: "শিক্ষক প্রতিনিধি", title: "সিনিয়র শিক্ষক (আরবি)" },
    { name: "মোঃ মোস্তাফিজুর রহমান", role: "শিক্ষক প্রতিনিধি", title: "সহকারী শিক্ষক (ইংরেজি)" },
    { name: "মোঃ খলিলুর রহমান", role: "অভিভাবক সদস্য", title: "সমাজসেবক" },
    { name: "মোসাঃ রহিমা খাতুন", role: "মহিলা অভিভাবক সদস্য", title: "সদস্য" }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        {/* Page Hero */}
        <div className="text-center">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            পরিচিতি ও ইতিহাস
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            আমাদের মাদ্রাসা সম্পর্কে
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl mx-auto">
            {info.name}-এর গৌরবময় অতীত, বর্তমান কার্যক্রম এবং ভবিষ্যৎ কর্মপরিকল্পনা
          </p>
        </div>

        {/* Madrasah Cover Banner */}
        {info.bannerImage && (
          <div className="relative w-full h-56 md:h-80 rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-100 group">
            <Image
              src={info.bannerImage}
              alt={info.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 md:p-8">
              <div>
                <span className="inline-block px-3 py-1 bg-[#DDAA00] text-slate-950 text-xs font-black rounded-lg mb-2 shadow">
                  ক্যাম্পাস ও প্রতিষ্ঠান
                </span>
                <h2 className="text-xl md:text-3xl font-black text-white drop-shadow">
                  {info.name}
                </h2>
                <p className="text-emerald-200 text-xs md:text-sm font-semibold mt-1">
                  {info.slogan || "দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়"} • স্থাপিত: {info.established} ইং
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History & Establishment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <School className="w-7 h-7 text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">মাদ্রাসার ইতিহাস ও ঐতিহ্য</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
              <p>
                ১৯৯৫ খ্রিষ্টাব্দে অত্র পশ্চিম আলোহালী অঞ্চলের একদল ধর্মপ্রাণ ও শিক্ষানুরাগী ব্যক্তিবর্গের মহৎ প্রচেষ্টায় প্রতিষ্ঠিত হয় <strong>{info.name}</strong>। প্রতিষ্ঠার পর থেকেই প্রতিষ্ঠানটি এই অঞ্চলের সাধারণ পরিবারের সন্তানদের মাঝে পবিত্র কুরআন ও সুন্নাহর বিশুদ্ধ জ্ঞান ছড়িয়ে দিতে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে।
              </p>
              <p>
                বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড কর্তৃক নিয়মিত পাঠদানের অনুমতি ও এমপিওভুক্তি লাভ করে প্রতিষ্ঠানটি ক্রমান্বয়ে নূরানী ও হেফজখানা থেকে শুরু করে ইবতেদায়ী এবং পূর্ণাঙ্গ দাখিল পর্যায়ে উন্নীত হয়।
              </p>
              <p>
                বর্তমানে মাদ্রাসায় দাখিল সাধারণ বিভাগের পাশাপাশি রয়েছে বিজ্ঞান বিভাগ ও অত্যাধুনিক ডিজিটাল কম্পিউটার ল্যাব, যা শিক্ষার্থীদের মাদ্রাসা শিক্ষার পাশাপাশি আন্তর্জাতিক ও বিজ্ঞানভিত্তিক প্রতিযোগিতায় এগিয়ে রাখছে।
              </p>
            </div>

            <div className="md:col-span-5 bg-gradient-to-br from-[#00341c] via-[#006837] to-[#003580] text-white rounded-2xl p-6 shadow-xl space-y-4 border-2 border-[#DDAA00]/40">
              <div className="flex items-center gap-3 border-b border-[#DDAA00]/40 pb-3">
                <div className="relative w-14 h-14 shrink-0 drop-shadow-md">
                  <Image
                    src={info.logo || "/logo.png"}
                    alt={info.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#DDAA00]">
                    একনজরে তথ্য
                  </h3>
                  <p className="text-xs text-emerald-200 font-semibold">{info.location || "দুপচাঁচিয়া, বগুড়া"}</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs">
                <li className="flex justify-between border-b border-emerald-800/60 pb-1.5">
                  <span className="text-emerald-200">প্রতিষ্ঠা সাল:</span>
                  <span className="font-bold">{info.established} ইং</span>
                </li>
                <li className="flex justify-between border-b border-emerald-800/60 pb-1.5">
                  <span className="text-emerald-200">EIIN নম্বর:</span>
                  <span className="font-mono font-bold text-[#DDAA00]">{info.eiin}</span>
                </li>
                <li className="flex justify-between border-b border-emerald-800/60 pb-1.5">
                  <span className="text-emerald-200">মাদ্রাসা কোড:</span>
                  <span className="font-mono font-bold">{info.madrasahCode}</span>
                </li>
                <li className="flex justify-between border-b border-emerald-800/60 pb-1.5">
                  <span className="text-emerald-200">এমপিও কোড:</span>
                  <span className="font-mono font-bold">{info.mpoCode}</span>
                </li>
                <li className="flex justify-between border-b border-emerald-800/60 pb-1.5">
                  <span className="text-emerald-200">অবস্থান:</span>
                  <span className="font-bold text-[#DDAA00] text-right">দুপচাঁচিয়া, বগুড়া</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-emerald-200">শিক্ষা বোর্ড:</span>
                  <span className="font-semibold text-right">বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">আমাদের লক্ষ্য (Mission)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              পবিত্র কুরআন ও হাদিসের আলোকে ইসলামী অনুশাসন, উন্নত চরিত্র এবং আধুনিক তথ্যপ্রযুক্তি ও সাধারণ শিক্ষার সমন্বয়ে এমন এক প্রজন্ম গড়ে তোলা যারা সমাজের প্রতি দায়বদ্ধ এবং দেশ ও জাতির অগ্রগতিতে কার্যকর অবদান রাখবে।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">আমাদের দৃষ্টিভঙ্গি (Vision)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              একটি মডেল ডিজিটাল দাখিল মাদ্রাসা হিসেবে নিজেদের প্রতিষ্ঠিত করা যেখানে ধর্মীয় শিক্ষার পবিত্রতা বজায় রাখার পাশাপাশি শিক্ষার্থীদের আন্তর্জাতিক মানের বিজ্ঞান, গণিত ও প্রযুক্তি বিদ্যায় দক্ষ করে গড়ে তোলা হবে।
            </p>
          </div>
        </div>

        {/* Managing Committee */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <Users className="w-7 h-7 text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">ম্যানেজিং ও পরিচালনা কমিটি</h2>
          </div>

          <p className="text-xs md:text-sm text-slate-600">
            মাদ্রাসার সুষ্ঠু পরিচালনা, আর্থিক স্বচ্ছতা এবং সার্বিক মানোন্নয়নে দায়িত্ব পালনরত সম্মানিত পরিচালনা পর্ষদের সদস্যবৃন্দ:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committeeMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    {member.role}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
