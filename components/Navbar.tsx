'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import {
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
  LogIn,
  LogOut,
  Phone
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { info, isAdmin, loggedStudent, currentAdminUser, logoutAdmin } = useMadrasah();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminRoute = pathname?.startsWith('/admin');

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

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAdminRoute) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Main Header / Logo Area */}
      <div className="bg-white border-b border-slate-100 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link
            href={isAdminRoute ? "/admin" : "/"}
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer"
            title={isAdminRoute ? "অ্যাডমিন প্যানেল রিলোড করুন" : info.name}
          >
            {/* Real Logo from Madrasah */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 drop-shadow-md group-hover:scale-105 transition-transform">
              <Image
                src={info.logo || "/logo.png"}
                alt={info.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
                unoptimized
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

          {/* Right Action: Login / Student Profile or Admin User Profile & Logout */}
          <div className="flex items-center gap-3">
            {isAdminRoute ? (
              isAdmin && (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Admin User Profile Badge */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006837] to-emerald-700 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0 ring-1 ring-emerald-200">
                      {currentAdminUser?.name ? currentAdminUser.name.charAt(0) : 'অ্যা'}
                    </div>
                    <div className="text-left leading-tight pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-slate-900 truncate max-w-[100px] sm:max-w-[160px]">
                          {currentAdminUser?.name || 'প্রধান সুপার অ্যাডমিন'}
                        </span>
                        {currentAdminUser?.isSuperAdmin ? (
                          <span className="bg-[#DDAA00] text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded hidden sm:inline-block">
                            সুপার
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-[9px] px-1.5 py-0.2 rounded hidden sm:inline-block">
                            স্টাফ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate max-w-[110px] sm:max-w-[170px]">
                        <span className="text-[#006837] font-bold">{currentAdminUser?.role || 'সুপার অ্যাডমিন'}</span>
                        <span className="font-mono text-slate-400"> • @{currentAdminUser?.username || 'admin'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Navbar Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      logoutAdmin();
                      router.push('/admin/login');
                    }}
                    className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
                    title="অ্যাডমিন প্যানেল থেকে লগআউট করুন"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="font-black">লগআউট</span>
                  </button>
                </div>
              )
            ) : (
              loggedStudent ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-none bg-transparent hover:bg-emerald-50/70 border-2 border-[#006837] hover:border-[#DDAA00] transition-all duration-200 hover:scale-[1.02] active:scale-95 group shadow-xs lg:mr-9 xl:mr-10"
                  title="শিক্ষার্থী প্রোফাইল দেখুন ও এডিট করুন"
                >
                  <div className="w-7 h-7 rounded-none bg-emerald-100 text-[#006837] flex items-center justify-center font-black text-xs overflow-hidden shrink-0 border border-[#006837]/40 group-hover:border-[#DDAA00] transition-colors">
                    {loggedStudent.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={loggedStudent.photo} alt={loggedStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{loggedStudent.name.charAt(0) || 'শ'}</span>
                    )}
                  </div>
                  <div className="text-left leading-tight pr-0.5">
                    <span className="block text-[#006837] group-hover:text-[#004e29] font-black text-xs truncate max-w-[85px] sm:max-w-[130px]">
                      {loggedStudent.name}
                    </span>
                    <span className="block text-[9px] text-[#DDAA00] font-bold">
                      প্রোফাইল
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-none bg-transparent hover:bg-emerald-50/70 text-[#006837] hover:text-[#00542c] border-2 border-[#006837] hover:border-[#DDAA00] font-black text-xs sm:text-sm tracking-wide shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 group lg:mr-9 xl:mr-10"
                  title="মাদ্রাসা ডিজিটাল লগইন পোর্টাল"
                >
                  <LogIn className="w-4 h-4 text-[#006837] group-hover:text-[#DDAA00] transition-colors" />
                  <span className="text-[#006837] group-hover:text-[#00542c] transition-colors font-bold">Login</span>
                </Link>
              )
            )}

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
              href={isAdmin ? "/admin" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-bold text-[#DDAA00] hover:bg-[#00542c] mt-2 border-t border-emerald-800/80"
            >
              <LogIn className="w-4 h-4 text-[#DDAA00]" />
              <span>{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'লগইন পোর্টাল (শিক্ষার্থী ও প্রশাসন)'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
