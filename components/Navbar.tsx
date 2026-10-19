'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import { getHijriDate, getBengaliDate, getGregorianDate } from '@/lib/islamicCalendar';
import {
  Phone,
  Menu,
  X,
  GraduationCap,
  FileText,
  Award,
  Users,
  Image as ImageIcon,
  Home,
  Info,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { info, isAdmin } = useMadrasah();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
  }, []);

  const hijri = mounted ? getHijriDate() : { full: '৯ জমাদিউল আউয়াল, ১৪৪৮ হিজরি' };
  const bengali = mounted ? getBengaliDate() : { full: '৪ কার্তিক, ১৪৩৩ বঙ্গাব্দ' };
  const gregorian = mounted ? getGregorianDate() : { full: 'মঙ্গলবার, ২০ অক্টোবর ২০২৬' };

  const navLinks = [
    { name: 'প্রচ্ছদ', href: '/', icon: Home },
    { name: 'পরিচিতি', href: '/about', icon: Info },
    { name: 'ভর্তি আবেদন', href: '/admission', icon: GraduationCap, badge: 'চলছে' },
    { name: 'নোটিশ বোর্ড', href: '/notices', icon: FileText },
    { name: 'ফলাফল', href: '/results', icon: Award },
    { name: 'শিক্ষকবৃন্দ', href: '/teachers', icon: Users },
    { name: 'রুটিন', href: '/routine', icon: Calendar },
    { name: 'গ্যালারি', href: '/gallery', icon: ImageIcon },
    { name: 'যোগাযোগ', href: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Islamic & Bengali Calendar Bar */}
      {!isAdminRoute && (
        <div className="bg-gradient-to-r from-[#00341c] via-[#006837] to-[#003580] text-white text-[11px] py-1.5 px-4 border-b border-[#DDAA00]/30 hidden sm:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-[#DDAA00] font-bold">
                <span>🌙</span>
                <span>{hijri.full}</span>
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-emerald-100 font-medium">{bengali.full}</span>
              <span className="text-emerald-300 hidden md:inline">•</span>
              <span className="text-slate-200 hidden md:inline">{gregorian.full}</span>
            </div>

            <div className="flex items-center gap-3.5 text-[11px]">
              <Link href="/#prayer-times" className="text-[#DDAA00] hover:text-amber-200 font-bold flex items-center gap-1 transition-colors">
                <Clock className="w-3 h-3 text-[#DDAA00]" />
                <span>সালাতের সময়সূচি</span>
              </Link>
              <span className="text-emerald-300">•</span>
              <a href={`tel:${info.phone}`} className="text-white hover:text-emerald-200 flex items-center gap-1 font-semibold transition-colors">
                <Phone className="w-3 h-3 text-[#DDAA00]" />
                <span>হেল্পলাইন: {info.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Header / Logo Area */}
      <div className="bg-white border-b border-slate-100 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Real Logo from Madrasah */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 drop-shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt={info.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-black text-[#006837] tracking-tight leading-tight group-hover:text-[#00542c] transition-colors">
                {info.name}
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
                <span className="text-[#006837] font-semibold">মাদ্রাসা কোড: {info.madrasahCode}</span>
                <span>•</span>
                <span>এমপিও: {info.mpoCode}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-emerald-800 font-semibold">বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত</span>
              </div>
            </div>
          </Link>


          {/* Mobile Menu Toggle Button */}
          {!isAdminRoute && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-50 text-[#006837] hover:bg-emerald-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) with Primary Green #006837 */}
      {!isAdminRoute && (
        <nav className="hidden lg:block bg-[#006837] text-white shadow-md border-t border-[#DDAA00]/30">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center justify-between">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1.5 px-3.5 py-3 text-sm font-semibold transition-all relative ${
                        active
                          ? 'bg-[#003580] text-[#DDAA00] shadow-inner border-b-3 border-[#DDAA00]'
                          : 'text-white/95 hover:bg-[#00542c] hover:text-[#DDAA00]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#DDAA00]' : 'text-emerald-200'}`} />
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="bg-[#DDAA00] text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full ml-1 shadow-sm">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}

      {/* Mobile Drawer */}
      {!isAdminRoute && mobileMenuOpen && (
        <div className="lg:hidden bg-[#004022] border-t border-emerald-800 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              href="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-[#DDAA00] text-slate-950 font-black px-3 py-2.5 rounded-lg text-sm shadow"
            >
              <GraduationCap className="w-4 h-4" />
              <span>ভর্তি আবেদন</span>
            </Link>
            <Link
              href="/results"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-[#003580] text-[#DDAA00] font-bold px-3 py-2.5 rounded-lg text-sm border border-[#DDAA00]/40"
            >
              <Award className="w-4 h-4" />
              <span>ফলাফল দেখুন</span>
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#003580] text-[#DDAA00] font-bold'
                      : 'text-emerald-100 hover:bg-[#00542c] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#DDAA00]" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-[#DDAA00] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-bold text-[#DDAA00] hover:bg-[#00542c] mt-2 border-t border-emerald-800/80"
            >
              <ShieldCheck className="w-4 h-4 text-[#DDAA00]" />
              <span>{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
