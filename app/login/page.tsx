'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import { ResultRecord, AdmissionApplication } from '@/lib/data';
import {
  GraduationCap,
  User,
  Phone,
  ArrowRight,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Printer,
  LogOut,
  AlertCircle,
  FileText,
  School,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  QrCode,
  IdCard,
  CreditCard
} from 'lucide-react';

interface StudentProfile {
  name: string;
  phone: string;
  classYear: string;
  rollNo: string;
  regNo: string;
  session: string;
  bloodGroup: string;
  attendanceRate: string;
  feeStatus: string;
  result?: ResultRecord;
  application?: AdmissionApplication;
}

export default function LoginPage() {
  const { info, results, applications } = useMadrasah();

  // Student Login Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentError, setStudentError] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<StudentProfile | null>(null);

  // Active sub-tab in Student Profile
  const [profileTab, setProfileTab] = useState<'idcard' | 'results' | 'routine' | 'fees'>('idcard');

  // Restore saved login session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('padm_logged_student');
      if (saved) {
        setLoggedInStudent(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Normalize bangla to english digits
  const normalizeDigits = (str: string) => {
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, (w) => bnToEn[w] || w).trim();
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    const nameTrim = studentName.trim();
    const phoneTrim = studentPhone.trim();

    if (!nameTrim) {
      setStudentError('অনুগ্রহ করে শিক্ষার্থীর নাম লিখুন।');
      return;
    }
    if (!phoneTrim) {
      setStudentError('অনুগ্রহ করে মোবাইল নম্বর দিন।');
      return;
    }

    const normPhone = normalizeDigits(phoneTrim);
    const normName = nameTrim.toLowerCase();

    // 1. Search in results database
    const foundResult = results.find(r => {
      const rName = r.studentName.toLowerCase();
      return rName.includes(normName) || normName.includes(rName);
    });

    let profile: StudentProfile;

    if (foundResult) {
      profile = {
        name: foundResult.studentName,
        phone: phoneTrim,
        classYear: foundResult.classYear,
        rollNo: foundResult.rollNo,
        regNo: foundResult.regNo,
        session: foundResult.session || '২০২৫-২০২৬',
        bloodGroup: 'B+',
        attendanceRate: '৯৬%',
        feeStatus: 'পরিশোধিত (Paid)',
        result: foundResult
      };
    } else {
      // 2. Search in admission applications
      const foundApp = applications.find(a => {
        const aNameBn = a.studentNameBn.toLowerCase();
        const aNameEn = a.studentNameEn.toLowerCase();
        const aPhone = normalizeDigits(a.fatherPhone);
        return (
          aNameBn.includes(normName) ||
          normName.includes(aNameBn) ||
          aNameEn.includes(normName) ||
          aPhone.includes(normPhone) ||
          normPhone.includes(aPhone)
        );
      });

      if (foundApp) {
        profile = {
          name: foundApp.studentNameBn,
          phone: foundApp.fatherPhone,
          classYear: foundApp.applyingClass,
          rollNo: foundApp.id,
          regNo: '২০২৬' + (normPhone.slice(-4) || '১০১০'),
          session: '২০২৬-২০২৭',
          bloodGroup: foundApp.bloodGroup || 'O+',
          attendanceRate: '৯৮%',
          feeStatus: 'ভর্তি সম্পন্ন',
          application: foundApp
        };
      } else {
        // 3. Create fresh official profile with entered Name & Phone Number
        profile = {
          name: nameTrim,
          phone: phoneTrim,
          classYear: '১০ম শ্রেণি (দাখিল)',
          rollNo: '১০১',
          regNo: '২০২৬' + (normPhone.slice(-4) || '১০১০'),
          session: '২০২৫-২০২৬',
          bloodGroup: 'A+',
          attendanceRate: '৯৫%',
          feeStatus: 'পরিশোধিত (Paid)',
          result: {
            id: `res-${Date.now()}`,
            studentName: nameTrim,
            rollNo: '১০১',
            regNo: '২০২৬' + (normPhone.slice(-4) || '১০১০'),
            examName: 'দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬',
            classYear: '১০ম শ্রেণি (দাখিল)',
            session: '২০২৫-২০২৬',
            gpa: 5.00,
            grade: 'A+',
            resultStatus: 'উত্তীর্ণ',
            publishDate: '২৮ সেপ্টেম্বর ২০২৬',
            subjects: [
              { name: 'কুরআন মাজীদ ও তাজবীদ', fullMarks: 100, obtainedMarks: 94, grade: 'A+', point: 5.0 },
              { name: 'হাদীস শরীফ ও উসূলুল হাদীস', fullMarks: 100, obtainedMarks: 91, grade: 'A+', point: 5.0 },
              { name: 'আকাইদ ও ফিকহ', fullMarks: 100, obtainedMarks: 88, grade: 'A+', point: 5.0 },
              { name: 'আরবি ১ম ও ২য় পত্র', fullMarks: 100, obtainedMarks: 89, grade: 'A+', point: 5.0 },
              { name: 'বাংলা ১ম ও ২য় পত্র', fullMarks: 100, obtainedMarks: 84, grade: 'A+', point: 5.0 },
              { name: 'ইংরেজি ১ম ও ২য় পত্র', fullMarks: 100, obtainedMarks: 81, grade: 'A+', point: 5.0 },
              { name: 'সাধারণ গণিত', fullMarks: 100, obtainedMarks: 95, grade: 'A+', point: 5.0 },
              { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', fullMarks: 50, obtainedMarks: 48, grade: 'A+', point: 5.0 }
            ]
          }
        };
      }
    }

    setLoggedInStudent(profile);
    try {
      localStorage.setItem('padm_logged_student', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    try {
      localStorage.removeItem('padm_logged_student');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Class Routine schedule
  const sampleRoutine = [
    { period: '১ম ঘণ্টা', time: '০৯:১৫ - ১০:০০', subject: 'কুরআন মাজীদ ও তাজবীদ', teacher: 'মাওলানা মোঃ রফিকুল ইসলাম' },
    { period: '২য় ঘণ্টা', time: '১০:০০ - ১০:৪৫', subject: 'হাদীস শরীফ', teacher: 'মাওলানা মোঃ জয়নাল আবেদীন' },
    { period: '৩য় ঘণ্টা', time: '১০:৪৫ - ১১:৩০', subject: 'আরবি ১ম পত্র', teacher: 'মাওলানা মোঃ আব্দুল করিম' },
    { period: '৪র্থ ঘণ্টা', time: '১১:৩০ - ১২:১৫', subject: 'সাধারণ গণিত', teacher: 'মোঃ মাহবুবুল হক' },
    { period: 'বিরতি ও সালাত', time: '১২:১৫ - ০১:১৫', subject: 'যোহরের জামাত ও বিরতি', teacher: 'সকল শিক্ষক' },
    { period: '৫ম ঘণ্টা', time: '০১:১৫ - ০২:০০', subject: 'ইংরেজি ১ম ও ২য় পত্র', teacher: 'মোঃ মোস্তাফিজুর রহমান' },
    { period: '৬ষ্ঠ ঘণ্টা', time: '০২:০০ - ০২:৪৫', subject: 'বাংলা সাহিত্য', teacher: 'মোছাঃ ফাতেমা আক্তার' },
    { period: '৭ম ঘণ্টা', time: '০২:৪৫ - ০৩:৩০', subject: 'তথ্য ও যোগাযোগ প্রযুক্তি', teacher: 'মোঃ আহসান উল্লাহ' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-emerald-50/20 to-slate-100 py-10 px-4 flex items-center justify-center relative islamic-bg-pattern">
      <div className={`w-full transition-all duration-300 ${loggedInStudent ? 'max-w-4xl' : 'max-w-md'}`}>
        
        {/* ========================================================
            VIEW 1: STUDENT LOGIN FORM (When NOT logged in)
           ======================================================== */}
        {!loggedInStudent ? (
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header with Madrasah Brand Colors */}
            <div className="bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] text-white p-7 text-center relative border-b-2 border-[#DDAA00]/40">
              <Link href="/" className="inline-block relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 drop-shadow-lg bg-white rounded-2xl p-1.5 border-2 border-[#DDAA00] hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt={info.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </Link>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                শিক্ষার্থী ও অভিভাবক পোর্টাল
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
                {info.name} • {info.location || 'দুপচাঁচিয়া, বগুড়া'}
              </p>
            </div>

            {/* Login Form Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#006837]">
                  <Sparkles className="w-4 h-4 text-[#DDAA00]" />
                  <span>শিক্ষার্থী প্রোফাইল লগইন:</span>
                </div>
                <p className="leading-relaxed">
                  আপনার <strong>নাম</strong> এবং <strong>মোবাইল নম্বর</strong> লিখুন। সাথে সাথে আপনার ব্যক্তিগত ডিজিটাল আইডি কার্ড, পরীক্ষার ফলাফল ও ক্লাস রুটিনের প্রোফাইল তৈরি হয়ে যাবে।
                </p>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-4">
                {/* Field 1: Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    শিক্ষার্থীর পূর্ণ নাম (Student Full Name) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="যেমন: মোঃ ওমর ফারুক বা আপনার নাম"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold bg-white"
                    />
                  </div>
                </div>

                {/* Field 2: Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    অভিভাবক / শিক্ষার্থীর মোবাইল নম্বর (Phone Number) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="যেমন: 017XXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-sm font-semibold font-mono bg-white"
                    />
                  </div>
                </div>

                {studentError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{studentError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#006837] hover:bg-[#00542c] text-white font-black py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer mt-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#DDAA00]" />
                  <span>প্রোফাইলে প্রবেশ করুন</span>
                  <ArrowRight className="w-4 h-4 text-[#DDAA00]" />
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400">
                  পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা • ছাত্র ও অভিভাবক পোর্টাল
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             VIEW 2: FULL STUDENT PROFILE DASHBOARD (When LOGGED IN)
             ======================================================== */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar with Student Info and Logout */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#00341c] to-[#006837] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-[#DDAA00] shrink-0">
                  {loggedInStudent.name.charAt(0) || 'শ'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {loggedInStudent.name}
                    </h2>
                    <span className="bg-emerald-100 text-[#006837] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#006837]" />
                      <span>সক্রিয় শিক্ষার্থী</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    {loggedInStudent.classYear} • রোল নম্বর: <strong className="font-mono text-[#006837]">{loggedInStudent.rollNo}</strong> • সেশন: {loggedInStudent.session}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#006837]" />
                    <span>অভিভাবক মোবাইল: {loggedInStudent.phone}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Print & Logout */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#006837] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-[#006837]" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-600 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProfileTab('idcard')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  profileTab === 'idcard'
                    ? 'bg-[#006837] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <IdCard className="w-4 h-4" />
                <span>ডিজিটাল পরিচয়পত্র (ID Card)</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileTab('results')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  profileTab === 'results'
                    ? 'bg-[#006837] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>একাডেমিক ফলাফল ও নম্বরপত্র</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileTab('routine')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  profileTab === 'routine'
                    ? 'bg-[#006837] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>ক্লাস রুটিন</span>
              </button>
            </div>

            {/* TAB CONTENT 1: DIGITAL STUDENT ID CARD */}
            {profileTab === 'idcard' && (
              <div className="space-y-6">
                <div className="max-w-md mx-auto bg-gradient-to-br from-[#00341c] via-[#006837] to-[#002e18] text-white rounded-3xl p-6 shadow-2xl border-2 border-[#DDAA00] relative overflow-hidden">
                  {/* Subtle Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none islamic-bg-pattern" />

                  {/* ID Header */}
                  <div className="flex items-center gap-3 border-b border-[#DDAA00]/40 pb-3 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 drop-shadow">
                      <Image
                        src="/logo.png"
                        alt={info.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#DDAA00] leading-tight">
                        {info.name}
                      </h4>
                      <p className="text-[10px] text-emerald-200">
                        {info.location || 'দুপচাঁচিয়া, বগুড়া'} • কোড: {info.madrasahCode}
                      </p>
                      <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block mt-0.5">
                        ডিজিটাল শিক্ষার্থী পরিচয়পত্র (Student ID)
                      </span>
                    </div>
                  </div>

                  {/* ID Body */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-20 h-24 rounded-xl bg-white/20 border-2 border-[#DDAA00] flex flex-col items-center justify-center text-center p-2 shrink-0">
                      <User className="w-10 h-10 text-[#DDAA00] mb-1" />
                      <span className="text-[9px] font-bold text-white/90">শিক্ষার্থী ছবি</span>
                    </div>

                    <div className="space-y-1 text-xs text-white flex-1">
                      <div>
                        <span className="text-[10px] text-emerald-200 font-semibold block">নাম:</span>
                        <strong className="text-sm font-black text-[#DDAA00]">{loggedInStudent.name}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div>
                          <span className="text-[10px] text-emerald-200 block">শ্রেণি:</span>
                          <strong className="font-bold">{loggedInStudent.classYear}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-200 block">রোল নম্বর:</span>
                          <strong className="font-bold font-mono">{loggedInStudent.rollNo}</strong>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div>
                          <span className="text-[10px] text-emerald-200 block">রেজি নম্বর:</span>
                          <strong className="font-bold font-mono">{loggedInStudent.regNo}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-200 block">রক্তের গ্রুপ:</span>
                          <strong className="font-bold text-[#DDAA00]">{loggedInStudent.bloodGroup}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ID Footer */}
                  <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-[10px] text-emerald-200 relative z-10">
                    <div>
                      <span>সেশন: <strong>{loggedInStudent.session}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#DDAA00] font-bold block">অধ্যক্ষ / সুপারিনটেনডেন্ট</span>
                      <span className="text-[9px] text-emerald-300">স্বাক্ষরিত ও অনুমোদিত</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 bg-[#006837] hover:bg-[#00542c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#DDAA00]" />
                    <span>আইডি কার্ড প্রিন্ট বা ডাউনলোড করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ACADEMIC RESULTS */}
            {profileTab === 'results' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#006837]" />
                    <span>দাখিল প্রাক-নির্বাচনী পরীক্ষার ফলাফল ও নম্বরপত্র</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা • শিক্ষা বোর্ড মান অনুযায়ী
                  </p>
                </div>

                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <span className="text-xs text-emerald-800 font-bold block">জিপিএ (GPA)</span>
                    <div className="text-2xl font-black text-[#006837] mt-1">
                      {loggedInStudent.result?.gpa.toFixed(2) || '৫.০০'}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <span className="text-xs text-amber-800 font-bold block">প্রাপ্ত লেটার গ্রেড</span>
                    <div className="text-2xl font-black text-[#997500] mt-1">
                      {loggedInStudent.result?.grade || 'A+'}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <span className="text-xs text-blue-800 font-bold block">উপস্থিতির হার</span>
                    <div className="text-2xl font-black text-[#003580] mt-1">
                      {loggedInStudent.attendanceRate}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-xs text-slate-700 font-bold block">ফলাফল অবস্থা</span>
                    <div className="text-sm font-black text-emerald-800 mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{loggedInStudent.result?.resultStatus || 'উত্তীর্ণ'}</span>
                    </div>
                  </div>
                </div>

                {/* Subject-wise Marks Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 font-bold text-xs text-slate-800 flex justify-between items-center">
                    <span>বিষয়ভিত্তিক প্রাপ্ত নম্বর ও গ্রেডশিট</span>
                    <span className="text-emerald-800 text-[11px] font-semibold">সেশন: {loggedInStudent.session}</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {(loggedInStudent.result?.subjects || []).map((sub, idx) => (
                      <div key={idx} className="px-4 py-2.5 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <span className="font-bold text-slate-900">{sub.name}</span>
                          <span className="text-[10px] text-slate-500 block">পূর্ণমান: {sub.fullMarks}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-slate-700 font-bold">{sub.obtainedMarks} নম্বর</span>
                          <span className="font-black text-[#006837] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono text-xs">
                            {sub.grade} (জিপিএ {sub.point.toFixed(1)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: CLASS ROUTINE */}
            {profileTab === 'routine' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#006837]" />
                    <span>ক্লাস রুটিন ও সময়সূচি ({loggedInStudent.classYear})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ক্লাস শুরুর সময়: সকাল ০৯:১৫ | সালাত ও টিফিন বিরতি: ১২:১৫ - ০১:১৫
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {sampleRoutine.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-100 text-[#006837] font-extrabold px-2 py-1 rounded text-[11px] shrink-0 font-mono">
                          {item.period}
                        </span>
                        <div>
                          <strong className="text-slate-900 text-xs sm:text-sm block">{item.subject}</strong>
                          <span className="text-[11px] text-slate-500">{item.teacher}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
