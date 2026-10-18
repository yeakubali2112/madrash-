'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  GraduationCap,
  FileCheck,
  Printer,
  CalendarCheck,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export const QuickAdmissionCta: React.FC = () => {
  const { info } = useMadrasah();

  return (
    <section className="py-16 bg-gradient-to-r from-[#00341c] via-[#004022] to-[#002b66] text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#DDAA00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="bg-[#001f4d]/80 border-2 border-[#DDAA00]/50 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#DDAA00] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block shadow">
                  নতুন সেশন ২০২৬ ভর্তি চলছে
                </span>
                <span className="text-xs text-[#DDAA00] font-bold">
                  {info.location || "দুপচাঁচিয়া, বগুড়া"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                আপনার সন্তানের দ্বীনি ও আধুনিক শিক্ষার নিশ্চয়তায় আজই ভর্তি আবেদন করুন
              </h2>
              <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                নূরানী, হেফজখানা, ইবতেদায়ী এবং দাখিল সাধারণ ও বিজ্ঞান বিভাগে সীমিত আসনে নতুন শিক্ষার্থী ভর্তি নেওয়া হচ্ছে। ঘরে বসেই খুব সহজে পূরণ করুন অনলাইন আবেদন ফরম।
              </p>

              {/* 3 Step Process */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="flex items-start gap-2.5 bg-[#001533]/80 p-3 rounded-xl border border-[#003580]">
                  <FileCheck className="w-5 h-5 text-[#DDAA00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">১. তথ্য দিন</h4>
                    <p className="text-[11px] text-emerald-200">সহজ অনলাইন ফরম পূরণ</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#001533]/80 p-3 rounded-xl border border-[#003580]">
                  <Printer className="w-5 h-5 text-[#DDAA00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">২. স্লিপ ডাউনলোড</h4>
                    <p className="text-[11px] text-emerald-200">তাৎক্ষণিক আবেদন কপি</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#001533]/80 p-3 rounded-xl border border-[#003580]">
                  <CalendarCheck className="w-5 h-5 text-[#DDAA00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">৩. সাক্ষাৎকার</h4>
                    <p className="text-[11px] text-emerald-200">সহজ যাচাই ও ভর্তি</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 cols */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-4">
              <div className="relative w-24 h-24 mb-2 drop-shadow-2xl">
                <Image
                  src="/logo.png"
                  alt={info.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>

              <Link
                href="/admission"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#DDAA00] hover:bg-[#c99a00] text-slate-950 font-black px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-all text-base text-center"
              >
                <GraduationCap className="w-6 h-6" />
                <span>অনলাইন ভর্তি ফরম পূরণ করুন</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="text-xs text-emerald-200 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#DDAA00]" />
                <span>যেকোনো তথ্যে কল করুন: <a href={`tel:${info.phone}`} className="text-[#DDAA00] font-bold hover:underline font-mono">{info.phone}</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
