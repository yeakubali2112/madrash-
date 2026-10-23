'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMadrasah } from '@/context/MadrasahContext';
import { defaultHeroSettings, HeroSettings } from '@/lib/data';
import { getStoredHeroSettings } from '@/lib/storage';
import { NoticeTicker } from './NoticeTicker';
import {
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle,
  MapPin,
  Users,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { info, heroSettings } = useMadrasah();
  const [currentHero, setCurrentHero] = useState<HeroSettings>(heroSettings || defaultHeroSettings);

  // Sync with context
  useEffect(() => {
    if (heroSettings) {
      setCurrentHero(heroSettings);
    }
  }, [heroSettings]);

  // Real-time synchronization with localStorage & admin updates across tabs/windows
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const stored = getStoredHeroSettings();
        if (stored) {
          setCurrentHero(stored);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const handleCustomSync = (e: any) => {
      if (e?.detail) {
        setCurrentHero(e.detail);
      } else {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('padm_hero_sync', handleCustomSync);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('padm_hero_sync', handleCustomSync);
    };
  }, []);

  const hero = currentHero || defaultHeroSettings;
  const allSlides = hero?.slides && hero.slides.length > 0 ? hero.slides : defaultHeroSettings.slides;
  const filteredActive = allSlides.filter((s) => s.isActive);
  const activeSlides = filteredActive.length > 0 ? filteredActive : allSlides;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide effect
  useEffect(() => {
    if (!hero.slideshowEnabled || activeSlides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, (hero.slideInterval || 5) * 1000);
    return () => clearInterval(interval);
  }, [hero.slideshowEnabled, activeSlides.length, hero.slideInterval, isPaused]);

  // Handle bounds
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  const handleNextSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  const currentSlide = activeSlides[currentSlideIndex] || null;
  const currentHeadline = currentSlide?.title || hero.headline || info.name;
  const currentSlogan = currentSlide?.subtitle || hero.slogan || info.slogan;
  const currentDescription = currentSlide?.description || hero.description;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-slate-950 text-white overflow-hidden min-h-[520px] lg:min-h-[580px] flex flex-col justify-between"
    >
      {/* Background Slideshow Images */}
      {hero.slideshowEnabled && activeSlides.length > 0 && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {activeSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Standard HTML img for 100% reliable local/remote/base64 banner photos */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt={slide.title || 'মাদ্রাসা ব্যানার'}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[10000ms]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Cinematic Vignette Overlay: Darker at top & bottom for text/buttons, clear in center for vivid photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/60" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
      )}

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#006837]/30 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#003580]/30 rounded-full blur-3xl pointer-events-none z-[1]" />

      {/* Notice Ticker if enabled */}
      <div className="relative z-10 w-full">
        {hero.showNoticeTicker && <NoticeTicker />}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-20 w-full my-auto">
        <div className={`grid grid-cols-1 ${hero.showStatsCard ? 'lg:grid-cols-12 gap-10 items-center' : 'max-w-4xl mx-auto text-center'}`}>
          {/* Main Hero Column */}
          <div className={`${hero.showStatsCard ? 'lg:col-span-7 space-y-6 text-center lg:text-left' : 'space-y-7'}`}>
            {/* Arabic Ayah Callout */}
            {hero.showAyahCallout && (
              <div className="inline-flex flex-col items-center bg-[#002d18]/90 border border-[#DDAA00]/40 rounded-2xl px-6 py-3.5 shadow-xl backdrop-blur-md">
                <span className="font-arabic text-xl md:text-2xl lg:text-3xl text-[#DDAA00] font-bold tracking-wide">
                  {hero.ayahArabic}
                </span>
                <span className="text-xs md:text-sm text-emerald-200 mt-1.5 font-medium">
                  &quot;{hero.ayahBangla}&quot;
                </span>
              </div>
            )}

            {/* Location Pill */}
            {hero.showLocationBadge && (
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#DDAA00] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2 shadow">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{hero.locationBadgeText || `${info.location || "দুপচাঁচিয়া, বগুড়া"} • দ্বীনি শিক্ষার অনন্য প্রতিষ্ঠান`}</span>
                </div>
              </div>
            )}

            {/* Main Headline & Slogan with smooth key transition */}
            <div key={`title-${currentSlideIndex}`} className="space-y-3 animate-in fade-in duration-500">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                {currentHeadline}
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#DDAA00] font-bold drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {currentSlogan}
              </p>
            </div>

            {/* Description */}
            <p key={`desc-${currentSlideIndex}`} className="text-base md:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-in fade-in duration-500 font-medium">
              {currentDescription}
            </p>

            {/* Action Buttons */}
            {(hero.showButton1 || hero.showButton2) && (
              <div className={`flex flex-wrap items-center gap-4 pt-3 ${hero.showStatsCard ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                {hero.showButton1 && (
                  <Link
                    href={hero.button1Link || "/admission"}
                    className="group inline-flex items-center gap-2 bg-[#DDAA00] hover:bg-[#c99a00] text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-xl hover:shadow-[#DDAA00]/30 transition-all hover:scale-105 text-sm sm:text-base"
                  >
                    <GraduationCap className="w-5 h-5 text-slate-950" />
                    <span>{hero.button1Text || "অনলাইন ভর্তি আবেদন করুন"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {hero.showButton2 && (
                  <Link
                    href={hero.button2Link || "/results"}
                    className="inline-flex items-center gap-2 bg-[#003580] hover:bg-[#002b66] text-white font-bold px-7 py-3.5 rounded-xl border border-[#DDAA00]/40 shadow-lg backdrop-blur-sm transition-all hover:scale-105 text-sm sm:text-base"
                  >
                    <Award className="w-5 h-5 text-[#DDAA00]" />
                    <span>{hero.button2Text || "পরীক্ষার ফলাফল অনুসন্ধান"}</span>
                  </Link>
                )}
              </div>
            )}

            {/* Highlights checkmarks */}
            {hero.showHighlights && (
              <div className={`flex flex-wrap items-center gap-3 text-xs md:text-sm text-emerald-200 pt-3 ${hero.showStatsCard ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                <span className="flex items-center gap-1.5 bg-[#002d18]/80 px-3.5 py-1.5 rounded-full border border-emerald-800 backdrop-blur-sm shadow">
                  <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
                  <span>{hero.highlight1}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#002d18]/80 px-3.5 py-1.5 rounded-full border border-emerald-800 backdrop-blur-sm shadow">
                  <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
                  <span>{hero.highlight2}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#002d18]/80 px-3.5 py-1.5 rounded-full border border-emerald-800 backdrop-blur-sm shadow">
                  <CheckCircle className="w-4 h-4 text-[#DDAA00]" />
                  <span>{hero.highlight3}</span>
                </span>
              </div>
            )}
          </div>

          {/* Right Highlights Card if enabled */}
          {hero.showStatsCard && (
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-[#003580]/90 to-[#001533]/95 border-2 border-[#DDAA00]/50 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3.5 border-b border-[#003580] pb-4">
                  <div className="relative w-20 h-20 shrink-0 drop-shadow-xl bg-white rounded-2xl p-1 border-2 border-[#DDAA00]">
                    <Image
                      src="/logo.png"
                      alt={info.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="bg-[#DDAA00] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      EIIN: {info.eiin}
                    </span>
                    <h3 className="font-bold text-white text-sm md:text-base leading-snug mt-1">
                      {info.name}
                    </h3>
                    <p className="text-xs text-[#DDAA00] font-semibold">{info.location || "দুপচাঁচিয়া, বগুড়া"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                    <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-white">{info.stats.students}</div>
                    <div className="text-[11px] text-emerald-200 font-medium">বর্তমান শিক্ষার্থী</div>
                  </div>

                  <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                    <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-white">{info.stats.teachers}</div>
                    <div className="text-[11px] text-emerald-200 font-medium">শিক্ষক ও স্টাফ</div>
                  </div>

                  <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                    <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-[#DDAA00]">{info.stats.passRate}</div>
                    <div className="text-[11px] text-emerald-200 font-medium">দাখিল পাশের গড় হার</div>
                  </div>

                  <div className="bg-[#00204d]/80 border border-[#003580] rounded-xl p-3.5 text-center">
                    <div className="w-9 h-9 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center mx-auto mb-1.5 shadow">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-[#DDAA00]">{info.stats.gpa5}</div>
                    <div className="text-[11px] text-emerald-200 font-medium">মোট জিপিএ-৫ প্রাপ্তি</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#003580] space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/routine"
                      className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#006837] hover:bg-[#00542c] text-white font-bold transition-colors shadow-sm"
                    >
                      ক্লাস রুটিন
                    </Link>
                    <Link
                      href="/notices"
                      className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#002b66] hover:bg-[#003580] text-[#DDAA00] font-bold transition-colors border border-[#DDAA00]/40"
                    >
                      সর্বশেষ নোটিশ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slideshow Arrow Navigation */}
      {hero.slideshowEnabled && activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#DDAA00] text-white hover:text-slate-950 border border-white/20 hover:border-[#DDAA00] flex items-center justify-center backdrop-blur-md transition-all shadow-xl active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#DDAA00] text-white hover:text-slate-950 border border-white/20 hover:border-[#DDAA00] flex items-center justify-center backdrop-blur-md transition-all shadow-xl active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slideshow Bottom Dots Indicator */}
      {hero.slideshowEnabled && activeSlides.length > 1 && (
        <div className="relative z-20 pb-4 flex justify-center items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-black/50 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex
                    ? 'w-7 h-2 bg-[#DDAA00]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
            <span className="text-[11px] font-mono text-emerald-200 ml-1.5 font-bold">
              {currentSlideIndex + 1}/{activeSlides.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
