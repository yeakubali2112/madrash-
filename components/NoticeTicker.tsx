'use client';

import React from 'react';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import { Bell } from 'lucide-react';

export const NoticeTicker: React.FC = () => {
  const { urgentNotices, tickerSettings } = useMadrasah();

  // If ticker is disabled in admin settings, do not render
  if (tickerSettings && !tickerSettings.isEnabled) {
    return null;
  }

  const activeItems = (urgentNotices || []).filter(item => item.isActive);
  if (activeItems.length === 0) {
    return null;
  }

  const duration = tickerSettings?.speed === 'slow' ? '38s' : tickerSettings?.speed === 'fast' ? '16s' : '26s';

  return (
    <div className="bg-transparent text-white py-2.5 border-b border-emerald-800/40 overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Label */}
        <div className="flex items-center gap-1.5 bg-[#003580] text-[#DDAA00] font-black px-3 py-1 rounded text-xs shrink-0 shadow mr-4 z-10 border border-[#DDAA00]/30">
          <Bell className="w-3.5 h-3.5 animate-pulse text-[#DDAA00]" />
          <span>{tickerSettings?.label || "জরুরি নোটিশ:"}</span>
        </div>

        {/* Marquee Animated Scrolling content */}
        <div className="flex-1 overflow-hidden relative cursor-pointer" title="পড়তে মাউস ধরুন">
          <div
            className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs md:text-sm font-semibold py-0.5"
            style={{ animationDuration: duration }}
          >
            {[...activeItems, ...activeItems].map((n, idx) => (
              <Link
                key={`${n.id}-${idx}`}
                href={n.link || `/notices#${n.id}`}
                className="inline-flex items-center gap-2 text-slate-100 hover:underline hover:text-[#DDAA00] transition-colors shrink-0"
              >
                {n.category && (
                  <span className="bg-[#006837] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-600/50">
                    {n.category}
                  </span>
                )}
                <span>{n.title}</span>
                {n.date && (
                  <span className="text-emerald-300 text-[11px] font-normal">({n.date})</span>
                )}
                <span className="text-[#DDAA00] font-black ml-4">✦</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
