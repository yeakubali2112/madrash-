'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Notice,
  Teacher,
  AdmissionApplication,
  ResultRecord,
  ContactMessage,
  MadrasahInfo,
  UrgentNoticeItem,
  FacilityItem,
  GalleryItem
} from '@/lib/data';
import {
  ShieldCheck,
  LayoutDashboard,
  GraduationCap,
  Bell,
  Users,
  Award,
  Settings,
  MessageSquare,
  Database,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Search,
  Download,
  Upload,
  RefreshCw,
  X,
  Pin,
  Save,
  Check,
  Megaphone,
  ExternalLink,
  Sparkles,
  Laptop,
  Microscope,
  Book,
  Droplets,
  Trophy,
  Building,
  Camera,
  Quote,
  UserCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    isAdmin,
    logoutAdmin,
    info,
    updateInfo,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    urgentNotices,
    tickerSettings,
    updateTickerSettings,
    addUrgentNotice,
    updateUrgentNotice,
    deleteUrgentNotice,
    toggleUrgentNoticeStatus,
    facilities,
    addFacility,
    updateFacility,
    deleteFacility,
    toggleFacilityStatus,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    applications,
    updateApplicationStatus,
    deleteApplication,
    results,
    addResult,
    messages,
    markMessageRead,
    deleteMessage,
    resetToDefaults
  } = useMadrasah();

  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'notices' | 'urgent-notices' | 'facilities' | 'gallery' | 'teachers' | 'authorities' | 'results' | 'settings' | 'messages' | 'backup'>('overview');

  // Check auth
  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  // Notice Form State
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'পরীক্ষা' as Notice['category'],
    date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    content: '',
    author: 'প্রশাসন বিভাগ',
    isPinned: false
  });

  // Urgent Notice Form State
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [editingUrgentNotice, setEditingUrgentNotice] = useState<UrgentNoticeItem | null>(null);
  const [urgentForm, setUrgentForm] = useState({
    title: '',
    category: 'জরুরি',
    date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    link: '',
    isActive: true
  });
  const [tickerLabelInput, setTickerLabelInput] = useState(tickerSettings?.label || 'জরুরি নোটিশ:');
  const [tickerSettingsSaved, setTickerSettingsSaved] = useState(false);

  useEffect(() => {
    if (tickerSettings) {
      setTickerLabelInput(tickerSettings.label || 'জরুরি নোটিশ:');
    }
  }, [tickerSettings]);

  // Facility Form State
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);
  const [facilityForm, setFacilityForm] = useState({
    title: '',
    desc: '',
    iconName: 'Laptop',
    isActive: true
  });

  // Gallery Form State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('সকল');
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'ক্যাম্পাস' as GalleryItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
  });

  // Teacher Form State
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: '',
    qualification: '',
    subject: '',
    phone: '',
    email: '',
    image: ''
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<MadrasahInfo>(info);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Authority Speeches Form State
  const [authorityForm, setAuthorityForm] = useState({
    principalName: info.principalName || '',
    principalTitle: info.principalTitle || '',
    principalMessage: info.principalMessage || '',
    principalImage: info.principalImage || '',
    presidentName: info.presidentName || '',
    presidentTitle: info.presidentTitle || '',
    presidentMessage: info.presidentMessage || '',
    presidentImage: info.presidentImage || ''
  });
  const [authoritySaved, setAuthoritySaved] = useState(false);

  useEffect(() => {
    setSettingsForm(info);
    if (info) {
      setAuthorityForm({
        principalName: info.principalName || '',
        principalTitle: info.principalTitle || '',
        principalMessage: info.principalMessage || '',
        principalImage: info.principalImage || '',
        presidentName: info.presidentName || '',
        presidentTitle: info.presidentTitle || '',
        presidentMessage: info.presidentMessage || '',
        presidentImage: info.presidentImage || ''
      });
    }
  }, [info]);

  // Selected Application for Details Modal
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState<'সকল' | 'অপেক্ষমান' | 'অনুমোদিত' | 'বাতিল'>('সকল');

  // Pending and unread counts
  const pendingAppsCount = applications.filter(a => a.status === 'অপেক্ষমান').length;
  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  // Helper for compressing/resizing images to prevent localStorage quota overflow
  const handleImageUpload = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const rawDataUrl = uploadEvent.target?.result as string;
      if (!rawDataUrl) return;

      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        const maxDim = 500;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          callback(compressed);
        } else {
          callback(rawDataUrl);
        }
      };
      img.onerror = () => {
        callback(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle Notice Save
  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      alert('শিরোনাম ও বিবরণ পূরণ করুন।');
      return;
    }

    if (editingNotice) {
      updateNotice(editingNotice.id, noticeForm);
    } else {
      addNotice(noticeForm);
    }
    setShowNoticeModal(false);
    setEditingNotice(null);
    setNoticeForm({
      title: '',
      category: 'সাধারণ',
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: '',
      author: 'প্রশাসন বিভাগ',
      isPinned: false
    });
  };

  // Handle Teacher Save
  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.designation) {
      alert('শিক্ষকের নাম ও পদবী পূরণ করুন।');
      return;
    }

    const finalTeacherData = {
      ...teacherForm,
      image: teacherForm.image?.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, finalTeacherData);
    } else {
      addTeacher(finalTeacherData);
    }
    setShowTeacherModal(false);
    setEditingTeacher(null);
    setTeacherForm({
      name: '',
      designation: '',
      qualification: '',
      subject: '',
      phone: '',
      email: '',
      image: ''
    });
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateInfo(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Export Data JSON
  const handleExportData = () => {
    const backupData = {
      info,
      notices,
      teachers,
      applications,
      results,
      messages,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madrasah_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered applications
  const filteredApps = applications.filter(a => {
    const matchesFilter = appFilter === 'সকল' || a.status === appFilter;
    const matchesSearch =
      a.studentNameBn.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.fatherPhone.includes(appSearch) ||
      a.applyingClass.toLowerCase().includes(appSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-gradient-to-r from-[#00341c] via-[#006837] to-[#003580] text-white px-4 py-2.5 border-b border-[#DDAA00]/40 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0 drop-shadow-md">
              <Image
                src="/logo.png"
                alt={info.name}
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base md:text-lg leading-tight text-white">
                  মাদ্রাসা অ্যাডমিন কন্ট্রোল প্যানেল
                </h1>
                <span className="bg-[#DDAA00] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                  লাইভ সিস্টেম
                </span>
              </div>
              <p className="text-xs text-emerald-200">{info.name} • {info.location || "দুপচাঁচিয়া, বগুড়া"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm shrink-0 self-start">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            প্রধান মেনু
          </div>
          <nav className="space-y-1 text-xs md:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>ওভারভিউ</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'admissions'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4" />
                <span>ভর্তি আবেদন</span>
              </div>
              {pendingAppsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {pendingAppsCount} নতুন
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'notices'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>নোটিশ ব্যবস্থাপনা</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {notices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('urgent-notices')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'urgent-notices'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>জরুরি নোটিশ (স্ক্রল)</span>
              </div>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {urgentNotices.filter(n => n.isActive).length}টি সক্রিয়
              </span>
            </button>

            <button
              onClick={() => setActiveTab('facilities')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'facilities'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>সুযোগ-সুবিধাসমূহ</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {facilities.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>ফটো গ্যালারি</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {gallery.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'teachers'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>শিক্ষক ও স্টাফ</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {teachers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('authorities')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'authorities'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Quote className="w-4 h-4 text-emerald-500" />
                <span>কর্তৃপক্ষের বাণী</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                ২টি বাণী
              </span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'results'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>ফলাফল ও মার্কস</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'messages'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>প্রাপ্ত বার্তা</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'settings'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>মাদ্রাসা সেটিংস</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'backup'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>ব্যাকআপ ও রিস্টোর</span>
              </div>
            </button>
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-100 px-2 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center justify-center gap-1 bg-emerald-50 py-2 rounded-lg"
            >
              <span>ওয়েবসাইটের মূল রূপ দেখুন ↗</span>
            </a>

            <button
              onClick={() => {
                logoutAdmin();
                router.push('/admin/login');
              }}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-sm hover:shadow"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">ড্যাশবোর্ড ওভারভিউ</h2>
                  <p className="text-xs text-slate-500">মাদ্রাসার সার্বিক পরিসংখ্যান ও কার্যক্রমের সারসংক্ষেপ</p>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-emerald-800">মোট শিক্ষার্থী</span>
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-950">{info.stats.students}</div>
                  <div className="text-[11px] text-emerald-700 mt-1">সক্রিয় অধ্যয়নরত</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-amber-800">নতুন ভর্তি আবেদন</span>
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-950">{applications.length}</div>
                  <div className="text-[11px] text-amber-700 mt-1">{pendingAppsCount}টি অপেক্ষমান</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-800">মোট শিক্ষক ও স্টাফ</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-blue-950">{teachers.length} জন</div>
                  <div className="text-[11px] text-blue-700 mt-1">পূর্ণকালীন দায়িত্বপ্রাপ্ত</div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-purple-800">প্রকাশিত নোটিশ</span>
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-purple-950">{notices.length}টি</div>
                  <div className="text-[11px] text-purple-700 mt-1">সক্রিয় নোটিশ বোর্ডে</div>
                </div>
              </div>

              {/* Urgent Notice Quick Status in Overview */}
              <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">জরুরি নোটিশ (স্ক্রলিং টিককার):</span>{' '}
                    <span className="text-slate-600">
                      {tickerSettings?.isEnabled ? `${urgentNotices.filter(n => n.isActive).length}টি নোটিশ বর্তমানে স্ক্রল হচ্ছে` : 'বারটি বর্তমানে বন্ধ রাখা হয়েছে'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('urgent-notices')}
                  className="bg-[#003580] hover:bg-[#002456] text-[#DDAA00] font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-colors shrink-0"
                >
                  জরুরি নোটিশ পরিচালনা করুন →
                </button>
              </div>

              {/* Recent Applications Section */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm">সর্বশেষ ভর্তি আবেদনসমূহ</h3>
                  <button
                    onClick={() => setActiveTab('admissions')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    সকল আবেদন দেখুন →
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">ট্র্যাকিং আইডি</th>
                        <th className="p-3">শিক্ষার্থীর নাম</th>
                        <th className="p-3">আবেদনকৃত শ্রেণি</th>
                        <th className="p-3">মোবাইল</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3">অবস্থা</th>
                        <th className="p-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.slice(0, 4).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-emerald-800">{app.id}</td>
                          <td className="p-3 font-bold text-slate-900">{app.studentNameBn}</td>
                          <td className="p-3 text-slate-700">{app.applyingClass}</td>
                          <td className="p-3 font-mono text-slate-600">{app.fatherPhone}</td>
                          <td className="p-3 text-slate-500">{app.appliedDate}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                app.status === 'অনুমোদিত'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'বাতিল'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setActiveTab('admissions');
                              }}
                              className="text-emerald-700 font-bold hover:underline"
                            >
                              বিস্তারিত
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSIONS MANAGEMENT */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">ভর্তি আবেদন ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500">অনলাইনে জমা হওয়া সকল ভর্তি আবেদন পর্যালোচনা, অনুমোদন বা বাতিল করুন</p>
                </div>

                <div className="flex gap-2">
                  {(['সকল', 'অপেক্ষমান', 'অনুমোদিত', 'বাতিল'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAppFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        appFilter === filter
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম, শ্রেণি, আইডি বা মোবাইল দিয়ে খুঁজুন..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-emerald-900 text-white font-bold">
                    <tr>
                      <th className="p-3">ট্র্যাকিং আইডি</th>
                      <th className="p-3">শিক্ষার্থীর নাম</th>
                      <th className="p-3">শ্রেণি</th>
                      <th className="p-3">পিতার নাম ও মোবাইল</th>
                      <th className="p-3">বর্তমান অবস্থা</th>
                      <th className="p-3 text-center">অবস্থা পরিবর্তন</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          কোনো আবেদন পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-emerald-800">{app.id}</td>
                          <td className="p-3 font-bold text-slate-900">
                            {app.studentNameBn}
                            <span className="block text-[10px] text-slate-500 font-normal">{app.studentNameEn}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{app.applyingClass}</td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-900">{app.fatherName}</span>
                            <span className="block text-emerald-700 font-mono text-[11px]">{app.fatherPhone}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                app.status === 'অনুমোদিত'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'বাতিল'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={app.status}
                              onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                              className="px-2 py-1 rounded border border-slate-300 text-[11px] font-bold bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            >
                              <option value="অপেক্ষমান">অপেক্ষমান</option>
                              <option value="অনুমোদিত">অনুমোদিত</option>
                              <option value="বাতিল">বাতিল</option>
                            </select>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 p-1.5 rounded"
                              title="বিস্তারিত স্লিপ দেখুন"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`আপনি কি "${app.studentNameBn}"-এর আবেদনটি মুছে ফেলতে চান?`)) {
                                  deleteApplication(app.id);
                                }
                              }}
                              className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 p-1.5 rounded"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NOTICES MANAGEMENT */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">নোটিশ ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500">নোটিশ প্রকাশ, সম্পাদনা বা পিন করুন</p>
                </div>
                <button
                  onClick={() => {
                    setEditingNotice(null);
                    setNoticeForm({
                      title: '',
                      category: 'সাধারণ',
                      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
                      content: '',
                      author: 'প্রশাসন বিভাগ',
                      isPinned: false
                    });
                    setShowNoticeModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন নোটিশ লিখুন</span>
                </button>
              </div>

              {/* Notices List */}
              <div className="space-y-3">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 flex justify-between items-start gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        {n.isPinned && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-slate-950" /> পিন করা
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">{n.date}</span>
                        <span className="text-[11px] text-emerald-700 font-medium">• {n.author}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">{n.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{n.content}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNotice(n);
                          setNoticeForm({
                            title: n.title,
                            category: n.category,
                            date: n.date,
                            content: n.content,
                            author: n.author,
                            isPinned: !!n.isPinned
                          });
                          setShowNoticeModal(true);
                        }}
                        className="p-2 bg-white text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200"
                        title="সম্পাদনা"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${n.title}" নোটিশটি মুছে ফেলতে চান?`)) {
                            deleteNotice(n.id);
                          }
                        }}
                        className="p-2 bg-white text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: URGENT NOTICES (SCROLLING TICKER) */}
          {activeTab === 'urgent-notices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">জরুরি নোটিশ (স্ক্রলিং বার) ব্যবস্থাপনা</h2>
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      লাইভ অ্যানিমেশন
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ওয়েবসাইটের হেডারের নিচে হলুদ বারে স্ক্রল হতে থাকা জরুরি নোটিশগুলো এখান থেকে যোগ, এডিট বা বন্ধ করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingUrgentNotice(null);
                      setUrgentForm({
                        title: '',
                        category: 'জরুরি',
                        date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
                        link: '',
                        isActive: true
                      });
                      setShowUrgentModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00542c] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 text-[#DDAA00]" />
                    <span>নতুন জরুরি নোটিশ যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Panel */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 shadow-md border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-emerald-400">ওয়েবসাইটে বর্তমানে যেমন দেখাবে (লাইভ প্রিভিউ)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    অবস্থা: {tickerSettings?.isEnabled ? (urgentNotices.filter(n => n.isActive).length > 0 ? '🟢 প্রদর্শিত হচ্ছে' : '🟡 কোনো সক্রিয় নোটিশ নেই') : '🔴 বার বন্ধ রাখা হয়েছে'}
                  </span>
                </div>

                {/* Ticker bar preview */}
                {tickerSettings?.isEnabled && urgentNotices.filter(n => n.isActive).length > 0 ? (
                  <div className="bg-[#002d18] text-white py-2 px-3 rounded-xl border border-emerald-800 shadow-inner overflow-hidden flex items-center">
                    <div className="flex items-center gap-1.5 bg-[#003580] text-[#DDAA00] font-black px-3 py-1 rounded text-xs shrink-0 shadow mr-3 z-10 border border-[#DDAA00]/30">
                      <Bell className="w-3.5 h-3.5 animate-pulse text-[#DDAA00]" />
                      <span>{tickerSettings?.label || "জরুরি নোটিশ:"}</span>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      <div
                        className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs md:text-sm font-bold py-0.5"
                        style={{ animationDuration: tickerSettings?.speed === 'slow' ? '38s' : tickerSettings?.speed === 'fast' ? '16s' : '26s' }}
                      >
                        {[...urgentNotices.filter(n => n.isActive), ...urgentNotices.filter(n => n.isActive)].map((n, idx) => (
                          <div key={`${n.id}-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                            {n.category && (
                              <span className="bg-[#006837] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-600/50">
                                {n.category}
                              </span>
                            )}
                            <span className="text-slate-100">{n.title}</span>
                            {n.date && (
                              <span className="text-emerald-300 text-[11px] font-normal">({n.date})</span>
                            )}
                            <span className="text-[#DDAA00] font-black ml-4">✦</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800 text-slate-400 text-xs py-4 px-4 rounded-xl text-center border border-slate-700">
                    {tickerSettings?.isEnabled ? "কোনো জরুরি নোটিশ সক্রিয় নেই। নোটিশ যোগ করুন অথবা তালিকা থেকে সক্রিয় করুন।" : "জরুরি নোটিশ বারটি সেটিংস থেকে বন্ধ রাখা হয়েছে। চালু করতে নিচের বাটনে ক্লিক করুন।"}
                  </div>
                )}
              </div>

              {/* Ticker General Settings Box */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-emerald-800" />
                    <span>টিককার সেটিংস ও নিয়ন্ত্রণ</span>
                  </h3>
                  {tickerSettingsSaved && (
                    <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3.5 h-3.5" /> সেটিংস সংরক্ষিত হয়েছে!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* On/Off Switch */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <label className="font-bold text-slate-700 block">বার প্রদর্শন চালু / বন্ধ</label>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {tickerSettings?.isEnabled ? 'বর্তমানে ওয়েবসাইটে চালু আছে' : 'বর্তমানে বন্ধ রাখা আছে'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateTickerSettings({ isEnabled: !tickerSettings?.isEnabled });
                          setTickerSettingsSaved(true);
                          setTimeout(() => setTickerSettingsSaved(false), 2500);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          tickerSettings?.isEnabled
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {tickerSettings?.isEnabled ? 'চালু আছে ✓' : 'বন্ধ আছে ✕'}
                      </button>
                    </div>
                  </div>

                  {/* Label Text */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <label className="font-bold text-slate-700 block">বামের লেবেল টেক্সট</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tickerLabelInput}
                        onChange={(e) => setTickerLabelInput(e.target.value)}
                        placeholder="যেমন: জরুরি নোটিশ:"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateTickerSettings({ label: tickerLabelInput });
                          setTickerSettingsSaved(true);
                          setTimeout(() => setTickerSettingsSaved(false), 2500);
                        }}
                        className="bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-900"
                      >
                        সেভ
                      </button>
                    </div>
                  </div>

                  {/* Speed Selector */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <label className="font-bold text-slate-700 block">স্ক্রলিং গতি (Speed)</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'slow', label: 'ধীর' },
                        { id: 'normal', label: 'স্বাভাবিক' },
                        { id: 'fast', label: 'দ্রুত' },
                      ].map((spd) => (
                        <button
                          key={spd.id}
                          type="button"
                          onClick={() => {
                            updateTickerSettings({ speed: spd.id as any });
                            setTickerSettingsSaved(true);
                            setTimeout(() => setTickerSettingsSaved(false), 2500);
                          }}
                          className={`py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                            tickerSettings?.speed === spd.id
                              ? 'bg-[#003580] text-[#DDAA00] shadow'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {spd.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick import from regular notices */}
              {notices.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>দ্রুত যোগ করুন:</strong> মূল নোটিশ বোর্ড থেকে এক ক্লিকে জরুরি বারে নিয়ে আসুন:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      id="quick-import-select"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium max-w-xs"
                      defaultValue=""
                      onChange={(e) => {
                        const noticeId = e.target.value;
                        if (!noticeId) return;
                        const found = notices.find(n => n.id === noticeId);
                        if (found) {
                          addUrgentNotice({
                            title: found.title,
                            category: found.category,
                            date: found.date,
                            link: `/notices#${found.id}`,
                            isActive: true
                          });
                          e.target.value = '';
                          alert(`"${found.title}" সফলভাবে জরুরি নোটিশে যোগ করা হয়েছে!`);
                        }
                      }}
                    >
                      <option value="">-- নোটিশ বেছে নিন --</option>
                      {notices.map(n => (
                        <option key={n.id} value={n.id}>{n.category}: {n.title.slice(0, 40)}...</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Urgent Notices Items List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-base">
                    জরুরি নোটিশ তালিকা ({urgentNotices.length}টি)
                  </h3>
                  <span className="text-xs text-slate-500">
                    এখানে থাকা নোটিশগুলো ওয়েবসাইটের হলুদ টিককারে ধারাবাহিকভাবে প্রদর্শিত হয়
                  </span>
                </div>

                <div className="space-y-2">
                  {urgentNotices.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-xs">
                      বর্তমানে কোনো জরুরি নোটিশ নেই। উপরে &quot;নতুন জরুরি নোটিশ যোগ করুন&quot; বাটনে ক্লিক করে যোগ করুন।
                    </div>
                  ) : (
                    urgentNotices.map((un, index) => (
                      <div
                        key={un.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                          un.isActive
                            ? 'bg-white border-emerald-200 shadow-sm'
                            : 'bg-slate-50/80 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="font-mono text-xs font-bold text-slate-400 w-5 shrink-0">
                            #{index + 1}
                          </span>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                                un.isActive ? 'bg-[#006837] text-white' : 'bg-slate-300 text-slate-700'
                              }`}>
                                {un.category || 'সাধারণ'}
                              </span>

                              {un.date && (
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {un.date}
                                </span>
                              )}

                              {un.link && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 font-mono">
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  {un.link}
                                </span>
                              )}

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                un.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {un.isActive ? 'সক্রিয়' : 'বন্ধ'}
                              </span>
                            </div>

                            <p className="font-bold text-slate-900 text-sm leading-snug truncate">
                              {un.title}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {/* Active / Inactive Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleUrgentNoticeStatus(un.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              un.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                            title={un.isActive ? 'বন্ধ করতে ক্লিক করুন' : 'চালু করতে ক্লিক করুন'}
                          >
                            {un.isActive ? 'চালু আছে' : 'বন্ধ আছে'}
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUrgentNotice(un);
                              setUrgentForm({
                                title: un.title,
                                category: un.category || 'জরুরি',
                                date: un.date || '',
                                link: un.link || '',
                                isActive: un.isActive
                              });
                              setShowUrgentModal(true);
                            }}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 transition-colors"
                            title="সম্পাদনা"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`আপনি কি "${un.title}" জরুরি নোটিশটি মুছে ফেলতে চান?`)) {
                                deleteUrgentNotice(un.id);
                              }
                            }}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FACILITIES MANAGEMENT */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">আমাদের বিশেষ সুযোগ-সুবিধাসমূহ ব্যবস্থাপনা</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                      অবকাঠামো
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ওয়েবসাইটের হোমপেজে প্রদর্শিত মাদ্রাসার সুযোগ-সুবিধাসমূহ (ল্যাব, লাইব্রেরি, হোস্টেল ইত্যাদি) এখান থেকে নিয়ন্ত্রণ করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingFacility(null);
                      setFacilityForm({
                        title: '',
                        desc: '',
                        iconName: 'Laptop',
                        isActive: true
                      });
                      setShowFacilityModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00542c] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 text-[#DDAA00]" />
                    <span>নতুন সুযোগ-সুবিধা যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Facility Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-xs">
                    কোনো সুযোগ-সুবিধা যোগ করা নেই। নতুন সুবিধা যোগ করতে উপরের বাটনে ক্লিক করুন।
                  </div>
                ) : (
                  facilities.map((fac) => {
                    return (
                      <div
                        key={fac.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                          fac.isActive !== false
                            ? 'bg-white border-emerald-200 shadow-sm hover:border-emerald-500 hover:shadow-md'
                            : 'bg-slate-50/80 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold">
                              <Sparkles className="w-5 h-5 text-emerald-700" />
                            </div>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              আইকন: {fac.iconName}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-snug">
                              {fac.title}
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {fac.desc}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => toggleFacilityStatus(fac.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              fac.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {fac.isActive !== false ? 'সক্রিয় ✓' : 'বন্ধ ✕'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFacility(fac);
                                setFacilityForm({
                                  title: fac.title,
                                  desc: fac.desc,
                                  iconName: fac.iconName || 'Laptop',
                                  isActive: fac.isActive !== false
                                });
                                setShowFacilityModal(true);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 transition-colors"
                              title="সম্পাদনা"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`আপনি কি "${fac.title}" সুবিধাটি মুছে ফেলতে চান?`)) {
                                  deleteFacility(fac.id);
                                }
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 transition-colors"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: GALLERY MANAGEMENT */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">ফটো ও ইভেন্ট গ্যালারি ব্যবস্থাপনা</h2>
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      গ্যালারি
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    মাদ্রাসার বিভিন্ন অনুষ্ঠান, জাতীয় দিবস, ওয়াজ মাহফিল ও ক্যাম্পাসের স্থিরচিত্র যোগ, সম্পাদনা ও নিয়ন্ত্রণ করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/gallery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-300 transition-colors"
                  >
                    <span>গ্যালারি পেজ দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      setEditingGalleryItem(null);
                      setGalleryForm({
                        title: '',
                        category: 'ক্যাম্পাস',
                        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
                        date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
                      });
                      setShowGalleryModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00542c] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 text-[#DDAA00]" />
                    <span>নতুন ছবি যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills & Counter */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 mr-1">ফিল্টার:</span>
                  {['সকল', 'ক্যাম্পাস', 'অনুষ্ঠান', 'প্রতিযোগিতা', 'ক্লাস', 'সাধারণ'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        galleryCategoryFilter === cat
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  মোট ছবি: <span className="font-bold text-slate-800">{gallery.length}</span> টি
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gallery.filter(item => galleryCategoryFilter === 'সকল' || item.category === galleryCategoryFilter).length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-xs">
                    <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">এই ক্যাটাগরিতে কোনো ছবি নেই</p>
                    <p className="text-slate-500 text-xs mt-1">নতুন ছবি যুক্ত করতে &quot;নতুন ছবি যোগ করুন&quot; বাটনে চাপ দিন।</p>
                  </div>
                ) : (
                  gallery
                    .filter(item => galleryCategoryFilter === 'সকল' || item.category === galleryCategoryFilter)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                      >
                        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold bg-[#006837] text-white px-2 py-0.5 rounded shadow">
                              {item.category}
                            </span>
                          </div>
                          <div className="absolute bottom-2.5 right-2.5">
                            <span className="text-[10px] font-medium bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded">
                              {item.date}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-3 leading-snug">
                            {item.title}
                          </h4>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>বড় করে দেখুন</span>
                            </a>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingGalleryItem(item);
                                  setGalleryForm({
                                    title: item.title,
                                    category: item.category,
                                    imageUrl: item.imageUrl,
                                    date: item.date
                                  });
                                  setShowGalleryModal(true);
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 transition-colors"
                                title="সম্পাদনা"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`আপনি কি "${item.title}" ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?`)) {
                                    deleteGalleryItem(item.id);
                                  }
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 transition-colors"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TEACHERS MANAGEMENT */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">শিক্ষক ও স্টাফ তালিকা ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500">নতুন শিক্ষক যুক্ত করুন বা তথ্য আপডেট করুন</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTeacher(null);
                    setTeacherForm({
                      name: '',
                      designation: '',
                      qualification: '',
                      subject: '',
                      phone: '',
                      email: '',
                      image: ''
                    });
                    setShowTeacherModal(true);
                  }}
                  className="relative overflow-hidden group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-115" />
                  <span>নতুন শিক্ষক যুক্ত করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative border border-emerald-600 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            {t.designation}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5">{t.name}</h4>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mb-3">
                        <p><strong>যোগ্যতা:</strong> {t.qualification}</p>
                        <p><strong>বিষয়:</strong> {t.subject}</p>
                        <p><strong>ফোন:</strong> {t.phone}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTeacher(t);
                          setTeacherForm({
                            name: t.name,
                            designation: t.designation,
                            qualification: t.qualification,
                            subject: t.subject,
                            phone: t.phone,
                            email: t.email,
                            image: t.image
                          });
                          setShowTeacherModal(true);
                        }}
                        className="px-3 py-1 bg-white text-emerald-800 border border-slate-200 rounded text-xs font-bold"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${t.name}"-এর তথ্য মুছে ফেলতে চান?`)) {
                            deleteTeacher(t.id);
                          }
                        }}
                        className="px-3 py-1 bg-white text-rose-700 border border-slate-200 rounded text-xs font-bold"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESULTS MANAGEMENT */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">ফলাফল ও মার্কস ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500">অনলাইন পরীক্ষার ফলাফল ডেটাবেজ</p>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((res) => (
                  <div key={res.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {res.examName}
                        </span>
                        <h4 className="font-bold text-base text-slate-900 mt-1">
                          {res.studentName} (রোল: {res.rollNo}, রেজি: {res.regNo})
                        </h4>
                        <p className="text-xs text-slate-600">{res.classYear} • সেশন: {res.session}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-900">GPA {res.gpa.toFixed(2)}</span>
                        <span className="block text-xs font-bold text-amber-700">গ্রেড: {res.grade} ({res.resultStatus})</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                      <span>মোট বিষয়: {res.subjects.length}টি</span>
                      <span>প্রকাশের তারিখ: {res.publishDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">প্রাপ্ত বার্তা ও অনুসন্ধান</h2>
                  <p className="text-xs text-slate-500">যোগাযোগ পেইজ থেকে দর্শনার্থীদের পাঠানো বার্তা</p>
                </div>
              </div>

              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500 p-8 text-center">কোনো বার্তা নেই।</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        msg.isRead ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50/50 border-emerald-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {msg.name} <span className="font-mono text-emerald-800 text-xs font-normal">({msg.phone})</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold">{msg.subject || 'সাধারণ অনুসন্ধান'}</p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{msg.date}</span>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100 mb-3 leading-relaxed">
                        {msg.message}
                      </p>

                      <div className="flex justify-end gap-2 text-xs">
                        {!msg.isRead && (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="text-emerald-800 font-bold hover:underline"
                          >
                            পঠিত হিসেবে চিহ্নিত করুন
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('আপনি কি এই বার্তাটি মুছে ফেলতে চান?')) {
                              deleteMessage(msg.id);
                            }
                          }}
                          className="text-rose-600 font-bold hover:underline ml-3"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: AUTHORITIES SPEECHES */}
          {activeTab === 'authorities' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">কর্তৃপক্ষের বাণী ব্যবস্থাপনা</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                      দিকনির্দেশনামূলক বক্তব্য
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    মাদ্রাসার সুপারিনটেনডেন্ট এবং সভাপতির বাণী, নাম, পদবী ও ছবি এখান থেকে পরিবর্তন ও পরিচালনা করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/#principal-message"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-300 transition-colors"
                  >
                    <span>ওয়েবসাইটে দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {authoritySaved && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>কর্তৃপক্ষের বাণী সফলভাবে সংরক্ষণ করা হয়েছে! মূল ওয়েবসাইটে তা সরাসরি আপডেট হয়েছে।</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateInfo({
                    ...info,
                    principalName: authorityForm.principalName,
                    principalTitle: authorityForm.principalTitle,
                    principalMessage: authorityForm.principalMessage,
                    principalImage: authorityForm.principalImage,
                    presidentName: authorityForm.presidentName,
                    presidentTitle: authorityForm.presidentTitle,
                    presidentMessage: authorityForm.presidentMessage,
                    presidentImage: authorityForm.presidentImage
                  });
                  setAuthoritySaved(true);
                  setTimeout(() => setAuthoritySaved(false), 3000);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: সুপারিনটেনডেন্টের বাণী */}
                  <div className="bg-white rounded-2xl border-2 border-emerald-100 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-100 text-[#006837]">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">সুপারিনটেনডেন্টের বাণী</h3>
                          <p className="text-[11px] text-slate-500">প্রতিষ্ঠানের প্রধান কর্মকর্তার বক্তব্য ও তথ্য</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        প্রধান কর্ণধার
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        সুপারিনটেনডেন্টের নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={authorityForm.principalName}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, principalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        placeholder="যেমন: মাওলানা মোহাম্মদ রফিকুল ইসলাম"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        পদবী ও শিক্ষাগত যোগ্যতা <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={authorityForm.principalTitle}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, principalTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        placeholder="যেমন: সুপারিনটেনডেন্ট (কামিল, এম.এ)"
                      />
                    </div>

                    {/* Principal Photo */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 flex justify-between items-center">
                        <span>ছবি (Photo)</span>
                        {authorityForm.principalImage && (
                          <button
                            type="button"
                            onClick={() => setAuthorityForm({ ...authorityForm, principalImage: '' })}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" /> ছবি মুছুন
                          </button>
                        )}
                      </label>

                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 shrink-0 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={authorityForm.principalImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'}
                            alt="Principal Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400';
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <label
                            htmlFor="principal-file-input"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-[#006837] font-bold cursor-pointer text-xs transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>ডিভাইস থেকে ছবি আপলোড</span>
                            <input
                              id="principal-file-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (dataUrl) => {
                                    setAuthorityForm(prev => ({ ...prev, principalImage: dataUrl }));
                                  });
                                }
                              }}
                            />
                          </label>

                          <input
                            type="text"
                            value={authorityForm.principalImage.startsWith('data:') ? '[ডিভাইস থেকে ছবি সংযুক্ত]' : authorityForm.principalImage}
                            onChange={(e) => setAuthorityForm({ ...authorityForm, principalImage: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] font-mono"
                            placeholder="বা ছবির লিঙ্ক (URL) দিন..."
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বাণী ও বক্তব্য <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={authorityForm.principalMessage}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, principalMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                        placeholder="সুপারিনটেনডেন্টের দিকনির্দেশনামূলক বক্তব্য লিখুন..."
                      />
                    </div>
                  </div>

                  {/* Card 2: সভাপতির বাণী */}
                  <div className="bg-white rounded-2xl border-2 border-amber-100 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">সভাপতির বাণী</h3>
                          <p className="text-[11px] text-slate-500">পরিচালনা পর্ষদের সম্মানিত সভাপতির বক্তব্য ও তথ্য</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                        পরিচালনা পর্ষদ
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        সভাপতির নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={authorityForm.presidentName}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, presidentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        placeholder="যেমন: হাজী মোঃ নুরুল ইসলাম"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        পদবী <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={authorityForm.presidentTitle}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, presidentTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        placeholder="যেমন: সভাপতি, ম্যানেজিং কমিটি"
                      />
                    </div>

                    {/* President Photo */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 flex justify-between items-center">
                        <span>ছবি (Photo)</span>
                        {authorityForm.presidentImage && (
                          <button
                            type="button"
                            onClick={() => setAuthorityForm({ ...authorityForm, presidentImage: '' })}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" /> ছবি মুছুন
                          </button>
                        )}
                      </label>

                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-600 shrink-0 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={authorityForm.presidentImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                            alt="President Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400';
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <label
                            htmlFor="president-file-input"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-amber-600 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold cursor-pointer text-xs transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>ডিভাইস থেকে ছবি আপলোড</span>
                            <input
                              id="president-file-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (dataUrl) => {
                                    setAuthorityForm(prev => ({ ...prev, presidentImage: dataUrl }));
                                  });
                                }
                              }}
                            />
                          </label>

                          <input
                            type="text"
                            value={authorityForm.presidentImage.startsWith('data:') ? '[ডিভাইস থেকে ছবি সংযুক্ত]' : authorityForm.presidentImage}
                            onChange={(e) => setAuthorityForm({ ...authorityForm, presidentImage: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] font-mono"
                            placeholder="বা ছবির লিঙ্ক (URL) দিন..."
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বাণী ও বক্তব্য <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={authorityForm.presidentMessage}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, presidentMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                        placeholder="সভাপতির দিকনির্দেশনামূলক বক্তব্য লিখুন..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="relative overflow-hidden group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer btn-pulse-glow"
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    <Save className="w-4 h-4 text-[#DDAA00] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <span>কর্তৃপক্ষের বাণী সংরক্ষণ করুন (Save Changes)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">মাদ্রাসার সাধারণ তথ্য ও সেটিংস</h2>
                  <p className="text-xs text-slate-500">মাদ্রাসার নাম, কোড, ফোন, ঠিকানা ও বাণী পরিবর্তন করুন</p>
                </div>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে! সম্পূর্ণ ওয়েবসাইটে নতুন তথ্য হালনাগাদ করা হয়েছে।</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাদ্রাসার নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাদ্রাসার নাম (ইংরেজি)</label>
                    <input
                      type="text"
                      value={settingsForm.englishName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, englishName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">EIIN নম্বর</label>
                    <input
                      type="text"
                      value={settingsForm.eiin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, eiin: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাদ্রাসা কোড</label>
                    <input
                      type="text"
                      value={settingsForm.madrasahCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, madrasahCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">প্রধান ফোন নম্বর</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাদ্রাসার পূর্ণ ঠিকানা</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">সুপারিনটেনডেন্টের নাম ও পদবী</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="নাম"
                        value={settingsForm.principalName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, principalName: e.target.value })}
                        className="px-3 py-2 rounded-lg border text-xs"
                      />
                      <input
                        type="text"
                        placeholder="পদবী"
                        value={settingsForm.principalTitle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, principalTitle: e.target.value })}
                        className="px-3 py-2 rounded-lg border text-xs"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">সুপারিনটেনডেন্টের বাণী</label>
                    <textarea
                      rows={3}
                      value={settingsForm.principalMessage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, principalMessage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="relative overflow-hidden group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer btn-pulse-glow"
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-900">ডাটা ব্যাকআপ ও রিসেট ব্যবস্থাপনা</h2>
                <p className="text-xs text-slate-500">ওয়েবসাইটের সকল তথ্য এক্সপোর্ট করুন অথবা প্রয়োজন অনুযায়ী ডিফল্ট তথ্যে ফিরিয়ে আনুন</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">ব্যাকআপ ডাউনলোড করুন</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      বর্তমান সকল নোটিশ, শিক্ষক তালিকা, ভর্তি আবেদন ও সেটিংসের একটি ব্যাকআপ JSON ফাইল ডাউনলোড করুন।
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>JSON ব্যাকআপ ডাউনলোড</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-950 text-base">ডিফল্ট ডেমো তথ্যে রিসেট</h3>
                    <p className="text-xs text-rose-800 mt-1">
                      যদি কোনো ডাটা এলোমেলো হয়ে যায় তবে এক ক্লিকে প্রাথমিক অফিসিয়াল ডেমো তথ্যে ফিরে যেতে পারবেন।
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('আপনি কি নিশ্চিত যে সকল তথ্য প্রাথমিক ডেমো অবস্থায় ফিরিয়ে নিতে চান?')) {
                        resetToDefaults();
                        alert('ডাটা সফলভাবে প্রাথমিক অবস্থায় রিসেট করা হয়েছে!');
                      }
                    }}
                    className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>ফ্যাক্টরি রিসেট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Notice Add/Edit Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingNotice ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ তৈরি'}
              </h3>
              <button onClick={() => setShowNoticeModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs font-semibold"
                  placeholder="যেমন: বার্ষিক পরীক্ষার রুটিন সংক্রান্ত"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  >
                    <option value="পরীক্ষা">পরীক্ষা</option>
                    <option value="ভর্তি">ভর্তি</option>
                    <option value="ছুটি">ছুটি</option>
                    <option value="সাধারণ">সাধারণ</option>
                    <option value="জরুরি">জরুরি</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রকাশের তারিখ</label>
                  <input
                    type="text"
                    value={noticeForm.date}
                    onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কর্তৃপক্ষ / লেখক</label>
                <input
                  type="text"
                  value={noticeForm.author}
                  onChange={(e) => setNoticeForm({ ...noticeForm, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের বিস্তারিত বিবরণ</label>
                <textarea
                  required
                  rows={4}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="বিস্তারিত নোটিশ..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={noticeForm.isPinned}
                  onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                  className="rounded text-emerald-700"
                />
                <label htmlFor="pinCheck" className="text-xs font-bold text-slate-700">
                  উপরে পিন করে রাখুন (জরুরি হিসেবে দেখাবে)
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="submit"
                  className="relative overflow-hidden group px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer btn-pulse-glow"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Add/Edit Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTeacher ? 'শিক্ষকের তথ্য সম্পাদনা' : 'নতুন শিক্ষক যুক্তকরণ'}
              </h3>
              <button
                type="button"
                onClick={() => setShowTeacherModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 active:scale-90 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষকের পূর্ণ নাম</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  placeholder="যেমন: মাওলানা মোঃ সাইফুল ইসলাম"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পদবী</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="যেমন: সহকারী শিক্ষক"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পাঠদানের বিষয়</label>
                  <input
                    type="text"
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="যেমন: আরবি / গণিত"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={teacherForm.qualification}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    placeholder="যেমন: কামিল, এম.এ"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                    placeholder="017XXXXXXXX"
                  />
                </div>
              </div>

              {/* Photo Upload and Preview Section */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>শিক্ষকের ছবি (Teacher Photo)</span>
                  </label>
                  {teacherForm.image ? (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {teacherForm.image.startsWith('data:') ? 'ডিভাইস থেকে যুক্ত' : 'ছবি নির্বাচন করা হয়েছে'}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">
                      (ঐচ্ছিক - ডিফল্ট ছবি থাকবে)
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  {/* Photo Preview Circle with click-to-upload */}
                  <div className="relative group shrink-0">
                    <label
                      htmlFor="teacher-photo-file-input"
                      className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-emerald-600 shadow-sm bg-white flex flex-col items-center justify-center cursor-pointer hover:border-emerald-700 hover:scale-105 hover:shadow-lg hover:ring-4 hover:ring-emerald-400/25 active:scale-95 transition-all duration-200 group"
                      title="ছবি আপলোড করতে ক্লিক করুন"
                    >
                      {teacherForm.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={teacherForm.image}
                          alt="Teacher Preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                      ) : (
                        <div className="text-slate-400 flex flex-col items-center p-1 text-center">
                          <Camera className="w-6 h-6 text-emerald-700 mb-0.5 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-200" />
                          <span className="text-[9px] font-bold text-emerald-800 leading-tight">ছবি দিন</span>
                        </div>
                      )}
                    </label>

                    {teacherForm.image && (
                      <button
                        type="button"
                        onClick={() => setTeacherForm({ ...teacherForm, image: '' })}
                        className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md hover:scale-115 active:scale-90 transition-all duration-200 cursor-pointer"
                        title="ছবি মুছে ফেলুন"
                      >
                        <X className="w-3.5 h-3.5 transition-transform duration-200 hover:rotate-90" />
                      </button>
                    )}
                  </div>

                  {/* Device Upload Button & URL fallback */}
                  <div className="flex-1 w-full space-y-2">
                    <label
                      htmlFor="teacher-photo-file-input"
                      className="relative overflow-hidden group w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-dashed border-emerald-600 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-900 font-bold cursor-pointer transition-all duration-200 text-xs shadow-xs hover:shadow-md hover:border-emerald-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                    >
                      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                      <Upload className="w-4 h-4 text-emerald-700 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-115" />
                      <span>📁 ডিভাইস (মোবাইল / কম্পিউটার) থেকে ছবি আপলোড করুন</span>
                      <input
                        id="teacher-photo-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, (dataUrl) => {
                              setTeacherForm(prev => ({ ...prev, image: dataUrl }));
                            });
                          }
                        }}
                      />
                    </label>

                    {/* Or URL input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-500 font-medium">অথবা সরাসরি ছবির লিঙ্ক (Image URL):</span>
                        {teacherForm.image && (
                          <button
                            type="button"
                            onClick={() => setTeacherForm({ ...teacherForm, image: '' })}
                            className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline font-semibold transition-colors duration-150 active:scale-95"
                          >
                            ছবি ক্লিয়ার করুন
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={teacherForm.image.startsWith('data:') ? '[ডিভাইস থেকে ছবি আপলোড করা হয়েছে]' : teacherForm.image}
                        onChange={(e) => setTeacherForm({ ...teacherForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Avatars Quick Select */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1.5">
                    অথবা ডেমো প্রোফাইল ছবি থেকে এক ক্লিকে বেছে নিন:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: 'শিক্ষক (১)', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400' },
                      { label: 'শিক্ষক (২)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
                      { label: 'শিক্ষক (৩)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
                      { label: 'শিক্ষিকা', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' }
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTeacherForm(prev => ({ ...prev, image: sample.url }))}
                        className={`text-[10px] py-1.5 px-2 rounded-lg border transition-all duration-200 text-center font-medium cursor-pointer ${
                          teacherForm.image === sample.url
                            ? 'bg-emerald-800 text-white border-emerald-800 font-bold shadow-sm scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 hover:scale-105 active:scale-95 hover:shadow-xs'
                        }`}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="submit"
                  className="relative overflow-hidden group px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer btn-pulse-glow"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Application Detail Modal with Direct Print */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto print-area">
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <h3 className="font-bold text-slate-900 text-base">
                ভর্তি আবেদন বিস্তারিত — {selectedApp.id}
              </h3>
              <button onClick={() => setSelectedApp(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Slip Card */}
            <div className="text-center border-b-2 border-[#006837] pb-3 mb-4">
              <div className="flex justify-center items-center gap-3 mb-2">
                <div className="relative w-14 h-14 shrink-0 drop-shadow-md">
                  <Image
                    src="/logo.png"
                    alt={info.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-black text-[#006837]">{info.name}</h2>
                  <p className="text-xs font-bold text-[#003580]">{info.location || "দুপচাঁচিয়া, বগুড়া"}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600">{info.address} • EIIN: {info.eiin}</p>
              <span className="inline-block bg-[#006837] text-[#DDAA00] text-xs font-black px-4 py-0.5 rounded-full mt-2 border border-[#DDAA00]/40">
                ভর্তি আবেদন ফরম কপি
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                <p><strong>আইডি:</strong> {selectedApp.id}</p>
                <p><strong>শিক্ষার্থীর নাম:</strong> {selectedApp.studentNameBn}</p>
                <p><strong>ইংরেজি নাম:</strong> {selectedApp.studentNameEn}</p>
                <p><strong>জন্মনিবন্ধন:</strong> {selectedApp.birthRegNo}</p>
                <p><strong>জন্ম তারিখ:</strong> {selectedApp.dob}</p>
                <p><strong>লিঙ্গ:</strong> {selectedApp.gender}</p>
                <p><strong>আবেদনকৃত শ্রেণি:</strong> <span className="font-bold text-emerald-800">{selectedApp.applyingClass}</span></p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                <p><strong>পিতার নাম:</strong> {selectedApp.fatherName}</p>
                <p><strong>মোবাইল:</strong> {selectedApp.fatherPhone}</p>
                <p><strong>পিতার পেশা:</strong> {selectedApp.fatherOccupation}</p>
                <p><strong>মাতার নাম:</strong> {selectedApp.motherName}</p>
                <p><strong>ঠিকানা:</strong> {selectedApp.presentAddress}</p>
                <p><strong>অবস্থা:</strong> <span className="font-bold">{selectedApp.status}</span></p>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">অবস্থা পরিবর্তন:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    updateApplicationStatus(selectedApp.id, newStatus);
                    setSelectedApp({ ...selectedApp, status: newStatus });
                  }}
                  className="px-2 py-1 rounded border text-xs font-bold"
                >
                  <option value="অপেক্ষমান">অপেক্ষমান</option>
                  <option value="অনুমোদিত">অনুমোদিত</option>
                  <option value="বাতিল">বাতিল</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-600"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Notice Add/Edit Modal */}
      {showUrgentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-800" />
                <span>{editingUrgentNotice ? 'জরুরি নোটিশ সম্পাদনা' : 'নতুন জরুরি নোটিশ যোগ করুন'}</span>
              </h3>
              <button onClick={() => setShowUrgentModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!urgentForm.title.trim()) {
                  alert('অনুগ্রহ করে নোটিশের শিরোনাম লিখুন।');
                  return;
                }

                if (editingUrgentNotice) {
                  updateUrgentNotice(editingUrgentNotice.id, urgentForm);
                } else {
                  addUrgentNotice(urgentForm);
                }

                setShowUrgentModal(false);
                setEditingUrgentNotice(null);
                setUrgentForm({
                  title: '',
                  category: 'জরুরি',
                  date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
                  link: '',
                  isActive: true
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নোটিশের শিরোনাম / লেখা <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={urgentForm.title}
                  onChange={(e) => setUrgentForm({ ...urgentForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="যেমন: ২০২৬ শিক্ষাবর্ষে নূরানী, ইবতেদায়ী ও দাখিল শ্রেণিতে নতুন ভর্তি চলছে"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি ব্যাজ</label>
                  <select
                    value={urgentForm.category}
                    onChange={(e) => setUrgentForm({ ...urgentForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="ভর্তি">ভর্তি</option>
                    <option value="পরীক্ষা">পরীক্ষা</option>
                    <option value="জরুরি">জরুরি</option>
                    <option value="সাধারণ">সাধারণ</option>
                    <option value="ছুটি">ছুটি</option>
                    <option value="ফলাফল">ফলাফল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="text"
                    value={urgentForm.date}
                    onChange={(e) => setUrgentForm({ ...urgentForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    placeholder="যেমন: ১৫ অক্টোবর ২০২৬"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ক্লিক করলে যে লিংকে যাবে (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={urgentForm.link}
                  onChange={(e) => setUrgentForm({ ...urgentForm, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  placeholder="যেমন: /admission বা /notices বা /results"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  খালি রাখলে ক্লিক করলে ডিফল্ট নোটিশ পেজে যাবে।
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgent-active"
                  checked={urgentForm.isActive}
                  onChange={(e) => setUrgentForm({ ...urgentForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-800"
                />
                <label htmlFor="urgent-active" className="text-xs font-bold text-slate-800 cursor-pointer">
                  এই নোটিশটি স্ক্রলিং বারে সক্রিয় রাখুন
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUrgentModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="submit"
                  className="relative overflow-hidden group px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer btn-pulse-glow"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <span>{editingUrgentNotice ? 'পরিবর্তন সংরক্ষণ করুন' : 'যোগ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Facility Add/Edit Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>{editingFacility ? 'সুযোগ-সুবিধা সম্পাদনা' : 'নতুন সুযোগ-সুবিধা যোগ করুন'}</span>
              </h3>
              <button onClick={() => setShowFacilityModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!facilityForm.title.trim()) {
                  alert('অনুগ্রহ করে শিরোনাম লিখুন।');
                  return;
                }

                if (editingFacility) {
                  updateFacility(editingFacility.id, facilityForm);
                } else {
                  addFacility(facilityForm);
                }

                setShowFacilityModal(false);
                setEditingFacility(null);
                setFacilityForm({
                  title: '',
                  desc: '',
                  iconName: 'Laptop',
                  isActive: true
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সুযোগ-সুবিধার শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={facilityForm.title}
                  onChange={(e) => setFacilityForm({ ...facilityForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="যেমন: আধুনিক কম্পিউটার ল্যাব"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={facilityForm.desc}
                  onChange={(e) => setFacilityForm({ ...facilityForm, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="যেমন: মাল্টিমিডিয়া প্রজেক্টর ও উচ্চগতির ইন্টারনেট সংযোগসহ ডিজিটাল আইসিটি প্রশিক্ষণ।"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আইকন নির্বাচন করুন</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                  {[
                    { id: 'Laptop', label: 'কম্পিউটার' },
                    { id: 'Microscope', label: 'সায়েন্স' },
                    { id: 'Book', label: 'লাইব্রেরি' },
                    { id: 'Home', label: 'হোস্টেল' },
                    { id: 'Users', label: 'শিক্ষক' },
                    { id: 'Shield', label: 'নিরাপত্তা' },
                    { id: 'Droplets', label: 'পানি' },
                    { id: 'Trophy', label: 'ক্রীড়া' },
                    { id: 'Wifi', label: 'ইন্টারনেট' },
                    { id: 'Building', label: 'ভবন' },
                    { id: 'GraduationCap', label: 'শিক্ষা' },
                    { id: 'Heart', label: 'সেবা' }
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setFacilityForm({ ...facilityForm, iconName: ic.id })}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        facilityForm.iconName === ic.id
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] font-bold">{ic.label}</div>
                      <div className="text-[9px] opacity-75">{ic.id}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="facility-active"
                  checked={facilityForm.isActive}
                  onChange={(e) => setFacilityForm({ ...facilityForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-800"
                />
                <label htmlFor="facility-active" className="text-xs font-bold text-slate-800 cursor-pointer">
                  এই সুবিধাটি ওয়েবসাইটে সক্রিয় প্রদর্শন রাখুন
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="submit"
                  className="relative overflow-hidden group px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer btn-pulse-glow"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <span>{editingFacility ? 'পরিবর্তন সংরক্ষণ করুন' : 'যোগ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add/Edit Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingGalleryItem ? 'গ্যালারি ছবি সম্পাদনা' : 'গ্যালারিতে নতুন ছবি যোগ'}
                  </h3>
                  <p className="text-xs text-slate-500">ছবি এবং প্রদর্শন তথ্য পূরণ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!galleryForm.title.trim()) {
                  alert('অনুগ্রহ করে ছবির শিরোনাম লিখুন!');
                  return;
                }
                if (!galleryForm.imageUrl.trim()) {
                  alert('অনুগ্রহ করে ছবির লিঙ্ক (Image URL) প্রদান করুন!');
                  return;
                }

                if (editingGalleryItem) {
                  updateGalleryItem(editingGalleryItem.id, galleryForm);
                } else {
                  addGalleryItem(galleryForm);
                }

                setShowGalleryModal(false);
                setEditingGalleryItem(null);
                setGalleryForm({
                  title: '',
                  category: 'ক্যাম্পাস',
                  imageUrl: '',
                  date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ছবির শিরোনাম / বিবরণ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরষ্কার বিতরণী অনুষ্ঠান"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাটাগরি নির্বাচন <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                    <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                    <option value="প্রতিযোগিতা">প্রতিযোগিতা</option>
                    <option value="ক্লাস">ক্লাস</option>
                    <option value="সাধারণ">সাধারণ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    তারিখ / সময় <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={galleryForm.date}
                    onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="যেমন: অক্টোবর ২০২৬"
                  />
                </div>
              </div>

              {/* Photo Add / Upload Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ছবি নির্বাচন বা পরিবর্তন (Photo Upload / URL) <span className="text-rose-500">*</span></span>
                  {galleryForm.imageUrl && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ছবি সংযুক্ত আছে
                    </span>
                  )}
                </label>

                {/* Device File Upload Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label
                    htmlFor="gallery-file-input"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-600 bg-emerald-50/70 hover:bg-emerald-100 text-[#006837] font-bold cursor-pointer transition-all text-xs shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>📁 ডিভাইস (কম্পিউটার/মোবাইল) থেকে নতুন ছবি সিলেক্ট করুন</span>
                    <input
                      id="gallery-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (dataUrl) => {
                            setGalleryForm(prev => ({ ...prev, imageUrl: dataUrl }));
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Or enter Image URL */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">অথবা সরাসরি ছবির ওয়েব লিঙ্ক (Image URL) দিন:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={galleryForm.imageUrl.startsWith('data:') ? '[ডিভাইস থেকে ছবি আপলোড করা হয়েছে]' : galleryForm.imageUrl}
                      onChange={(e) => {
                        setGalleryForm({ ...galleryForm, imageUrl: e.target.value });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none pr-8"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    {galleryForm.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setGalleryForm({ ...galleryForm, imageUrl: '' })}
                        className="absolute right-2 top-2 text-slate-400 hover:text-rose-600 p-0.5"
                        title="ছবি রিমুভ করুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sample Images Quick Fill */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  নমুনা ও ডেমো ইমেজ থেকে এক ক্লিকে বেছে নিন:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'মিলাদ ও দোয়া', url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800' },
                    { label: 'ক্যাম্পাস ভবন', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800' },
                    { label: 'ক্বেরাত প্রতিযোগিতা', url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800' },
                    { label: 'কম্পিউটার ল্যাব', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' },
                    { label: 'বার্ষিক ক্রীড়া', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800' },
                    { label: 'বিজ্ঞান মেলা', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800' }
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGalleryForm({ ...galleryForm, imageUrl: sample.url })}
                      className="px-2 py-1 rounded bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-[10px] font-semibold text-slate-700 transition-colors text-center truncate"
                      title={sample.label}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview & Delete / Remove Photo Option */}
              {galleryForm.imageUrl ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700">ছবির প্রিভিউ (Preview):</span>
                    <button
                      type="button"
                      onClick={() => setGalleryForm({ ...galleryForm, imageUrl: '' })}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ছবি মুছুন (Remove Photo)</span>
                    </button>
                  </div>
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryForm.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => setGalleryForm({ ...galleryForm, imageUrl: '' })}
                        className="bg-black/70 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-lg shadow transition-colors flex items-center gap-1.5 text-[11px] font-bold"
                        title="ছবিটি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ছবি মুছুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 text-center bg-slate-50">
                  <label
                    htmlFor="gallery-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-700"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700">বর্তমানে কোনো ছবি সিলেক্ট করা নেই</span>
                    <span className="text-[11px] text-emerald-800 font-semibold underline">
                      কম্পিউটার/মোবাইল থেকে নতুন ছবি যোগ করতে এখানে ক্লিক করুন
                    </span>
                  </label>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-3 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div>
                  {editingGalleryItem && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`আপনি কি "${editingGalleryItem.title}" ছবিটি গ্যালারি থেকে সম্পূর্ণ মুছে ফেলতে চান?`)) {
                          deleteGalleryItem(editingGalleryItem.id);
                          setShowGalleryModal(false);
                          setEditingGalleryItem(null);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors w-full sm:w-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>গ্যালারি থেকে আইটেমটি মুছুন</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                    <span>বাতিল</span>
                  </button>
                  <button
                    type="submit"
                    className="relative overflow-hidden group px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer btn-pulse-glow"
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <span>{editingGalleryItem ? 'সংরক্ষণ করুন' : 'গ্যালারিতে যুক্ত করুন'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
