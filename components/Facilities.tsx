'use client';

import React from 'react';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Laptop,
  Microscope,
  Book,
  Home,
  Shield,
  Droplets,
  Trophy,
  Users,
  Wifi,
  Award,
  Sparkles,
  Building,
  GraduationCap,
  Clock,
  Heart,
  Lightbulb
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Microscope,
  Book,
  Home,
  Shield,
  Droplets,
  Trophy,
  Users,
  Wifi,
  Award,
  Sparkles,
  Building,
  GraduationCap,
  Clock,
  Heart,
  Lightbulb
};

export const Facilities: React.FC = () => {
  const { facilities } = useMadrasah();
  const activeFacilities = (facilities || []).filter(f => f.isActive !== false);

  if (activeFacilities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-emerald-50/40 border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
            আধুনিক অবকাঠামো
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            আমাদের বিশেষ সুযোগ-সুবিধাসমূহ
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            শিক্ষার্থীদের পড়াশোনার সুন্দর ও অনুকূল পরিবেশ নিশ্চিত করতে আমাদের রয়েছে প্রয়োজনীয় সকল ব্যবস্থা
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeFacilities.map((fac) => {
            const Icon = ICON_MAP[fac.iconName] || Sparkles;
            return (
              <div
                key={fac.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100/70 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white flex items-center justify-center mb-3.5 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-emerald-800 transition-colors">
                  {fac.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

