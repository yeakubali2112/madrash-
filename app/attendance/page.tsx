'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import { academicClassesList, StudentProfile, StudentDailyAttendanceLog } from '@/lib/data';
import {
  UserCheck,
  Search,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  User,
  GraduationCap,
  Sparkles,
  Phone,
  MapPin,
  FileText,
  RotateCcw
} from 'lucide-react';

// Fallback student database for comprehensive class coverage
const fallbackStudentRoster: Record<string, Array<{
  id: string;
  name: string;
  nameEn?: string;
  rollNo: string;
  regNo?: string;
  fatherName?: string;
  motherName?: string;
  phone?: string;
  address?: string;
  attendanceRate?: string;
  gender?: string;
}>> = {
  '১০ম শ্রেণি (দাখিল)': [
    {
      id: 'std-10-101',
      name: 'মোঃ ওমর ফারুক',
      nameEn: 'Md. Omar Faruk',
      rollNo: '১০১',
      regNo: '২০২৬১০১০১',
      fatherName: 'মোঃ আব্দুর রহমান',
      motherName: 'মোছাঃ ফাতেমা বেগম',
      phone: '01711000101',
      address: 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
      attendanceRate: '৯৮%',
      gender: 'ছাত্র'
    },
    {
      id: 'std-10-102',
      name: 'আয়েশা সিদ্দিকা',
      nameEn: 'Ayesha Siddika',
      rollNo: '১০২',
      regNo: '২০২৬১০১০২',
      fatherName: 'মোঃ আব্দুল জলিল',
      motherName: 'মোছাঃ রাবেয়া খাতুন',
      phone: '01711000102',
      address: 'পূর্ব আলোহালী, দুপচাঁচিয়া, বগুড়া',
      attendanceRate: '৯৬%',
      gender: 'ছাত্রী'
    },
    {
      id: 'std-10-103',
      name: 'মোঃ হাসান মাহমুদ',
      nameEn: 'Md. Hasan Mahmud',
      rollNo: '১০৩',
      regNo: '২০২৬১০১০৩',
      fatherName: 'মোঃ আব্দুল করিম',
      motherName: 'মোছাঃ শাহিদা পারভীন',
      phone: '01711000103',
      address: 'দুপচাঁচিয়া সদর, বগুড়া',
      attendanceRate: '৯৪%',
      gender: 'ছাত্র'
    }
  ],
  '৯ম শ্রেণি (দাখিল)': [
    {
      id: 'std-09-101',
      name: 'সুমাইয়া আক্তার',
      nameEn: 'Sumaiya Akhter',
      rollNo: '১০১',
      regNo: '২০২৬০৯১০১',
      fatherName: 'মোঃ হাবিবুর রহমান',
      motherName: 'মোছাঃ শিরিন আক্তার',
      phone: '01711000104',
      address: 'গোবিন্দপুর, দুপচাঁচিয়া, বগুড়া',
      attendanceRate: '৯৭%',
      gender: 'ছাত্রী'
    },
    {
      id: 'std-09-001',
      name: 'মোঃ তানভীর আহমেদ',
      nameEn: 'Md. Tanvir Ahmed',
      rollNo: '০১',
      regNo: '২০২৬০৯০০১',
      fatherName: 'মোঃ আবুল কালাম',
      motherName: 'মোছাঃ নাছিমা খাতুন',
      phone: '01710000001',
      address: 'আলোহালী, দুপচাঁচিয়া',
      attendanceRate: '৯৫%',
      gender: 'ছাত্র'
    }
  ],
  '৮ম শ্রেণি (জেডিসি)': [
    {
      id: 'std-08-001',
      name: 'মোঃ রিফাত হোসেন',
      nameEn: 'Md. Rifat Hossain',
      rollNo: '০১',
      regNo: '২০২৬০৮০০১',
      fatherName: 'মোঃ শফিকুল ইসলাম',
      motherName: 'মোছাঃ রোকসানা বেগম',
      phone: '01720000001',
      address: 'আক্কেলপুর রোড, দুপচাঁচিয়া',
      attendanceRate: '৯৬%',
      gender: 'ছাত্র'
    },
    {
      id: 'std-08-002',
      name: 'জান্নাতুল ফেরদৌস',
      nameEn: 'Jannatul Ferdous',
      rollNo: '০২',
      regNo: '২০২৬০৮০০২',
      fatherName: 'মোঃ ফারুক হোসেন',
      motherName: 'মোছাঃ আনোয়ারা বেগম',
      phone: '01720000002',
      address: 'পশ্চিম আলোহালী',
      attendanceRate: '৯৮%',
      gender: 'ছাত্রী'
    }
  ],
  '৭ম শ্রেণি': [
    {
      id: 'std-07-001',
      name: 'মোঃ সালমান ফারসি',
      nameEn: 'Md. Salman Farsi',
      rollNo: '০১',
      regNo: '২০২৬০৭০০১',
      fatherName: 'মোঃ আবু তালেব',
      motherName: 'মোছাঃ মমতাজ বেগম',
      phone: '01730000001',
      address: 'উপজেলা গেট, দুপচাঁচিয়া',
      attendanceRate: '৯৪%',
      gender: 'ছাত্র'
    }
  ],
  '৬ষ্ঠ শ্রেণি': [
    {
      id: 'std-06-001',
      name: 'মোঃ জুনাইদ আহমেদ',
      nameEn: 'Md. Junaid Ahmed',
      rollNo: '০১',
      regNo: '২০২৬০৬০০১',
      fatherName: 'মোঃ জাকির হোসেন',
      motherName: 'মোছাঃ নাসরিন আক্তার',
      phone: '01740000001',
      address: 'দুপচাঁচিয়া বাজার',
      attendanceRate: '৯৮%',
      gender: 'ছাত্র'
    }
  ],
  'ইবতেদায়ী (১ম-৫ম)': [
    {
      id: 'std-eb-001',
      name: 'মোঃ তালহা জুবায়ের',
      nameEn: 'Md. Talha Zubair',
      rollNo: '০১',
      regNo: '২০২৬০১০০১',
      fatherName: 'মাওলানা মোঃ কামরুল ইসলাম',
      motherName: 'মোছাঃ আয়েশা বেগম',
      phone: '01750000001',
      address: 'আলোহালী মাদ্রাসা পাড়া',
      attendanceRate: '৯৯%',
      gender: 'ছাত্র'
    }
  ]
};

// Available months for selection
const academicMonths = [
  { id: '2026-10', name: 'অক্টোবর ২০২৬ (চলতি মাস)', daysInMonth: 31, workingDays: 22 },
  { id: '2026-09', name: 'সেপ্টেম্বর ২০২৬', daysInMonth: 30, workingDays: 22 },
  { id: '2026-08', name: 'আগস্ট ২০২৬', daysInMonth: 31, workingDays: 23 },
  { id: '2026-07', name: 'জুলাই ২০২৬', daysInMonth: 31, workingDays: 22 }
];

function AttendanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { info, students, results, applications } = useMadrasah();

  const [selectedClass, setSelectedClass] = useState<string>('১০ম শ্রেণি (দাখিল)');
  const [rollInput, setRollInput] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'leave'>('all');

  const [searchedStudent, setSearchedStudent] = useState<StudentProfile | null>(null);
  const [searchError, setSearchError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Normalize Bengali and English digits and trim leading zeros
  const normalizeDigits = (str: string) => {
    if (!str) return '';
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    const cleaned = str.replace(/[০-৯]/g, (w) => bnToEn[w] || w).trim();
    return cleaned.replace(/^0+/, '') || '0';
  };

  // Convert English number to Bengali number
  const toBnDigits = (num: number | string): string => {
    const enToBn: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).replace(/[0-9]/g, (d) => enToBn[d] || d);
  };

  // Execute lookup
  const performSearch = (cls: string, roll: string) => {
    setSearchError('');
    setHasSearched(true);

    const normRoll = normalizeDigits(roll);
    if (!normRoll || normRoll === '0') {
      setSearchError('অনুগ্রহ করে সঠিক রোল নম্বর দিন। (ডেমো দেখতে রোল ১০১, ১০২ বা ১ দিয়ে চেষ্টা করুন)');
      setSearchedStudent(null);
      return;
    }

    // 1. Search in custom & default students in MadrasahContext
    let found = (students || []).find(s => {
      const c = (s.classYear || '').trim();
      const matchClass = c === cls || (cls.includes('১০ম') && c.includes('১০ম')) || (cls.includes('৯ম') && c.includes('৯ম'));
      const sRoll = normalizeDigits(s.rollNo || '');
      return matchClass && sRoll === normRoll;
    });

    // 2. Search in exam results database
    if (!found) {
      const matchResult = (results || []).find(r => {
        const c = (r.classYear || '').trim();
        const matchClass = c === cls || (cls.includes('১০ম') && c.includes('১০ম')) || (cls.includes('৯ম') && c.includes('৯ম'));
        const rRoll = normalizeDigits(r.rollNo || '');
        return matchClass && rRoll === normRoll;
      });

      if (matchResult) {
        found = {
          id: `res-${matchResult.id}`,
          name: matchResult.studentName,
          nameEn: matchResult.studentNameEn,
          rollNo: matchResult.rollNo,
          regNo: matchResult.regNo,
          classYear: matchResult.classYear,
          session: matchResult.session || '২০২৫-২০২৬',
          bloodGroup: 'B+',
          fatherName: 'মোঃ আব্দুল করিম',
          motherName: 'মোছাঃ রাহিমা বেগম',
          phone: '017XXXXXXXX',
          address: 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
          attendanceRate: '৯৬%',
          feeStatus: 'পরিশোধিত',
          gender: 'ছাত্র'
        };
      }
    }

    // 3. Search in fallback class rosters
    if (!found) {
      const classList = fallbackStudentRoster[cls] || [];
      const matchFallback = classList.find(s => normalizeDigits(s.rollNo) === normRoll);
      if (matchFallback) {
        found = {
          id: matchFallback.id,
          name: matchFallback.name,
          nameEn: matchFallback.nameEn,
          rollNo: matchFallback.rollNo,
          regNo: matchFallback.regNo || '২০২৬১০০০১',
          classYear: cls,
          session: '২০২৫-২০২৬',
          bloodGroup: 'A+',
          fatherName: matchFallback.fatherName || 'মোঃ আব্দুর রহমান',
          motherName: matchFallback.motherName || 'মোছাঃ ফাতেমা বেগম',
          phone: matchFallback.phone || '017XXXXXXXX',
          address: matchFallback.address || 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
          attendanceRate: matchFallback.attendanceRate || '৯৮%',
          feeStatus: 'পরিশোধিত',
          gender: matchFallback.gender || 'ছাত্র'
        };
      }
    }

    // 4. Also check applications for admission
    if (!found) {
      const matchApp = (applications || []).find(a => {
        const c = (a.applyingClass || '').trim();
        const matchClass = c === cls || (cls.includes('১০ম') && c.includes('১০ম'));
        const aRoll = normalizeDigits(String(a.id || '').slice(-3));
        return matchClass && aRoll === normRoll;
      });

      if (matchApp) {
        found = {
          id: String(matchApp.id),
          name: matchApp.studentNameBn,
          nameEn: matchApp.studentNameEn,
          rollNo: toBnDigits(normRoll),
          regNo: `২০২৬${normRoll}`,
          classYear: cls,
          session: '২০২৫-২০২৬',
          bloodGroup: matchApp.bloodGroup || 'A+',
          fatherName: matchApp.fatherNameBn,
          motherName: matchApp.motherNameBn,
          phone: matchApp.fatherPhone,
          address: matchApp.presentAddress || 'পশ্চিম আলোহালী, দুপচাঁচিয়া',
          attendanceRate: '৯৭%',
          feeStatus: 'পরিশোধিত',
          gender: matchApp.gender || 'ছাত্র'
        };
      }
    }

    if (found) {
      setSearchedStudent(found);
      setSearchError('');
    } else {
      setSearchedStudent(null);
      setSearchError(`"${cls}"-এ রোল নম্বর "${roll}"-এর কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক রোল নম্বর ও শ্রেণি নির্বাচন করুন।`);
    }
  };

  // Handle URL query parameters on initial load
  useEffect(() => {
    const classFromUrl = searchParams.get('class');
    const rollFromUrl = searchParams.get('roll');

    if (classFromUrl) {
      setSelectedClass(classFromUrl);
    }
    if (rollFromUrl) {
      setRollInput(rollFromUrl);
      performSearch(classFromUrl || selectedClass, rollFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(selectedClass, rollInput);
  };

  const handleQuickPick = (cls: string, roll: string) => {
    setSelectedClass(cls);
    setRollInput(roll);
    performSearch(cls, roll);
  };

  // Generate monthly attendance log for the selected student & month
  const attendanceData = useMemo(() => {
    if (!searchedStudent) return null;

    const baseAttendanceRateNum = parseInt(
      (searchedStudent.attendanceRate || '৯৬%').replace(/[^0-9০-৯]/g, '').replace(/[০-৯]/g, (w) => {
        const map: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
        return map[w] || w;
      }),
      10
    ) || 96;

    // Working days generation for the month (excluding Fridays)
    const logs: StudentDailyAttendanceLog[] = [];
    const subjectsMap = ['কুরআন মাজিদ, আরবি ১ম, তাজবিদ', 'হাদিস শরিফ, ফিকহ, আকাইদ', 'বাংলা, ইংরেজি, গণিত', 'ইসলামের ইতিহাস, সমাজবিজ্ঞান', 'বিজ্ঞান, কম্পিউটার শিক্ষা'];

    const daysCount = 31;
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let lateCount = 0;

    // Today's Date String
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Read real admin-saved attendance records from localStorage if present
    const adminAttendanceKey = `padm_student_attendance_${todayStr}_${selectedClass}`;
    let savedAdminToday: Record<string, { status: string; remarks: string }> | null = null;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(adminAttendanceKey);
        if (raw) savedAdminToday = JSON.parse(raw);
      } catch (err) {
        console.warn('Error reading admin attendance:', err);
      }
    }

    let todayRecordStatus: 'present' | 'absent' | 'late' | 'leave' = 'present';
    let todayRecordInTime = '০৮:৪৫ মি.';
    let todayRecordRemarks = 'সময়মতো ক্লাসে উপস্থিত';

    // If admin has taken attendance today for this student
    if (savedAdminToday && searchedStudent.id && savedAdminToday[searchedStudent.id]) {
      const rec = savedAdminToday[searchedStudent.id];
      todayRecordStatus = (rec.status as any) || 'present';
      todayRecordRemarks = rec.remarks || (rec.status === 'present' ? 'সময়মতো উপস্থিত' : 'অনুপস্থিত');
    }

    let dayIndex = 1;
    for (let day = 1; day <= daysCount; day++) {
      const dayNumStr = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `2026-10-${dayNumStr}`;
      const dateObj = new Date(dateStr);
      const dayOfWeek = dateObj.getDay();

      // Skip Fridays (Weekly Holiday in Islamic Institution)
      if (dayOfWeek === 5) continue;

      const dayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const dayBn = dayNames[dayOfWeek];
      const dateBn = `${toBnDigits(day)} অক্টোবর ২০২৬`;
      const subjects = subjectsMap[day % subjectsMap.length];

      let status: 'present' | 'absent' | 'late' | 'leave' = 'present';
      let inTime = '০৮:৪৫ মি.';
      let remarks = 'সময়মতো ক্লাসে উপস্থিত';

      // Check if this is today
      if (dateStr === todayStr) {
        status = todayRecordStatus;
        inTime = status === 'absent' ? '--' : todayRecordInTime;
        remarks = todayRecordRemarks;
      } else {
        // Deterministic pseudo-random generation based on roll and day
        const seed = (parseInt(normalizeDigits(searchedStudent.rollNo) || '1', 10) * 17 + day * 13) % 100;

        if (seed > baseAttendanceRateNum + 2) {
          status = 'absent';
          inTime = '--';
          remarks = 'অবহিতকরণ ব্যতিরেকে অনুপস্থিত';
          absentCount++;
        } else if (seed === baseAttendanceRateNum) {
          status = 'leave';
          inTime = '--';
          remarks = 'অভিভাবকের আবেদনক্রমে ছুটি মঞ্জুর';
          leaveCount++;
        } else if (seed === baseAttendanceRateNum + 1) {
          status = 'late';
          inTime = '০৯:১০ মি.';
          remarks = 'দেরিতে ক্লাসে আগমন (অনুমোদিত)';
          lateCount++;
          presentCount++;
        } else {
          status = 'present';
          inTime = '০৮:' + (40 + (day % 15)) + ' মি.';
          remarks = 'যথাসময়ে উপস্থিত ও মনোযোগী';
          presentCount++;
        }
      }

      if (dateStr === todayStr) {
        if (status === 'present' || status === 'late') presentCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'leave') leaveCount++;
      }

      logs.push({
        dayIndex,
        date: dateStr,
        dateBn,
        dayBn,
        status,
        inTime,
        subjects,
        remarks
      });

      dayIndex++;
    }

    const totalWorkingDays = logs.length;
    const finalRate = Math.min(100, Math.round((presentCount / (totalWorkingDays || 1)) * 100));

    return {
      logs,
      totalWorkingDays,
      presentCount,
      absentCount,
      leaveCount,
      lateCount,
      finalRate,
      todayStatus: todayRecordStatus,
      todayInTime: todayRecordInTime,
      todayRemarks: todayRecordRemarks
    };
  }, [searchedStudent, selectedClass]);

  // Filtered log table based on tab
  const filteredLogs = useMemo(() => {
    if (!attendanceData) return [];
    if (statusFilter === 'all') return attendanceData.logs;
    if (statusFilter === 'present') return attendanceData.logs.filter(l => l.status === 'present' || l.status === 'late');
    if (statusFilter === 'absent') return attendanceData.logs.filter(l => l.status === 'absent');
    if (statusFilter === 'leave') return attendanceData.logs.filter(l => l.status === 'leave');
    return attendanceData.logs;
  }, [attendanceData, statusFilter]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="py-8 md:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Page Top Header (no-print) */}
        <div className="text-center mb-8 no-print">
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-xs">
            <UserCheck className="w-4 h-4 text-[#006837]" />
            <span>ডিজিটাল হাজিরা পোর্টাল • অভিভাবক কর্নার</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            শিক্ষার্থীর দৈনিক ও মাসিক উপস্থিতি অনুসন্ধান
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
            {info.name}-এর নিয়মিত শিক্ষার্থীদের ক্লাসে উপস্থিতি, সময়ানুবর্তিতা এবং শতকরা হার যাচাই করতে নিচের ফরম পূরণ করুন।
          </p>
        </div>

        {/* Search Panel (no-print) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 no-print">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Class Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ১. শ্রেণি নির্বাচন করুন
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  {academicClassesList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ২. শিক্ষার্থীর রোল নম্বর
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    placeholder="রোল নম্বর (যেমন: ১০১ বা 1)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-black text-emerald-900 placeholder:font-normal placeholder:text-slate-400"
                  />
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              {/* Month Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ৩. হাজিরা বিবরণীর মাস
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  {academicMonths.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{searchError}</p>
                  <p className="text-xs text-rose-600">
                    পরামর্শ: নিচের নমুনা রোল বোতামে ক্লিক করে তাৎক্ষণিক ডেমো প্রোফাইল দেখতে পারেন।
                  </p>
                </div>
              </div>
            )}

            {/* Form Footer: Sample buttons & submit */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold mr-1">💡 নমুনা রোল:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPick('১০ম শ্রেণি (দাখিল)', '১০১')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
                >
                  ১০ম - ১০১ (ওমর ফারুক)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPick('১০ম শ্রেণি (দাখিল)', '১০২')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
                >
                  ১০ম - ১০২ (আয়েশা সিদ্দিকা)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPick('৯ম শ্রেণি (দাখিল)', '১০১')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
                >
                  ৯ম - ১০১ (সুমাইয়া)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPick('৮ম শ্রেণি (জেডিসি)', '০১')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
                >
                  ৮ম - ০১ (রিফাত)
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#006837] hover:bg-[#00542c] active:scale-95 text-white font-black px-7 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#DDAA00]" />
                <span>উপস্থিতি অনুসন্ধান করুন</span>
              </button>
            </div>
          </form>
        </div>

        {/* Found Student Attendance Statement */}
        {searchedStudent && attendanceData && (
          <div className="bg-white rounded-3xl border-2 border-[#006837] p-6 sm:p-8 md:p-10 shadow-xl print-area space-y-6">
            {/* Institution Letterhead (Header for Screen & Print) */}
            <div className="text-center border-b-2 border-[#006837] pb-5">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-2">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-md">
                  <Image
                    src={info.logo || '/logo.png'}
                    alt={info.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#006837] leading-tight">
                    {info.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-[#003580] mt-0.5">
                    {info.location || 'দুপচাঁচিয়া, বগুড়া'} • {info.englishName}
                  </p>
                  <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    মাদ্রাসা কোড: {info.madrasahCode} • এমপিও: {info.mpoCode} • EIIN: {info.eiin} • স্থাপিত: ১৯৯৫ খ্রি.
                  </p>
                </div>
              </div>

              <div className="inline-block bg-[#006837] text-[#DDAA00] text-xs sm:text-sm font-black px-6 py-1.5 rounded-full mt-2 shadow-sm border border-[#DDAA00]/40">
                শিক্ষার্থীর ডিজিটাল উপস্থিতি ও হাজিরা বিবরণী ({academicMonths.find(m => m.id === selectedMonth)?.name || 'অক্টোবর ২০২৬'})
              </div>
            </div>

            {/* Student Identity Card Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-blue-50 rounded-2xl p-5 border border-emerald-200">
              <div className="flex flex-col md:flex-row items-center gap-5">
                {/* Photo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-emerald-600 shadow-md overflow-hidden shrink-0 flex items-center justify-center">
                  {searchedStudent.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={searchedStudent.photo}
                      alt={searchedStudent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-emerald-800">
                      <User className="w-8 h-8 text-emerald-600" />
                      <span className="text-[10px] font-bold mt-1">শিক্ষার্থী</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {searchedStudent.name}
                      </h3>
                      {searchedStudent.nameEn && (
                        <p className="text-xs font-semibold text-slate-500 font-mono mt-0.5">
                          {searchedStudent.nameEn}
                        </p>
                      )}
                    </div>
                    <span className="inline-block bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs self-center sm:self-auto">
                      ✓ নিয়মিত শিক্ষার্থী
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">শ্রেণি ও সেশন:</span>
                      <span className="font-bold text-slate-900">{searchedStudent.classYear}</span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">ক্লাস রোল:</span>
                      <span className="font-mono font-black text-emerald-800 text-sm">
                        {searchedStudent.rollNo}
                      </span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">রেজিস্ট্রেশন নং:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {searchedStudent.regNo || '২০২৬১০১০১'}
                      </span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">পিতার নাম:</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {searchedStudent.fatherName || 'মোঃ আব্দুর রহমান'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Today's Status */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-4 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-100">আজকের হাজিরা স্থিতি</span>
                  <CheckCircle2 className="w-4 h-4 text-[#DDAA00]" />
                </div>
                <div className="my-2">
                  <div className="text-xl sm:text-2xl font-black">
                    {attendanceData.todayStatus === 'present' ? 'উপস্থিত ✓' : attendanceData.todayStatus === 'absent' ? 'অনুপস্থিত ✗' : 'ছুটি 🟡'}
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>প্রবেশ: {attendanceData.todayInTime}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-md inline-block self-start">
                  তারিখ: ২৩ অক্টোবর ২০২৬
                </span>
              </div>

              {/* Card 2: Attendance Rate */}
              <div className="bg-gradient-to-br from-[#003580] to-[#001d4a] text-white rounded-2xl p-4 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-200">মাসিক উপস্থিতির হার</span>
                  <Sparkles className="w-4 h-4 text-[#DDAA00]" />
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black text-[#DDAA00]">
                    {toBnDigits(attendanceData.finalRate)}%
                  </div>
                  <div className="text-[11px] text-blue-100 mt-1">
                    {attendanceData.finalRate >= 95 ? '🌟 চমৎকার উপস্থিতি' : attendanceData.finalRate >= 80 ? '👍 সন্তোষজনক' : '⚠️ সতর্কবার্তা'}
                  </div>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md inline-block self-start">
                  বোর্ড স্ট্যান্ডার্ড: ৭৫%+
                </span>
              </div>

              {/* Card 3: Days Present */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold">মোট কার্যদিবস ও উপস্থিতি</span>
                  <Calendar className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="my-2">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    <span className="text-emerald-700">{toBnDigits(attendanceData.presentCount)}</span>
                    <span className="text-slate-400 text-lg"> / {toBnDigits(attendanceData.totalWorkingDays)} দিন</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    মোট কার্যদিবসের মধ্যে উপস্থিত
                  </div>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md inline-block self-start">
                  বিলম্ব আগমন: {toBnDigits(attendanceData.lateCount)} দিন
                </span>
              </div>

              {/* Card 4: Absent & Leave */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold">অনুপস্থিতি ও ছুটি</span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="my-2">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    <span className="text-rose-600">{toBnDigits(attendanceData.absentCount)} দিন</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    অনুমোদিত ছুটি: {toBnDigits(attendanceData.leaveCount)} দিন
                  </div>
                </div>
                <span className="text-[10px] text-slate-700 font-semibold bg-slate-200 px-2 py-0.5 rounded-md inline-block self-start">
                  চলতি মাসের হিসাব
                </span>
              </div>
            </div>

            {/* Attendance Progress & Advice Banner */}
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              attendanceData.finalRate >= 90
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : attendanceData.finalRate >= 75
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  attendanceData.finalRate >= 90
                    ? 'bg-emerald-600 text-white'
                    : attendanceData.finalRate >= 75
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {attendanceData.finalRate >= 90
                      ? 'অধ্যক্ষ মহোদয়ের সন্তোষ ও শুভকামনা'
                      : attendanceData.finalRate >= 75
                      ? 'উপস্থিতি সন্তোষজনক, তবে আরও যত্নবান হওয়া প্রয়োজন'
                      : 'জরুরি অভিভাবক পরামর্শ: ক্লাসে নিয়মিত উপস্থিতি আবশ্যক'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    {attendanceData.finalRate >= 90
                      ? 'আপনার সন্তান নিয়মিত এবং সময়মতো মাদ্রাসায় উপস্থিত থাকছে। এই শৃঙ্খলা বজায় রাখলে চূড়ান্ত পরীক্ষায় মেধার সর্বোত্তম বিকাশ ঘটবে।'
                      : 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের নিয়মানুযায়ী ফাইনাল পরীক্ষায় অংশগ্রহণের জন্য ন্যূনতম ৭৫% ক্লাসে উপস্থিতি বাধ্যতামূলক।'}
                  </p>
                </div>
              </div>

              {/* Progress Bar Visual */}
              <div className="w-full sm:w-44 shrink-0 bg-white/70 p-2 rounded-xl border border-black/10 text-center">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span>অগ্রগতি</span>
                  <span>{toBnDigits(attendanceData.finalRate)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      attendanceData.finalRate >= 90
                        ? 'bg-emerald-600'
                        : attendanceData.finalRate >= 75
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                    style={{ width: `${Math.min(100, attendanceData.finalRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Filterable Date-by-Date Table Header & Actions (no-print) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 no-print">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>তারিখভিত্তিক বিস্তারিত দৈনিক উপস্থিতি লগ</span>
                </h4>
                <p className="text-xs text-slate-500">
                  চলতি মাসের সকল ক্লাসের আগমন ও হাজিরা বিবরণী
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  সকল দিন ({toBnDigits(attendanceData.totalWorkingDays)})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('present')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    statusFilter === 'present'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  উপস্থিত ({toBnDigits(attendanceData.presentCount)})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('absent')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    statusFilter === 'absent'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  অনুপস্থিত ({toBnDigits(attendanceData.absentCount)})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('leave')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    statusFilter === 'leave'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ছুটি ({toBnDigits(attendanceData.leaveCount)})
                </button>
              </div>
            </div>

            {/* Attendance Log Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="py-3 px-3.5 text-center w-12">#</th>
                      <th className="py-3 px-3.5">তারিখ ও বার</th>
                      <th className="py-3 px-3.5">ক্লাস বিষয়সমূহ</th>
                      <th className="py-3 px-3.5 text-center">আগমনের সময়</th>
                      <th className="py-3 px-3.5 text-center">হাজিরা স্থিতি</th>
                      <th className="py-3 px-3.5">শিক্ষকের মন্তব্য / বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLogs.map((log) => (
                      <tr
                        key={log.date}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          log.status === 'absent' ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3.5 text-center font-mono text-slate-500">
                          {toBnDigits(log.dayIndex)}
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                          <div>{log.dateBn}</div>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {log.dayBn}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-700">
                          {log.subjects}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-mono font-semibold text-slate-800">
                          {log.inTime}
                        </td>
                        <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                          {log.status === 'present' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              উপস্থিত
                            </span>
                          ) : log.status === 'late' ? (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-300">
                              <Clock className="w-3 h-3" />
                              বিলম্ব
                            </span>
                          ) : log.status === 'leave' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                              <AlertCircle className="w-3 h-3" />
                              ছুটি
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                              <XCircle className="w-3 h-3" />
                              অনুপস্থিত
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 text-[11px]">
                          {log.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Signatures & Seal (Visible on Print and Screen) */}
            <div className="pt-8 mt-6 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-800">
                <div>
                  <div className="border-t border-slate-400 pt-2 w-36 mx-auto">
                    শ্রেণি শিক্ষক
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">স্বাক্ষর ও তারিখ</span>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 w-36 mx-auto">
                    হাজিরা ও শৃংখলা ইনচার্জ
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">যাচাইকৃত ডিজিটাল সিল</span>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 w-36 mx-auto">
                    সুপারিনটেনডেন্ট / অধ্যক্ষ
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">{info.name}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Print & Reset Buttons, no-print) */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200 no-print">
              <button
                type="button"
                onClick={() => {
                  setSearchedStudent(null);
                  setRollInput('');
                  setHasSearched(false);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>নতুন অনুসন্ধান করুন</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003580] hover:bg-[#002860] active:scale-95 text-white font-black px-6 py-2.5 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#DDAA00]" />
                <span>হাজিরা বিবরণী প্রিন্ট ও ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        )}

        {/* Parent Notice & Information Box (no-print) */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs no-print">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                অভিভাবকদের জ্ঞাতার্থে মাদ্রাসা কর্তৃপক্ষের নির্দেশনা
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs leading-relaxed">
                <li>
                  প্রতিটি কর্মদিবসে সকাল ৮:৪৫ মিনিটের পূর্বেই শিক্ষার্থীদের সুনির্দিষ্ট পোশাকে (ইউনিফর্ম) মাদ্রাসায় উপস্থিত থাকা আবশ্যক।
                </li>
                <li>
                  অসুস্থতা বা জরুরি পারিবারিক কারণে শিক্ষার্থী অনুপস্থিত থাকলে অবশ্যই অভিভাবকের স্বাক্ষর সম্বলিত ছুটির দরখাস্ত মাদ্রাসা অফিসে জমা দিতে হবে।
                </li>
                <li>
                  উপস্থিতি সংক্রান্ত যেকোনো অসঙ্গতি বা প্রশ্নের জন্য সরাসরি মাদ্রাসা অফিসে যোগাযোগ করুন: <strong className="text-emerald-800 font-bold">{info.phone || '০১৭১১-XXXXXX'}</strong>।
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#006837] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-600">হাজিরা পোর্টাল লোড হচ্ছে...</p>
        </div>
      }
    >
      <AttendanceContent />
    </Suspense>
  );
}
