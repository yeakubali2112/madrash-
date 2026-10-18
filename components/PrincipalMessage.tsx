'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import { Quote, ChevronRight, UserCheck } from 'lucide-react';

export const PrincipalMessage: React.FC = () => {
  const { info } = useMadrasah();
  const [showFullSuper, setShowFullSuper] = useState(false);
  const [showFullPres, setShowFullPres] = useState(false);

  return (
    <section id="principal-message" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            দিকনির্দেশনামূলক বাণী
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            কর্তৃপক্ষের বাণী
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            মাদ্রাসার সার্বিক উন্নয়ন, শিক্ষা কার্যক্রম ও ভবিষ্যৎ পরিকল্পনা সম্পর্কে দায়িত্বশীল ব্যক্তিবর্গের বক্তব্য
          </p>
        </div>

        {/* Two Columns: Superintendent and President */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Superintendent Message */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-start gap-4 mb-5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0 border-2 border-emerald-600">
                  <Image
                    src={info.principalImage}
                    alt={info.principalName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit mb-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>সুপারিনটেনডেন্টের বাণী</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {info.principalName}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {info.principalTitle}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    {info.name}
                  </p>
                </div>
              </div>

              <div className="relative bg-emerald-50/50 rounded-xl p-4 border-l-4 border-emerald-600">
                <Quote className="w-8 h-8 text-emerald-300/60 absolute top-2 right-2 -rotate-12" />
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
                  {showFullSuper ? info.principalMessage : `${info.principalMessage.slice(0, 220)}...`}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono text-[11px]">প্রতিষ্ঠানের কর্ণধার</span>
              <button
                onClick={() => setShowFullSuper(!showFullSuper)}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-0.5"
              >
                <span>{showFullSuper ? 'সংক্ষিপ্ত করুন' : 'সম্পূর্ণ পড়ুন'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* President Message */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-start gap-4 mb-5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0 border-2 border-amber-600">
                  <Image
                    src={info.presidentImage}
                    alt={info.presidentName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full w-fit mb-1 border border-amber-200">
                    <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>সভাপতির বাণী</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {info.presidentName}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {info.presidentTitle}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    পরিচালনা পর্ষদ, {info.name}
                  </p>
                </div>
              </div>

              <div className="relative bg-amber-50/40 rounded-xl p-4 border-l-4 border-amber-600">
                <Quote className="w-8 h-8 text-amber-300/60 absolute top-2 right-2 -rotate-12" />
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
                  {showFullPres ? info.presidentMessage : `${info.presidentMessage.slice(0, 220)}...`}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono text-[11px]">ম্যানেজিং কমিটি</span>
              <button
                onClick={() => setShowFullPres(!showFullPres)}
                className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-0.5"
              >
                <span>{showFullPres ? 'সংক্ষিপ্ত করুন' : 'সম্পূর্ণ পড়ুন'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
