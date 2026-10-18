'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/data';
import { useMadrasah } from '@/context/MadrasahContext';
import { Camera, Filter, X, Eye, ImageOff } from 'lucide-react';

export default function GalleryPage() {
  const { info, gallery } = useMadrasah();
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['সকল', 'ক্যাম্পাস', 'অনুষ্ঠান', 'প্রতিযোগিতা', 'ক্লাস', 'সাধারণ'];

  const filteredGallery = (gallery || []).filter(item =>
    selectedCategory === 'সকল' || item.category === selectedCategory
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            স্মৃতি ও মুহূর্ত
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            মাদ্রাসা ফটো ও ইভেন্ট গ্যালারি
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর বিভিন্ন ধর্মীয় অনুষ্ঠান, ওয়াজ মাহফিল, বিজ্ঞান মেলা ও ক্যাম্পাসের স্থিরচিত্র
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <ImageOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">এই বিভাগে কোন ছবি পাওয়া যায়নি</h3>
            <p className="text-slate-500 text-xs mt-1">অন্য ক্যাটাগরি নির্বাচন করুন বা পরবর্তীতে আবার দেখুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 cursor-pointer bg-slate-950 transition-all duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-base leading-snug group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-[65vh] w-full bg-black">
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-5 bg-slate-950 text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-0.5">
                  ক্যাটাগরি: {activePhoto.category} • {activePhoto.date}
                </span>
                <h3 className="text-lg font-bold">{activePhoto.title}</h3>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
