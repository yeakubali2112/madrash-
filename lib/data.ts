export interface MadrasahInfo {
  name: string;
  englishName: string;
  established: string;
  eiin: string;
  mpoCode: string;
  madrasahCode: string;
  address: string;
  location: string;
  phone: string;
  altPhone: string;
  email: string;
  slogan: string;
  officeHours: string;
  logo: string;
  bannerImage?: string;
  officialSeal?: string;
  principalSignature?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  principalName: string;
  principalTitle: string;
  principalMessage: string;
  principalImage: string;
  presidentName: string;
  presidentTitle: string;
  presidentMessage: string;
  presidentImage: string;
  bannerVerseArabic: string;
  bannerVerseBangla: string;
  bannerVerseReference: string;
  stats: {
    students: string;
    teachers: string;
    passRate: string;
    gpa5: string;
  };
}

export interface Notice {
  id: string;
  title: string;
  category: 'পরীক্ষা' | 'ভর্তি' | 'ছুটি' | 'সাধারণ' | 'জরুরি';
  date: string;
  content: string;
  isPinned?: boolean;
  pdfUrl?: string;
  author: string;
}

export interface UrgentNoticeItem {
  id: string;
  title: string;
  category: string;
  date: string;
  link?: string;
  isActive: boolean;
}

export interface TickerSettings {
  isEnabled: boolean;
  label: string;
  speed: 'slow' | 'normal' | 'fast';
}

export interface HeroBannerSlide {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface HeroSettings {
  headline: string;
  slogan: string;
  description: string;
  showButton1: boolean;
  button1Text: string;
  button1Link: string;
  showButton2: boolean;
  button2Text: string;
  button2Link: string;
  showNoticeTicker: boolean;
  showAyahCallout: boolean;
  ayahArabic: string;
  ayahBangla: string;
  showLocationBadge: boolean;
  locationBadgeText: string;
  showHighlights: boolean;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  showStatsCard: boolean;

  // Slideshow Banners
  slideshowEnabled: boolean;
  slideInterval: number; // in seconds
  slides: HeroBannerSlide[];
}

export interface PrayerTimeConfig {
  isEnabled: boolean;
  fajrAthan: string;
  fajrIqamah: string;
  sunrise: string;
  dhuhrAthan: string;
  dhuhrIqamah: string;
  asrAthan: string;
  asrIqamah: string;
  maghribAthan: string;
  maghribIqamah: string;
  ishaAthan: string;
  ishaIqamah: string;
  jumuahBayan: string;
  jumuahIqamah: string;
  tahajjudEnd: string;
  iftarTime: string;
  areaNote: string;
  prayerQuoteArabic: string;
  prayerQuoteBangla: string;
  prayerQuoteSource: string;
}

export interface StudentProfile {
  id?: string;
  name: string;
  nameEn?: string;
  phone: string;
  photo?: string;
  address?: string;
  fatherName?: string;
  motherName?: string;
  classYear: string;
  rollNo: string;
  regNo: string;
  session: string;
  bloodGroup: string;
  gender?: string;
  birthDate?: string;
  guardianPhone?: string;
  attendanceRate: string;
  feeStatus: string;
  status?: string;
  createdAt?: string;
  result?: ResultRecord;
  application?: AdmissionApplication;
}

export interface AlumniStudent {
  id: string;
  name: string;
  nameEn?: string;
  passingYear: string;
  examType: string;
  rollNo?: string;
  regNo?: string;
  gpa?: string;
  group?: string;
  fatherName?: string;
  motherName?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  currentStatus?: string;
  presentInstitute?: string;
  address?: string;
  photo?: string;
  achievements?: string;
  createdAt: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  isActive: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  subject: string;
  phone: string;
  email: string;
  image: string;
  order: number;
}

export interface Department {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  classes: string;
  features: string[];
  icon: string;
}

export interface AdmissionApplication {
  id: string;
  studentNameBn: string;
  studentNameEn: string;
  birthRegNo: string;
  dob: string;
  bloodGroup: string;
  gender: 'ছাত্র' | 'ছাত্রী';
  religion: string;
  applyingClass: string;
  previousSchool?: string;
  previousGpa?: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  presentAddress: string;
  permanentAddress: string;
  emergencyContact: string;
  appliedDate: string;
  status: 'অপেক্ষমান' | 'অনুমোদিত' | 'বাতিল';
  remarks?: string;
}

export interface SubjectResult {
  name: string;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
  point: number;
}

export interface ResultRecord {
  id: string;
  studentName: string;
  rollNo: string;
  regNo: string;
  examName: string;
  classYear: string;
  session: string;
  gpa: number;
  grade: string;
  resultStatus: 'উত্তীর্ণ' | 'অনুত্তীর্ণ';
  subjects: SubjectResult[];
  publishDate: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ক্যাম্পাস' | 'অনুষ্ঠান' | 'প্রতিযোগিতা' | 'ক্লাস';
  imageUrl: string;
  date: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: 'ওয়াজ মাহফিল' | 'কুরআন তিলাওয়াত' | 'বার্ষিক অনুষ্ঠান' | 'বিজ্ঞান মেলা' | 'ক্যাম্পাস' | 'সাধারণ';
  videoType: 'youtube' | 'upload' | 'url';
  videoUrl: string;
  thumbnailUrl?: string;
  description?: string;
  duration?: string;
  date: string;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return null;
}

export function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export const defaultMadrasahInfo: MadrasahInfo = {
  name: "পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা",
  englishName: "Poschim Alohali Islamia Adarsho Bohumukhi Dakhil Madrasah",
  established: "১৯৯৫",
  eiin: "১৩৪৮৯২",
  mpoCode: "৪২১০৫১২৩",
  madrasahCode: "১৮৪৫২",
  address: "পশ্চিম আলোহালী, ডাকঘর: আলোহালী, উপজেলা: দুপচাঁচিয়া, জেলা: বগুড়া",
  location: "দুপচাঁচিয়া, বগুড়া",
  phone: "+৮৮০১৭১২-৩৪৫৬৭৮",
  altPhone: "+৮৮০১৮১২-৩৪৫৬৭৮",
  email: "poschimalohali@gmail.com",
  slogan: "দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়",
  officeHours: "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:৩০",
  logo: "/logo.png",
  bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
  officialSeal: "",
  principalSignature: "",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  principalName: "মাওলানা মোহাম্মদ রফিকুল ইসলাম",
  principalTitle: "সুপারিনটেনডেন্ট (কামিল, এম.এ)",
  principalMessage: "বিসমিল্লাহির রাহমানির রাহিম। পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা দুপচাঁচিয়া, বগুড়ার একটি ঐতিহ্যবাহী দ্বীনি ও যুগোপযোগী শিক্ষাপ্রতিষ্ঠান। ১৯৯৫ সালে প্রতিষ্ঠিত হওয়ার পর থেকে প্রতিষ্ঠানটি অত্র অঞ্চলের শিক্ষার্থীদের মাঝে পবিত্র কুরআন ও সুন্নাহর সঠিক জ্ঞান বিতরণের পাশাপাশি আধুনিক সাধারণ শিক্ষার আলো ছড়িয়ে আসছে। আমাদের লক্ষ্য এমন এক আদর্শ নাগরিক গড়ে তোলা যারা আল্লাহভীরু, চরিত্রবান, দেশপ্রেমিক এবং আধুনিক বিশ্বের চ্যালেঞ্জ মোকাবেলায় সক্ষম। আমরা অভিভাবক ও শুভাকাঙ্ক্ষীদের দোয়া ও সহযোগিতা কামনা করছি।",
  principalImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
  presidentName: "হাজী মোঃ নুরুল ইসলাম",
  presidentTitle: "সভাপতি, ম্যানেজিং কমিটি",
  presidentMessage: "পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা আমাদের প্রাণের প্রতিষ্ঠান। দুপচাঁচিয়ার শিক্ষানুরাগী ব্যক্তিবর্গের অক্লান্ত পরিশ্রমে প্রতিষ্ঠিত এই প্রতিষ্ঠান আজ আলোকবর্তিকা হয়ে কাজ করছে। মাদ্রাসা পরিচালনা পর্ষদের পক্ষ থেকে আমরা শিক্ষক, শিক্ষার্থী ও অভিভাবকদের সার্বিক উন্নয়ন ও শিক্ষার গুণগত মান নিশ্চিত করতে বদ্ধপরিকর। আল্লাহ তায়ালা আমাদের সহায় হোন।",
  presidentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  bannerVerseArabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
  bannerVerseBangla: "পড় তোমার রবের নামে যিনি সৃষ্টি করেছেন। (সূরা আলাক: ১)",
  bannerVerseReference: "আল-কুরআন, সূরা আল-আলাক: ৯৬/১",
  stats: {
    students: "১২৫০+",
    teachers: "২৮",
    passRate: "৯৮.৫%",
    gpa5: "৪৫+",
  }
};

export const defaultNotices: Notice[] = [
  {
    id: "not-1",
    title: "২০২৬ শিক্ষাবর্ষে নূরানী, ইবতেদায়ী ও দাখিল শ্রেণিতে নতুন ভর্তি চলছে",
    category: "ভর্তি",
    date: "১৫ অক্টোবর ২০২৬",
    content: "পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসায় ২০২৬ শিক্ষাবর্ষের সকল শ্রেণিতে (নূরানী, ১ম-৫ম ইবতেদায়ী এবং ৬ষ্ঠ-৯ম শ্রেণি দাখিল সাধারণ ও বিজ্ঞান বিভাগ) শিক্ষার্থী ভর্তি কার্যক্রম শুরু হয়েছে। আগ্রহী অভিভাবকগণ অনলাইন অথবা মাদ্রাসা অফিস থেকে ফরম সংগ্রহ করে জমা দিতে পারবেন।",
    isPinned: true,
    author: "অধ্যক্ষ কার্যালয়"
  },
  {
    id: "not-2",
    title: "বার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ও প্রবেশপত্র বিতরণ সংক্রান্ত বিজ্ঞপ্তি",
    category: "পরীক্ষা",
    date: "১০ অক্টোবর ২০২৬",
    content: "আগামী ২৫ নভেম্বর ২০২৬ তারিখ থেকে ৬ষ্ঠ হতে ৯ম শ্রেণির বার্ষিক পরীক্ষা শুরু হবে। সকল শিক্ষার্থীকে আগামী ২০ নভেম্বরের মধ্যে বকেয়া বেতন পরিশোধপূর্বক প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া যাচ্ছে।",
    isPinned: true,
    author: "পরীক্ষা নিয়ন্ত্রক কমিটি"
  },
  {
    id: "not-3",
    title: "পবিত্র ঈদে মিলাদুন্নবী (সা.) উদযাপন ও ক্বেরাত প্রতিযোগিতা",
    category: "সাধারণ",
    date: "০৫ অক্টোবর ২০২৬",
    content: "যথাযোগ্য ধর্মীয় ভাবগাম্ভীর্যের সাথে আগামী ১২ অক্টোবর মাদ্রাসার অডিটোরিয়ামে পবিত্র ঈদে মিলাদুন্নবী (সা.) উপলক্ষে আলোচনা সভা, ক্বেরাত, হামদ-নাত প্রতিযোগিতা ও দোয়া মাহফিল অনুষ্ঠিত হবে। সকল শিক্ষার্থী ও শিক্ষকবৃন্দকে উপস্থিত থাকার অনুরোধ করা হলো।",
    isPinned: false,
    author: "সাংস্কৃতিক কমিটি"
  },
  {
    id: "not-4",
    title: "দাখিল প্রাক-নির্বাচনী পরীক্ষার ফলাফল প্রকাশ ও অভিভাবক সমাবেশ",
    category: "পরীক্ষা",
    date: "২৮ সেপ্টেম্বর ২০২৬",
    content: "২০২৬ সালের দাখিল পরীক্ষার্থীদের প্রাক-নির্বাচনী পরীক্ষার ফলাফল প্রকাশিত হয়েছে। আগামী ৫ অক্টোবর সকাল ১০টায় মাদ্রাসার মিলনায়তনে অভিভাবক সমাবেশ অনুষ্ঠিত হবে। সংশ্লিষ্ট সকল অভিভাবককে উপস্থিত থাকার জন্য বিনীত অনুরোধ জানানো যাচ্ছে।",
    isPinned: false,
    author: "সুপারিনটেনডেন্ট"
  },
  {
    id: "not-5",
    title: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে ছুটির নোটিশ",
    category: "ছুটি",
    date: "২০ সেপ্টেম্বর ২০২৬",
    content: "সরকারি ছুটির তালিকা অনুযায়ী আগামী ২১ সেপ্টেম্বর মাদ্রাসা ক্লাস বন্ধ থাকবে। তবে সকালে মাদ্রাসার শহীদ মিনারে পুষ্পস্তবক অর্পণ ও আলোচনা সভা অনুষ্ঠিত হবে।",
    isPinned: false,
    author: "প্রশাসন বিভাগ"
  }
];

export const defaultTickerSettings: TickerSettings = {
  isEnabled: true,
  label: "জরুরি নোটিশ:",
  speed: "normal"
};

export const defaultHeroSlides: HeroBannerSlide[] = [
  {
    id: "slide-1",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920",
    title: "পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা",
    subtitle: "দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়",
    description: "১৯৯৫ সাল থেকে নিষ্ঠা ও সুশৃঙ্খল পরিবেশে দুপচাঁচিয়া, বগুড়ায় দ্বীনি মূল্যবোধ, কুরআন-হাদিসের আদর্শ শিক্ষা এবং বোর্ড নির্ধারিত আধুনিক বিজ্ঞান ও প্রযুক্তির সমন্বয়ে গড়ে তুলছি সৎ, দক্ষ ও আলোকিত প্রজন্ম।",
    isActive: true,
    order: 1
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1920",
    title: "হিফজুল কুরআন ও নূরানী একাডেমি শাখা",
    subtitle: "তাজবীদসহ বিশুদ্ধ কুরআন তিলাওয়াত ও হিফজের সুব্যবস্থা",
    description: "অভিজ্ঞ হাফেজ ও কারীগণের সার্বক্ষণিক তত্ত্বাবধানে সুন্দর ও আধ্যাত্মিক পরিবেশে কুরআন শিক্ষার বিশেষ ব্যবস্থা।",
    isActive: true,
    order: 2
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920",
    title: "আধুনিক বিজ্ঞান ও কম্পিউটার ল্যাব",
    subtitle: "ডিজিটাল বাংলাদেশ বিনির্মাণে তথ্যপ্রযুক্তি নির্ভর যুগোপযোগী শিক্ষা",
    description: "দাখিল বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য বোর্ড নির্ধারিত আধুনিক বিজ্ঞানাগার ও সার্বক্ষণিক কম্পিউটার প্রশিক্ষণ।",
    isActive: true,
    order: 3
  }
];

export const defaultHeroSettings: HeroSettings = {
  headline: "পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা",
  slogan: "দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়",
  description: "১৯৯৫ সাল থেকে নিষ্ঠা ও সুশৃঙ্খল পরিবেশে দুপচাঁচিয়া, বগুড়ায় দ্বীনি মূল্যবোধ, কুরআন-হাদিসের আদর্শ শিক্ষা এবং বোর্ড নির্ধারিত আধুনিক বিজ্ঞান ও প্রযুক্তির সমন্বয়ে গড়ে তুলছি সৎ, দক্ষ ও আলোকিত প্রজন্ম।",
  showButton1: true,
  button1Text: "অনলাইন ভর্তি আবেদন করুন",
  button1Link: "/admission",
  showButton2: true,
  button2Text: "পরীক্ষার ফলাফল অনুসন্ধান",
  button2Link: "/results",
  showNoticeTicker: true,
  showAyahCallout: false,
  ayahArabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
  ayahBangla: "পড় তোমার রবের নামে যিনি সৃষ্টি করেছেন। (সূরা আলাক: ১)",
  showLocationBadge: false,
  locationBadgeText: "দুপচাঁচিয়া, বগুড়া • দ্বীনি শিক্ষার অনন্য প্রতিষ্ঠান",
  showHighlights: false,
  highlight1: "বোর্ড অনুমোদিত পূর্ণাঙ্গ মাদ্রাসা",
  highlight2: "হিফজ ও নূরানী আবাসিক সুবিধা",
  highlight3: "বিজ্ঞান ও কম্পিউটার ল্যাব",
  showStatsCard: false,
  slideshowEnabled: true,
  slideInterval: 5,
  slides: defaultHeroSlides,
};

export const defaultUrgentNotices: UrgentNoticeItem[] = [
  {
    id: "urg-1",
    title: "২০২৬ শিক্ষাবর্ষে নূরানী, ইবতেদায়ী ও দাখিল শ্রেণিতে নতুন ভর্তি চলছে",
    category: "ভর্তি",
    date: "১৫ অক্টোবর ২০২৬",
    link: "/admission",
    isActive: true
  },
  {
    id: "urg-2",
    title: "বার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ও প্রবেশপত্র বিতরণ সংক্রান্ত বিজ্ঞপ্তি",
    category: "পরীক্ষা",
    date: "১০ অক্টোবর ২০২৬",
    link: "/notices#not-2",
    isActive: true
  },
  {
    id: "urg-3",
    title: "পবিত্র ঈদে মিলাদুন্নবী (সা.) উদযাপন ও ক্বেরাত প্রতিযোগিতা",
    category: "সাধারণ",
    date: "০৫ অক্টোবর ২০২৬",
    link: "/notices#not-3",
    isActive: true
  },
  {
    id: "urg-4",
    title: "দাখিল প্রাক-নির্বাচনী পরীক্ষার ফলাফল প্রকাশ ও অভিভাবক সমাবেশ",
    category: "পরীক্ষা",
    date: "২৮ সেপ্টেম্বর ২০২৬",
    link: "/notices#not-4",
    isActive: true
  }
];

export const defaultFacilities: FacilityItem[] = [
  {
    id: "fac-1",
    iconName: "Laptop",
    title: "আধুনিক কম্পিউটার ল্যাব",
    desc: "মাল্টিমিডিয়া প্রজেক্টর ও উচ্চগতির ইন্টারনেট সংযোগসহ ডিজিটাল আইসিটি প্রশিক্ষণ।",
    isActive: true
  },
  {
    id: "fac-2",
    iconName: "Microscope",
    title: "সুসজ্জিত সায়েন্স ল্যাব",
    desc: "দাখিল বিজ্ঞান বিভাগের পদার্থ, রসায়ন ও জীববিজ্ঞান বিষয়ের নিয়মিত ব্যবহারিক ক্লাস।",
    isActive: true
  },
  {
    id: "fac-3",
    iconName: "Book",
    title: "সমৃদ্ধ কুতুবখানা (লাইব্রেরি)",
    desc: "তাফসির, হাদিস, ফিকহ ও সাধারণ জ্ঞানমূলক দেশি-বিদেশি হাজারো কিতাব ও বইয়ের সমাহার।",
    isActive: true
  },
  {
    id: "fac-4",
    iconName: "Home",
    title: "আবাসিক ছাত্রাবাস",
    desc: "হিফজুল কুরআন ও দূরবর্তী শিক্ষার্থীদের জন্য সুশৃঙ্খল, নিরাপদ ও স্বাস্থ্যসম্মত হোস্টেল ব্যবস্থা।",
    isActive: true
  },
  {
    id: "fac-5",
    iconName: "Users",
    title: "উচ্চশিক্ষিত শিক্ষক মণ্ডলী",
    desc: "কামিল, এম.এ ও বি.এসসি ডিগ্রিধারী অভিজ্ঞ ও স্নেহপরায়ণ শিক্ষকগণের সরাসরি তত্ত্বাবধান।",
    isActive: true
  },
  {
    id: "fac-6",
    iconName: "Shield",
    title: "সিসিটিভি ও নিরাপত্তা",
    desc: "সম্পূর্ণ ক্যাম্পাস সার্বক্ষণিক সিসিটিভি ক্যামেরায় নজরদারি এবং কঠোর নিরাপত্তা নিশ্চিতকরণ।",
    isActive: true
  },
  {
    id: "fac-7",
    iconName: "Droplets",
    title: "বিশুদ্ধ খাবার পানি",
    desc: "শিক্ষার্থী ও শিক্ষকবৃন্দের স্বাস্থ্য সুরক্ষায় আর্সেনিকমুক্ত পিউরিফাইড ওয়াটার ফিল্টার।",
    isActive: true
  },
  {
    id: "fac-8",
    iconName: "Trophy",
    title: "সহশিক্ষা ও ক্বেরাত প্রতিযোগিতা",
    desc: "বার্ষিক ক্রীড়া, হামদ-নাত, ক্বেরাত, বিতর্ক প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠান।",
    isActive: true
  }
];

export const defaultTeachers: Teacher[] = [
  {
    id: "t-1",
    name: "মাওলানা মোঃ রফিকুল ইসলাম",
    designation: "সুপারিনটেনডেন্ট",
    qualification: "কামিল (হাদিস), এম.এ (ইসলামিক স্টাডিজ)",
    subject: "আল-কুরআন ও হাদিস শরীফ",
    phone: "০১৭১২-৩৪৫৬৭৮",
    email: "rafiqul.super@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    order: 1
  },
  {
    id: "t-2",
    name: "মাওলানা মোহাম্মদ আব্দুল করিম",
    designation: "সহকারী সুপারিনটেনডেন্ট",
    qualification: "কামিল (ফিকহ), বি.এ অনার্স (আরবি)",
    subject: "আরবি সাহিত্য ও ব্যাকরণ",
    phone: "০১৭২৩-৪৫৬৭৮৯",
    email: "karim.asst@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    order: 2
  },
  {
    id: "t-3",
    name: "মাওলানা মোঃ জয়নাল আবেদীন",
    designation: "সিনিয়র শিক্ষক (আরবি)",
    qualification: "কামিল (তাফসির), এম.এম",
    subject: "আকাইদ ও ফিকহ",
    phone: "০১৭৩৪-৫৬৭৮৯০",
    email: "zainal@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    order: 3
  },
  {
    id: "t-4",
    name: "মোঃ মাহবুবুল হক",
    designation: "সহকারী শিক্ষক (গণিত ও বিজ্ঞান)",
    qualification: "এম.এসসি (গণিত), বি.এড",
    subject: "উচ্চতর গণিত ও পদার্থবিজ্ঞান",
    phone: "০১৭৪৫-৬৭৮৯০১",
    email: "mahbub.math@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    order: 4
  },
  {
    id: "t-5",
    name: "মোঃ মোস্তাফিজুর রহমান",
    designation: "সহকারী শিক্ষক (ইংরেজি)",
    qualification: "এম.এ (ইংরেজি), বি.এড",
    subject: "ইংরেজি ১ম ও ২য় পত্র",
    phone: "০১৭৫৬-৭৮৯০১২",
    email: "mustafiz.eng@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    order: 5
  },
  {
    id: "t-6",
    name: "হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল",
    designation: "প্রধান ক্বারী ও হিফজ শিক্ষক",
    qualification: "হিফজুল কুরআন, ক্বিরাআত সাব'আহ",
    subject: "হিফজ ও সহীহ তিলাওয়াত",
    phone: "০১৭৬৭-৮৯০১২৩",
    email: "ibrahim.qari@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    order: 6
  },
  {
    id: "t-7",
    name: "মোঃ আহসান উল্লাহ",
    designation: "সহকারী শিক্ষক (আইসিটি ও তথ্যপ্রযুক্তি)",
    qualification: "বি.এসসি ইন সিএসই (CSE)",
    subject: "তথ্য ও যোগাযোগ প্রযুক্তি",
    phone: "০১৭৭৮-৯MDE১২৪",
    email: "ahsan.ict@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    order: 7
  },
  {
    id: "t-8",
    name: "মোছাঃ ফাতেমা আক্তার",
    designation: "সহকারী শিক্ষক (বাংলা ও সামাজিক বিজ্ঞান)",
    qualification: "এম.এ (বাংলা সাহিত্য)",
    subject: "বাংলা ও বাংলাদেশ ও বিশ্বপরিচয়",
    phone: "০১৭৮৯-০১২৩৪৫",
    email: "fatema@poschimalohali.edu.bd",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    order: 8
  }
];

export const defaultDepartments: Department[] = [
  {
    id: "noorani",
    title: "নূরানী ও নাজেরা বিভাগ",
    englishTitle: "Noorani & Nazera Section",
    description: "কোমলমতি শিশুদের সহীহ-শুদ্ধভাবে কুরআন মাজীদ তিলাওয়াত, মাসনূন দোয়া ও বুনিয়াদি শিক্ষার অনন্য আয়োজন।",
    classes: "প্লে, নার্সারি ও কেজি সমমান",
    features: [
      "সহীহ মাখরাজ ও তাজবীদ শিক্ষা",
      "মৌলিক কালেমা, নামাজ ও প্রয়োজনীয় দোয়া",
      "বাংলা, ইংরেজি ও গণিতের মজবুত বুনিয়াদ",
      "স্নেহশীল ও অভিজ্ঞ শিক্ষক দ্বারা পাঠদান"
    ],
    icon: "BookOpen"
  },
  {
    id: "hifz",
    title: "হিফজুল কুরআন বিভাগ",
    englishTitle: "Tahfeezul Quran Section",
    description: "আন্তর্জাতিক মানের ক্বারীগণের তত্ত্বাবধানে অত্যন্ত যত্নসহকারে স্বল্প সময়ে সম্পূর্ণ কুরআনুল কারীম হিফজ করানোর ব্যবস্থা।",
    classes: "আন্তর্জাতিক তাহফিজ সিলেবাস",
    features: [
      "আন্তর্জাতিক মানসম্পন্ন ক্বারীদের তত্ত্বাবধান",
      "প্রতিদিন শোনানো ও রিভিশনের সুশৃঙ্খল রুটিন",
      "মনোরম ও শান্ত আবাসিক পরিবেশ",
      "হিফজের পাশাপাশি সাধারণ শিক্ষার সুযোগ"
    ],
    icon: "Award"
  },
  {
    id: "ibtedaee",
    title: "ইবতেদায়ী বিভাগ (১ম - ৫ম)",
    englishTitle: "Ibtedaee Section (Class 1-5)",
    description: "মাদ্রাসা শিক্ষা বোর্ডের পাঠ্যক্রম অনুযায়ী প্রাথমিক সমমানের আধুনিক সাধারণ ও দ্বীনি শিক্ষার সমন্বিত পাঠদান।",
    classes: "১ম থেকে ৫ম শ্রেণি",
    features: [
      "বোর্ড অনুমোদিত পূর্ণাঙ্গ সিলেবাস",
      "ইবতেদায়ী শিক্ষা সমাপনীতে ১০০% সাফল্য",
      "স্মার্ট ক্লাসরুম ও মাল্টিমিডিয়া প্রজেক্টর",
      "নিয়মিত হাতের লেখা ও মানসিক বিকাশ চর্চা"
    ],
    icon: "GraduationCap"
  },
  {
    id: "dakhil-general",
    title: "দাখিল সাধারণ বিভাগ (৬ষ্ঠ - ১০ম)",
    englishTitle: "Dakhil General Section",
    description: "মাধ্যমিক সমমানের দাখিল সিলেবাসে কুরআন, হাদিস, ফিকহ, আরবি ব্যাকরণের পাশাপাশি ইংরেজি ও গণিতে দক্ষতা অর্জন।",
    classes: "৬ষ্ঠ থেকে দাখিল (১০ম শ্রেণি)",
    features: [
      "উচ্চতর আরবি ও ইসলামিক স্টাডিজ",
      "ইংরেজি ভাষা ও ব্যাকরণে বিশেষ প্রশিক্ষণ",
      "সৃজনশীল পদ্ধতিতে নিয়মিত মডেল টেস্ট",
      "বোর্ড পরীক্ষায় প্রতিবছর গোল্ডেন জিপিএ-৫ প্রাপ্তি"
    ],
    icon: "School"
  },
  {
    id: "dakhil-science",
    title: "দাখিল বিজ্ঞান বিভাগ",
    englishTitle: "Dakhil Science Section",
    description: "আধুনিক বিজ্ঞান ল্যাবরেটরি, পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত ও জীববিজ্ঞান শিক্ষার সমৃদ্ধ আয়োজন।",
    classes: "৯ম ও ১০ম শ্রেণি",
    features: [
      "সুসজ্জিত আধুনিক বিজ্ঞানাগার (Science Lab)",
      "অভিজ্ঞ বি.এসসি ও এম.এসসি শিক্ষক মণ্ডলী",
      "নিয়মিত ব্যবহারিক ক্লাস ও প্রোজেক্ট ওয়ার্ক",
      "ভবিষ্যৎ ডাক্তার ও ইঞ্জিনিয়ার তৈরির প্ল্যাটফর্ম"
    ],
    icon: "Sparkles"
  },
  {
    id: "ict",
    title: "কম্পিউটার ও আইসিটি ল্যাব",
    englishTitle: "Computer & ICT Training Lab",
    description: "ডিজিটাল বাংলাদেশের সাথে তাল মিলিয়ে প্রত্যেক শিক্ষার্থীকে তথ্যপ্রযুক্তি ও আধুনিক কম্পিউটার দক্ষতায় স্বাবলম্বী করা।",
    classes: "সকল শ্রেণির শিক্ষার্থীদের জন্য",
    features: [
      "উচ্চগতির ব্রডব্যান্ড ইন্টারনেট সুবিধা",
      "অফিস অ্যাপ্লিকেশন, গ্রাফিক্স ও কোডিং শিক্ষা",
      "নিরাপদ ও সার্বক্ষণিক বিদ্যুৎ ব্যাকআপ",
      "দক্ষ আইটি ইন্সট্রাক্টর দ্বারা সরাসরি প্র্যাকটিস"
    ],
    icon: "CheckCircle2"
  }
];

export const defaultApplications: AdmissionApplication[] = [
  {
    id: "PADM-2026-1001",
    studentNameBn: "মুহাম্মদ আব্দুল্লাহ আল মামুন",
    studentNameEn: "Muhammad Abdullah Al Mamun",
    birthRegNo: "20124598712345678",
    dob: "2012-04-15",
    bloodGroup: "A+",
    gender: "ছাত্র",
    religion: "ইসলাম",
    applyingClass: "ষষ্ঠ শ্রেণি",
    previousSchool: "আলোহালী সরকারি প্রাথমিক বিদ্যালয়",
    previousGpa: "৫.০০",
    fatherName: "মোঃ নজরুল ইসলাম",
    fatherPhone: "০১৭২২-১১২২৩৩",
    fatherOccupation: "ব্যবসায়ী",
    motherName: "মোসাঃ পারভীন আক্তার",
    motherOccupation: "গৃহিণী",
    presentAddress: "পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া",
    permanentAddress: "পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া",
    emergencyContact: "০১৭২২-১১২২৩৩",
    appliedDate: "২০২৬-১০-১৪",
    status: "অনুমোদিত",
    remarks: "সকল সনদপত্র যাচাই করা হয়েছে। ভর্তি নিশ্চিত।"
  },
  {
    id: "PADM-2026-1002",
    studentNameBn: "ফাতিমা তুয যোহরা",
    studentNameEn: "Fatima Tuz Zohra",
    birthRegNo: "20146789123456789",
    dob: "2014-08-20",
    bloodGroup: "B+",
    gender: "ছাত্রী",
    religion: "ইসলাম",
    applyingClass: "চতুর্থ শ্রেণি",
    previousSchool: "দুপচাঁচিয়া মডেল কিন্ডারগার্টেন",
    previousGpa: "৪.৮০",
    fatherName: "মোঃ আব্দুর রহিম",
    fatherPhone: "০১৮৩৩-৪৪৫৫৬৬",
    fatherOccupation: "শিক্ষক",
    motherName: "রোকেয়া বেগম",
    motherOccupation: "শিক্ষিকা",
    presentAddress: "আলোহালী, দুপচাঁচিয়া, বগুড়া",
    permanentAddress: "আলোহালী, দুপচাঁচিয়া, বগুড়া",
    emergencyContact: "০১৮৩৩-৪৪৫৫৬৬",
    appliedDate: "২০২৬-১০-১৫",
    status: "অপেক্ষমান",
    remarks: "মৌখিক পরীক্ষার জন্য ডাকা হয়েছে।"
  },
  {
    id: "PADM-2026-1003",
    studentNameBn: "হাফেজ মোঃ সালমান ফারসী",
    studentNameEn: "Md Salman Farsi",
    birthRegNo: "20119876543210123",
    dob: "2011-02-10",
    bloodGroup: "O+",
    gender: "ছাত্র",
    religion: "ইসলাম",
    applyingClass: "হিফজুল কুরআন বিভাগ",
    previousSchool: "মদিনাতুল উলুম মাদ্রাসা",
    previousGpa: "৫.০০",
    fatherName: "মোঃ সাইদুল ইসলাম",
    fatherPhone: "০১৬১১-৯৯৮৮৭৭",
    fatherOccupation: "প্রবাসী",
    motherName: "আসমাহান খাতুন",
    motherOccupation: "গৃহিণী",
    presentAddress: "পশ্চিম আলোহালী মধ্যপাড়া, দুপচাঁচিয়া",
    permanentAddress: "পশ্চিম আলোহালী মধ্যপাড়া, দুপচাঁচিয়া",
    emergencyContact: "০১৬১১-৯৯৮৮৭৭",
    appliedDate: "২০২৬-১০-১৬",
    status: "অনুমোদিত",
    remarks: "হিফজ টেস্টে উত্তীর্ণ হয়েছে।"
  }
];

export const defaultResults: ResultRecord[] = [
  {
    id: "res-1",
    studentName: "মোঃ ওমর ফারুক",
    rollNo: "১০১",
    regNo: "২০২৬১০১০১",
    examName: "দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬",
    classYear: "১০ম শ্রেণি (দাখিল)",
    session: "২০২৫-২০২৬",
    gpa: 5.00,
    grade: "A+",
    resultStatus: "উত্তীর্ণ",
    publishDate: "২৮ সেপ্টেম্বর ২০২৬",
    subjects: [
      { name: "কুরআন মাজীদ ও তাজবীদ", fullMarks: 100, obtainedMarks: 94, grade: "A+", point: 5.0 },
      { name: "হাদীস শরীফ ও উসূলুল হাদীস", fullMarks: 100, obtainedMarks: 91, grade: "A+", point: 5.0 },
      { name: "আকাইদ ও ফিকহ", fullMarks: 100, obtainedMarks: 88, grade: "A+", point: 5.0 },
      { name: "আরবি ১ম পত্র", fullMarks: 100, obtainedMarks: 85, grade: "A+", point: 5.0 },
      { name: "আরবি ২য় পত্র", fullMarks: 100, obtainedMarks: 89, grade: "A+", point: 5.0 },
      { name: "বাংলা ১ম ও ২য় পত্র", fullMarks: 100, obtainedMarks: 82, grade: "A+", point: 5.0 },
      { name: "ইংরেজি ১ম ও ২য় পত্র", fullMarks: 100, obtainedMarks: 80, grade: "A+", point: 5.0 },
      { name: "সাধারণ গণিত", fullMarks: 100, obtainedMarks: 96, grade: "A+", point: 5.0 },
      { name: "তথ্য ও যোগাযোগ প্রযুক্তি", fullMarks: 50, obtainedMarks: 48, grade: "A+", point: 5.0 }
    ]
  },
  {
    id: "res-2",
    studentName: "আয়েশা সিদ্দিকা",
    rollNo: "১০২",
    regNo: "২০২৬১০১০২",
    examName: "দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬",
    classYear: "১০ম শ্রেণি (দাখিল)",
    session: "২০২৫-২০২৬",
    gpa: 4.88,
    grade: "A",
    resultStatus: "উত্তীর্ণ",
    publishDate: "২৮ সেপ্টেম্বর ২০২৬",
    subjects: [
      { name: "কুরআন মাজীদ ও তাজবীদ", fullMarks: 100, obtainedMarks: 89, grade: "A+", point: 5.0 },
      { name: "হাদীস শরীফ ও উসূলুল হাদীস", fullMarks: 100, obtainedMarks: 86, grade: "A+", point: 5.0 },
      { name: "আকাইদ ও ফিকহ", fullMarks: 100, obtainedMarks: 84, grade: "A+", point: 5.0 },
      { name: "আরবি ১ম পত্র", fullMarks: 100, obtainedMarks: 81, grade: "A+", point: 5.0 },
      { name: "আরবি ২য় পত্র", fullMarks: 100, obtainedMarks: 78, grade: "A", point: 4.0 },
      { name: "বাংলা ১ম ও ২য় পত্র", fullMarks: 100, obtainedMarks: 85, grade: "A+", point: 5.0 },
      { name: "ইংরেজি ১ম ও ২য় পত্র", fullMarks: 100, obtainedMarks: 76, grade: "A", point: 4.0 },
      { name: "সাধারণ গণিত", fullMarks: 100, obtainedMarks: 92, grade: "A+", point: 5.0 },
      { name: "তথ্য ও যোগাযোগ প্রযুক্তি", fullMarks: 50, obtainedMarks: 47, grade: "A+", point: 5.0 }
    ]
  },
  {
    id: "res-3",
    studentName: "মোঃ হাসান মাহমুদ",
    rollNo: "১০৩",
    regNo: "২০২৬১০১০৩",
    examName: "দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬",
    classYear: "১০ম শ্রেণি (দাখিল)",
    session: "২০২৫-২০২৬",
    gpa: 5.00,
    grade: "A+",
    resultStatus: "উত্তীর্ণ",
    publishDate: "২৮ সেপ্টেম্বর ২০২৬",
    subjects: [
      { name: "কুরআন মাজীদ ও তাজবীদ", fullMarks: 100, obtainedMarks: 95, grade: "A+", point: 5.0 },
      { name: "হাদীস শরীফ ও উসূলুল হাদীস", fullMarks: 100, obtainedMarks: 92, grade: "A+", point: 5.0 },
      { name: "আকাইদ ও ফিকহ", fullMarks: 100, obtainedMarks: 90, grade: "A+", point: 5.0 },
      { name: "পদার্থবিজ্ঞান", fullMarks: 100, obtainedMarks: 88, grade: "A+", point: 5.0 },
      { name: "রসায়ন", fullMarks: 100, obtainedMarks: 86, grade: "A+", point: 5.0 },
      { name: "উচ্চতর গণিত", fullMarks: 100, obtainedMarks: 98, grade: "A+", point: 5.0 },
      { name: "বাংলা ১ম ও ২য় পত্র", fullMarks: 100, obtainedMarks: 84, grade: "A+", point: 5.0 },
      { name: "ইংরেজি ১ম ও ২য় পত্র", fullMarks: 100, obtainedMarks: 82, grade: "A+", point: 5.0 },
      { name: "তথ্য ও যোগাযোগ প্রযুক্তি", fullMarks: 50, obtainedMarks: 49, grade: "A+", point: 5.0 }
    ]
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "বার্ষিক মিলাদ ও দোয়া মাহফিল",
    category: "অনুষ্ঠান",
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800",
    date: "অক্টোবর ২০২৬"
  },
  {
    id: "gal-2",
    title: "মাদ্রাসার মনোরম ভবন ও সবুজ প্রাঙ্গণ",
    category: "ক্যাম্পাস",
    imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800",
    date: "সেপ্টেম্বর ২০২৬"
  },
  {
    id: "gal-3",
    title: "জাতীয় ক্বেরাত ও হিফজুল কুরআন প্রতিযোগিতা",
    category: "প্রতিযোগিতা",
    imageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800",
    date: "আগস্ট ২০২৬"
  },
  {
    id: "gal-4",
    title: "ডিজিটাল কম্পিউটার ল্যাবে প্রশিক্ষণ",
    category: "ক্লাস",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    date: "জুলাই ২০২৬"
  },
  {
    id: "gal-5",
    title: "বার্ষিক ক্রীড়া ও সাংস্কৃতিক পুরষ্কার বিতরণী",
    category: "অনুষ্ঠান",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    date: "মার্চ ২০২৬"
  },
  {
    id: "gal-6",
    title: "বিজ্ঞান মেলা ও শিক্ষার্থীদের প্রোজেক্ট প্রদর্শনী",
    category: "প্রতিযোগিতা",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    date: "ফেব্রুয়ারি ২০২৬"
  }
];

export const defaultVideos: VideoItem[] = [
  {
    id: "vid-1",
    title: "বার্ষিক ওয়াজ মাহফিল ও দোআ অনুষ্ঠান ২০২৬",
    category: "ওয়াজ মাহফিল",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80",
    description: "পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসার বার্ষিক ইসলামী সম্মেলন ও কৃতী শিক্ষার্থীদের দোআ মাহফিল।",
    duration: "১৫:২০",
    date: "২০২৬-১০-১৫"
  },
  {
    id: "vid-2",
    title: "আন্তর্জাতিক ক্বিরাত সম্মেলন ও পবিত্র কুরআন তিলাওয়াত প্রতিযোগিতা",
    category: "কুরআন তিলাওয়াত",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80",
    description: "হিফজুল কুরআন বিভাগের শিক্ষার্থীদের হৃদয়স্পর্শী কুরআন তিলাওয়াত।",
    duration: "১০:৪৫",
    date: "২০২৬-০৯-২০"
  },
  {
    id: "vid-3",
    title: "বার্ষিক ক্রীড়া ও বিজ্ঞান মেলা সমাপনী ও পুরস্কার বিতরণ",
    category: "বিজ্ঞান মেলা",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    description: "মাদ্রাসার শিক্ষার্থীদের বিজ্ঞান প্রজেক্ট প্রদর্শনী ও বার্ষিক ক্রীড়ার আকর্ষণীয় মুহূর্ত।",
    duration: "১২:১০",
    date: "২০২৬-০৮-১২"
  }
];

export const defaultMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "মোঃ রফিকুল হাসান",
    phone: "০১৭৮৯-১২৩৪৫৬",
    email: "rafiq.hasan@gmail.com",
    subject: "হিফজ বিভাগে নতুন ভর্তি সংক্রান্ত তথ্য",
    message: "আসসালামু আলাইকুম। আমার ৭ বছর বয়সী ছেলেকে হিফজুল কুরআন বিভাগে আবাসিক হোস্টেলে ভর্তি করাতে চাই। দুপচাঁচিয়া শাখা অফিসের বিস্তারিত জানতে চাচ্ছি।",
    date: "২০২৬-১০-১৬",
    isRead: false
  },
  {
    id: "msg-2",
    name: "মাওলানা আব্দুল বাতেন",
    phone: "০১৮১৬-৭৮৯০১২",
    email: "abdul.baten@yahoo.com",
    subject: "দাখিল বিজ্ঞান বিভাগের সুযোগ-সুবিধা",
    message: "মাদ্রাসার দাখিল বিজ্ঞান বিভাগের শিক্ষক মণ্ডলী ও ল্যাবরেটরি সম্পর্কে ইতিবাচক সুনাম শুনেছি। বিস্তারিত প্রসপেক্টাস পাওয়ার অনুরোধ রইল।",
    date: "২০২৬-১০-১৫",
    isRead: true
  }
];

export const defaultPrayerConfig: PrayerTimeConfig = {
  isEnabled: true,
  fajrAthan: "০৪:৪৫",
  fajrIqamah: "০৫:১৫",
  sunrise: "০৬:০৫",
  dhuhrAthan: "১২:১৫",
  dhuhrIqamah: "০১:১৫",
  asrAthan: "০৪:১৫",
  asrIqamah: "০৪:৪৫",
  maghribAthan: "০৫:৩৬",
  maghribIqamah: "০৫:৪০",
  ishaAthan: "০৭:০০",
  ishaIqamah: "০৭:৪৫",
  jumuahBayan: "১২:৩০",
  jumuahIqamah: "০১:৩০",
  tahajjudEnd: "০৪:৪০",
  iftarTime: "০৫:৩৬",
  areaNote: "দুপচাঁচিয়া ও বগুড়া অঞ্চলের স্থানীয় ওয়াক্ত ও জামাত সময়সূচি",
  prayerQuoteArabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
  prayerQuoteBangla: "নিশ্চয়ই সালাত মুমিনদের ওপর নির্দিষ্ট সময়ে ফরয করা হয়েছে। (সূরা আন-নিসা: ১০৩)",
  prayerQuoteSource: "আল-কুরআন, সূরা আন-নিসা: ৪/১০৩"
};

export interface RoutinePeriod {
  id: string;
  period: string;
  time: string;
  subject: string;
  teacher: string;
  room?: string;
}

export interface ClassRoutine {
  id: string;
  className: string;
  effectiveDate?: string;
  notes?: string;
  periods: RoutinePeriod[];
}

export const defaultClassRoutines: ClassRoutine[] = [
  {
    id: 'routine-10',
    className: '১০ম শ্রেণি (দাখিল)',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'বিশেষ প্রয়োজনে কর্তৃপক্ষ রুটিন পরিবর্তনের ক্ষমতা সংরক্ষণ করে।',
    periods: [
      { id: 'p10-1', period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন মাজীদ ও তাজবীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { id: 'p10-2', period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'হাদীস শরীফ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
      { id: 'p10-3', period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'আরবি ১ম পত্র', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'p10-4', period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'সাধারণ গণিত / পদার্থ', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p10-5', period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও খাবার বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { id: 'p10-6', period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'ইংরেজি ১ম ও ২য় পত্র', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { id: 'p10-7', period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'বাংলা সাহিত্য ও ব্যাকরণ', teacher: 'মোছাঃ ফাতেমা আক্তার' },
      { id: 'p10-8', period: '৭ম ঘণ্টা', time: '০২:৪৫ - ০৩:৩০', subject: 'আইসিটি ল্যাব প্র্যাকটিস', teacher: 'মোঃ আহসান উল্লাহ' },
    ]
  },
  {
    id: 'routine-9',
    className: '৯ম শ্রেণি',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'বিজ্ঞান ও সাধারণ উভয় বিভাগের জন্য প্রযোজ্য।',
    periods: [
      { id: 'p9-1', period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'আকাইদ ও ফিকহ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
      { id: 'p9-2', period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'কুরআন মাজীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { id: 'p9-3', period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p9-4', period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'ইংরেজি ১ম পত্র', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { id: 'p9-5', period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও খাবার বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { id: 'p9-6', period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'আরবি সাহিত্য', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'p9-7', period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'তথ্য ও যোগাযোগ প্রযুক্তি', teacher: 'মোঃ আহসান উল্লাহ' },
      { id: 'p9-8', period: '৭ম ঘণ্টা', time: '০২:৪৫ - ০৩:৩০', subject: 'বাংলাদেশ ও বিশ্বপরিচয়', teacher: 'মোছাঃ ফাতেমা আক্তার' },
    ]
  },
  {
    id: 'routine-8',
    className: '৮ম শ্রেণি (জেডিসি সমমান)',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'জেডিসি সমমান পরীক্ষার প্রস্তুতিমূলক নিয়মিত পাঠদান।',
    periods: [
      { id: 'p8-1', period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন মাজীদ ও তাজবীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { id: 'p8-2', period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'আরবি ১ম পত্র', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'p8-3', period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p8-4', period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'ইংরেজি', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { id: 'p8-5', period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও মধ্যাহ্ন বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { id: 'p8-6', period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'আকাইদ ও ফিকহ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
      { id: 'p8-7', period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'সাধারণ বিজ্ঞান', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p8-8', period: '৭ম ঘণ্টা', time: '০২:৪৫ - ০৩:৩০', subject: 'বাংলা সাহিত্য', teacher: 'মোছাঃ ফাতেমা আক্তার' },
    ]
  },
  {
    id: 'routine-7',
    className: '৭ম শ্রেণি',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'নতুন শিক্ষাক্রম ও মাদরাসা শিক্ষা বোর্ডের নির্দেশনা অনুযায়ী।',
    periods: [
      { id: 'p7-1', period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন ও আরবি ভাষা', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'p7-2', period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p7-3', period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'ইংরেজি', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { id: 'p7-4', period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'বাংলা সাহিত্য', teacher: 'মোছাঃ ফাতেমা আক্তার' },
      { id: 'p7-5', period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও খাবার বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { id: 'p7-6', period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'দ্বীনিয়াত ও আখলাক', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { id: 'p7-7', period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'বিজ্ঞান ও স্বাস্থ্য সুরক্ষা', teacher: 'মোঃ আহসান উল্লাহ' },
    ]
  },
  {
    id: 'routine-6',
    className: '৬ষ্ঠ শ্রেণি',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'নতুন শিক্ষাক্রমের আলোকে নিয়মিত বিষয়ভিত্তিক পাঠদান।',
    periods: [
      { id: 'p6-1', period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন মাজীদ ও তাজবীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
      { id: 'p6-2', period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'বাংলা ভাষা ও সাহিত্য', teacher: 'মোছাঃ ফাতেমা আক্তার' },
      { id: 'p6-3', period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p6-4', period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'ইংরেজি পাঠ', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { id: 'p6-5', period: 'বিরতি ও যোহরের সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও খাবার বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { id: 'p6-6', period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'আরবি ১ম পত্র', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'p6-7', period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'ডিজিটাল প্রযুক্তি ও তথ্যজ্ঞান', teacher: 'মোঃ আহসান উল্লাহ' },
    ]
  },
  {
    id: 'routine-5',
    className: 'পঞ্চম শ্রেণি (ইবতেদায়ী সমাপনী)',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'ইবতেদায়ী সমাপনী পরীক্ষার বিশেষ প্রস্তুতি ক্লাস।',
    periods: [
      { id: 'p5-1', period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন মাজীদ ও আকাইদ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
      { id: 'p5-2', period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'আরবি ভাষা ও সাহিত্য', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'p5-3', period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
      { id: 'p5-4', period: 'বিরতি ও যোহরের সালাত', time: '১১:৩০ - ১২:৩০', subject: 'যোহরের সালাত ও টিফিন বিরতি', teacher: 'সকল শিক্ষক ও শিক্ষার্থী' },
      { id: 'p5-5', period: '৪র্থ ঘণ্টা', time: '১২:৩০ - ০১:১৫', subject: 'ইংরেজি', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
      { id: 'p5-6', period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'বাংলা', teacher: 'মোছাঃ ফাতেমা আক্তার' },
    ]
  },
  {
    id: 'routine-hifz',
    className: 'হিফজুল কুরআন বিভাগ',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'হিফজুল কুরআন আবাসিক ও অনাবাসিক শিক্ষার্থীদের সার্বক্ষণিক পাঠদান রুটিন।',
    periods: [
      { id: 'ph-1', period: 'ফজরের পর', time: '০৫:৩০ - ০৭:০০', subject: 'সাবাখ (নতুন পড়া মুখস্থ ও তিলাওয়াত)', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { id: 'ph-2', period: 'সকালের বিরতি', time: '০৭:০০ - ০৮:৩০', subject: 'নাশতা ও বিশ্রাম', teacher: 'হোস্টেল সুপারভাইজার' },
      { id: 'ph-3', period: '১ম অধিবেশন', time: '০৮:৩০ - ১১:৩০', subject: 'সাবাখী (পূর্বের দিনের পাঠ মজবুতকরণ)', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { id: 'ph-4', period: 'দুপুরের বিরতি', time: '১১:৩০ - ০২:০০', subject: 'গোসল, খাবার ও যোহরের সালাত', teacher: 'সকল শিক্ষক' },
      { id: 'ph-5', period: '২য় অধিবেশন', time: '০২:০০ - আসর', subject: 'আমোকথা (পেছনের পারা রিভিশন)', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { id: 'ph-6', period: 'মাগরিবের পর', time: 'মাগরিব - এশা', subject: 'দৈনিক পাঠের চূড়ান্ত যাচাই ও পরীক্ষা', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
    ]
  },
  {
    id: 'routine-nurani',
    className: 'নূরানী ও নাজেরা বিভাগ',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'ছোট শিশুদের বিশুদ্ধ মাখরাজ ও সহীহ কুরআন পাঠ প্রশিক্ষণ।',
    periods: [
      { id: 'pn-1', period: '১ম অধিবেশন', time: '০৮:৩০ - ০৯:১৫', subject: 'নূরানী কায়দা ও মাখরাজ প্রশিক্ষণ', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { id: 'pn-2', period: '২য় অধিবেশন', time: '০৯:১৫ - ১০:০০', subject: 'নাজেরা কুরআন তিলাওয়াত', teacher: 'হাফেজ ক্বারী মোঃ ইব্রাহিম খলিল' },
      { id: 'pn-3', period: '৩য় অধিবেশন', time: '১০:০০ - ১০:৪৫', subject: 'হুসনুল খত (আরবি ও বাংলা হস্তলিপি)', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
      { id: 'pn-4', period: 'টিফিন বিরতি', time: '১০:৪৫ - ১১:১৫', subject: 'নাশতা ও খেলাধুলা', teacher: 'দায়িত্বপ্রাপ্ত শিক্ষক' },
      { id: 'pn-5', period: '৪র্থ অধিবেশন', time: '১১:১৫ - ১২:০০', subject: 'মাসনূন দোয়া ও দ্বীনিয়াহ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
    ]
  }
];

export const defaultAlumniStudents: AlumniStudent[] = [
  {
    id: 'alm-2024-01',
    name: 'মোঃ তানভীর হাসান',
    nameEn: 'Md. Tanvir Hasan',
    passingYear: '২০২৪',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '৪১২০৫১',
    regNo: '১৯১২৩৪৫৬৭৮',
    gpa: '৫.০০ (গোল্ডেন A+)',
    group: 'বিজ্ঞান বিভাগ',
    fatherName: 'মোঃ রফিকুল ইসলাম',
    motherName: 'মোছাঃ জাহানারা বেগম',
    phone: '01711-223344',
    email: 'tanvir.hasan@example.com',
    bloodGroup: 'A+',
    currentStatus: 'উচ্চ মাধ্যমিক (বিজ্ঞান)',
    presentInstitute: 'নটর ডেম কলেজ, ঢাকা',
    address: 'পশ্চিম আলোহালী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    achievements: 'দাখিল পরীক্ষায় মাদ্রাসায় সর্বোচ্চ নম্বর ও গোল্ডেন জিপিএ ৫.০০ প্রাপ্তি।',
    createdAt: '২০২৪-০৭-১৫'
  },
  {
    id: 'alm-2024-02',
    name: 'মোছাঃ মারিয়া আক্তার',
    nameEn: 'Mst. Maria Akter',
    passingYear: '২০২৪',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '৪১২০৫২',
    regNo: '১৯১২৩৪৫৬৭৯',
    gpa: '৫.০০ (A+)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মোঃ আশরাফুল আলম',
    motherName: 'মোছাঃ সেলিনা পারভীন',
    phone: '01722-334455',
    email: 'maria.akter@example.com',
    bloodGroup: 'B+',
    currentStatus: 'একাদশ শ্রেণিতে অধ্যয়নরত',
    presentInstitute: 'রাজশাহী সরকারি মহিলা কলেজ',
    address: 'চৌকড়ী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    achievements: 'উপজেলা পর্যায়ে কিরাত ও ইসলামিক সাধারণ জ্ঞানে ১ম স্থান অধিকারী।',
    createdAt: '২০২৪-০৭-১৫'
  },
  {
    id: 'alm-2023-01',
    name: 'হাফেজ মোঃ নাঈমুল ইসলাম',
    nameEn: 'Hafez Md. Naimul Islam',
    passingYear: '২০২৩',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '৩১৮০২১',
    regNo: '১৮১২৩৪৫৮০১',
    gpa: '৪.৮৮ (A+)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মাওলানা মোঃ নুরুল হুদা',
    motherName: 'মোছাঃ খাদিজা বেগম',
    phone: '01733-445566',
    email: 'naimul.quran@example.com',
    bloodGroup: 'O+',
    currentStatus: 'অনার্স ১ম বর্ষ (আরবি সাহিত্য)',
    presentInstitute: 'রাজশাহী বিশ্ববিদ্যালয়',
    address: 'পশ্চিম আলোহালী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    achievements: 'হিফজুল কুরআন সম্পন্নকারী ও বিভাগীয় কুরআন তিলাওয়াত প্রতিযোগিতার রানারআপ।',
    createdAt: '২০২৩-০৮-১০'
  },
  {
    id: 'alm-2023-02',
    name: 'মোছাঃ ফাতেমা খাতুন',
    nameEn: 'Mst. Fatema Khatun',
    passingYear: '২০২৩',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '৩১৮০২২',
    regNo: '১৮১২৩৪৫৮০২',
    gpa: '৪.৭৫ (A)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মোঃ আব্দুল মান্নান',
    motherName: 'মোছাঃ আয়েশা বেগম',
    phone: '01744-556677',
    email: 'fatema.khatun@example.com',
    bloodGroup: 'AB+',
    currentStatus: 'দ্বাদশ শ্রেণি (মানবিক বিভাগ)',
    presentInstitute: 'সিংড়া গোল-ই-আফরোজ সরকারি কলেজ',
    address: 'বিলদহর, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    achievements: 'শ্রেষ্ঠ বিতার্কিক ও সাহিত্য সাংস্কৃতিক প্রতিযোগিতায় পুরষ্কারপ্রাপ্ত।',
    createdAt: '২০২৩-০৮-১০'
  },
  {
    id: 'alm-2022-01',
    name: 'মোঃ সাইফুল ইসলাম',
    nameEn: 'Md. Saiful Islam',
    passingYear: '২০২২',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '২২৪০১১',
    regNo: '১৭১২৩৪৬০০১',
    gpa: '৫.০০ (গোল্ডেন A+)',
    group: 'বিজ্ঞান বিভাগ',
    fatherName: 'মোঃ গোলাম মোস্তফা',
    motherName: 'মোছাঃ রাবেয়া বসরী',
    phone: '01755-667788',
    email: 'saiful.buet@example.com',
    bloodGroup: 'A+',
    currentStatus: 'বিএসসি ইঞ্জিনিয়ারিং (ইইই)',
    presentInstitute: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (BUET)',
    address: 'পশ্চিম আলোহালী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    achievements: 'বুয়েট ভর্তি পরীক্ষায় কৃতিত্বের সাথে চান্স লাভ ও জাতীয় গণিত অলিম্পিয়াড অংশগ্রহণকারী।',
    createdAt: '২০২২-০৭-২০'
  },
  {
    id: 'alm-2022-02',
    name: 'মোঃ আল-আমিন হোসেন',
    nameEn: 'Md. Al-Amin Hossain',
    passingYear: '২০২২',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '২২৪০১২',
    regNo: '১৭১২৩৪৬০০২',
    gpa: '৪.৬০ (A)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মোঃ মোকছেদ আলী',
    motherName: 'মোছাঃ শাহিদা পারভীন',
    phone: '01766-778899',
    email: 'alamin.madrasah@example.com',
    bloodGroup: 'B+',
    currentStatus: 'ফাজিল (স্নাতক) ২য় বর্ষ',
    presentInstitute: 'কাদেরিয়া তৈয়্যেবিয়া আলিয়া কামিল মাদ্রাসা, ঢাকা',
    address: 'বটতলী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    achievements: 'ইসলামিক ক্যালিগ্রাফিতে জাতীয় পুরষ্কারপ্রাপ্ত।',
    createdAt: '২০২২-০৭-২০'
  },
  {
    id: 'alm-2021-01',
    name: 'মোছাঃ সাবিনা ইয়াসমিন',
    nameEn: 'Mst. Sabina Yasmin',
    passingYear: '২০২১',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '২১৩০১৪',
    regNo: '১৬১২৩৪৬১০৫',
    gpa: '৪.৯২ (A+)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মোঃ জহুরুল হক',
    motherName: 'মোছাঃ মমতাজ বেগম',
    phone: '01777-889900',
    email: 'sabina.du@example.com',
    bloodGroup: 'O+',
    currentStatus: 'অনার্স ৩য় বর্ষ (ইসলামিক স্টাডিজ)',
    presentInstitute: 'ঢাকা বিশ্ববিদ্যালয়',
    address: 'পশ্চিম আলোহালী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    achievements: 'বিশ্ববিদ্যালয় মেধা বৃত্তিপ্রাপ্ত শিক্ষার্থী।',
    createdAt: '২০২১-০৭-১৮'
  },
  {
    id: 'alm-2020-01',
    name: 'মোঃ হাসিবুর রহমান',
    nameEn: 'Md. Hasibur Rahman',
    passingYear: '২০২০',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '২০২০১৫',
    regNo: '১৫১২৩৪৬২১১',
    gpa: '৫.০০ (A+)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মোঃ শাহজাহান আলী',
    motherName: 'মোছাঃ ফরিদা বেগম',
    phone: '01788-990011',
    email: 'hasibur.edu@example.com',
    bloodGroup: 'A+',
    currentStatus: 'সহকারী শিক্ষক (সরকারি প্রাথমিক বিদ্যালয়)',
    presentInstitute: 'প্রাথমিক ও গণশিক্ষা মন্ত্রণালয়',
    address: 'সিংড়া পৌরসভা, নাটোর',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    achievements: 'বিসিএস ও প্রাথমিক শিক্ষক নিয়োগ পরীক্ষায় প্রথম সারিতে উত্তীর্ণ।',
    createdAt: '২০২০-০৬-৩০'
  },
  {
    id: 'alm-2019-01',
    name: 'ইঞ্জিনিয়ার মোঃ আরিফুল ইসলাম',
    nameEn: 'Engr. Md. Ariful Islam',
    passingYear: '২০১৯',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '১৯১০১৮',
    regNo: '১৪১২৩৪৬৩২৫',
    gpa: '৪.৬৫ (A)',
    group: 'বিজ্ঞান বিভাগ',
    fatherName: 'মোঃ ইব্রাহিম খলিল',
    motherName: 'মোছাঃ নাসিমা আক্তার',
    phone: '01799-001122',
    email: 'ariful.dev@example.com',
    bloodGroup: 'AB+',
    currentStatus: 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
    presentInstitute: 'টেকনো সল্যুশনস লিমিটেড, ঢাকা',
    address: 'উত্তরা, ঢাকা (মূল বাড়ি: পশ্চিম আলোহালী)',
    photo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=250',
    achievements: 'মাদ্রাসার আইসিটি ল্যাব প্রতিষ্ঠায় আর্থিক ও প্রযুক্তিগত অনুদান দাতা।',
    createdAt: '২০১৯-০৬-২৫'
  },
  {
    id: 'alm-2018-01',
    name: 'মাওলানা মোঃ মাহমুদুল হাসান',
    nameEn: 'Mawlana Md. Mahmudul Hasan',
    passingYear: '২০১৮',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '১৮১০১০',
    regNo: '১৩১২৩৪৬৪০১',
    gpa: '৪.৮০ (A+)',
    group: 'সাধারণ বিভাগ',
    fatherName: 'মোঃ আব্দুল কুদ্দুস',
    motherName: 'মোছাঃ খাদিজাতুল কোবরা',
    phone: '01811-223344',
    email: 'mahmud.khatib@example.com',
    bloodGroup: 'O+',
    currentStatus: 'খতিব ও সিনিয়র আরবি প্রভাষক',
    presentInstitute: 'বায়তুস সালাম কেন্দ্রীয় জামে মসজিদ ও ফাজিল মাদ্রাসা',
    address: 'পশ্চিম আলোহালী, সিংড়া, নাটোর',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    achievements: 'কামিল হাদিস বিভাগে জাতীয় মেধা তালিকায় ১০ম স্থান।',
    createdAt: '২০১৮-০৭-১০'
  }
];

export const defaultStudents: StudentProfile[] = [
  {
    id: 'std-2026-01',
    name: 'মোঃ ওমর ফারুক',
    nameEn: 'Md. Omar Faruk',
    phone: '01711000101',
    classYear: '১০ম শ্রেণি (দাখিল)',
    rollNo: '১০১',
    regNo: '২০২৬১০১০১',
    session: '২০২৫-২০২৬',
    bloodGroup: 'A+',
    gender: 'ছাত্র',
    fatherName: 'মোঃ আব্দুর রহমান',
    motherName: 'মোছাঃ ফাতেমা বেগম',
    address: 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
    attendanceRate: '৯৮%',
    feeStatus: 'পরিশোধিত',
    status: 'নিয়মিত',
    createdAt: '২০২৬-০১-১০'
  },
  {
    id: 'std-2026-02',
    name: 'আয়েশা সিদ্দিকা',
    nameEn: 'Ayesha Siddika',
    phone: '01711000102',
    classYear: '১০ম শ্রেণি (দাখিল)',
    rollNo: '১০২',
    regNo: '২০২৬১০১০২',
    session: '২০২৫-২০২৬',
    bloodGroup: 'B+',
    gender: 'ছাত্রী',
    fatherName: 'মোঃ আব্দুল জলিল',
    motherName: 'মোছাঃ রাবেয়া খাতুন',
    address: 'পূর্ব আলোহালী, দুপচাঁচিয়া, বগুড়া',
    attendanceRate: '৯৬%',
    feeStatus: 'পরিশোধিত',
    status: 'নিয়মিত',
    createdAt: '২০২৬-০১-১০'
  },
  {
    id: 'std-2026-03',
    name: 'মোঃ হাসান মাহমুদ',
    nameEn: 'Md. Hasan Mahmud',
    phone: '01711000103',
    classYear: '১০ম শ্রেণি (দাখিল)',
    rollNo: '১০৩',
    regNo: '২০২৬১০১০৩',
    session: '২০২৫-২০২৬',
    bloodGroup: 'O+',
    gender: 'ছাত্র',
    fatherName: 'মোঃ আব্দুল করিম',
    motherName: 'মোছাঃ শাহিদা পারভীন',
    address: 'দুপচাঁচিয়া সদর, বগুড়া',
    attendanceRate: '৯৪%',
    feeStatus: 'পরিশোধিত',
    status: 'নিয়মিত',
    createdAt: '২০২৬-০১-১১'
  },
  {
    id: 'std-2026-04',
    name: 'সুমাইয়া আক্তার',
    nameEn: 'Sumaiya Akhter',
    phone: '01711000104',
    classYear: '৯ম শ্রেণি (দাখিল)',
    rollNo: '১০১',
    regNo: '২০২৬০৯১০১',
    session: '২০২৫-২০২৬',
    bloodGroup: 'AB+',
    gender: 'ছাত্রী',
    fatherName: 'মোঃ হাবিবুর রহমান',
    motherName: 'মোছাঃ শিরিন আক্তার',
    address: 'গোবিন্দপুর, দুপচাঁচিয়া, বগুড়া',
    attendanceRate: '৯৭%',
    feeStatus: 'পরিশোধিত',
    status: 'নিয়মিত',
    createdAt: '২০২৬-০১-১২'
  }
];

export interface AdminPermission {
  id: string;
  name: string;
  title: string;
  description: string;
  category: 'core' | 'academic' | 'media' | 'system';
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  phone?: string;
  email?: string;
  isSuperAdmin?: boolean;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export const availablePermissions: AdminPermission[] = [
  { id: 'overview', name: 'ড্যাশবোর্ড ওভারভিউ', title: 'ড্যাশবোর্ড ওভারভিউ', description: 'মাদ্রাসার সার্বিক পরিসংখ্যান ও সারসংক্ষেপ দেখা', category: 'core' },
  { id: 'attendance', name: 'দৈনিক হাজিরা ও উপস্থিতি', title: 'দৈনিক হাজিরা ও উপস্থিতি', description: 'শিক্ষক ও শিক্ষার্থীদের ডিজিটাল হাজিরা গ্রহণ ও রিপোর্ট', category: 'academic' },
  { id: 'students', name: 'শিক্ষার্থী প্রোফাইল', title: 'শিক্ষার্থী প্রোফাইল ও ডাটাবেজ', description: 'মাদ্রাসার নিয়মিত শিক্ষার্থীদের পূর্ণাঙ্গ ডাটাবেজ, প্রোফাইল তৈরি ও আইডি কার্ড জেনারেশন', category: 'academic' },
  { id: 'routine', name: 'ক্লাস রুটিন ব্যবস্থাপনা', title: 'ক্লাস রুটিন ব্যবস্থাপনা', description: 'সকল শ্রেণির নিয়মিত ক্লাস রুটিন, পিরিয়ড ও শিক্ষক নির্ধারণ', category: 'academic' },
  { id: 'alumni', name: 'পুরাতন শিক্ষার্থী তালিকা', title: 'পুরাতন শিক্ষার্থী তালিকা', description: 'মাদ্রাসার প্রাক্তন ও উত্তীর্ণ শিক্ষার্থীদের তথ্য, ব্যাচ ও ডাটাবেজ ব্যবস্থাপনা', category: 'academic' },
  { id: 'results', name: 'ফলাফল ও মার্কস', title: 'ফলাফল ও মার্কস', description: 'পরীক্ষার ফলাফল প্রকাশ, এডিট ও নম্বরপত্র তৈরি', category: 'academic' },
  { id: 'admissions', name: 'ভর্তি আবেদন', title: 'ভর্তি আবেদন', description: 'অনলাইন নতুন ভর্তি আবেদন যাচাই, অনুমোদন ও বাতিল', category: 'academic' },
  { id: 'teachers', name: 'শিক্ষক ও স্টাফ তালিকা', title: 'শিক্ষক ও স্টাফ তালিকা', description: 'শিক্ষক-কর্মচারীদের তথ্য ও প্রোফাইল ব্যবস্থাপনা', category: 'academic' },
  { id: 'notices', name: 'নোটিশ ব্যবস্থাপনা', title: 'নোটিশ ব্যবস্থাপনা', description: 'সাধারণ ও অ্যাকাডেমিক নোটিশ যুক্ত ও প্রকাশ', category: 'core' },
  { id: 'urgent-notices', name: 'জরুরি নোটিশ (স্ক্রল)', title: 'জরুরি নোটিশ (স্ক্রল)', description: 'হোমপেজের জরুরি স্ক্রলিং টিকার নোটিশ নিয়ন্ত্রণ', category: 'core' },
  { id: 'hero', name: 'হিরো ব্যানার স্লাইডশো', title: 'হিরো ব্যানার স্লাইডশো', description: 'হোমপেজের মূল ব্যানার, ছবি ও স্লাইডশো পরিবর্তন', category: 'media' },
  { id: 'facilities', name: 'সুযোগ-সুবিধাসমূহ', title: 'সুযোগ-সুবিধাসমূহ', description: 'মাদ্রাসার ল্যাব, লাইব্রেরি ও ক্যাম্পাসের সুবিধা এডিট', category: 'media' },
  { id: 'gallery',
      'videos', name: 'ফটো গ্যালারি', title: 'ফটো গ্যালারি', description: 'ক্যাম্পাস, অনুষ্ঠান ও পুরস্কারের ছবি আপলোড', category: 'media' },
  { id: 'videos', name: 'ভিডিও গ্যালারি', title: 'ভিডিও গ্যালারি', description: 'ইউটিউব ও আপলোড করা ভিডিও ব্যবস্থাপনা', category: 'media' },
  { id: 'authorities', name: 'কর্তৃপক্ষের বাণী', title: 'কর্তৃপক্ষের বাণী', description: 'সভাপতি ও অধ্যক্ষ মহোদয়ের বাণী ও ছবি পরিবর্তন', category: 'media' },
  { id: 'messages', name: 'প্রাপ্ত বার্তা (ইনবক্স)', title: 'প্রাপ্ত বার্তা (ইনবক্স)', description: 'ওয়েবসাইটের যোগাযোগ ফরম থেকে আসা মেসেজ দেখা', category: 'core' },
  { id: 'prayer', name: 'সালাতের সময়সূচি', title: 'সালাতের সময়সূচি', description: 'পাঁচ ওয়াক্ত সালাতের আযান ও জামাতের সময়সূচি পরিবর্তন', category: 'core' },
  { id: 'settings', name: 'মাদ্রাসা সাধারণ সেটিংস', title: 'মাদ্রাসা সাধারণ সেটিংস', description: 'মাদ্রাসার নাম, কোড, ঠিকানা, ফোন ও অন্যান্য সেটিংস', category: 'system' },
  { id: 'users', name: 'ইউজার ও পারমিশন কন্ট্রোল', title: 'ইউজার ও পারমিশন কন্ট্রোল', description: 'নতুন অ্যাডমিন তৈরি ও তাদের এক্সেস পারমিশন নিয়ন্ত্রণ', category: 'system' }
];

export const defaultAdminUsers: AdminUser[] = [
  {
    id: 'admin-super',
    name: 'প্রধান সুপার অ্যাডমিন',
    username: 'admin',
    password: 'madrasah123',
    role: 'সুপার অ্যাডমিন (Super Admin)',
    phone: '01773542057',
    email: 'admin@madrasah.edu.bd',
    isSuperAdmin: true,
    isActive: true,
    permissions: [
      'overview',
      'hero',
      'admissions',
      'notices',
      'urgent-notices',
      'facilities',
      'gallery',
      'teachers',
      'attendance',
      'routine',
      'alumni',
      'authorities',
      'results',
      'messages',
      'settings',
      'prayer',
      'backup',
      'users'
    ],
    createdAt: '২০২৬-০১-০১'
  },
  {
    id: 'admin-attendance',
    name: 'মাওলানা মোঃ রফিকুল ইসলাম',
    username: 'attendance_staff',
    password: 'att123',
    role: 'হাজিরা ও শিক্ষক ইনচার্জ',
    phone: '01711223344',
    email: 'attendance@madrasah.edu.bd',
    isSuperAdmin: false,
    isActive: true,
    permissions: ['overview', 'attendance', 'teachers'],
    createdAt: '২০২৬-০২-০১'
  },
  {
    id: 'admin-exam',
    name: 'মোঃ মাহবুবুল হক',
    username: 'exam_admin',
    password: 'exam123',
    role: 'পরীক্ষা ও ফলাফল নিয়ন্ত্রক',
    phone: '01819876543',
    email: 'exam@madrasah.edu.bd',
    isSuperAdmin: false,
    isActive: true,
    permissions: ['overview', 'results', 'notices'],
    createdAt: '২০২৬-০২-১৫'
  },
  {
    id: 'admin-admission',
    name: 'মোঃ কামরুল হাসান',
    username: 'admission_staff',
    password: 'adm123',
    role: 'ভর্তি ও নোটিশ কর্মকর্তা',
    phone: '01912345678',
    email: 'admission@madrasah.edu.bd',
    isSuperAdmin: false,
    isActive: true,
    permissions: ['overview', 'admissions', 'notices', 'urgent-notices', 'messages'],
    createdAt: '২০২৬-০৩-০১'
  }
];

export const academicClassesList = [
  '১০ম শ্রেণি (দাখিল)',
  '৯ম শ্রেণি (দাখিল)',
  '৮ম শ্রেণি (জেডিসি)',
  '৭ম শ্রেণি',
  '৬ষ্ঠ শ্রেণি',
  'ইবতেদায়ী (১ম-৫ম)',
  'নূরানী ও হিফজ বিভাগ'
];

export interface StudentDailyAttendanceLog {
  dayIndex: number;
  date: string;
  dateBn: string;
  dayBn: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  inTime?: string;
  subjects?: string;
  remarks?: string;
}
