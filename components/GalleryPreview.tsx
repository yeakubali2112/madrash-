'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import { ChevronRight, Camera } from 'lucide-react';

export const GalleryPreview: React.FC = () => {
  const { gallery } = useMadrasah();
  const displayItems = (gallery && gallery.length > 0 ? gallery : []).slice(0, 4);

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
              ছবি ও স্মৃতি
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              ফটো গ্যালারি
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              মাদ্রাসার বিভিন্ন অনুষ্ঠান, জাতীয় দিবস, ক্বেরাত প্রতিযোগিতা ও শিক্ষার্থীদের কার্যক্রমের চিত্র
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>সম্পূর্ণ গ্যালারি দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 bg-slate-900"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm mt-2 leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-[11px] text-slate-300 font-mono mt-1 block">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
