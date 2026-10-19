// Utility for calculating authentic Hijri, Bengali, and Gregorian dates and prayer times

export const toBengaliDigits = (num: string | number): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
};

export const toEnglishDigits = (str: string): string => {
  const bnToEn: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return String(str).replace(/[০-৯]/g, d => bnToEn[d] || d);
};

// Official Bangladeshi Revised Bengali Calendar (১৪ এপ্রিল = ১ বৈশাখ)
export const getBengaliDate = (date: Date = new Date()) => {
  const bnMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];
  const seasons = [
    'গ্রীষ্মকাল', 'গ্রীষ্মকাল',
    'বর্ষাকাল', 'বর্ষাকাল',
    'শরৎকাল', 'শরৎকাল',
    'হেমন্তকাল', 'হেমন্তকাল',
    'শীতকাল', 'শীতকাল',
    'বসন্তকাল', 'বসন্তকাল'
  ];

  // Month day lengths according to Bangladesh Bangla Academy revision
  // First 6 months (Boishakh to Ashwin) = 31 days
  // Next 5 months (Kartik to Falgun) = 30 days (Falgun 31 in leap year)
  // Last month (Chaitra) = 30 days
  const year = date.getFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeapYear ? 31 : 30, 30];

  const boishakh1 = new Date(year, 3, 14); // 14 April
  let bnYear = year - 593;
  let startDate = boishakh1;

  if (date < boishakh1) {
    bnYear = year - 594;
    const prevYear = year - 1;
    const prevLeap = (prevYear % 4 === 0 && prevYear % 100 !== 0) || (prevYear % 400 === 0);
    monthDays[10] = prevLeap ? 31 : 30;
    startDate = new Date(prevYear, 3, 14);
  }

  const diffTime = date.getTime() - startDate.getTime();
  let dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let monthIndex = 0;

  while (dayOfYear >= monthDays[monthIndex] && monthIndex < 11) {
    dayOfYear -= monthDays[monthIndex];
    monthIndex++;
  }

  const day = toBengaliDigits(dayOfYear + 1);
  const month = bnMonths[monthIndex];
  const yearBn = toBengaliDigits(bnYear);
  const season = seasons[monthIndex];

  return {
    day,
    month,
    year: yearBn,
    season,
    full: `${day} ${month}, ${yearBn} বঙ্গাব্দ (${season})`
  };
};

// Accurate Hijri Islamic Date using Intl
export const getHijriDate = (date: Date = new Date()) => {
  try {
    const formatter = new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    let year = parts.find(p => p.type === 'year')?.value || '';
    // Strip trailing 'যুগ' or unwanted characters if any
    year = year.replace(/[^০-৯0-9]/g, '');

    const full = `${day} ${month}, ${year} হিজরি`;
    return { day, month, year, full };
  } catch {
    // Fallback if Intl calendar is unavailable
    return {
      day: '৯',
      month: 'জমাদিউল আউয়াল',
      year: '১৪৪৮',
      full: '৯ জমাদিউল আউয়াল, ১৪৪৮ হিজরি'
    };
  }
};

// Bengali representation of Gregorian Date
export const getGregorianDate = (date: Date = new Date()) => {
  const weekdaysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const weekday = weekdaysBn[date.getDay()];
  const day = toBengaliDigits(date.getDate());
  const month = monthsBn[date.getMonth()];
  const year = toBengaliDigits(date.getFullYear());

  return {
    day,
    month,
    year,
    weekday,
    full: `${weekday}, ${day} ${month} ${year}`
  };
};

// Helper to convert 12-hour formatted Bengali time string like "০৫:১৫" into minutes of day
export const parsePrayerTimeToMinutes = (timeBn: string, isAfternoon: boolean): number => {
  const clean = toEnglishDigits(timeBn).trim();
  const [hStr, mStr] = clean.split(':');
  let h = parseInt(hStr || '0', 10);
  const m = parseInt(mStr || '0', 10);
  if (isAfternoon && h < 12) {
    h += 12;
  }
  return h * 60 + m;
};

export const formatMinutesToBengaliCountdown = (diffMinutes: number): string => {
  if (diffMinutes <= 0) return 'সময় অতিবাহিত';
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  if (hours > 0 && mins > 0) {
    return `${toBengaliDigits(hours)} ঘণ্টা ${toBengaliDigits(mins)} মিনিট`;
  } else if (hours > 0) {
    return `${toBengaliDigits(hours)} ঘণ্টা`;
  } else {
    return `${toBengaliDigits(mins)} মিনিট`;
  }
};
