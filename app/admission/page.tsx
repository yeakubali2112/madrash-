'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useMadrasah } from '@/context/MadrasahContext';
import { AdmissionApplication } from '@/lib/data';
import {
  GraduationCap,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  Phone,
  Calendar,
  MapPin,
  School,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AdmissionPage() {
  const { info, applications, submitApplication } = useMadrasah();
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Form State
  const [formData, setFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    birthRegNo: '',
    dob: '',
    bloodGroup: 'A+',
    gender: 'ছাত্র' as 'ছাত্র' | 'ছাত্রী',
    religion: 'ইসলাম',
    applyingClass: 'ষষ্ঠ শ্রেণি',
    previousSchool: '',
    previousGpa: '',
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    presentAddress: '',
    permanentAddress: '',
    emergencyContact: ''
  });

  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<AdmissionApplication | null>(null);
  const [searchError, setSearchError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentNameBn || !formData.fatherPhone || !formData.birthRegNo) {
      alert('দয়া করে শিক্ষার্থীর নাম, জন্মনিবন্ধন এবং অভিভাবকের মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    const newApp = submitApplication({
      ...formData,
      emergencyContact: formData.emergencyContact || formData.fatherPhone
    });

    setSubmittedApp(newApp);

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback if canvas not available
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError('অনুগ্রহ করে আবেদন আইডি বা মোবাইল নম্বর লিখুন।');
      return;
    }

    const found = applications.find(
      app =>
        app.id.toLowerCase() === query ||
        app.fatherPhone.replace(/\D/g, '') === query.replace(/\D/g, '') ||
        app.birthRegNo === query
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchError('দুঃখিত! এই আইডি বা মোবাইল নম্বরে কোনো আবেদন পাওয়া যায়নি। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getStatusBadge = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'অনুমোদিত':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ভর্তি আবেদন অনুমোদিত</span>
          </span>
        );
      case 'বাতিল':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 font-bold px-3 py-1 rounded-full text-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>আবেদন বাতিল</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>যাচাইকরণ প্রক্রিয়াধীন (অপেক্ষমান)</span>
          </span>
        );
    }
  };

  const renderSlip = (app: AdmissionApplication) => (
    <div className="bg-white rounded-2xl border-2 border-[#006837] p-6 md:p-8 shadow-xl print-area">
      {/* Official Madrasah Header */}
      <div className="text-center border-b-2 border-[#006837] pb-4 mb-6">
        <div className="flex justify-center items-center gap-4 mb-2">
          <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 drop-shadow-md">
            <Image
              src="/logo.png"
              alt={info.name}
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#006837] leading-tight">
              {info.name}
            </h2>
            <p className="text-xs font-bold text-[#003580]">{info.location || "দুপচাঁচিয়া, বগুড়া"} • {info.englishName}</p>
          </div>
        </div>
        <p className="text-xs text-slate-700 font-medium">
          {info.address} • ফোন: {info.phone} • EIIN: {info.eiin} • কোড: {info.madrasahCode}
        </p>
        <div className="inline-block bg-[#006837] text-[#DDAA00] text-sm font-black px-6 py-1 rounded-full mt-3 shadow-sm border border-[#DDAA00]/40">
          অনলাইন ভর্তি আবেদন কপি ও প্রবেশ স্লিপ
        </div>
      </div>

      {/* Slip Metadata Bar */}
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">আবেদন ট্র্যাকিং আইডি:</span>
          <span className="text-lg font-mono font-black text-emerald-900">{app.id}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">আবেদনের তারিখ:</span>
          <span className="text-sm font-bold text-slate-800">{app.appliedDate}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">আবেদনের বর্তমান অবস্থা:</span>
          <div>{getStatusBadge(app.status)}</div>
        </div>
      </div>

      {/* Applicant & Details Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm mb-6">
        <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="font-bold text-emerald-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-700" />
            <span>শিক্ষার্থীর ব্যক্তিগত তথ্য</span>
          </h4>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">শিক্ষার্থীর নাম (বাংলা):</span>
            <span className="font-bold text-slate-900">{app.studentNameBn}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">শিক্ষার্থীর নাম (ইংরেজি):</span>
            <span className="font-semibold text-slate-800 uppercase">{app.studentNameEn || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">জন্মনিবন্ধন নম্বর:</span>
            <span className="font-mono font-bold text-slate-900">{app.birthRegNo}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">জন্ম তারিখ:</span>
            <span className="font-semibold text-slate-800">{app.dob || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">লিঙ্গ ও রক্তগ্রুপ:</span>
            <span className="font-semibold text-slate-800">{app.gender} • {app.bloodGroup}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">আবেদনকৃত শ্রেণি:</span>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{app.applyingClass}</span>
          </div>
        </div>

        <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="font-bold text-emerald-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>অভিভাবক ও ঠিকানার তথ্য</span>
          </h4>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">পিতার নাম:</span>
            <span className="font-bold text-slate-900">{app.fatherName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">পিতার মোবাইল:</span>
            <span className="font-bold font-mono text-emerald-700">{app.fatherPhone}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">মাতার নাম:</span>
            <span className="font-semibold text-slate-800">{app.motherName || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">বর্তমান ঠিকানা:</span>
            <span className="font-semibold text-slate-800">{app.presentAddress || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">পূর্ববর্তী প্রতিষ্ঠান:</span>
            <span className="font-semibold text-slate-800">{app.previousSchool || 'N/A'} (জিপিএ: {app.previousGpa || 'N/A'})</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">জরুরি যোগাযোগ:</span>
            <span className="font-mono text-slate-800">{app.emergencyContact}</span>
          </div>
        </div>
      </div>

      {/* Instructions Box */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 mb-6">
        <h5 className="font-bold mb-1 flex items-center gap-1 text-amber-950">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>ভর্তি সংক্রান্ত পরবর্তী নির্দেশনা:</span>
        </h5>
        <ul className="list-disc list-inside space-y-1 text-amber-800">
          <li>এই আবেদন কপিটি প্রিন্ট করে সংরক্ষণ করুন অথবা স্ক্রিনশট নিয়ে রাখুন।</li>
          <li>শিক্ষার্থীর ২ কপি পাসপোর্ট সাইজ ছবি এবং অনলাইন জন্ম সনদের ফটোকপিসহ মাদ্রাসা অফিসে যোগাযোগ করুন।</li>
          <li>ভর্তি সংক্রান্ত যেকোনো জিজ্ঞাসায় কল করুন: <span className="font-bold">{info.phone}</span></li>
        </ul>
      </div>

      {/* Signature Area */}
      <div className="pt-8 mt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-700">
        <div className="text-center">
          <div className="w-36 border-b border-slate-400 mb-1.5"></div>
          <p className="font-semibold">অভিভাবকের স্বাক্ষর</p>
        </div>
        <div className="text-center">
          <div className="w-36 border-b border-slate-400 mb-1.5"></div>
          <p className="font-bold text-slate-900">{info.principalName}</p>
          <p>{info.principalTitle}</p>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3 no-print">
        <button
          onClick={() => {
            setSubmittedApp(null);
            setSearchResult(null);
          }}
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          ← নতুন আরেকটি আবেদন করুন
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>স্লিপ প্রিন্ট / ডাউনলোড করুন</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            ভর্তি সেশন ২০২৬
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            অনলাইন ভর্তি আবেদন ও ট্র্যাকিং
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এ ২০২৬ শিক্ষাবর্ষে সকল শ্রেণিতে অনলাইনে সরাসরি ভর্তি আবেদন করুন অথবা পূর্বের আবেদনের অবস্থা যাচাই করুন।
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 no-print">
          <div className="bg-slate-200 p-1.5 rounded-xl flex gap-1 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('apply');
                setSubmittedApp(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'apply'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>নতুন ভর্তি আবেদন</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'track'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>আবেদন যাচাই ও স্লিপ প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* If Application Just Submitted, Show Slip */}
        {submittedApp && renderSlip(submittedApp)}

        {/* If Tracking Result Found, Show Slip */}
        {!submittedApp && activeTab === 'track' && searchResult && renderSlip(searchResult)}

        {/* Tracking Search Form */}
        {!submittedApp && activeTab === 'track' && !searchResult && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-md">
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">আবেদনের অবস্থা অনুসন্ধান</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনার আবেদন ট্র্যাকিং আইডি (যেমন: PADM-2026-1001) অথবা আবেদনে ব্যবহৃত মোবাইল নম্বর বা জন্মনিবন্ধন নম্বর দিন
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="আবেদন আইডি অথবা মোবাইল নম্বর"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                />
              </div>

              {searchError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {searchError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>আবেদন অনুসন্ধান করুন</span>
              </button>
            </form>
          </div>
        )}

        {/* Application Form */}
        {!submittedApp && activeTab === 'apply' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-md space-y-8">
            {/* Section 1: Student Information */}
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">১</div>
                <h3 className="text-lg font-bold text-slate-900">শিক্ষার্থীর ব্যক্তিগত তথ্য</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    শিক্ষার্থীর পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="studentNameBn"
                    value={formData.studentNameBn}
                    onChange={handleChange}
                    placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    শিক্ষার্থীর নাম (ইংরেজিতে ক্যাপিটাল লেটার)
                  </label>
                  <input
                    type="text"
                    name="studentNameEn"
                    value={formData.studentNameEn}
                    onChange={handleChange}
                    placeholder="e.g. MUHAMMAD ABDULLAH"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    জন্মনিবন্ধন নম্বর (১৭ ডিজিট) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="birthRegNo"
                    value={formData.birthRegNo}
                    onChange={handleChange}
                    placeholder="১৭ ডিজিটের জন্মনিবন্ধন নম্বর"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    জন্ম তারিখ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আবেদনকৃত শ্রেণি ও বিভাগ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="applyingClass"
                    value={formData.applyingClass}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                  >
                    <option value="নূরানী ও নাজেরা বিভাগ">নূরানী ও নাজেরা বিভাগ</option>
                    <option value="হিফজুল কুরআন বিভাগ">হিফজুল কুরআন বিভাগ</option>
                    <option value="প্রথম শ্রেণি (ইবতেদায়ী)">প্রথম শ্রেণি (ইবতেদায়ী)</option>
                    <option value="দ্বিতীয় শ্রেণি">দ্বিতীয় শ্রেণি</option>
                    <option value="তৃতীয় শ্রেণি">তৃতীয় শ্রেণি</option>
                    <option value="চতুর্থ শ্রেণি">চতুর্থ শ্রেণি</option>
                    <option value="পঞ্চম শ্রেণি (ইবতেদায়ী সমাপনী)">পঞ্চম শ্রেণি (ইবতেদায়ী সমাপনী)</option>
                    <option value="ষষ্ঠ শ্রেণি">ষষ্ঠ শ্রেণি</option>
                    <option value="সপ্তম শ্রেণি">সপ্তম শ্রেণি</option>
                    <option value="অষ্টম শ্রেণি (জেডিসি সমমান)">অষ্টম শ্রেণি (জেডিসি সমমান)</option>
                    <option value="নবম শ্রেণি (দাখিল সাধারণ বিভাগ)">নবম শ্রেণি (দাখিল সাধারণ বিভাগ)</option>
                    <option value="নবম শ্রেণি (দাখিল বিজ্ঞান বিভাগ)">নবম শ্রেণি (দাখিল বিজ্ঞান বিভাগ)</option>
                    <option value="দশম শ্রেণি (দাখিল পরীক্ষার্থী)">দশম শ্রেণি (দাখিল পরীক্ষার্থী)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      লিঙ্গ
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                    >
                      <option value="ছাত্র">ছাত্র</option>
                      <option value="ছাত্রী">ছাত্রী</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      রক্তের গ্রুপ
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পূর্ববর্তী প্রতিষ্ঠানের নাম
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    placeholder="যেমন: আলোহালী সরকারি প্রাথমিক বিদ্যালয়"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পূর্ববর্তী পরীক্ষার জিপিএ / ফলাফল
                  </label>
                  <input
                    type="text"
                    name="previousGpa"
                    value={formData.previousGpa}
                    onChange={handleChange}
                    placeholder="যেমন: ৫.০০"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Parents & Guardians */}
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">২</div>
                <h3 className="text-lg font-bold text-slate-900">পিতা, মাতা ও অভিভাবকের তথ্য</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পিতার নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="পিতার পূর্ণ নাম"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পিতা/অভিভাবকের সচল মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="fatherPhone"
                    value={formData.fatherPhone}
                    onChange={handleChange}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পিতার পেশা
                  </label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleChange}
                    placeholder="যেমন: ব্যবসায়ী / চাকরিজীবী"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    placeholder="মাতার পূর্ণ নাম"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Address */}
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">৩</div>
                <h3 className="text-lg font-bold text-slate-900">ঠিকানা ও জরুরি যোগাযোগ</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    বর্তমান ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    name="presentAddress"
                    value={formData.presentAddress}
                    onChange={handleChange}
                    placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    স্থায়ী ঠিকানা
                  </label>
                  <textarea
                    rows={3}
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা (বর্তমান ঠিকানার অনুরূপ হলে ফাঁকা রাখুন)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Agreement & Submit */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                আমি অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও নির্ভুল।
              </p>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-black px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm"
              >
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span>আবেদন সম্পন্ন ও স্লিপ গ্রহণ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
