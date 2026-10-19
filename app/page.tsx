import React from 'react';
import { HeroSlider } from '@/components/HeroSlider';
import { PrayerTimesWidget } from '@/components/PrayerTimesWidget';
import { NoticeSection } from '@/components/NoticeSection';
import { PrincipalMessage } from '@/components/PrincipalMessage';
import { Departments } from '@/components/Departments';
import { Facilities } from '@/components/Facilities';
import { GalleryPreview } from '@/components/GalleryPreview';
import { QuickAdmissionCta } from '@/components/QuickAdmissionCta';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSlider />
      <div id="prayer-times">
        <PrayerTimesWidget />
      </div>
      <NoticeSection />
      <PrincipalMessage />
      <Departments />
      <Facilities />
      <QuickAdmissionCta />
      <GalleryPreview />
    </div>
  );
}

