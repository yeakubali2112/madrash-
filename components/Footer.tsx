'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { info } = useMadrasah();

  // Hide footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#001f4d] via-[#001533] to-[#000d20] text-slate-300 border-t-4 border-[#DDAA00] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Madrasah Info with Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
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
                <h3 className="text-base font-bold text-white leading-tight">
                  {info.name}
                </h3>
                <p className="text-xs text-[#DDAA00] font-semibold">{info.location || "দুপচাঁচিয়া, বগুড়া"}</p>
                <p className="text-[11px] text-slate-400 font-mono">স্থাপিত: {info.established} খ্রিষ্টাব্দ</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {info.slogan}। নৈতিক মূল্যবোধসম্পন্ন ও আধুনিক শিক্ষায় শিক্ষিত আদর্শ নাগরিক গড়াই আমাদের মূল লক্ষ্য।
            </p>

            <div className="bg-[#002b66]/60 border border-[#003580] rounded-xl p-3 text-xs">
              <p className="text-[#DDAA00] font-arabic text-sm text-center font-bold">
                طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
              </p>
              <p className="text-center text-[11px] text-emerald-200 mt-1">
                &quot;জ্ঞান অর্জন করা প্রত্যেক মুসলমানের ওপর ফরজ।&quot; — আল-হাদিস
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-l-4 border-[#DDAA00] pl-2.5">
              গুরুত্বপূর্ণ লিঙ্ক
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span>প্রচ্ছদ (মূল পাতা)</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span>মাদ্রাসা পরিচিতি ও ইতিহাস</span>
                </Link>
              </li>
              <li>
                <Link href="/admission" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span className="font-semibold text-emerald-300">অনলাইন ভর্তি আবেদন</span>
                </Link>
              </li>
              <li>
                <Link href="/notices" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span>নোটিশ বোর্ড ও সার্কুলার</span>
                </Link>
              </li>
              <li>
                <Link href="/results" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span>অনলাইন পরীক্ষার ফলাফল</span>
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span>সম্মানিত শিক্ষক ও কর্মচারীবৃন্দ</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="flex items-center gap-1.5 hover:text-[#DDAA00] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#006837]" />
                  <span>ফটো ও ভিডিও গ্যালারি</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Board & Govt Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-l-4 border-[#DDAA00] pl-2.5">
              প্রয়োজনীয় শিক্ষামূলক লিঙ্ক
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="http://www.bmeb.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#DDAA00] transition-colors"
                >
                  <span>মাদ্রাসা শিক্ষা বোর্ড (BMEB)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://moedu.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#DDAA00] transition-colors"
                >
                  <span>শিক্ষা মন্ত্রণালয়</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.dshe.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#DDAA00] transition-colors"
                >
                  <span>মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.nctb.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#DDAA00] transition-colors"
                >
                  <span>এনসিটিবি (NCTB) পাঠ্যবই</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.banbeis.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#DDAA00] transition-colors"
                >
                  <span>ব্যানবেইস (BANBEIS)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>


          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-l-4 border-[#DDAA00] pl-2.5">
              যোগাযোগ ও অবস্থান
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DDAA00] shrink-0 mt-0.5" />
                <span>{info.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DDAA00] shrink-0" />
                <div>
                  <a href={`tel:${info.phone}`} className="hover:text-[#DDAA00] block font-mono">{info.phone}</a>
                  <a href={`tel:${info.altPhone}`} className="hover:text-[#DDAA00] block font-mono">{info.altPhone}</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DDAA00] shrink-0" />
                <a href={`mailto:${info.email}`} className="hover:text-[#DDAA00] break-all">{info.email}</a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#DDAA00] shrink-0 mt-0.5" />
                <span>{info.officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>
            © ২০২৬ {info.name}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-3">
            <span>EIIN: {info.eiin}</span>
            <span>•</span>
            <span>মাদ্রাসা কোড: {info.madrasahCode}</span>
            <span>•</span>
            <span className="text-[#DDAA00] font-semibold">{info.location || "দুপচাঁচিয়া, বগুড়া"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
