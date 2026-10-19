'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import { StudentProfile } from '@/lib/data';
import {
  GraduationCap,
  User,
  Phone,
  ArrowRight,
  Calendar,
  Award,
  CheckCircle2,
  Printer,
  LogOut,
  AlertCircle,
  Sparkles,
  IdCard,
  Edit3,
  Camera,
  Save,
  Upload,
  X,
  MapPin,
  Trash2,
  Check
} from 'lucide-react';

export default function LoginPage() {
  const { info, results, applications, loggedStudent, updateLoggedStudent } = useMadrasah();

  // Student Login Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentError, setStudentError] = useState('');

  // Active sub-tab in Student Profile
  const [profileTab, setProfileTab] = useState<'idcard' | 'results' | 'routine'>('idcard');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Form Fields
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    photo: '',
    address: '',
    fatherName: '',
    motherName: '',
    classYear: '',
    rollNo: '',
    regNo: '',
    session: '',
    bloodGroup: 'B+'
  });

  // Normalize bangla to english digits
  const normalizeDigits = (str: string) => {
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, (w) => bnToEn[w] || w).trim();
  };

  // Compress uploaded photo to fit safely in localStorage (under ~35KB)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 360;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Open edit modal and populate with current student data
  const handleOpenEditModal = () => {
    if (!loggedStudent) return;
    setEditForm({
      name: loggedStudent.name || '',
      phone: loggedStudent.phone || '',
      photo: loggedStudent.photo || '',
      address: loggedStudent.address || 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
      fatherName: loggedStudent.fatherName || '',
      motherName: loggedStudent.motherName || '',
      classYear: loggedStudent.classYear || '১০ম শ্রেণি (দাখিল)',
      rollNo: loggedStudent.rollNo || '১০১',
      regNo: loggedStudent.regNo || '',
      session: loggedStudent.session || '২০২৫-২০২৬',
      bloodGroup: loggedStudent.bloodGroup || 'B+'
    });
    setIsEditModalOpen(true);
  };

  // Handle Photo selection & compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImage(file);
      setEditForm(prev => ({ ...prev, photo: compressedBase64 }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে অন্য ছবি নির্বাচন করুন।');
    } finally {
      setIsCompressing(false);
    }
  };

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedStudent) return;

    const updatedProfile: StudentProfile = {
      ...loggedStudent,
      name: editForm.name.trim() || loggedStudent.name,
      phone: editForm.phone.trim() || loggedStudent.phone,
      photo: editForm.photo || '',
      address: editForm.address.trim() || loggedStudent.address || 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
      fatherName: editForm.fatherName.trim(),
      motherName: editForm.motherName.trim(),
      classYear: editForm.classYear.trim() || loggedStudent.classYear,
      rollNo: editForm.rollNo.trim() || loggedStudent.rollNo,
      regNo: editForm.regNo.trim() || loggedStudent.regNo,
      session: editForm.session.trim() || loggedStudent.session,
      bloodGroup: editForm.bloodGroup || loggedStudent.bloodGroup
    };

    updateLoggedStudent(updatedProfile);
    setIsEditModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Login handler
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
        address: 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
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
        const addr = foundApp.presentVillage
          ? `${foundApp.presentVillage}, ${foundApp.presentPost || ''}, ${foundApp.presentUpazila || 'দুপচাঁচিয়া'}, ${foundApp.presentDistrict || 'বগুড়া'}`
          : 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া';

        profile = {
          name: foundApp.studentNameBn,
          phone: foundApp.fatherPhone,
          photo: foundApp.photo || '',
          address: addr,
          fatherName: foundApp.fatherNameBn || '',
          motherName: foundApp.motherNameBn || '',
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
          address: 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
          fatherName: '',
          motherName: '',
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

    updateLoggedStudent(profile);
  };

  const handleLogout = () => {
    updateLoggedStudent(null);
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
      <div className={`w-full transition-all duration-300 ${loggedStudent ? 'max-w-4xl' : 'max-w-md'}`}>

        {/* Success Alert Toast */}
        {saveSuccess && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-700 text-white shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300 border-2 border-[#DDAA00]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DDAA00] text-slate-900 flex items-center justify-center font-black shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</p>
                <p className="text-xs text-emerald-100">আপনার ছবি, ঠিকানা এবং তথ্যাবলী সেভ করা হয়েছে।</p>
              </div>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ========================================================
            VIEW 1: STUDENT LOGIN FORM (When NOT logged in)
           ======================================================== */}
        {!loggedStudent ? (
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
            {/* Top Bar with Student Info, Photo, Edit Button, Print and Logout */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start sm:items-center gap-4">
                {/* Profile Photo / Avatar with edit shortcut */}
                <div
                  onClick={handleOpenEditModal}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00341c] to-[#006837] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#DDAA00] shrink-0 overflow-hidden cursor-pointer group"
                  title="ছবি বা তথ্য পরিবর্তন করতে ক্লিক করুন"
                >
                  {loggedStudent.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={loggedStudent.photo}
                      alt={loggedStudent.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span>{loggedStudent.name.charAt(0) || 'শ'}</span>
                  )}
                  {/* Camera overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                    <Camera className="w-5 h-5 text-[#DDAA00]" />
                    <span className="text-[8px] font-bold">এডিট</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {loggedStudent.name}
                    </h2>
                    <span className="bg-emerald-100 text-[#006837] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-[#006837]" />
                      <span>সক্রিয় শিক্ষার্থী</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {loggedStudent.classYear} • রোল: <strong className="font-mono text-[#006837]">{loggedStudent.rollNo}</strong> • সেশন: {loggedStudent.session}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-[#006837]" />
                      <span>মোবাইল: {loggedStudent.phone}</span>
                    </span>
                    {loggedStudent.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#006837]" />
                        <span className="truncate max-w-[200px] sm:max-w-[320px]">ঠিকানা: {loggedStudent.address}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit Profile, Print & Logout */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] hover:from-[#002614] hover:to-[#005a30] text-white border-2 border-[#DDAA00] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                >
                  <Edit3 className="w-4 h-4 text-[#DDAA00]" />
                  <span>প্রোফাইল এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#006837] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-[#006837]" />
                  <span>প্রিন্ট</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
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
                    {/* ID Card Photo with edit shortcut */}
                    <div
                      onClick={handleOpenEditModal}
                      className="w-20 h-24 rounded-xl bg-white/10 border-2 border-[#DDAA00] flex flex-col items-center justify-center text-center shrink-0 relative overflow-hidden cursor-pointer group"
                      title="ছবি বদলাতে ক্লিক করুন"
                    >
                      {loggedStudent.photo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={loggedStudent.photo}
                          alt={loggedStudent.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="p-2 flex flex-col items-center">
                          <User className="w-10 h-10 text-[#DDAA00] mb-1" />
                          <span className="text-[9px] font-bold text-white/90">ছবি নেই</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-[#DDAA00] font-bold transition-opacity">
                        <Camera className="w-4 h-4 mb-0.5" />
                        <span>ছবি বদলান</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-white flex-1">
                      <div>
                        <span className="text-[10px] text-emerald-200 font-semibold block">নাম:</span>
                        <strong className="text-sm font-black text-[#DDAA00]">{loggedStudent.name}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div>
                          <span className="text-[10px] text-emerald-200 block">শ্রেণি:</span>
                          <strong className="font-bold">{loggedStudent.classYear}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-200 block">রোল নম্বর:</span>
                          <strong className="font-bold font-mono">{loggedStudent.rollNo}</strong>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div>
                          <span className="text-[10px] text-emerald-200 block">রেজি নম্বর:</span>
                          <strong className="font-bold font-mono">{loggedStudent.regNo}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-200 block">রক্তের গ্রুপ:</span>
                          <strong className="font-bold text-[#DDAA00]">{loggedStudent.bloodGroup}</strong>
                        </div>
                      </div>

                      {loggedStudent.address && (
                        <div className="pt-1">
                          <span className="text-[9px] text-emerald-200 block">ঠিকানা:</span>
                          <span className="text-[11px] font-medium text-emerald-100 block truncate">
                            {loggedStudent.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Footer */}
                  <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-[10px] text-emerald-200 relative z-10">
                    <div>
                      <span>সেশন: <strong>{loggedStudent.session}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#DDAA00] font-bold block">অধ্যক্ষ / সুপারিনটেনডেন্ট</span>
                      <span className="text-[9px] text-emerald-300">স্বাক্ষরিত ও অনুমোদিত</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00341c] to-[#006837] border-2 border-[#DDAA00] hover:scale-105 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#DDAA00]" />
                    <span>আইডি কার্ড ও প্রোফাইল এডিট করুন</span>
                  </button>

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
                      {loggedStudent.result?.gpa.toFixed(2) || '৫.০০'}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <span className="text-xs text-amber-800 font-bold block">প্রাপ্ত লেটার গ্রেড</span>
                    <div className="text-2xl font-black text-[#997500] mt-1">
                      {loggedStudent.result?.grade || 'A+'}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <span className="text-xs text-blue-800 font-bold block">উপস্থিতির হার</span>
                    <div className="text-2xl font-black text-[#003580] mt-1">
                      {loggedStudent.attendanceRate}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-xs text-slate-700 font-bold block">ফলাফল অবস্থা</span>
                    <div className="text-sm font-black text-emerald-800 mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{loggedStudent.result?.resultStatus || 'উত্তীর্ণ'}</span>
                    </div>
                  </div>
                </div>

                {/* Subject-wise Marks Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 font-bold text-xs text-slate-800 flex justify-between items-center">
                    <span>বিষয়ভিত্তিক প্রাপ্ত নম্বর ও গ্রেডশিট</span>
                    <span className="text-emerald-800 text-[11px] font-semibold">সেশন: {loggedStudent.session}</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {(loggedStudent.result?.subjects || []).map((sub, idx) => (
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
                    <span>ক্লাস রুটিন ও সময়সূচি ({loggedStudent.classYear})</span>
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

        {/* ========================================================
            MODAL: EDIT STUDENT PROFILE (Photo, Address, Info)
           ======================================================== */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-2 border-emerald-500 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] text-white p-5 px-6 flex items-center justify-between border-b-2 border-[#DDAA00]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#DDAA00] text-slate-900 flex items-center justify-center font-bold">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                      শিক্ষার্থী প্রোফাইল এডিট ও আপডেট
                    </h3>
                    <p className="text-xs text-emerald-100">
                      আপনার ছবি, ঠিকানা ও অন্যান্য তথ্য পরিবর্তন করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                
                {/* 1. Photo Upload Section */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-24 rounded-xl bg-white border-2 border-[#DDAA00] overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                    {editForm.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={editForm.photo} alt="Student Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <User className="w-8 h-8 mx-auto text-[#006837]/40 mb-1" />
                        <span className="text-[9px] font-bold block">ছবি দিন</span>
                      </div>
                    )}
                    {isCompressing && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold">
                        লোড হচ্ছে...
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <p className="text-xs font-bold text-slate-800">
                      শিক্ষার্থীর ছবি (Photo Upload)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      আপনার পাসপোর্ট সাইজ বা পরিষ্কার ছবি আপলোড করুন। এটি আপনার আইডি কার্ড ও পোর্টাল হেডার এ দেখাবে।
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-[#006837] hover:bg-[#00542c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#DDAA00]" />
                        <span>{editForm.photo ? 'ছবি পরিবর্তন করুন' : 'ছবি নির্বাচন করুন'}</span>
                      </button>

                      {editForm.photo && (
                        <button
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, photo: '' }))}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছুন</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Text Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর নাম (Student Name) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="যেমন: আকাশ বা মোঃ ওমর ফারুক"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর (Phone) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold font-mono"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      রক্তের গ্রুপ (Blood Group)
                    </label>
                    <select
                      value={editForm.bloodGroup}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold bg-white"
                    >
                      <option value="A+">A+ (পজিটিভ)</option>
                      <option value="A-">A- (নেগেটিভ)</option>
                      <option value="B+">B+ (পজিটিভ)</option>
                      <option value="B-">B- (নেগেটিভ)</option>
                      <option value="O+">O+ (পজিটিভ)</option>
                      <option value="O-">O- (নেগেটিভ)</option>
                      <option value="AB+">AB+ (পজিটিভ)</option>
                      <option value="AB-">AB- (নেগেটিভ)</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ঠিকানা (Address - গ্রাম, ডাকঘর, উপজেলা, জেলা) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="যেমন: পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  {/* Father's Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পিতার নাম (Father&apos;s Name)
                    </label>
                    <input
                      type="text"
                      value={editForm.fatherName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, fatherName: e.target.value }))}
                      placeholder="পিতার নাম লিখুন"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  {/* Mother's Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মাতার নাম (Mother&apos;s Name)
                    </label>
                    <input
                      type="text"
                      value={editForm.motherName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, motherName: e.target.value }))}
                      placeholder="মাতার নাম লিখুন"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শ্রেণি (Class)
                    </label>
                    <input
                      type="text"
                      value={editForm.classYear}
                      onChange={(e) => setEditForm(prev => ({ ...prev, classYear: e.target.value }))}
                      placeholder="যেমন: ১০ম শ্রেণি (দাখিল)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  {/* Roll No */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      রোল নম্বর (Roll No)
                    </label>
                    <input
                      type="text"
                      value={editForm.rollNo}
                      onChange={(e) => setEditForm(prev => ({ ...prev, rollNo: e.target.value }))}
                      placeholder="যেমন: ১০১"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006837] text-xs sm:text-sm font-semibold font-mono"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] hover:from-[#002614] hover:to-[#005a30] border-2 border-[#DDAA00] text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    <Save className="w-4 h-4 text-[#DDAA00]" />
                    <span>তথ্য সংরক্ষণ করুন (Save Changes)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
