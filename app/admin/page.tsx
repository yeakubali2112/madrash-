'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMadrasah } from '@/context/MadrasahContext';
import confetti from 'canvas-confetti';
import {
  Notice,
  Teacher,
  AdmissionApplication,
  ResultRecord,
  ContactMessage,
  MadrasahInfo,
  UrgentNoticeItem,
  FacilityItem,
  GalleryItem,
  HeroSettings,
  defaultHeroSettings,
  HeroBannerSlide,
  defaultHeroSlides,
  PrayerTimeConfig,
  defaultPrayerConfig,
  AdminUser,
  availablePermissions,
  ClassRoutine,
  RoutinePeriod,
  defaultClassRoutines,
  AlumniStudent,
  defaultAlumniStudents,
  SubjectResult,
  StudentProfile,
  defaultStudents
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
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  KeyRound,
  ShieldAlert,
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
  UserCheck,
  Sliders,
  CheckCircle,
  MapPin,
  Image as ImageIcon,
  Layers,
  Info,
  ArrowUp,
  ArrowDown,
  Play,
  AlertTriangle,
  Compass,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  School,
  Globe,
  Phone,
  Mail,
  Briefcase,
  Filter,
  ChevronLeft,
  ChevronRight,
  Database,
  FileSpreadsheet,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured
} from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    isAdmin,
    isLoaded,
    logoutAdmin,
    adminUsers,
    currentAdminUser,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminUserStatus,
    switchAdminUser,
    restoreSuperAdmin,
    info,
    updateInfo,
    heroSettings,
    updateHeroSettings,
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
    updateResult,
    deleteResult,
    messages,
    markMessageRead,
    deleteMessage,
    prayerConfig,
    updatePrayerConfig,
    routines,
    addClassRoutine,
    updateClassRoutine,
    deleteClassRoutine,
    addPeriodToRoutine,
    updatePeriodInRoutine,
    deletePeriodFromRoutine,
    resetRoutinesToDefault,
    alumniStudents,
    addAlumniStudent,
    updateAlumniStudent,
    deleteAlumniStudent,
    resetAlumniToDefault,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    resetStudentsToDefault,
    isCloudConnected,
    uploadAllDataToCloud,
    refreshFromCloud
  } = useMadrasah();

  const [activeTab, setActiveTab] = useState<'overview' | 'hero' | 'admissions' | 'notices' | 'urgent-notices' | 'facilities' | 'gallery' | 'teachers' | 'attendance' | 'routine' | 'alumni' | 'students' | 'authorities' | 'results' | 'settings' | 'prayer' | 'messages' | 'users'>('overview');
  const [mounted, setMounted] = useState(false);

  // User Permission verification
  const isSuperAdminUser =
    !currentAdminUser ||
    currentAdminUser.isSuperAdmin === true ||
    currentAdminUser.username.toLowerCase() === 'admin' ||
    (currentAdminUser.role && String(currentAdminUser.role).toLowerCase().includes('সুপার'));

  const userPermissions = isSuperAdminUser
    ? availablePermissions.map(p => p.id)
    : (currentAdminUser?.permissions || []);

  const canAccessTab = (tabId: string) => {
    if (isSuperAdminUser) return true;
    return userPermissions.includes(tabId);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth - only after mounted and isLoaded from storage
  useEffect(() => {
    if (mounted && isLoaded && !isAdmin) {
      router.push('/admin/login');
    }
  }, [mounted, isLoaded, isAdmin, router]);

  // Ensure active tab is within user's allowed permissions
  useEffect(() => {
    if (mounted && !canAccessTab(activeTab)) {
      const firstAllowed = availablePermissions.find(p => canAccessTab(p.id))?.id;
      if (firstAllowed) {
        setActiveTab(firstAllowed as any);
      }
    }
  }, [activeTab, currentAdminUser, mounted]);

  // Universal Centered Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'হ্যাঁ, নিশ্চিত করুন',
    cancelLabel: 'বাতিল',
    type: 'danger',
    onConfirm: () => {}
  });

  const openConfirmModal = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || 'হ্যাঁ, নিশ্চিত করুন',
      cancelLabel: options.cancelLabel || 'বাতিল',
      type: options.type || 'danger',
      onConfirm: options.onConfirm
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Hero Section Form State
  const [heroForm, setHeroForm] = useState<HeroSettings>(heroSettings || defaultHeroSettings);
  const [heroSettingsSaved, setHeroSettingsSaved] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);

  useEffect(() => {
    if (heroSettings) {
      setHeroForm(heroSettings);
    }
  }, [heroSettings]);

  const handleHeroSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (heroSaving) return;
    setHeroSaving(true);
    setHeroSettingsSaved(false);

    setTimeout(() => {
      updateHeroSettings(heroForm);
      setHeroSaving(false);
      setHeroSettingsSaved(true);

      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#006837', '#DDAA00', '#10b981', '#ffffff']
        });
      } catch (err) {}

      setTimeout(() => setHeroSettingsSaved(false), 4000);
    }, 600);
  };

  const handleHeroReset = () => {
    openConfirmModal({
      title: 'ডিফল্ট সেটিংসে ফিরিয়ে নেওয়ার নিশ্চিতকরণ',
      message: 'আপনি কি হিরো সেকশনের সকল সেটিংস ও ব্যানার ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান? এতে আপনার কাস্টমাইজেশন রিসেট হয়ে যাবে।',
      confirmLabel: 'হ্যাঁ, রিসেট করুন',
      cancelLabel: 'বাতিল',
      type: 'warning',
      onConfirm: () => {
        setHeroForm(defaultHeroSettings);
        updateHeroSettings(defaultHeroSettings);
        setHeroSettingsSaved(true);
        setTimeout(() => setHeroSettingsSaved(false), 3000);
        closeConfirmModal();
      }
    });
  };

  // Hero Slide Management State
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroBannerSlide | null>(null);
  const [slideForm, setSlideForm] = useState<{
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    isActive: boolean;
  }>({
    imageUrl: '',
    title: '',
    subtitle: '',
    description: '',
    isActive: true
  });

  const sampleBanners = [
    {
      name: 'মাদ্রাসা ক্যাম্পাস',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920'
    },
    {
      name: 'হিফজ ও কুরআন পাঠ',
      url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1920'
    },
    {
      name: 'কম্পিউটার ও বিজ্ঞান ল্যাব',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920'
    },
    {
      name: 'সমাবেশ ও দোয়া মাহফিল',
      url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1920'
    }
  ];

  // Specialized image compressor for widescreen hero banners (max width 1600px, 0.82 quality)
  const handleBannerImageUpload = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const rawDataUrl = uploadEvent.target?.result as string;
      if (!rawDataUrl) return;

      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        const maxWidth = 1600;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
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

  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideForm({
      imageUrl: '',
      title: '',
      subtitle: '',
      description: '',
      isActive: true
    });
    setShowSlideModal(true);
  };

  const handleOpenEditSlide = (slide: HeroBannerSlide) => {
    setEditingSlide(slide);
    setSlideForm({
      imageUrl: slide.imageUrl,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      isActive: slide.isActive
    });
    setShowSlideModal(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.imageUrl.trim()) {
      alert('অনুগ্রহ করে ব্যানারের ছবির লিংক দিন অথবা ডিভাইস থেকে ছবি আপলোড করুন।');
      return;
    }

    const currentSlides = heroForm.slides || defaultHeroSlides;

    if (editingSlide) {
      const updatedSlides = currentSlides.map(s =>
        s.id === editingSlide.id
          ? {
              ...s,
              imageUrl: slideForm.imageUrl.trim(),
              title: slideForm.title.trim(),
              subtitle: slideForm.subtitle.trim(),
              description: slideForm.description.trim(),
              isActive: slideForm.isActive
            }
          : s
      );
      const updatedHeroForm = { ...heroForm, slides: updatedSlides };
      setHeroForm(updatedHeroForm);
      updateHeroSettings(updatedHeroForm);
    } else {
      const newSlide: HeroBannerSlide = {
        id: `slide-${Date.now()}`,
        imageUrl: slideForm.imageUrl.trim(),
        title: slideForm.title.trim(),
        subtitle: slideForm.subtitle.trim(),
        description: slideForm.description.trim(),
        isActive: slideForm.isActive,
        order: (currentSlides.length || 0) + 1
      };
      const updatedSlides = [...currentSlides, newSlide];
      const updatedHeroForm = { ...heroForm, slides: updatedSlides };
      setHeroForm(updatedHeroForm);
      updateHeroSettings(updatedHeroForm);
    }

    setShowSlideModal(false);
    setEditingSlide(null);
    setHeroSettingsSaved(true);
    setTimeout(() => setHeroSettingsSaved(false), 3000);
  };

  const handleDeleteSlide = (id: string) => {
    openConfirmModal({
      title: 'ফটো ব্যানার মুছে ফেলার নিশ্চিতকরণ',
      message: 'আপনি কি এই ফটো ব্যানারটি মুছে ফেলতে চান? মুছে ফেললে এটি ওয়েবসাইট ও ব্যানার স্লাইডশো থেকে স্থায়ীভাবে অপসারিত হবে।',
      confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
      cancelLabel: 'বাতিল',
      type: 'danger',
      onConfirm: () => {
        const currentSlides = heroForm.slides || defaultHeroSlides;
        const updatedSlides = currentSlides.filter(s => s.id !== id);
        const updatedHeroForm = { ...heroForm, slides: updatedSlides };
        setHeroForm(updatedHeroForm);
        updateHeroSettings(updatedHeroForm);
        setHeroSettingsSaved(true);
        setTimeout(() => setHeroSettingsSaved(false), 3000);
        closeConfirmModal();
      }
    });
  };

  const handleToggleSlideStatus = (id: string) => {
    const currentSlides = heroForm.slides || defaultHeroSlides;
    const updatedSlides = currentSlides.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    const updatedHeroForm = { ...heroForm, slides: updatedSlides };
    setHeroForm(updatedHeroForm);
    updateHeroSettings(updatedHeroForm);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const currentSlides = [...(heroForm.slides || defaultHeroSlides)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;

    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;

    const reordered = currentSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
    const updatedHeroForm = { ...heroForm, slides: reordered };
    setHeroForm(updatedHeroForm);
    updateHeroSettings(updatedHeroForm);
  };

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
  const [gallerySaving, setGallerySaving] = useState(false);
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
  const [teacherSaving, setTeacherSaving] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: '',
    qualification: '',
    subject: '',
    phone: '',
    email: '',
    image: ''
  });

  // Alumni (Old Students / প্রাক্তন শিক্ষার্থী) State
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniStudent | null>(null);
  const [viewingAlumni, setViewingAlumni] = useState<AlumniStudent | null>(null);
  const [alumniSearch, setAlumniSearch] = useState('');
  const [alumniYearFilter, setAlumniYearFilter] = useState('সকল');
  const [alumniExamFilter, setAlumniExamFilter] = useState('সকল');
  const [alumniGroupFilter, setAlumniGroupFilter] = useState('সকল');
  const [alumniBloodFilter, setAlumniBloodFilter] = useState('সকল');
  const [alumniViewMode, setAlumniViewMode] = useState<'table' | 'cards'>('table');
  const [alumniSaving, setAlumniSaving] = useState(false);
  const [alumniToast, setAlumniToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [alumniPage, setAlumniPage] = useState(1);
  const ALUMNI_PER_PAGE = 15;

  // Supabase Cloud Sync State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [cloudSqlCopied, setCloudSqlCopied] = useState(false);
  const [cloudToast, setCloudToast] = useState<{ show: boolean; message: string; type?: 'success' | 'error' }>({ show: false, message: '' });

  useEffect(() => {
    const cfg = getSupabaseConfig();
    setSupabaseUrlInput(cfg.url);
    setSupabaseKeyInput(cfg.anonKey);
  }, []);

  const handleSaveCloudConfig = async () => {
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setCloudSyncing(true);
    await refreshFromCloud();
    setCloudSyncing(false);
    setCloudToast({
      show: true,
      message: 'ক্লাউড ডাটাবেজ কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!',
      type: 'success'
    });
    setTimeout(() => setCloudToast({ show: false, message: '' }), 4000);
  };

  const handleUploadAllToCloud = async () => {
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      alert('দয়া করে প্রথমে Supabase Project URL এবং API Key প্রদান করুন');
      return;
    }
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setCloudSyncing(true);
    const success = await uploadAllDataToCloud();
    setCloudSyncing(false);
    if (success) {
      setCloudToast({
        show: true,
        message: 'সকল লোকাল ডাটা সফলভাবে সুপাবেজ ক্লাউডে আপলোড করা হয়েছে!',
        type: 'success'
      });
    } else {
      setCloudToast({
        show: true,
        message: 'ক্লাউড আপলোড ব্যর্থ হয়েছে। দয়া করে আপনার Supabase URL ও Key এবং madrasah_store টেবিল যাচাই করুন।',
        type: 'error'
      });
    }
    setTimeout(() => setCloudToast({ show: false, message: '' }), 5000);
  };

  const initialAlumniForm: Omit<AlumniStudent, 'id' | 'createdAt'> = {
    name: '',
    nameEn: '',
    passingYear: '২০২৪',
    examType: 'দাখিল পরীক্ষা',
    rollNo: '',
    regNo: '',
    gpa: '৫.০০ (A+)',
    group: 'সাধারণ বিভাগ',
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
    bloodGroup: 'A+',
    currentStatus: '',
    presentInstitute: '',
    address: 'পশ্চিম আলোহালী, সিংড়া, নাটোর',
    photo: '',
    achievements: ''
  };

  const [alumniForm, setAlumniForm] = useState<Omit<AlumniStudent, 'id' | 'createdAt'>>(initialAlumniForm);

  const handleOpenAddAlumni = () => {
    setEditingAlumni(null);
    setAlumniForm(initialAlumniForm);
    setShowAlumniModal(true);
  };

  const handleOpenEditAlumni = (student: AlumniStudent) => {
    setEditingAlumni(student);
    setAlumniForm({
      name: student.name || '',
      nameEn: student.nameEn || '',
      passingYear: student.passingYear || '২০২৪',
      examType: student.examType || 'দাখিল পরীক্ষা',
      rollNo: student.rollNo || '',
      regNo: student.regNo || '',
      gpa: student.gpa || '',
      group: student.group || 'সাধারণ বিভাগ',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      phone: student.phone || '',
      email: student.email || '',
      bloodGroup: student.bloodGroup || 'A+',
      currentStatus: student.currentStatus || '',
      presentInstitute: student.presentInstitute || '',
      address: student.address || '',
      photo: student.photo || '',
      achievements: student.achievements || ''
    });
    setShowAlumniModal(true);
  };

  const handleSaveAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (alumniSaving) return;
    if (!alumniForm.name.trim()) {
      alert('অনুগ্রহ করে শিক্ষার্থীর নাম প্রদান করুন');
      return;
    }

    setAlumniSaving(true);
    setTimeout(() => {
      if (editingAlumni) {
        updateAlumniStudent(editingAlumni.id, alumniForm);
        setAlumniToast({ show: true, message: `"${alumniForm.name}"-এর তথ্য সফলভাবে আপডেট করা হয়েছে!` });
      } else {
        addAlumniStudent(alumniForm);
        setAlumniToast({ show: true, message: `নতুন প্রাক্তন শিক্ষার্থী "${alumniForm.name}" সফলভাবে যুক্ত করা হয়েছে!` });
      }

      setAlumniSaving(false);
      setShowAlumniModal(false);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#006837', '#DDAA00', '#10b981', '#ffffff']
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setAlumniToast({ show: false, message: '' });
      }, 4000);
    }, 400);
  };

  const handleDeleteAlumni = (student: AlumniStudent) => {
    openConfirmModal({
      title: 'প্রাক্তন শিক্ষার্থীর তথ্য মুছে ফেলার নিশ্চিতকরণ',
      message: `আপনি কি "${student.name}" (পাসের সাল: ${student.passingYear})-এর সকল তথ্য ডাটাবেজ থেকে মুছে ফেলতে চান?`,
      confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
      cancelLabel: 'বাতিল',
      type: 'danger',
      onConfirm: () => {
        deleteAlumniStudent(student.id);
        closeConfirmModal();
        setAlumniToast({ show: true, message: `"${student.name}"-এর রেকর্ড মুছে ফেলা হয়েছে।` });
        setTimeout(() => setAlumniToast({ show: false, message: '' }), 3000);
      }
    });
  };

  // Filtered Alumni List
  const filteredAlumni = React.useMemo(() => {
    return (alumniStudents || []).filter(student => {
      const q = (alumniSearch || '').toLowerCase().trim();
      const searchMatch = !q ||
        (student.name || '').toLowerCase().includes(q) ||
        (student.nameEn || '').toLowerCase().includes(q) ||
        (student.rollNo || '').toLowerCase().includes(q) ||
        (student.regNo || '').toLowerCase().includes(q) ||
        (student.phone || '').toLowerCase().includes(q) ||
        (student.currentStatus || '').toLowerCase().includes(q) ||
        (student.presentInstitute || '').toLowerCase().includes(q) ||
        (student.address || '').toLowerCase().includes(q);

      const yearMatch = alumniYearFilter === 'সকল' || student.passingYear === alumniYearFilter;
      const examMatch = alumniExamFilter === 'সকল' || student.examType === alumniExamFilter;
      const groupMatch = alumniGroupFilter === 'সকল' || student.group === alumniGroupFilter;
      const bloodMatch = alumniBloodFilter === 'সকল' || student.bloodGroup === alumniBloodFilter;

      return searchMatch && yearMatch && examMatch && groupMatch && bloodMatch;
    });
  }, [alumniStudents, alumniSearch, alumniYearFilter, alumniExamFilter, alumniGroupFilter, alumniBloodFilter]);

  // Reset pagination when search or filters change
  React.useEffect(() => {
    setAlumniPage(1);
  }, [alumniSearch, alumniYearFilter, alumniExamFilter, alumniGroupFilter, alumniBloodFilter]);

  const totalAlumniPages = Math.max(1, Math.ceil(filteredAlumni.length / ALUMNI_PER_PAGE));
  const safeAlumniPage = Math.min(Math.max(1, alumniPage), totalAlumniPages);
  const paginatedAlumni = React.useMemo(() => {
    const startIndex = (safeAlumniPage - 1) * ALUMNI_PER_PAGE;
    return filteredAlumni.slice(startIndex, startIndex + ALUMNI_PER_PAGE);
  }, [filteredAlumni, safeAlumniPage]);

  // Unique Passing Years for Filter Dropdown
  const availablePassingYears = React.useMemo(() => {
    const years = Array.from(new Set((alumniStudents || []).map(s => s.passingYear).filter(Boolean)));
    return years.sort().reverse();
  }, [alumniStudents]);

  // Export Alumni to JSON file
  const handleExportAlumni = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alumniStudents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `madrasah_alumni_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Results Management State
  const [resultSearchQuery, setResultSearchQuery] = useState('');
  const [resultExamFilter, setResultExamFilter] = useState('all');
  const [resultClassFilter, setResultClassFilter] = useState('all');
  const [expandedResultIds, setExpandedResultIds] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [viewingResult, setViewingResult] = useState<ResultRecord | null>(null);
  const [resultToast, setResultToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Standard Subject Presets
  const dakhilSubjectsPreset: SubjectResult[] = [
    { name: 'কুরআন মাজীদ ও তাজবীদ', fullMarks: 100, obtainedMarks: 85, grade: 'A+', point: 5.0 },
    { name: 'হাদিস শরীফ ও উসূলে হাদিস', fullMarks: 100, obtainedMarks: 82, grade: 'A+', point: 5.0 },
    { name: 'আল-আকাইদ ও ফিকাহ্', fullMarks: 100, obtainedMarks: 80, grade: 'A+', point: 5.0 },
    { name: 'আরবি ১ম পত্র', fullMarks: 100, obtainedMarks: 78, grade: 'A', point: 4.0 },
    { name: 'আরবি ২য় পত্র', fullMarks: 100, obtainedMarks: 75, grade: 'A', point: 4.0 },
    { name: 'বাংলা ১ম ও ২য় পত্র', fullMarks: 100, obtainedMarks: 76, grade: 'A', point: 4.0 },
    { name: 'ইংরেজি ১ম ও ২য় পত্র', fullMarks: 100, obtainedMarks: 72, grade: 'A', point: 4.0 },
    { name: 'গণিত', fullMarks: 100, obtainedMarks: 84, grade: 'A+', point: 5.0 },
    { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', fullMarks: 50, obtainedMarks: 45, grade: 'A+', point: 5.0 }
  ];

  const generalJuniorSubjectsPreset: SubjectResult[] = [
    { name: 'কুরআন মাজীদ ও আকাইদ-ফিকহ', fullMarks: 100, obtainedMarks: 80, grade: 'A+', point: 5.0 },
    { name: 'আরবি', fullMarks: 100, obtainedMarks: 75, grade: 'A', point: 4.0 },
    { name: 'বাংলা', fullMarks: 100, obtainedMarks: 78, grade: 'A', point: 4.0 },
    { name: 'ইংরেজি', fullMarks: 100, obtainedMarks: 70, grade: 'A', point: 4.0 },
    { name: 'গণিত', fullMarks: 100, obtainedMarks: 82, grade: 'A+', point: 5.0 },
    { name: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMarks: 100, obtainedMarks: 76, grade: 'A', point: 4.0 },
    { name: 'সাধারণ বিজ্ঞান', fullMarks: 100, obtainedMarks: 80, grade: 'A+', point: 5.0 },
    { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', fullMarks: 50, obtainedMarks: 42, grade: 'A', point: 4.0 }
  ];

  const initialResultForm: {
    studentName: string;
    rollNo: string;
    regNo: string;
    examName: string;
    classYear: string;
    session: string;
    publishDate: string;
    subjects: SubjectResult[];
    gpa: number;
    grade: string;
    resultStatus: 'উত্তীর্ণ' | 'অনুত্তীর্ণ';
  } = {
    studentName: '',
    rollNo: '',
    regNo: '',
    examName: 'দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬',
    classYear: '১০ম শ্রেণি (দাখিল)',
    session: '২০২৫-২০২৬',
    publishDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    subjects: [
      { name: 'কুরআন মাজীদ ও তাজবীদ', fullMarks: 100, obtainedMarks: 80, grade: 'A+', point: 5.0 },
      { name: 'হাদিস শরীফ', fullMarks: 100, obtainedMarks: 75, grade: 'A', point: 4.0 },
      { name: 'বাংলা', fullMarks: 100, obtainedMarks: 72, grade: 'A', point: 4.0 },
      { name: 'ইংরেজি', fullMarks: 100, obtainedMarks: 68, grade: 'A-', point: 3.5 },
      { name: 'গণিত', fullMarks: 100, obtainedMarks: 85, grade: 'A+', point: 5.0 }
    ],
    gpa: 4.5,
    grade: 'A',
    resultStatus: 'উত্তীর্ণ'
  };

  const [resultForm, setResultForm] = useState(initialResultForm);

  // Helper to calculate grade and point from marks
  const calcGradeAndPoint = (obtained: number, full: number): { grade: string; point: number } => {
    if (full <= 0) return { grade: 'F', point: 0.0 };
    const pct = (obtained / full) * 100;
    if (pct >= 80) return { grade: 'A+', point: 5.0 };
    if (pct >= 70) return { grade: 'A', point: 4.0 };
    if (pct >= 60) return { grade: 'A-', point: 3.5 };
    if (pct >= 50) return { grade: 'B', point: 3.0 };
    if (pct >= 40) return { grade: 'C', point: 2.0 };
    if (pct >= 33) return { grade: 'D', point: 1.0 };
    return { grade: 'F', point: 0.0 };
  };

  // Helper to calculate GPA, Grade and Status from list of subjects
  const calculateOverallResult = (subs: SubjectResult[]) => {
    if (!subs || subs.length === 0) {
      return { gpa: 0, grade: 'F', resultStatus: 'অনুত্তীর্ণ' as const };
    }
    const hasFail = subs.some(s => s.point === 0);
    if (hasFail) {
      return { gpa: 0.0, grade: 'F', resultStatus: 'অনুত্তীর্ণ' as const };
    }
    const totalPoints = subs.reduce((acc, s) => acc + (s.point || 0), 0);
    const avg = totalPoints / subs.length;
    const gpa = Math.min(5.0, Math.round(avg * 100) / 100);
    let grade = 'F';
    if (gpa >= 5.0) grade = 'A+';
    else if (gpa >= 4.0) grade = 'A';
    else if (gpa >= 3.5) grade = 'A-';
    else if (gpa >= 3.0) grade = 'B';
    else if (gpa >= 2.0) grade = 'C';
    else if (gpa >= 1.0) grade = 'D';

    return {
      gpa,
      grade,
      resultStatus: 'উত্তীর্ণ' as const
    };
  };

  const showResultNotification = (msg: string) => {
    setResultToast({ show: true, message: msg });
    setTimeout(() => {
      setResultToast({ show: false, message: '' });
    }, 3500);
  };

  const handleOpenAddResult = () => {
    setEditingResultId(null);
    setResultForm({
      ...initialResultForm,
      publishDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    setShowResultModal(true);
  };

  const handleOpenEditResult = (res: ResultRecord) => {
    setEditingResultId(res.id);
    setResultForm({
      studentName: res.studentName,
      rollNo: res.rollNo,
      regNo: res.regNo || '',
      examName: res.examName,
      classYear: res.classYear,
      session: res.session,
      publishDate: res.publishDate,
      subjects: res.subjects && res.subjects.length > 0 ? JSON.parse(JSON.stringify(res.subjects)) : [],
      gpa: res.gpa,
      grade: res.grade,
      resultStatus: res.resultStatus
    });
    setShowResultModal(true);
  };

  const handleDeleteResult = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}"-এর ফলাফল মুছে ফেলতে চান?`)) {
      deleteResult(id);
      showResultNotification('ফলাফল সফলভাবে মুছে ফেলা হয়েছে!');
    }
  };

  const handleSubjectChange = (index: number, field: keyof SubjectResult, val: any) => {
    const updated = [...resultForm.subjects];
    const item = { ...updated[index], [field]: val };
    
    // Auto-update grade and point if fullMarks or obtainedMarks changes
    if (field === 'obtainedMarks' || field === 'fullMarks') {
      const full = field === 'fullMarks' ? Number(val) : item.fullMarks;
      const obtained = field === 'obtainedMarks' ? Number(val) : item.obtainedMarks;
      const calc = calcGradeAndPoint(obtained, full);
      item.grade = calc.grade;
      item.point = calc.point;
    }
    updated[index] = item;
    
    // Auto calculate overall gpa
    const overall = calculateOverallResult(updated);
    setResultForm({
      ...resultForm,
      subjects: updated,
      gpa: overall.gpa,
      grade: overall.grade,
      resultStatus: overall.resultStatus
    });
  };

  const handleAddSubjectRow = () => {
    const newSub: SubjectResult = {
      name: '',
      fullMarks: 100,
      obtainedMarks: 0,
      grade: 'F',
      point: 0.0
    };
    const updated = [...resultForm.subjects, newSub];
    setResultForm({ ...resultForm, subjects: updated });
  };

  const handleRemoveSubjectRow = (index: number) => {
    const updated = resultForm.subjects.filter((_, i) => i !== index);
    const overall = calculateOverallResult(updated);
    setResultForm({
      ...resultForm,
      subjects: updated,
      gpa: overall.gpa,
      grade: overall.grade,
      resultStatus: overall.resultStatus
    });
  };

  const handleLoadSubjectPreset = (preset: SubjectResult[]) => {
    const clone = JSON.parse(JSON.stringify(preset));
    const overall = calculateOverallResult(clone);
    setResultForm({
      ...resultForm,
      subjects: clone,
      gpa: overall.gpa,
      grade: overall.grade,
      resultStatus: overall.resultStatus
    });
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.studentName.trim() || !resultForm.rollNo.trim()) {
      alert('শিক্ষার্থীর নাম ও রোল নম্বর অবশ্যই পূরণ করতে হবে!');
      return;
    }

    if (editingResultId) {
      updateResult(editingResultId, {
        studentName: resultForm.studentName.trim(),
        rollNo: resultForm.rollNo.trim(),
        regNo: resultForm.regNo.trim(),
        examName: resultForm.examName.trim(),
        classYear: resultForm.classYear.trim(),
        session: resultForm.session.trim(),
        publishDate: resultForm.publishDate.trim(),
        subjects: resultForm.subjects,
        gpa: Number(resultForm.gpa),
        grade: resultForm.grade.trim(),
        resultStatus: resultForm.resultStatus
      });
      showResultNotification(`"${resultForm.studentName}"-এর ফলাফল সফলভাবে আপডেট হয়েছে!`);
    } else {
      addResult({
        studentName: resultForm.studentName.trim(),
        rollNo: resultForm.rollNo.trim(),
        regNo: resultForm.regNo.trim(),
        examName: resultForm.examName.trim(),
        classYear: resultForm.classYear.trim(),
        session: resultForm.session.trim(),
        publishDate: resultForm.publishDate.trim(),
        subjects: resultForm.subjects,
        gpa: Number(resultForm.gpa),
        grade: resultForm.grade.trim(),
        resultStatus: resultForm.resultStatus
      });
      showResultNotification(`"${resultForm.studentName}"-এর নতুন ফলাফল সফলভাবে যোগ করা হয়েছে!`);
    }

    setShowResultModal(false);
    setEditingResultId(null);
  };

  const toggleResultExpand = (id: string) => {
    setExpandedResultIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Student Profile Management State
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const [studentBloodFilter, setStudentBloodFilter] = useState('all');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [viewingStudentProfile, setViewingStudentProfile] = useState<StudentProfile | null>(null);
  const [studentToast, setStudentToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [isCompressingStudentPhoto, setIsCompressingStudentPhoto] = useState(false);

  const initialStudentForm: {
    name: string;
    nameEn: string;
    phone: string;
    photo: string;
    address: string;
    fatherName: string;
    motherName: string;
    classYear: string;
    rollNo: string;
    regNo: string;
    session: string;
    bloodGroup: string;
    gender: string;
    birthDate: string;
    guardianPhone: string;
    attendanceRate: string;
    feeStatus: string;
    status: string;
  } = {
    name: '',
    nameEn: '',
    phone: '',
    photo: '',
    address: 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
    fatherName: '',
    motherName: '',
    classYear: '১০ম শ্রেণি (দাখিল)',
    rollNo: '',
    regNo: '',
    session: '২০২৫-২০২৬',
    bloodGroup: 'B+',
    gender: 'ছাত্র',
    birthDate: '',
    guardianPhone: '',
    attendanceRate: '৯৫%',
    feeStatus: 'পরিশোধিত',
    status: 'নিয়মিত'
  };

  const [studentForm, setStudentForm] = useState(initialStudentForm);

  const showStudentNotification = (msg: string) => {
    setStudentToast({ show: true, message: msg });
    setTimeout(() => {
      setStudentToast({ show: false, message: '' });
    }, 3500);
  };

  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setStudentForm({ ...initialStudentForm });
    setShowStudentModal(true);
  };

  const handleOpenEditStudent = (std: StudentProfile) => {
    setEditingStudentId(std.id || null);
    setStudentForm({
      name: std.name || '',
      nameEn: std.nameEn || '',
      phone: std.phone || '',
      photo: std.photo || '',
      address: std.address || 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া',
      fatherName: std.fatherName || '',
      motherName: std.motherName || '',
      classYear: std.classYear || '১০ম শ্রেণি (দাখিল)',
      rollNo: std.rollNo || '',
      regNo: std.regNo || '',
      session: std.session || '২০২৫-২০২৬',
      bloodGroup: std.bloodGroup || 'B+',
      gender: std.gender || 'ছাত্র',
      birthDate: std.birthDate || '',
      guardianPhone: std.guardianPhone || '',
      attendanceRate: std.attendanceRate || '৯৫%',
      feeStatus: std.feeStatus || 'পরিশোধিত',
      status: std.status || 'নিয়মিত'
    });
    setShowStudentModal(true);
  };

  const handleCreateStudentFromApplication = (app: AdmissionApplication) => {
    const addr = app.presentVillage
      ? `${app.presentVillage}, ${app.presentPost || ''}, ${app.presentUpazila || 'দুপচাঁচিয়া'}, ${app.presentDistrict || 'বগুড়া'}`
      : 'পশ্চিম আলোহালী, দুপচাঁচিয়া, বগুড়া';
    setEditingStudentId(null);
    setStudentForm({
      ...initialStudentForm,
      name: app.studentNameBn || '',
      nameEn: app.studentNameEn || '',
      phone: app.fatherPhone || '',
      fatherName: app.fatherNameBn || '',
      motherName: app.motherNameBn || '',
      classYear: app.applyingClass || '৬ষ্ঠ শ্রেণি',
      gender: app.gender === 'ছাত্রী' ? 'ছাত্রী' : 'ছাত্র',
      birthDate: app.birthDate || '',
      bloodGroup: app.bloodGroup || 'B+',
      guardianPhone: app.emergencyContact || app.fatherPhone || '',
      address: addr,
      photo: app.studentPhoto || ''
    });
    setShowStudentModal(true);
  };

  const handleDeleteStudent = (id: string | undefined, name: string) => {
    if (!id) return;
    if (confirm(`আপনি কি নিশ্চিত যে "${name}"-এর প্রোফাইল মুছে ফেলতে চান?`)) {
      deleteStudent(id);
      showStudentNotification('শিক্ষার্থীর প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!');
    }
  };

  const handleStudentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingStudentPhoto(true);
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
            const base64 = canvas.toDataURL('image/jpeg', 0.82);
            setStudentForm(prev => ({ ...prev, photo: base64 }));
          }
          setIsCompressingStudentPhoto(false);
        };
      };
    } catch (err) {
      console.error('Photo compress error:', err);
      setIsCompressingStudentPhoto(false);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim() || !studentForm.rollNo.trim()) {
      alert('শিক্ষার্থীর নাম ও রোল নম্বর অবশ্যই পূরণ করতে হবে!');
      return;
    }

    if (editingStudentId) {
      updateStudent(editingStudentId, {
        name: studentForm.name.trim(),
        nameEn: studentForm.nameEn.trim(),
        phone: studentForm.phone.trim(),
        photo: studentForm.photo,
        address: studentForm.address.trim(),
        fatherName: studentForm.fatherName.trim(),
        motherName: studentForm.motherName.trim(),
        classYear: studentForm.classYear.trim(),
        rollNo: studentForm.rollNo.trim(),
        regNo: studentForm.regNo.trim(),
        session: studentForm.session.trim(),
        bloodGroup: studentForm.bloodGroup,
        gender: studentForm.gender,
        birthDate: studentForm.birthDate.trim(),
        guardianPhone: studentForm.guardianPhone.trim(),
        attendanceRate: studentForm.attendanceRate.trim() || '৯৫%',
        feeStatus: studentForm.feeStatus,
        status: studentForm.status
      });
      showStudentNotification(`"${studentForm.name}"-এর প্রোফাইল সফলভাবে আপডেট হয়েছে!`);
    } else {
      addStudent({
        name: studentForm.name.trim(),
        nameEn: studentForm.nameEn.trim(),
        phone: studentForm.phone.trim(),
        photo: studentForm.photo,
        address: studentForm.address.trim(),
        fatherName: studentForm.fatherName.trim(),
        motherName: studentForm.motherName.trim(),
        classYear: studentForm.classYear.trim(),
        rollNo: studentForm.rollNo.trim(),
        regNo: studentForm.regNo.trim(),
        session: studentForm.session.trim(),
        bloodGroup: studentForm.bloodGroup,
        gender: studentForm.gender,
        birthDate: studentForm.birthDate.trim(),
        guardianPhone: studentForm.guardianPhone.trim(),
        attendanceRate: studentForm.attendanceRate.trim() || '৯৫%',
        feeStatus: studentForm.feeStatus,
        status: studentForm.status
      });
      showStudentNotification(`"${studentForm.name}"-এর নতুন শিক্ষার্থী প্রোফাইল সফলভাবে তৈরি হয়েছে!`);
    }

    setShowStudentModal(false);
    setEditingStudentId(null);
  };

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<MadrasahInfo>(info);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Prayer Schedule Form State
  const [prayerForm, setPrayerForm] = useState<PrayerTimeConfig>(prayerConfig || defaultPrayerConfig);
  const [prayerSaved, setPrayerSaved] = useState(false);
  const [prayerSaving, setPrayerSaving] = useState(false);

  useEffect(() => {
    if (prayerConfig) {
      setPrayerForm(prayerConfig);
    }
  }, [prayerConfig]);

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prayerSaving) return;
    setPrayerSaving(true);
    setPrayerSaved(false);

    setTimeout(() => {
      updatePrayerConfig(prayerForm);
      setPrayerSaving(false);
      setPrayerSaved(true);

      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#006837', '#DDAA00', '#10b981', '#ffffff']
        });
      } catch (err) {
        // fallback
      }

      setTimeout(() => setPrayerSaved(false), 4000);
    }, 600);
  };

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
  const [authoritySaving, setAuthoritySaving] = useState(false);

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

  // ==========================================
  // ADMIN USERS & PERMISSIONS MANAGEMENT STATE
  // ==========================================
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState<{
    name: string;
    username: string;
    password: string;
    role: string;
    phone: string;
    email: string;
    isActive: boolean;
    permissions: string[];
  }>({
    name: '',
    username: '',
    password: '',
    role: 'সহকারী অ্যাডমিন / ইনচার্জ',
    phone: '',
    email: '',
    isActive: true,
    permissions: ['overview', 'attendance', 'notices']
  });
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalPermCategory, setModalPermCategory] = useState<'all' | 'academic' | 'core' | 'media' | 'system'>('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [userToast, setUserToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      username: '',
      password: '',
      role: 'সহকারী অ্যাডমিন / ইনচার্জ',
      phone: '',
      email: '',
      isActive: true,
      permissions: ['overview', 'attendance', 'notices']
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      phone: user.phone || '',
      email: user.email || '',
      isActive: user.isActive,
      permissions: user.permissions || []
    });
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim()) {
      alert('অনুগ্রহ করে ব্যবহারকারীর পূর্ণ নাম লিখুন।');
      return;
    }
    const cleanUsername = userForm.username.trim().toLowerCase();
    if (!cleanUsername) {
      alert('অনুগ্রহ করে ইউজারনেম দিন।');
      return;
    }
    if (!userForm.password.trim()) {
      alert('অনুগ্রহ করে পাসওয়ার্ড দিন।');
      return;
    }

    const duplicate = adminUsers.find(
      u => u.username.toLowerCase() === cleanUsername && (!editingUser || u.id !== editingUser.id)
    );
    if (duplicate) {
      alert(`"${cleanUsername}" ইউজারনেমটি ইতিমধ্যে বিদ্যমান! অনুগ্রহ করে অন্য ইউজারনেম দিন।`);
      return;
    }

    if (userForm.permissions.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি অপশন বা পারমিশন নির্বাচন করুন।');
      return;
    }

    if (editingUser) {
      updateAdminUser(editingUser.id, {
        name: userForm.name.trim(),
        username: cleanUsername,
        password: userForm.password.trim(),
        role: userForm.role.trim() || 'সহকারী অ্যাডমিন',
        phone: userForm.phone.trim(),
        email: userForm.email.trim(),
        isActive: userForm.isActive,
        permissions: editingUser.isSuperAdmin ? availablePermissions.map(p => p.id) : userForm.permissions
      });
      setUserToast({ show: true, message: `"${userForm.name}"-এর প্রোফাইল ও পারমিশন সফলভাবে আপডেট হয়েছে!` });
    } else {
      addAdminUser({
        name: userForm.name.trim(),
        username: cleanUsername,
        password: userForm.password.trim(),
        role: userForm.role.trim() || 'সহকারী অ্যাডমিন',
        phone: userForm.phone.trim(),
        email: userForm.email.trim(),
        isActive: userForm.isActive,
        isSuperAdmin: false,
        permissions: userForm.permissions
      });
      setUserToast({ show: true, message: `নতুন প্রোফাইল "${userForm.name}" সফলভাবে তৈরি করা হয়েছে!` });
    }

    setShowUserModal(false);
    setEditingUser(null);
    setTimeout(() => setUserToast({ show: false, message: '' }), 3500);
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (user.isSuperAdmin) {
      alert('প্রধান সুপার অ্যাডমিন প্রোফাইল মুছে ফেলা যাবে না!');
      return;
    }
    openConfirmModal({
      title: 'প্রোফাইল মুছে ফেলার নিশ্চিতকরণ',
      message: `আপনি কি নিশ্চিতভাবে "${user.name}" (${user.username}) প্রোফাইলটি মুছে ফেলতে চান? মুছে ফেললে তিনি আর অ্যাডমিন প্যানেলে লগইন করতে পারবেন না।`,
      confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
      cancelLabel: 'বাতিল',
      type: 'danger',
      onConfirm: () => {
        deleteAdminUser(user.id);
        setUserToast({ show: true, message: `"${user.name}" প্রোফাইলটি সফলভাবে মুছে ফেলা হয়েছে!` });
        setTimeout(() => setUserToast({ show: false, message: '' }), 3500);
        closeConfirmModal();
      }
    });
  };

  const handleToggleUserActive = (user: AdminUser) => {
    if (user.isSuperAdmin) {
      alert('সুপার অ্যাডমিন প্রোফাইল নিষ্ক্রিয় করা যাবে না!');
      return;
    }
    toggleAdminUserStatus(user.id);
    setUserToast({
      show: true,
      message: `"${user.name}" প্রোফাইলটি ${user.isActive ? 'নিষ্ক্রিয়' : 'সক্রিয়'} করা হয়েছে!`
    });
    setTimeout(() => setUserToast({ show: false, message: '' }), 3500);
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const togglePermission = (permId: string) => {
    setUserForm(prev => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter(p => p !== permId)
          : [...prev.permissions, permId]
      };
    });
  };

  const selectAllPermissions = () => {
    setUserForm(prev => ({
      ...prev,
      permissions: availablePermissions.map(p => p.id)
    }));
  };

  const selectAcademicPreset = () => {
    setUserForm(prev => ({
      ...prev,
      permissions: ['overview', 'attendance', 'teachers', 'results', 'admissions']
    }));
  };

  const selectMediaPreset = () => {
    setUserForm(prev => ({
      ...prev,
      permissions: ['overview', 'notices', 'urgent-notices', 'hero', 'facilities', 'gallery', 'authorities']
    }));
  };

  const deselectAllPermissions = () => {
    setUserForm(prev => ({
      ...prev,
      permissions: ['overview']
    }));
  };

  const filteredUsers = adminUsers.filter(user => {
    const q = userSearchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q) ||
      (user.phone || '').includes(q);
    const matchesStatus =
      userStatusFilter === 'all'
        ? true
        : userStatusFilter === 'active'
        ? user.isActive
        : !user.isActive;
    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // CLASS ROUTINE MANAGEMENT STATE & HANDLERS
  // ==========================================
  const [selectedRoutineClassId, setSelectedRoutineClassId] = useState<string>('');
  const activeRoutine = (routines || []).find(r => r.id === selectedRoutineClassId) || (routines && routines[0]) || null;

  // Class Add/Edit Modal
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassRoutine, setEditingClassRoutine] = useState<ClassRoutine | null>(null);
  const [classForm, setClassForm] = useState({
    className: '',
    effectiveDate: '০১ জানুয়ারি ২০২৬',
    notes: 'বিশেষ প্রয়োজনে কর্তৃপক্ষ রুটিন পরিবর্তনের ক্ষমতা সংরক্ষণ করে।'
  });

  // Period Add/Edit Modal
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<RoutinePeriod | null>(null);
  const [periodForm, setPeriodForm] = useState({
    period: '১ম ঘণ্টা',
    time: '০৯:১৫ - ১০:০০',
    subject: '',
    teacher: '',
    room: ''
  });

  const [routineToast, setRoutineToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const showRoutineAlert = (message: string) => {
    setRoutineToast({ show: true, message });
    setTimeout(() => setRoutineToast({ show: false, message: '' }), 3500);
  };

  const handleOpenAddClass = () => {
    setEditingClassRoutine(null);
    setClassForm({
      className: '',
      effectiveDate: '০১ জানুয়ারি ২০২৬',
      notes: 'বিশেষ প্রয়োজনে কর্তৃপক্ষ রুটিন পরিবর্তনের ক্ষমতা সংরক্ষণ করে।'
    });
    setShowClassModal(true);
  };

  const handleOpenEditClass = (routine: ClassRoutine) => {
    setEditingClassRoutine(routine);
    setClassForm({
      className: routine.className,
      effectiveDate: routine.effectiveDate || '০১ জানুয়ারি ২০২৬',
      notes: routine.notes || ''
    });
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = classForm.className.trim();
    if (!cleanName) {
      alert('অনুগ্রহ করে শ্রেণির নাম লিখুন।');
      return;
    }

    if (editingClassRoutine) {
      updateClassRoutine(editingClassRoutine.id, {
        className: cleanName,
        effectiveDate: classForm.effectiveDate.trim(),
        notes: classForm.notes.trim()
      });
      showRoutineAlert(`"${cleanName}" শ্রেণির তথ্য আপডেট করা হয়েছে!`);
    } else {
      const exists = routines.some(r => r.className.toLowerCase() === cleanName.toLowerCase());
      if (exists) {
        alert('এই নামের শ্রেণি রুটিনে ইতিমধ্যে বিদ্যমান আছে!');
        return;
      }
      addClassRoutine({
        className: cleanName,
        effectiveDate: classForm.effectiveDate.trim(),
        notes: classForm.notes.trim(),
        periods: []
      });
      showRoutineAlert(`নতুন শ্রেণি "${cleanName}" যুক্ত করা হয়েছে!`);
    }
    setShowClassModal(false);
  };

  const handleDeleteClass = (routine: ClassRoutine) => {
    openConfirmModal({
      title: 'শ্রেণির রুটিন মুছে ফেলা',
      message: `আপনি কি নিশ্চিত যে "${routine.className}" শ্রেণির সম্পূর্ণ রুটিন মুছে ফেলতে চান? এটি মুছে ফেললে ক্লাসের সকল পিরিয়ড ও সময়সূচি স্থায়ীভাবে মুছে যাবে।`,
      confirmLabel: 'হ্যাঁ, সম্পূর্ণ রুটিন মুছুন',
      cancelLabel: 'বাতিল',
      type: 'danger',
      onConfirm: () => {
        deleteClassRoutine(routine.id);
        showRoutineAlert(`"${routine.className}" শ্রেণির রুটিন মুছে ফেলা হয়েছে!`);
        closeConfirmModal();
      }
    });
  };

  const handleOpenAddPeriod = () => {
    if (!activeRoutine) return;
    setEditingPeriod(null);
    const count = (activeRoutine.periods || []).length + 1;
    const defaultPeriodName = count === 1 ? '১ম ঘণ্টা' : count === 2 ? '২য় ঘণ্টা' : count === 3 ? '৩য় ঘণ্টা' : count === 4 ? '৪র্থ ঘণ্টা' : `${count}ম ঘণ্টা`;
    setPeriodForm({
      period: defaultPeriodName,
      time: '০৯:১৫ - ১০:০০',
      subject: '',
      teacher: teachers[0]?.name || '',
      room: ''
    });
    setShowPeriodModal(true);
  };

  const handleOpenEditPeriod = (period: RoutinePeriod) => {
    setEditingPeriod(period);
    setPeriodForm({
      period: period.period,
      time: period.time,
      subject: period.subject,
      teacher: period.teacher,
      room: period.room || ''
    });
    setShowPeriodModal(true);
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoutine) return;
    if (!periodForm.period.trim()) {
      showRoutineAlert('অনুগ্রহ করে পিরিয়ড / ঘণ্টার নাম দিন।');
      return;
    }
    if (!periodForm.subject.trim()) {
      showRoutineAlert('অনুগ্রহ করে বিষয়ের নাম লিখুন।');
      return;
    }

    if (editingPeriod) {
      updatePeriodInRoutine(activeRoutine.id, editingPeriod.id, {
        period: periodForm.period.trim(),
        time: periodForm.time.trim(),
        subject: periodForm.subject.trim(),
        teacher: periodForm.teacher.trim(),
        room: periodForm.room.trim()
      });
      showRoutineAlert('পিরিয়ড সফলভাবে আপডেট করা হয়েছে!');
    } else {
      addPeriodToRoutine(activeRoutine.id, {
        period: periodForm.period.trim(),
        time: periodForm.time.trim(),
        subject: periodForm.subject.trim(),
        teacher: periodForm.teacher.trim(),
        room: periodForm.room.trim()
      });
      showRoutineAlert('নতুন পিরিয়ড সফলভাবে যোগ করা হয়েছে!');
    }
    setShowPeriodModal(false);
  };

  const handleDeletePeriod = (periodId: string, periodName: string) => {
    if (!activeRoutine) return;
    openConfirmModal({
      title: 'পিরিয়ড মুছে ফেলা',
      message: `আপনি কি নিশ্চিত যে "${periodName}" পিরিয়ডটি মুছে ফেলতে চান?`,
      confirmLabel: 'হ্যাঁ, পিরিয়ড মুছুন',
      cancelLabel: 'বাতিল',
      type: 'danger',
      onConfirm: () => {
        deletePeriodFromRoutine(activeRoutine.id, periodId);
        showRoutineAlert(`"${periodName}" পিরিয়ড মুছে ফেলা হয়েছে!`);
        closeConfirmModal();
      }
    });
  };

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
    if (teacherSaving) return;

    setTeacherSaving(true);

    setTimeout(() => {
      const finalTeacherData = {
        ...teacherForm,
        email: teacherForm.email?.trim() || '',
        image: teacherForm.image?.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'
      };

      if (editingTeacher) {
        updateTeacher(editingTeacher.id, finalTeacherData);
      } else {
        addTeacher(finalTeacherData);
      }
      setTeacherSaving(false);
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

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 450);
  };

  // Handle Settings Save with professional loading & celebration animation
  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (settingsSaving) return;

    setSettingsSaving(true);
    setSettingsSaved(false);

    setTimeout(() => {
      updateInfo(settingsForm);
      setSettingsSaving(false);
      setSettingsSaved(true);

      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.75 },
          colors: ['#006837', '#DDAA00', '#10b981', '#3b82f6', '#ffffff']
        });
      } catch (err) {
        // fallback
      }

      setTimeout(() => setSettingsSaved(false), 4500);
    }, 600);
  };

  // Handle Settings Image Upload (Logo, Banner, Photos, Seal, Signature)
  const handleSettingsImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: keyof MadrasahInfo
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে। অনুগ্রহ করে ছোট সাইজের ছবি নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettingsForm(prev => ({
          ...prev,
          [fieldKey]: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
  };


  // Filtered applications
  const filteredApps = (applications || []).filter(a => {
    if (!a) return false;
    const matchesFilter = appFilter === 'সকল' || a.status === appFilter;
    const search = (appSearch || '').toLowerCase();
    const nameBn = (a.studentNameBn || '').toLowerCase();
    const id = (a.id || '').toLowerCase();
    const phone = a.fatherPhone || '';
    const applyingClass = (a.applyingClass || '').toLowerCase();

    const matchesSearch =
      nameBn.includes(search) ||
      id.includes(search) ||
      phone.includes(search) ||
      applyingClass.includes(search);
    return matchesFilter && matchesSearch;
  });

  // ==========================================
  // ATTENDANCE STATE (TEACHERS & STUDENTS)
  // ==========================================
  const [attendanceSubTab, setAttendanceSubTab] = useState<'teachers' | 'students'>('teachers');
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    try {
      const today = new Date();
      return today.toISOString().split('T')[0];
    } catch {
      return '2026-10-20';
    }
  });
  const [attendanceClassFilter, setAttendanceClassFilter] = useState<string>('১০ম শ্রেণি (দাখিল)');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  const [teacherAttendance, setTeacherAttendance] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'leave'; inTime: string; remarks: string }>>({});
  const [studentAttendance, setStudentAttendance] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'leave'; remarks: string }>>({});
  const [attendanceToast, setAttendanceToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Base student roster per class
  const baseClassStudents: Record<string, Array<{ id: string; name: string; rollNo: string; phone: string }>> = {
    '১০ম শ্রেণি (দাখিল)': [
      { id: 'std-101', name: 'আকাশ', rollNo: '১০১', phone: '01773542057' },
      { id: 'std-102', name: 'মোঃ ওমর ফারুক', rollNo: '১০২', phone: '01711223344' },
      { id: 'std-103', name: 'আব্দুল্লাহ আল মামুন', rollNo: '১০৩', phone: '01819876543' },
      { id: 'std-104', name: 'মুহাম্মদ আবু বকর', rollNo: '১০৪', phone: '01912345678' },
      { id: 'std-105', name: 'ফাতেমা আক্তার', rollNo: '১০৫', phone: '01511223344' },
      { id: 'std-106', name: 'মারিয়া জান্নাত', rollNo: '১০৬', phone: '01611223344' },
      { id: 'std-107', name: 'মোঃ হাসান মাহমুদ', rollNo: '১০৭', phone: '01722334455' },
      { id: 'std-108', name: 'মোঃ রবিউল ইসলাম', rollNo: '১০৮', phone: '01833445566' }
    ],
    '৯ম শ্রেণি': [
      { id: 'std-201', name: 'মোঃ তানভীর আহমেদ', rollNo: '০১', phone: '01710000001' },
      { id: 'std-202', name: 'মোঃ সাইদুল ইসলাম', rollNo: '০২', phone: '01710000002' },
      { id: 'std-203', name: 'সুমাইয়া খাতুন', rollNo: '০৩', phone: '01710000003' },
      { id: 'std-204', name: 'নাফিসা আনজুম', rollNo: '০৪', phone: '01710000004' },
      { id: 'std-205', name: 'মোঃ কামরুল হাসান', rollNo: '০৫', phone: '01710000005' },
      { id: 'std-206', name: 'মোছাঃ মাহিয়া আক্তার', rollNo: '০৬', phone: '01710000006' }
    ],
    '৮ম শ্রেণি (জেডিসি)': [
      { id: 'std-301', name: 'মোঃ রিফাত হোসেন', rollNo: '০১', phone: '01720000001' },
      { id: 'std-302', name: 'জান্নাতুল ফেরদৌস', rollNo: '০২', phone: '01720000002' },
      { id: 'std-303', name: 'মোঃ আসিফ ইকবাল', rollNo: '০৩', phone: '01720000003' },
      { id: 'std-304', name: 'হুমায়রা তাবাসসুম', rollNo: '০৪', phone: '01720000004' },
      { id: 'std-305', name: 'মোঃ নাজমুল সাকিব', rollNo: '০৫', phone: '01720000005' }
    ],
    '৭ম শ্রেণি': [
      { id: 'std-401', name: 'মোঃ সালমান ফারসি', rollNo: '০১', phone: '01730000001' },
      { id: 'std-402', name: 'খাদিজা আক্তার', rollNo: '০২', phone: '01730000002' },
      { id: 'std-403', name: 'মোঃ নাঈম ইসলাম', rollNo: '০৩', phone: '01730000003' },
      { id: 'std-404', name: 'সাদিয়া সুলতানা', rollNo: '০৪', phone: '01730000004' }
    ],
    '৬ষ্ঠ শ্রেণি': [
      { id: 'std-501', name: 'মোঃ জুনাইদ আহমেদ', rollNo: '০১', phone: '01740000001' },
      { id: 'std-502', name: 'আয়েশা সিদ্দিকা', rollNo: '০২', phone: '01740000002' },
      { id: 'std-503', name: 'মোঃ সিয়াম হোসেন', rollNo: '০৩', phone: '01740000003' },
      { id: 'std-504', name: 'মাইমুনা জাহান', rollNo: '০৪', phone: '01740000004' }
    ],
    'ইবতেদায়ী (১ম-৫ম)': [
      { id: 'std-601', name: 'মোঃ তালহা জুবায়ের', rollNo: '০১', phone: '01750000001' },
      { id: 'std-602', name: 'হাফসা জান্নাত', rollNo: '০২', phone: '01750000002' },
      { id: 'std-603', name: 'মোঃ রায়হানুল হক', rollNo: '০৩', phone: '01750000003' },
      { id: 'std-604', name: 'মারিয়াম বিনতে আলী', rollNo: '০৪', phone: '01750000004' }
    ]
  };

  // Dynamically merge actual admission applicants and results into active student roster
  const activeClassStudents = React.useMemo(() => {
    const list = [...(baseClassStudents[attendanceClassFilter] || [])];

    (applications || []).forEach(app => {
      if (!app) return;
      const appClass = (app.applyingClass || '').trim();
      const filterClass = (attendanceClassFilter || '').trim();
      const matches = appClass === filterClass || (filterClass.includes('১০ম') && appClass.includes('১০ম'));
      if (matches) {
        const studentName = app.studentNameBn || 'শিক্ষার্থী';
        if (!list.some(s => s.id === app.id || s.name === studentName)) {
          const strId = String(app.id || '');
          list.push({
            id: strId || `app-${Math.random()}`,
            name: studentName,
            rollNo: strId.length >= 3 ? strId.slice(-3) : '১১০',
            phone: app.fatherPhone || '017XXXXXXXX'
          });
        }
      }
    });

    (students || []).forEach(std => {
      if (!std) return;
      const stdClass = (std.classYear || '').trim();
      const filterClass = (attendanceClassFilter || '').trim();
      const matches = stdClass === filterClass || (filterClass.includes('১০ম') && stdClass.includes('১০ম')) || (filterClass.includes('৯ম') && stdClass.includes('৯ম'));
      if (matches) {
        const sName = (std.name || '').trim();
        if (sName && !list.some(s => s.id === std.id || (s.name || '').toLowerCase() === sName.toLowerCase())) {
          list.push({
            id: String(std.id || `std-${Math.random()}`),
            name: sName,
            rollNo: String(std.rollNo || '১০১'),
            phone: std.phone || '017XXXXXXXX'
          });
        }
      }
    });

    (results || []).forEach(res => {
      if (!res) return;
      const resClass = (res.classYear || '').trim();
      const filterClass = (attendanceClassFilter || '').trim();
      const matches = resClass === filterClass || (filterClass.includes('১০ম') && resClass.includes('১০ম'));
      if (matches) {
        const sName = (res.studentName || '').trim();
        if (sName && !list.some(s => (s.name || '').toLowerCase() === sName.toLowerCase())) {
          list.push({
            id: String(res.id || `res-${Math.random()}`),
            name: sName,
            rollNo: String(res.rollNo || '১০১'),
            phone: '017XXXXXXXX'
          });
        }
      }
    });

    return list;
  }, [attendanceClassFilter, applications, results, students]);

  // Load and sync Teacher Attendance from localStorage for the selected date
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = `padm_teacher_attendance_${attendanceDate}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setTeacherAttendance(parsed);
          return;
        }
      }
      const initial: Record<string, { status: 'present' | 'absent' | 'late' | 'leave'; inTime: string; remarks: string }> = {};
      (teachers || []).forEach(t => {
        if (t?.id) {
          initial[t.id] = { status: 'present', inTime: '০৮:৫০ মি.', remarks: '' };
        }
      });
      setTeacherAttendance(initial);
    } catch (e) {
      console.error(e);
      setTeacherAttendance({});
    }
  }, [attendanceDate, teachers]);

  // Load and sync Student Attendance from localStorage for the selected date and class
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = `padm_student_attendance_${attendanceDate}_${attendanceClassFilter}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setStudentAttendance(parsed);
          return;
        }
      }
      const initial: Record<string, { status: 'present' | 'absent' | 'late' | 'leave'; remarks: string }> = {};
      (activeClassStudents || []).forEach(s => {
        if (s?.id) {
          initial[s.id] = { status: 'present', remarks: '' };
        }
      });
      setStudentAttendance(initial);
    } catch (e) {
      console.error(e);
      setStudentAttendance({});
    }
  }, [attendanceDate, attendanceClassFilter, activeClassStudents]);

  // Save teacher attendance
  const handleSaveTeacherAttendance = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`padm_teacher_attendance_${attendanceDate}`, JSON.stringify(teacherAttendance || {}));
        setAttendanceToast({ show: true, message: 'শিক্ষক ও স্টাফদের আজকের হাজিরা সফলভাবে সংরক্ষিত হয়েছে!' });
        setTimeout(() => setAttendanceToast({ show: false, message: '' }), 3500);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Save student attendance
  const handleSaveStudentAttendance = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`padm_student_attendance_${attendanceDate}_${attendanceClassFilter}`, JSON.stringify(studentAttendance || {}));
        setAttendanceToast({ show: true, message: `${attendanceClassFilter}-এর হাজিরা সফলভাবে সংরক্ষিত হয়েছে!` });
        setTimeout(() => setAttendanceToast({ show: false, message: '' }), 3500);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Mark all teachers with a specific status
  const handleMarkAllTeachers = (status: 'present' | 'absent') => {
    setTeacherAttendance(prev => {
      const safePrev = prev && typeof prev === 'object' ? prev : {};
      const updated: Record<string, { status: 'present' | 'absent' | 'late' | 'leave'; inTime: string; remarks: string }> = {};
      (teachers || []).forEach(t => {
        if (t?.id) {
          updated[t.id] = {
            status,
            inTime: status === 'present' ? '০৮:৫০ মি.' : '',
            remarks: safePrev[t.id]?.remarks || ''
          };
        }
      });
      return updated;
    });
  };

  // Mark all students with a specific status
  const handleMarkAllStudents = (status: 'present' | 'absent') => {
    setStudentAttendance(prev => {
      const safePrev = prev && typeof prev === 'object' ? prev : {};
      const updated: Record<string, { status: 'present' | 'absent' | 'late' | 'leave'; remarks: string }> = {};
      (activeClassStudents || []).forEach(s => {
        if (s?.id) {
          updated[s.id] = {
            status,
            remarks: safePrev[s.id]?.remarks || ''
          };
        }
      });
      return updated;
    });
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl text-center shadow-xl">
          <RefreshCw className="w-8 h-8 animate-spin text-[#DDAA00] mx-auto mb-3" />
          <p className="text-white font-bold text-sm">মাদ্রাসা অ্যাডমিন কন্ট্রোল প্যানেল লোড হচ্ছে...</p>
          <p className="text-slate-400 text-xs mt-1">অনুগ্রহ করে একটু অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl text-center shadow-xl">
          <RefreshCw className="w-8 h-8 animate-spin text-[#DDAA00] mx-auto mb-3" />
          <p className="text-white font-bold text-sm">লগইন যাচাই করা হচ্ছে...</p>
          <p className="text-slate-400 text-xs mt-1">আপনাকে অ্যাডমিন লগইন পেজে নিয়ে যাওয়া হচ্ছে</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Test / Preview Mode Banner */}
      {!isSuperAdminUser && currentAdminUser && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold border-b border-amber-500 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 sticky top-[58px] z-30">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-950" />
            <span>
              আপনি বর্তমানে <strong>&ldquo;{currentAdminUser.name}&rdquo;</strong> (@{currentAdminUser.username}) হিসেবে প্যানেল দেখছেন। এই ইউজারের অনুমোদিত ({(currentAdminUser.permissions || []).length}টি) অপশন কার্যকর আছে।
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              restoreSuperAdmin();
              setActiveTab('users');
            }}
            className="bg-slate-900 hover:bg-black text-[#DDAA00] hover:text-white px-3 py-1.5 rounded-lg text-xs font-black shadow transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#DDAA00]" />
            <span>👑 সুপার অ্যাডমিনে ফিরে যান</span>
          </button>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm shrink-0 self-start">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 flex items-center justify-between">
            <span>প্রধান মেনু</span>
            {!isSuperAdminUser && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                সীমাবদ্ধ অ্যাক্সেস
              </span>
            )}
          </div>
          <nav className="space-y-1 text-xs md:text-sm font-semibold">
            {canAccessTab('overview') && (
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
            )}

            {canAccessTab('hero') && (
              <button
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'hero'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>হিরো ব্যানার</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  হোমপেজ
                </span>
              </button>
            )}

            {canAccessTab('admissions') && (
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
            )}

            {canAccessTab('notices') && (
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
              </button>
            )}

            {canAccessTab('urgent-notices') && (
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
            )}

            {canAccessTab('facilities') && (
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
              </button>
            )}

            {canAccessTab('gallery') && (
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
              </button>
            )}

            {canAccessTab('teachers') && (
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
              </button>
            )}

            {canAccessTab('attendance') && (
              <button
                onClick={() => setActiveTab('attendance')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'attendance'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>দৈনিক হাজিরা ও উপস্থিতি</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  নতুন
                </span>
              </button>
            )}

            {canAccessTab('routine') && (
              <button
                onClick={() => setActiveTab('routine')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'routine'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>ক্লাস রুটিন</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  নতুন
                </span>
              </button>
            )}

            {canAccessTab('students') && (
              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-emerald-800 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>শিক্ষার্থী প্রোফাইল</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {students?.length || 0} জন
                </span>
              </button>
            )}

            {canAccessTab('alumni') && (
              <button
                onClick={() => setActiveTab('alumni')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'alumni'
                    ? 'bg-emerald-800 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-[#DDAA00]" />
                  <span>পুরাতন শিক্ষার্থী তালিকা</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {alumniStudents?.length || 0} জন
                </span>
              </button>
            )}

            {canAccessTab('authorities') && (
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
              </button>
            )}

            {canAccessTab('results') && (
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
            )}

            {canAccessTab('messages') && (
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
            )}

            {canAccessTab('settings') && (
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
            )}

            {canAccessTab('prayer') && (
              <button
                onClick={() => setActiveTab('prayer')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === 'prayer'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#DDAA00]" />
                  <span>সালাতের সময়সূচি</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  নতুন
                </span>
              </button>
            )}


            {/* TAB: USER & PERMISSION PROFILES */}
            {canAccessTab('users') && (
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-emerald-800 text-white shadow-sm font-black'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#DDAA00]" />
                  <span>প্রোফাইল ও ইউজার কন্ট্রোল</span>
                </div>
              </button>
            )}
          </nav>
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
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-800">মোট শিক্ষার্থী</span>
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-950">{info.stats.students}</div>
                  <div className="text-[10px] text-emerald-700 mt-1">সক্রিয় অধ্যয়নরত</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-amber-800">ভর্তি আবেদন</span>
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-950">{applications.length}</div>
                  <div className="text-[10px] text-amber-700 mt-1">{pendingAppsCount}টি অপেক্ষমান</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-blue-800">শিক্ষক ও স্টাফ</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-blue-950">{teachers.length} জন</div>
                  <div className="text-[10px] text-blue-700 mt-1">পূর্ণকালীন দায়িত্বপ্রাপ্ত</div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-purple-800">প্রকাশিত নোটিশ</span>
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-purple-950">{notices.length}টি</div>
                  <div className="text-[10px] text-purple-700 mt-1">সক্রিয় নোটিশ বোর্ডে</div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('alumni')}
                  className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 text-left hover:bg-teal-100/70 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-teal-800 group-hover:text-teal-900">পুরাতন শিক্ষার্থী</span>
                    <GraduationCap className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-black text-teal-950">{alumniStudents?.length || 0} জন</div>
                  <div className="text-[10px] text-teal-700 mt-1 flex items-center justify-between">
                    <span>প্রাক্তন তালিকা</span>
                    <span className="text-teal-800 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
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

          {/* TAB: HERO SECTION MANAGEMENT */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Top Banner Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" /> হোমপেজ
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">হিরো ব্যানার ব্যবস্থাপনা</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    হোমপেজের মূল ব্যানার শিরোনাম, স্লোগান, বর্ণনা, বাটন ও উপাদানসমূহ নিয়ন্ত্রণ ও কাস্টমাইজ করুন
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>লাইভ হোমপেজ দেখুন</span>
                  </a>

                  <button
                    onClick={handleHeroSubmit}
                    className="btn-pulse-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* Notification if saved */}
              {heroSettingsSaved && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>হিরো সেকশনের সেটিংস সফলভাবে সংরক্ষিত হয়েছে এবং ওয়েবসাইটে তৎক্ষণাৎ কার্যকর হয়েছে!</span>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="bg-gradient-to-br from-[#002d18] via-[#004022] to-[#001f4d] text-white rounded-2xl p-6 shadow-xl border border-emerald-800/60 relative overflow-hidden">
                {/* Active Slide Image Background in Preview */}
                {heroForm.slides && heroForm.slides.find((s) => s.isActive) && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={heroForm.slides.find((s) => s.isActive)?.imageUrl || ''}
                      alt="Banner Preview"
                      fill
                      className="object-cover opacity-30"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001f4d]/90 via-[#002d18]/80 to-[#002d18]/90" />
                  </div>
                )}

                <div className="relative z-10 flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                  <span className="text-xs font-black text-[#DDAA00] tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#DDAA00]" /> লাইভ ভিউ প্রিভিউ
                  </span>
                  <span className="text-[11px] text-emerald-200">
                    নিচের সেটিংস অনুযায়ী তাৎক্ষণিক প্রিভিউ
                  </span>
                </div>

                <div className="relative z-10 text-center space-y-4 py-4 max-w-2xl mx-auto">
                  {heroForm.showAyahCallout && (
                    <div className="inline-flex flex-col items-center bg-[#002d18]/90 border border-[#DDAA00]/40 rounded-xl px-4 py-2 shadow-sm">
                      <span className="font-arabic text-lg text-[#DDAA00] font-bold">
                        {heroForm.ayahArabic}
                      </span>
                      <span className="text-[11px] text-emerald-200 mt-0.5">
                        &quot;{heroForm.ayahBangla}&quot;
                      </span>
                    </div>
                  )}

                  {heroForm.showLocationBadge && (
                    <div>
                      <span className="inline-flex items-center gap-1 bg-[#DDAA00] text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        <MapPin className="w-3 h-3" />
                        {heroForm.locationBadgeText}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      {heroForm.headline || info.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#DDAA00] font-bold mt-1">
                      {heroForm.slogan || info.slogan}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed">
                    {heroForm.description}
                  </p>

                  {(heroForm.showButton1 || heroForm.showButton2) && (
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      {heroForm.showButton1 && (
                        <span className="inline-flex items-center gap-1.5 bg-[#DDAA00] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{heroForm.button1Text || "বাটন ১"}</span>
                        </span>
                      )}
                      {heroForm.showButton2 && (
                        <span className="inline-flex items-center gap-1.5 bg-[#003580] text-white font-bold px-4 py-2 rounded-lg text-xs border border-[#DDAA00]/40 shadow">
                          <Award className="w-3.5 h-3.5 text-[#DDAA00]" />
                          <span>{heroForm.button2Text || "বাটন ২"}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {heroForm.showHighlights && (
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-emerald-200 pt-2">
                      <span className="bg-[#002d18]/70 px-2 py-0.5 rounded border border-emerald-800">✓ {heroForm.highlight1}</span>
                      <span className="bg-[#002d18]/70 px-2 py-0.5 rounded border border-emerald-800">✓ {heroForm.highlight2}</span>
                      <span className="bg-[#002d18]/70 px-2 py-0.5 rounded border border-emerald-800">✓ {heroForm.highlight3}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 📐 ব্যানার ছবির আদর্শ পরিমাপ ও সাইজ গাইডলাইন (Size Specifications Callout) */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg font-bold shadow-sm shrink-0">
                      📐
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2 flex-wrap">
                        <span>ব্যানার ছবির আদর্শ পরিমাপ ও সাইজ গাইডলাইন</span>
                        <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                          প্রস্তাবিত মাপ
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-800">
                        ওয়েবসাইটের হিরো সেকশনে ছবি ও লেখা নিখুঁতভাবে প্রদর্শনের জন্য নিচের সাইজ মেনে ছবি যুক্ত করুন
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white/95 border border-emerald-200 rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">রেজোলিউশন / সাইজ</span>
                    <span className="text-base font-black text-emerald-900 block mt-0.5">১৯২০ × ৭৫০ px</span>
                    <span className="text-[10px] text-emerald-700">বা ১৬০০ × ৬২৫ px</span>
                  </div>

                  <div className="bg-white/95 border border-emerald-200 rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">অ্যাসপেক্ট রেশিও</span>
                    <span className="text-base font-black text-emerald-900 block mt-0.5">১৬:৯ বা ২১:৯</span>
                    <span className="text-[10px] text-emerald-700">ওয়াইডস্ক্রিন ল্যান্ডস্কেপ</span>
                  </div>

                  <div className="bg-white/95 border border-emerald-200 rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">ছবি ফরম্যাট</span>
                    <span className="text-base font-black text-emerald-900 block mt-0.5">JPG, PNG, WebP</span>
                    <span className="text-[10px] text-emerald-700">সরাসরি আপলোড সাপোর্টেড</span>
                  </div>

                  <div className="bg-white/95 border border-emerald-200 rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">সর্বোচ্চ ফাইল সাইজ</span>
                    <span className="text-base font-black text-emerald-900 block mt-0.5">সর্বোচ্চ ৫ MB</span>
                    <span className="text-[10px] text-emerald-700">অটো-অপ্টিমাইজ হয়</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/70 flex items-start gap-2 text-xs text-emerald-900">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>গুরুত্বপূর্ণ পরামর্শ:</strong> ছবির মূল বিষয়বস্তু বা মাদ্রাসা ভবনের দৃশ্য ছবির কেন্দ্রস্থলে (Center) রাখলে মোবাইল, ট্যাবলেট এবং কম্পিউটার সব ডিভাইসেই কোনো অংশ কাটা না পড়ে চমৎকারভাবে প্রদর্শিত হবে।
                  </p>
                </div>
              </div>

              {/* 🖼️ ফটো ব্যানার ও স্লাইডশো ব্যবস্থাপনা (Photo Banner & Slideshow Management) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span>ফটো ব্যানার স্লাইডশো ব্যবস্থাপনা</span>
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {(heroForm.slides || defaultHeroSlides).length}টি ফটো স্লাইড
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ওয়েবসাইটের হিরো ব্যানারে প্রদর্শিত ফটোগুলো যোগ, পরিবর্তন, স্লাইডশো নিয়ন্ত্রণ ও সক্রিয়/নিষ্ক্রিয় করুন
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddSlide}
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ব্যানার ফটো যোগ করুন</span>
                  </button>
                </div>

                {/* Slideshow Controls Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {/* Enable Slideshow Toggle */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-emerald-600" />
                        <span>অটো স্লাইডশো (স্বয়ংক্রিয় পরিবর্তন)</span>
                      </div>
                      <div className="text-[11px] text-slate-500">হোমপেজে একা একা ব্যানার পরিবর্তন হবে</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={heroForm.slideshowEnabled ?? true}
                        onChange={(e) => {
                          const updated = { ...heroForm, slideshowEnabled: e.target.checked };
                          setHeroForm(updated);
                          updateHeroSettings(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Interval Selector */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>স্লাইড পরিবর্তনের গতি (Interval)</span>
                      </div>
                      <div className="text-[11px] text-slate-500">প্রতি স্লাইড কতক্ষণ পর্দায় থাকবে</div>
                    </div>
                    <select
                      value={heroForm.slideInterval || 5}
                      onChange={(e) => {
                        const updated = { ...heroForm, slideInterval: Number(e.target.value) };
                        setHeroForm(updated);
                        updateHeroSettings(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value={3}>৩ সেকেন্ড (দ্রুত)</option>
                      <option value={5}>৫ সেকেন্ড (প্রস্তাবিত)</option>
                      <option value={7}>৭ সেকেন্ড (স্বাভাবিক)</option>
                      <option value={10}>১০ সেকেন্ড (ধীর)</option>
                    </select>
                  </div>
                </div>

                {/* Slides List Grid */}
                <div className="space-y-3">
                  {(heroForm.slides || defaultHeroSlides).length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">বর্তমানে কোনো ব্যানার ফটো যোগ করা নেই</p>
                      <p className="text-[11px] text-slate-500 mt-1">উপরে &quot;নতুন ব্যানার ফটো যোগ করুন&quot; বাটনে ক্লিক করে ফটো ব্যানার যুক্ত করুন</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(heroForm.slides || defaultHeroSlides).map((slide, index) => (
                        <div
                          key={slide.id}
                          className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                            slide.isActive ? 'border-emerald-200 ring-1 ring-emerald-500/20' : 'border-slate-200 opacity-60'
                          }`}
                        >
                          {/* Image preview box with 16:9 aspect */}
                          <div className="relative aspect-[16/8] bg-slate-900 overflow-hidden group">
                            <Image
                              src={slide.imageUrl}
                              alt={slide.title || `ব্যানার #${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                            {/* Badge showing slide number */}
                            <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>#{index + 1}</span>
                              {slide.isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              )}
                            </span>

                            {/* Active/Inactive badge */}
                            <button
                              type="button"
                              onClick={() => handleToggleSlideStatus(slide.id)}
                              className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors shadow-sm ${
                                slide.isActive
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-slate-700 text-slate-200 hover:bg-slate-800'
                              }`}
                            >
                              {slide.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </button>

                            {/* Slide Title preview over image */}
                            <div className="absolute bottom-2 left-2 right-2 text-white">
                              <p className="text-xs font-bold truncate">
                                {slide.title || heroForm.headline || 'ডিফল্ট শিরোনাম'}
                              </p>
                              <p className="text-[10px] text-[#DDAA00] truncate">
                                {slide.subtitle || heroForm.slogan || 'ডিফল্ট স্লোগান'}
                              </p>
                            </div>
                          </div>

                          {/* Slide actions & reorder */}
                          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1">
                            {/* Reorder buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveSlide(index, 'up')}
                                title="উপরে বা বামে নিন"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === (heroForm.slides || defaultHeroSlides).length - 1}
                                onClick={() => handleMoveSlide(index, 'down')}
                                title="নিচে বা ডানে নিন"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Edit & Delete */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSlide(slide)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                <span>এডিট</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSlide(slide.id)}
                                title="মুছে ফেলুন"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Container */}
              <form onSubmit={handleHeroSubmit} className="space-y-6">


                {/* 2. অ্যাকশন বাটনদ্বয় */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DDAA00]"></span>
                      কল-টু-অ্যাকশন বাটন নিয়ন্ত্রণ
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Button 1 (Golden Button) */}
                    <div className="bg-white border border-amber-200/80 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#DDAA00]"></span>
                          বাটন ১ (প্রাথমিক বাটন)
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={heroForm.showButton1}
                            onChange={(e) => setHeroForm({ ...heroForm, showButton1: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          <span className="ml-2 text-[11px] font-bold text-slate-600">
                            {heroForm.showButton1 ? 'চালু' : 'বন্ধ'}
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">বাটনের টেক্সট</label>
                        <input
                          type="text"
                          value={heroForm.button1Text}
                          onChange={(e) => setHeroForm({ ...heroForm, button1Text: e.target.value })}
                          placeholder="অনলাইন ভর্তি আবেদন করুন"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">বাটনের লিংক</label>
                        <input
                          type="text"
                          value={heroForm.button1Link}
                          onChange={(e) => setHeroForm({ ...heroForm, button1Link: e.target.value })}
                          placeholder="/admission"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Button 2 (Blue Button) */}
                    <div className="bg-white border border-blue-200/80 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#003580]"></span>
                          বাটন ২ (মাধ্যমিক বাটন)
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={heroForm.showButton2}
                            onChange={(e) => setHeroForm({ ...heroForm, showButton2: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          <span className="ml-2 text-[11px] font-bold text-slate-600">
                            {heroForm.showButton2 ? 'চালু' : 'বন্ধ'}
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">বাটনের টেক্সট</label>
                        <input
                          type="text"
                          value={heroForm.button2Text}
                          onChange={(e) => setHeroForm({ ...heroForm, button2Text: e.target.value })}
                          placeholder="পরীক্ষার ফলাফল অনুসন্ধান"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">বাটনের লিংক</label>
                        <input
                          type="text"
                          value={heroForm.button2Link}
                          onChange={(e) => setHeroForm({ ...heroForm, button2Link: e.target.value })}
                          placeholder="/results"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>



                {/* Bottom Save Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {heroSettingsSaved && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> সংরক্ষিত হয়েছে!
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={heroSaving}
                      className={`btn-pulse-glow btn-shimmer-effect w-full sm:w-auto flex items-center justify-center gap-2 text-white text-xs font-black py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                        heroSaving
                          ? 'bg-slate-700 text-slate-200 cursor-wait'
                          : heroSettingsSaved
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 ring-4 ring-emerald-300 shadow-emerald-900/30 scale-105'
                          : 'bg-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      {heroSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#DDAA00]" />
                          <span>সংরক্ষণ হচ্ছে...</span>
                        </>
                      ) : heroSettingsSaved ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white animate-success-pop" />
                          <span>পরিবর্তন সংরক্ষিত! 🎉</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>পরিবর্তন সংরক্ষণ করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
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
                            {app.status === 'অনুমোদিত' && (
                              <button
                                onClick={() => handleCreateStudentFromApplication(app)}
                                className="text-xs bg-blue-50 text-blue-800 hover:bg-blue-100 p-1.5 rounded cursor-pointer"
                                title="শিক্ষার্থী প্রোফাইল তৈরি করুন"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 p-1.5 rounded cursor-pointer"
                              title="বিস্তারিত স্লিপ দেখুন"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                openConfirmModal({
                                  title: 'আবেদন মুছে ফেলার নিশ্চিতকরণ',
                                  message: `আপনি কি "${app.studentNameBn}"-এর ভর্তি আবেদনটি মুছে ফেলতে চান?`,
                                  confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                                  cancelLabel: 'বাতিল',
                                  type: 'danger',
                                  onConfirm: () => {
                                    deleteApplication(app.id);
                                    closeConfirmModal();
                                  }
                                });
                              }}
                              className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 p-1.5 rounded cursor-pointer"
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
                          openConfirmModal({
                            title: 'নোটিশ মুছে ফেলার নিশ্চিতকরণ',
                            message: `আপনি কি "${n.title}" নোটিশটি মুছে ফেলতে চান?`,
                            confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                            cancelLabel: 'বাতিল',
                            type: 'danger',
                            onConfirm: () => {
                              deleteNotice(n.id);
                              closeConfirmModal();
                            }
                          });
                        }}
                        className="p-2 bg-white text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 cursor-pointer"
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
                              openConfirmModal({
                                title: 'জরুরি নোটিশ মুছে ফেলার নিশ্চিতকরণ',
                                message: `আপনি কি "${un.title}" জরুরি নোটিশটি মুছে ফেলতে চান?`,
                                confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                                cancelLabel: 'বাতিল',
                                type: 'danger',
                                onConfirm: () => {
                                  deleteUrgentNotice(un.id);
                                  closeConfirmModal();
                                }
                              });
                            }}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 transition-colors cursor-pointer"
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
                                openConfirmModal({
                                  title: 'সুবিধা মুছে ফেলার নিশ্চিতকরণ',
                                  message: `আপনি কি "${fac.title}" সুবিধাটি তালিকা থেকে মুছে ফেলতে চান?`,
                                  confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                                  cancelLabel: 'বাতিল',
                                  type: 'danger',
                                  onConfirm: () => {
                                    deleteFacility(fac.id);
                                    closeConfirmModal();
                                  }
                                });
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 transition-colors cursor-pointer"
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
                                  openConfirmModal({
                                    title: 'ছবি মুছে ফেলার নিশ্চিতকরণ',
                                    message: `আপনি কি "${item.title}" ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?`,
                                    confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                                    cancelLabel: 'বাতিল',
                                    type: 'danger',
                                    onConfirm: () => {
                                      deleteGalleryItem(item.id);
                                      closeConfirmModal();
                                    }
                                  });
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded-lg border border-slate-200 transition-colors cursor-pointer"
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
                        {t.email && (
                          <p className="truncate text-slate-500 font-mono text-[11px]" title={t.email}>
                            <strong>ইমেইল:</strong> {t.email}
                          </p>
                        )}
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
                            email: t.email || '',
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
                          openConfirmModal({
                            title: 'শিক্ষকের তথ্য মুছে ফেলার নিশ্চিতকরণ',
                            message: `আপনি কি "${t.name}"-এর সকল তথ্য মুছে ফেলতে চান?`,
                            confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                            cancelLabel: 'বাতিল',
                            type: 'danger',
                            onConfirm: () => {
                              deleteTeacher(t.id);
                              closeConfirmModal();
                            }
                          });
                        }}
                        className="px-3 py-1 bg-white text-rose-700 hover:bg-rose-50 border border-slate-200 rounded text-xs font-bold cursor-pointer transition-colors"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: TEACHER & STUDENT ATTENDANCE MANAGEMENT
             ======================================================== */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Success Notification Banner */}
              {attendanceToast.show && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] text-white shadow-lg flex items-center justify-between border-2 border-[#DDAA00] animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#DDAA00] text-slate-900 flex items-center justify-center font-black shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{attendanceToast.message}</p>
                      <p className="text-xs text-emerald-100">হাজিরা সফলভাবে ডাটাবেজ ও লোকাল স্টোরেজে সংরক্ষণ করা হয়েছে।</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAttendanceToast({ show: false, message: '' })}
                    className="text-emerald-200 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Attendance Header & Date Picker */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#006837] text-xs font-bold px-3 py-1 rounded-full mb-2 border border-emerald-300">
                    <UserCheck className="w-3.5 h-3.5 text-[#006837]" />
                    <span>ডিজিটাল হাজিরা পোর্টাল</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    দৈনিক শিক্ষক ও শিক্ষার্থী হাজিরা ও উপস্থিতি
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা • তারিখভিত্তিক নিয়মিত হাজিরা রেকর্ড
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm">
                    <Calendar className="w-4 h-4 text-[#006837]" />
                    <span className="text-xs font-bold text-slate-700">তারিখ:</span>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#006837] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    title="হাজিরা শিট প্রিন্ট করুন"
                  >
                    <Printer className="w-4 h-4 text-[#006837]" />
                    <span>প্রিন্ট শিট</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: 1. Teachers Attendance | 2. Students Attendance */}
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceSubTab('teachers')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attendanceSubTab === 'teachers'
                      ? 'bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] text-white shadow-sm border-b-2 border-[#DDAA00]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>শিক্ষক ও স্টাফ হাজিরা ({teachers.length} জন)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceSubTab('students')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attendanceSubTab === 'students'
                      ? 'bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] text-white shadow-sm border-b-2 border-[#DDAA00]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>শিক্ষার্থী ডিজিটাল হাজিরা ({activeClassStudents.length} জন)</span>
                </button>
              </div>

              {/* ========================================================
                  SUB-TAB 1: TEACHER & STAFF ATTENDANCE
                 ======================================================== */}
              {attendanceSubTab === 'teachers' && (
                <div className="space-y-6">
                  {/* Teacher Stats KPI Cards */}
                  {(() => {
                    const total = (teachers || []).length;
                    const attendanceList = (teacherAttendance && typeof teacherAttendance === 'object') ? Object.values(teacherAttendance) : [];
                    const present = attendanceList.filter(a => a?.status === 'present').length;
                    const absent = attendanceList.filter(a => a?.status === 'absent').length;
                    const late = attendanceList.filter(a => a?.status === 'late').length;
                    const leave = attendanceList.filter(a => a?.status === 'leave').length;
                    const rate = total > 0 ? Math.round((present / total) * 100) : 100;

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                          <span className="text-xs text-slate-500 font-bold block">মোট শিক্ষক ও স্টাফ</span>
                          <div className="text-2xl font-black text-slate-900 mt-1">{total} জন</div>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm">
                          <span className="text-xs text-emerald-800 font-bold block">উপস্থিত (Present)</span>
                          <div className="text-2xl font-black text-[#006837] mt-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>{present}</span>
                          </div>
                        </div>

                        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 shadow-sm">
                          <span className="text-xs text-rose-800 font-bold block">অনুপস্থিত (Absent)</span>
                          <div className="text-2xl font-black text-rose-700 mt-1 flex items-center gap-1.5">
                            <XCircle className="w-5 h-5 text-rose-500" />
                            <span>{absent}</span>
                          </div>
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm">
                          <span className="text-xs text-amber-800 font-bold block">দেরিতে / ছুটি</span>
                          <div className="text-2xl font-black text-amber-700 mt-1 flex items-center gap-1.5">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <span>{late + leave}</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#00341c] to-[#006837] text-white rounded-2xl p-4 border border-emerald-700 shadow-sm col-span-2 sm:col-span-1">
                          <span className="text-xs text-emerald-200 font-bold block">উপস্থিতির হার</span>
                          <div className="text-2xl font-black text-[#DDAA00] mt-1">{rate}%</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Teacher Action Bar */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={attendanceSearchQuery}
                        onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                        placeholder="শিক্ষক বা পদবি খুঁজুন..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006837]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => handleMarkAllTeachers('present')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#006837] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>সকলকে উপস্থিত করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveTeacherAttendance}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] hover:from-[#002614] hover:to-[#005a30] border-2 border-[#DDAA00] text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-[#DDAA00]" />
                        <span>শিক্ষক হাজিরা সংরক্ষণ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Teachers Table */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-black">
                            <th className="py-3 px-4 w-12 text-center">ক্র.</th>
                            <th className="py-3 px-4">শিক্ষক ও পদবি</th>
                            <th className="py-3 px-4 hidden md:table-cell">মোবাইল</th>
                            <th className="py-3 px-4 text-center">উপস্থিতি স্ট্যাটাস</th>
                            <th className="py-3 px-4 text-center w-32 hidden sm:table-cell">আগমন সময়</th>
                            <th className="py-3 px-4 hidden lg:table-cell">মন্তব্য</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {(teachers || [])
                            .filter(t => {
                              if (!t) return false;
                              if (!attendanceSearchQuery) return true;
                              const q = attendanceSearchQuery.toLowerCase();
                              return (
                                (t.name || '').toLowerCase().includes(q) ||
                                (t.designation || '').toLowerCase().includes(q) ||
                                (t.subject || '').toLowerCase().includes(q)
                              );
                            })
                            .map((t, idx) => {
                              const record = (teacherAttendance && t && teacherAttendance[t.id]) || { status: 'present', inTime: '০৮:৫০ মি.', remarks: '' };

                              return (
                                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                                    {idx + 1}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200 shrink-0">
                                        {t.image ? (
                                          /* eslint-disable-next-line @next/next/no-img-element */
                                          <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center font-bold text-emerald-800 text-sm">
                                            {t.name.charAt(0) || 'শ'}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <strong className="text-slate-900 text-xs sm:text-sm block">{t.name}</strong>
                                        <span className="text-[11px] text-emerald-800 font-semibold">{t.designation}</span>
                                        {t.subject && (
                                          <span className="text-[10px] text-slate-400 block">• বিষয়: {t.subject}</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  <td className="py-3 px-4 hidden md:table-cell font-mono text-slate-600 font-semibold">
                                    {t.phone || '017XXXXXXXX'}
                                  </td>

                                  {/* Status Switcher Buttons */}
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTeacherAttendance(prev => ({
                                            ...prev,
                                            [t.id]: { ...record, status: 'present', inTime: record.inTime || '০৮:৫০ মি.' }
                                          }))
                                        }
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'present'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        উপস্থিত
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTeacherAttendance(prev => ({
                                            ...prev,
                                            [t.id]: { ...record, status: 'absent', inTime: '' }
                                          }))
                                        }
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'absent'
                                            ? 'bg-rose-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        অনুপস্থিত
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTeacherAttendance(prev => ({
                                            ...prev,
                                            [t.id]: { ...record, status: 'late' }
                                          }))
                                        }
                                        className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'late'
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        দেরি
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTeacherAttendance(prev => ({
                                            ...prev,
                                            [t.id]: { ...record, status: 'leave', inTime: '' }
                                          }))
                                        }
                                        className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'leave'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        ছুটি
                                      </button>
                                    </div>
                                  </td>

                                  {/* In-time input */}
                                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                                    <input
                                      type="text"
                                      value={record.inTime || ''}
                                      onChange={(e) =>
                                        setTeacherAttendance(prev => ({
                                          ...prev,
                                          [t.id]: { ...record, inTime: e.target.value }
                                        }))
                                      }
                                      placeholder="০৮:৫০ মি."
                                      className="w-24 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                    />
                                  </td>

                                  {/* Remarks input */}
                                  <td className="py-3 px-4 hidden lg:table-cell">
                                    <input
                                      type="text"
                                      value={record.remarks || ''}
                                      onChange={(e) =>
                                        setTeacherAttendance(prev => ({
                                          ...prev,
                                          [t.id]: { ...record, remarks: e.target.value }
                                        }))
                                      }
                                      placeholder="মন্তব্য লিখুন..."
                                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  SUB-TAB 2: STUDENT DIGITAL ATTENDANCE
                 ======================================================== */}
              {attendanceSubTab === 'students' && (
                <div className="space-y-6">
                  {/* Class Selection Filter Pills */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#006837]" />
                      <span>শ্রেণি নির্বাচন করুন:</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        '১০ম শ্রেণি (দাখিল)',
                        '৯ম শ্রেণি',
                        '৮ম শ্রেণি (জেডিসি)',
                        '৭ম শ্রেণি',
                        '৬ষ্ঠ শ্রেণি',
                        'ইবতেদায়ী (১ম-৫ম)'
                      ].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setAttendanceClassFilter(cls)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            attendanceClassFilter === cls
                              ? 'bg-[#006837] text-white shadow-sm border-2 border-[#DDAA00]'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student Stats KPI Cards */}
                  {(() => {
                    const total = (activeClassStudents || []).length;
                    const attendanceList = (studentAttendance && typeof studentAttendance === 'object') ? Object.values(studentAttendance) : [];
                    const present = attendanceList.filter(a => a?.status === 'present').length;
                    const absent = attendanceList.filter(a => a?.status === 'absent').length;
                    const rate = total > 0 ? Math.round((present / total) * 100) : 100;

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                          <span className="text-xs text-slate-500 font-bold block">{attendanceClassFilter} মোট শিক্ষার্থী</span>
                          <div className="text-2xl font-black text-slate-900 mt-1">{total} জন</div>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm">
                          <span className="text-xs text-emerald-800 font-bold block">উপস্থিত শিক্ষার্থী</span>
                          <div className="text-2xl font-black text-[#006837] mt-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>{present}</span>
                          </div>
                        </div>

                        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 shadow-sm">
                          <span className="text-xs text-rose-800 font-bold block">অনুপস্থিত</span>
                          <div className="text-2xl font-black text-rose-700 mt-1 flex items-center gap-1.5">
                            <XCircle className="w-5 h-5 text-rose-500" />
                            <span>{absent}</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#00341c] to-[#006837] text-white rounded-2xl p-4 border border-emerald-700 shadow-sm">
                          <span className="text-xs text-emerald-200 font-bold block">উপস্থিতির শতকরা হার</span>
                          <div className="text-2xl font-black text-[#DDAA00] mt-1">{rate}%</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Student Action Bar */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={attendanceSearchQuery}
                        onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                        placeholder="শিক্ষার্থীর নাম বা রোল খুঁজুন..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006837]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => handleMarkAllStudents('present')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#006837] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>সকলকে উপস্থিত করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarkAllStudents('absent')}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>সকলকে অনুপস্থিত</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveStudentAttendance}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00341c] via-[#006837] to-[#004d28] hover:from-[#002614] hover:to-[#005a30] border-2 border-[#DDAA00] text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-[#DDAA00]" />
                        <span>শিক্ষার্থী হাজিরা সংরক্ষণ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Student Attendance Table */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-black">
                            <th className="py-3 px-4 w-16 text-center">রোল</th>
                            <th className="py-3 px-4">শিক্ষার্থীর নাম</th>
                            <th className="py-3 px-4 hidden md:table-cell">শ্রেণি</th>
                            <th className="py-3 px-4 hidden sm:table-cell">অভিভাবক মোবাইল</th>
                            <th className="py-3 px-4 text-center">উপস্থিতি স্ট্যাটাস</th>
                            <th className="py-3 px-4 hidden lg:table-cell">মন্তব্য</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {(activeClassStudents || [])
                            .filter(s => {
                              if (!s) return false;
                              if (!attendanceSearchQuery) return true;
                              const q = attendanceSearchQuery.toLowerCase();
                              return (
                                (s.name || '').toLowerCase().includes(q) ||
                                (s.rollNo || '').includes(attendanceSearchQuery)
                              );
                            })
                            .map((s) => {
                              const record = (studentAttendance && s && studentAttendance[s.id]) || { status: 'present', remarks: '' };

                              return (
                                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 px-4 text-center font-mono font-black text-[#006837]">
                                    <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                      {s.rollNo}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4 font-bold text-slate-900 text-xs sm:text-sm">
                                    {s.name}
                                  </td>

                                  <td className="py-3 px-4 hidden md:table-cell text-slate-600 font-semibold">
                                    {attendanceClassFilter}
                                  </td>

                                  <td className="py-3 px-4 hidden sm:table-cell font-mono text-slate-600">
                                    {s.phone}
                                  </td>

                                  {/* Student Status Switcher */}
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setStudentAttendance(prev => ({
                                            ...prev,
                                            [s.id]: { ...record, status: 'present' }
                                          }))
                                        }
                                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'present'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        উপস্থিত
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setStudentAttendance(prev => ({
                                            ...prev,
                                            [s.id]: { ...record, status: 'absent' }
                                          }))
                                        }
                                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'absent'
                                            ? 'bg-rose-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        অনুপস্থিত
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setStudentAttendance(prev => ({
                                            ...prev,
                                            [s.id]: { ...record, status: 'leave' }
                                          }))
                                        }
                                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          record.status === 'leave'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        ছুটি
                                      </button>
                                    </div>
                                  </td>

                                  <td className="py-3 px-4 hidden lg:table-cell">
                                    <input
                                      type="text"
                                      value={record.remarks || ''}
                                      onChange={(e) =>
                                        setStudentAttendance(prev => ({
                                          ...prev,
                                          [s.id]: { ...record, remarks: e.target.value }
                                        }))
                                      }
                                      placeholder="মন্তব্য লিখুন..."
                                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#006837]"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RESULTS MANAGEMENT */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Award className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">ফলাফল ও মার্কস ব্যবস্থাপনা</h2>
                      <p className="text-xs text-slate-500">অনলাইন পরীক্ষার ফলাফল ডেটাবেজ, মার্কশিট তৈরি ও নম্বরপত্র এডিট</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddResult}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ফলাফল যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500">মোট ফলাফল এন্ট্রি</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{results.length} জন</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">ডাটাবেজে সংরক্ষিত রেকর্ড</div>
                </div>
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-2xs">
                  <div className="text-xs font-semibold text-emerald-800">কৃতকার্য / উত্তীর্ণ</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    {results.filter(r => r.resultStatus === 'উত্তীর্ণ').length} জন
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    পাশের হার {results.length > 0 ? Math.round((results.filter(r => r.resultStatus === 'উত্তীর্ণ').length / results.length) * 100) : 0}%
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 shadow-2xs">
                  <div className="text-xs font-semibold text-amber-900">জিপিএ ৫.০০ (A+)</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">
                    {results.filter(r => r.gpa >= 5.0).length} জন
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5">সর্বোচ্চ গ্রেড অর্জনকারী</div>
                </div>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 shadow-2xs">
                  <div className="text-xs font-semibold text-blue-800">তালিকাভুক্ত পরীক্ষা</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    {Array.from(new Set(results.map(r => r.examName))).length} টি
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">ভিন্ন ভিন্ন পরীক্ষা সেশন</div>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="শিক্ষার্থীর নাম, রোল বা রেজি নম্বর খুঁজুন..."
                      value={resultSearchQuery}
                      onChange={(e) => setResultSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <select
                      value={resultExamFilter}
                      onChange={(e) => setResultExamFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
                    >
                      <option value="all">সকল পরীক্ষা</option>
                      {Array.from(new Set(results.map(r => r.examName))).map((exam) => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={resultClassFilter}
                      onChange={(e) => setResultClassFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
                    >
                      <option value="all">সকল শ্রেণি</option>
                      {Array.from(new Set(results.map(r => r.classYear))).map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(resultSearchQuery || resultExamFilter !== 'all' || resultClassFilter !== 'all') && (
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <span>
                      ফিল্টার অনুযায়ী ফলাফল দেখানো হচ্ছে
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setResultSearchQuery('');
                        setResultExamFilter('all');
                        setResultClassFilter('all');
                      }}
                      className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      ফিল্টার রিসেট করুন
                    </button>
                  </div>
                )}
              </div>

              {/* Results Cards List */}
              {(() => {
                const filteredResults = results.filter((res) => {
                  const q = resultSearchQuery.trim().toLowerCase();
                  const matchesQuery = !q ||
                    res.studentName?.toLowerCase().includes(q) ||
                    res.rollNo?.toLowerCase().includes(q) ||
                    res.regNo?.toLowerCase().includes(q) ||
                    res.examName?.toLowerCase().includes(q);
                  const matchesExam = resultExamFilter === 'all' || res.examName === resultExamFilter;
                  const matchesClass = resultClassFilter === 'all' || res.classYear === resultClassFilter;
                  return matchesQuery && matchesExam && matchesClass;
                });

                if (filteredResults.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
                      <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h3 className="font-bold text-slate-700 text-sm">কোনো ফলাফল পাওয়া যায়নি</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        আপনার অনুসন্ধানের সাথে মিল রেখে কোনো ফলাফল পাওয়া যায়নি অথবা এখনও কোনো ফলাফল যুক্ত করা হয়নি।
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddResult}
                        className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>নতুন ফলাফল যোগ করুন</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filteredResults.map((res) => {
                      const isExpanded = expandedResultIds.includes(res.id);
                      return (
                        <div
                          key={res.id}
                          className="rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-all overflow-hidden"
                        >
                          <div className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                    {res.examName}
                                  </span>
                                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                    {res.classYear}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    সেশন: {res.session}
                                  </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mt-1">
                                  {res.studentName}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                                  <span>রোল: <strong className="font-mono text-slate-900">{res.rollNo}</strong></span>
                                  <span>•</span>
                                  <span>রেজিস্ট্রেশন: <strong className="font-mono text-slate-900">{res.regNo || '—'}</strong></span>
                                  <span>•</span>
                                  <span>মোট বিষয়: <strong className="text-slate-900">{res.subjects?.length || 0}টি</strong></span>
                                  <span>•</span>
                                  <span className="text-slate-400">প্রকাশ: {res.publishDate}</span>
                                </div>
                              </div>

                              {/* GPA Badge and Actions */}
                              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                <div className="text-left sm:text-right">
                                  <div className="text-xl sm:text-2xl font-black text-emerald-900">
                                    GPA {res.gpa.toFixed(2)}
                                  </div>
                                  <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                      res.resultStatus === 'উত্তীর্ণ'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      গ্রেড: {res.grade} ({res.resultStatus})
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => setViewingResult(res)}
                                    title="নম্বরপত্র / মার্কশিট দেখুন"
                                    className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">মার্কশিট</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditResult(res)}
                                    title="ফলাফল ও নম্বর সংশোধন করুন"
                                    className="p-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">এডিট</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteResult(res.id, res.studentName)}
                                    title="ফলাফল মুছে ফেলুন"
                                    className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer text-xs font-bold"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Subject toggle button */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => toggleResultExpand(res.id)}
                                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    <span>বিষয়ভিত্তিক প্রাপ্ত নম্বর লুকান</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    <span>বিষয়ভিত্তিক প্রাপ্ত নম্বর দেখুন ({res.subjects?.length || 0}টি বিষয়)</span>
                                  </>
                                )}
                              </button>
                              <span className="text-[11px] text-slate-400 font-mono">আইডি: {res.id}</span>
                            </div>

                            {/* Collapsible Subject Table */}
                            {isExpanded && (
                              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
                                    <tr>
                                      <th className="py-2 px-3">বিষয়</th>
                                      <th className="py-2 px-3 text-center">পূর্ণমান</th>
                                      <th className="py-2 px-3 text-center">প্রাপ্ত নম্বর</th>
                                      <th className="py-2 px-3 text-center">লেটার গ্রেড</th>
                                      <th className="py-2 px-3 text-center">গ্রেড পয়েন্ট</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200/70 text-slate-700 bg-white">
                                    {res.subjects && res.subjects.length > 0 ? (
                                      res.subjects.map((sub, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60">
                                          <td className="py-2 px-3 font-medium text-slate-900">{sub.name}</td>
                                          <td className="py-2 px-3 text-center font-mono">{sub.fullMarks}</td>
                                          <td className="py-2 px-3 text-center font-bold font-mono text-emerald-900">{sub.obtainedMarks}</td>
                                          <td className="py-2 px-3 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                              sub.grade === 'F' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                                            }`}>
                                              {sub.grade}
                                            </span>
                                          </td>
                                          <td className="py-2 px-3 text-center font-bold font-mono">{sub.point.toFixed(2)}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={5} className="py-3 px-3 text-center text-slate-400">
                                          কোনো বিষয়ের তালিকা পাওয়া যায়নি
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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
                            openConfirmModal({
                              title: 'বার্তা মুছে ফেলার নিশ্চিতকরণ',
                              message: 'আপনি কি এই বার্তাটি মুছে ফেলতে চান?',
                              confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                              cancelLabel: 'বাতিল',
                              type: 'danger',
                              onConfirm: () => {
                                deleteMessage(msg.id);
                                closeConfirmModal();
                              }
                            });
                          }}
                          className="text-rose-600 font-bold hover:underline ml-3 cursor-pointer"
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
                  if (authoritySaving) return;
                  setAuthoritySaving(true);
                  setAuthoritySaved(false);

                  setTimeout(() => {
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
                    setAuthoritySaving(false);
                    setAuthoritySaved(true);

                    try {
                      confetti({
                        particleCount: 85,
                        spread: 70,
                        origin: { y: 0.75 },
                        colors: ['#006837', '#DDAA00', '#10b981', '#ffffff']
                      });
                    } catch (err) {}

                    setTimeout(() => setAuthoritySaved(false), 4000);
                  }, 600);
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
                    disabled={authoritySaving}
                    className={`relative overflow-hidden group inline-flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer btn-shimmer-effect ${
                      authoritySaving
                        ? 'bg-slate-700 text-slate-200 cursor-wait'
                        : authoritySaved
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white ring-4 ring-emerald-400/40 shadow-emerald-900/30 scale-105'
                        : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:scale-95 btn-pulse-glow'
                    }`}
                  >
                    {authoritySaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#DDAA00]" />
                        <span>বাণী সংরক্ষণ করা হচ্ছে...</span>
                      </>
                    ) : authoritySaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white animate-success-pop" />
                        <span className="font-black">বাণী সফলভাবে সংরক্ষিত! 🎉</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-[#DDAA00] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span>কর্তৃপক্ষের বাণী সংরক্ষণ করুন (Save Changes)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: MADRASAH SETTINGS & MEDIA ASSETS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-1.5">
                    <Settings className="w-3.5 h-3.5 text-[#006837]" />
                    <span>প্রাতিষ্ঠানিক পরিচিতি ও ব্র্যান্ডিং কনফিগ</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>মাদ্রাসার সাধারণ সেটিংস ও মিডিয়া আপলোড</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    মাদ্রাসার মূল লোগো, কভার ব্যানার, অফিশিয়াল কোড ও যোগাযোগের তথ্য পরিবর্তন করুন
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsForm(info);
                      alert('সেটিংস পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>রিলোড</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={settingsSaving}
                    className={`relative overflow-hidden group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer btn-shimmer-effect ${
                      settingsSaving
                        ? 'bg-slate-700 text-slate-200 cursor-wait'
                        : settingsSaved
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white ring-4 ring-emerald-300 shadow-emerald-900/30 scale-105'
                        : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl hover:shadow-emerald-900/25 active:scale-95 btn-pulse-glow'
                    }`}
                  >
                    {settingsSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#DDAA00]" />
                        <span>সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : settingsSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white animate-success-pop" />
                        <span className="font-black">সংরক্ষিত! ✅</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 transition-transform group-hover:scale-125" />
                        <span>সেভ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Cloud Toast Feedback */}
              {cloudToast.show && (
                <div className={`p-4 text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  cloudToast.type === 'error' ? 'bg-gradient-to-r from-rose-600 to-red-700' : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="font-bold text-xs">{cloudToast.message}</span>
                  </div>
                </div>
              )}

              {/* Toast Feedback */}
              {settingsSaved && (
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-[#006837] text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</h4>
                      <p className="text-xs text-emerald-100">মাদ্রাসার লোগো, ব্যানার ও সকল তথ্য লাইভ ওয়েবসাইটে হালনাগাদ করা হয়েছে।</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full font-mono">লাইভ সিঙ্ক সম্পন্ন</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* SECTION 0: SUPABASE CLOUD DATABASE REAL-TIME SYNC */}
              {/* ======================================================== */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-7 rounded-3xl border border-emerald-500/30 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-white">সুপাবেজ ক্লাউড ডাটাবেজ সংযোগ (Supabase Cloud Sync)</h3>
                        {isCloudConnected ? (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            সক্রিয় সিঙ্ক (Live)
                          </span>
                        ) : (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            লোকাল মোড (অফলাইন)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        সকল ডিভাইস, কম্পিউটার ও মোবাইলে একই ডাটা দেখতে এবং তাৎক্ষণিক লাইভ ভর্তি আবেদন পাওয়ার জন্য ডাটাবেজ সংযুক্ত করুন।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUploadAllToCloud}
                      disabled={cloudSyncing}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                      title="বর্তমান সকল নোটিশ, শিক্ষক ও শিক্ষার্থী ডাটা ক্লাউডে আপলোড করুন"
                    >
                      {cloudSyncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>সব ডাটা ক্লাউডে পাঠান</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Supabase Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      ১. Supabase Project URL
                    </label>
                    <input
                      type="url"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      ২. Supabase Anon / Public API Key
                    </label>
                    <input
                      type="text"
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 relative z-10">
                  <p className="text-[11px] text-slate-400">
                    💡 তথ্য দুটি সেভ করার পর সকল ডিভাইসে একই ডাটা দেখাবে এবং যে কেউ ভর্তি আবেদন করলে সরাসরি অ্যাডমিন প্যানেলে জমা হবে।
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveCloudConfig}
                    disabled={cloudSyncing}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>কানেকশন সংরক্ষণ ও সিঙ্ক করুন</span>
                  </button>
                </div>

                {/* SQL Setup Helper Drawer */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 relative z-10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>সুপাবেজ টেবিল তৈরির SQL কোড (১-ক্লিকে রান করুন):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const sql = `CREATE TABLE IF NOT EXISTS madrasah_store (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE madrasah_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON madrasah_store FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON madrasah_store FOR ALL USING (true);`;
                        navigator.clipboard.writeText(sql);
                        setCloudSqlCopied(true);
                        setTimeout(() => setCloudSqlCopied(false), 3000);
                      }}
                      className="text-[11px] font-bold text-teal-300 hover:text-teal-100 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {cloudSqlCopied ? 'কপি হয়েছে ✓' : '📋 SQL কোড কপি করুন'}
                    </button>
                  </div>
                  <pre className="p-3 bg-black/40 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto border border-white/5">
                    {`CREATE TABLE IF NOT EXISTS madrasah_store (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE madrasah_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON madrasah_store FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON madrasah_store FOR ALL USING (true);`}
                  </pre>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* ======================================================== */}
                {/* SECTION 1: LOGO & COVER BANNER MEDIA UPLOAD */}
                {/* ======================================================== */}
                <div className="bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 p-5 sm:p-7 rounded-2xl border-2 border-emerald-200/80 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-[#006837] text-white flex items-center justify-center shadow-sm">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">১. প্রাতিষ্ঠানিক লোগো ও কভার ব্যানার আপলোড</h3>
                        <p className="text-xs text-slate-500">মাদ্রাসার অফিসিয়াল ব্র্যান্ডিং ও রিয়েল ইমেজ পরিবর্তন করুন</p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg self-start sm:self-auto">
                      সরাসরি লাইভ প্রিভিউ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LOGO UPLOAD CARD */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#DDAA00]" />
                            <span>মাদ্রাসার অফিশিয়াল লোগো (Logo)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsForm(prev => ({ ...prev, logo: '/logo.png' }))}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline font-bold cursor-pointer"
                          >
                            মূল লোগো ফিরিয়ে আনুন
                          </button>
                        </div>

                        {/* Dual Preview: Light & Header view */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Light Preview */}
                          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[140px]">
                            <div className="relative w-20 h-20 drop-shadow-md">
                              <Image
                                src={settingsForm.logo || '/logo.png'}
                                alt={settingsForm.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold mt-2">লাইট ব্যাকগ্রাউন্ডে প্রিভিউ</span>
                          </div>

                          {/* Header Dark Green Preview */}
                          <div className="bg-[#006837] rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[140px] text-white shadow-inner">
                            <div className="relative w-20 h-20 drop-shadow-lg">
                              <Image
                                src={settingsForm.logo || '/logo.png'}
                                alt={settingsForm.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-[10px] text-emerald-200 font-bold mt-2">গ্রিন হেডারে প্রিভিউ</span>
                          </div>
                        </div>

                        {/* Upload Controls */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="madrasah-logo-file"
                              className="flex-1 bg-gradient-to-r from-emerald-700 to-[#006837] hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
                            >
                              <Upload className="w-4 h-4" />
                              <span>কম্পিউটার/মোবাইল থেকে নতুন লোগো আপলোড</span>
                            </label>
                            <input
                              id="madrasah-logo-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSettingsImageUpload(e, 'logo')}
                              className="hidden"
                            />
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={settingsForm.logo || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                              placeholder="অথবা লোগোর ওয়েব লিংক দিন (https://...)"
                              className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            />
                            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 space-y-0.5">
                        <p className="font-bold text-emerald-900">💡 লোগো ব্যবহারের নিয়মাবলী:</p>
                        <p>স্কয়ার বা গোল আকারের PNG/WEBP ফরম্যাট এবং স্বচ্ছ (Transparent) ব্যাকগ্রাউন্ড সবচেয়ে আকর্ষণীয় ফলাফল দেবে। সর্বোচ্চ সাইজ: ৫ মেগাবাইট।</p>
                      </div>
                    </div>

                    {/* COVER BANNER UPLOAD CARD */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-emerald-700" />
                            <span>মাদ্রাসার কভার ব্যানার (Cover Banner)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsForm(prev => ({
                              ...prev,
                              bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'
                            }))}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline font-bold cursor-pointer"
                          >
                            ডিফল্ট ব্যানার
                          </button>
                        </div>

                        {/* Banner Preview */}
                        <div className="relative w-full h-36 rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner group">
                          {settingsForm.bannerImage ? (
                            <Image
                              src={settingsForm.bannerImage}
                              alt="মাদ্রাসা কভার ব্যানার"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                              কোনো ব্যানার নির্বাচন করা হয়নি
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                            <div className="text-white">
                              <span className="text-[9px] bg-[#DDAA00] text-slate-950 font-black px-1.5 py-0.5 rounded">লাইভ কভার ব্যানার</span>
                              <h4 className="font-bold text-xs line-clamp-1 drop-shadow mt-0.5">{settingsForm.name}</h4>
                            </div>
                          </div>
                        </div>

                        {/* Banner Upload Controls */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="madrasah-banner-file"
                              className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-black hover:to-black text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
                            >
                              <Upload className="w-4 h-4 text-[#DDAA00]" />
                              <span>কম্পিউটার/মোবাইল থেকে ব্যানার ছবি আপলোড</span>
                            </label>
                            <input
                              id="madrasah-banner-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSettingsImageUpload(e, 'bannerImage')}
                              className="hidden"
                            />
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={settingsForm.bannerImage || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, bannerImage: e.target.value })}
                              placeholder="অথবা ব্যানার ছবির ওয়েব লিংক দিন (URL)..."
                              className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            />
                            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                        <p className="font-bold text-slate-800">💡 ব্যানার ব্যবহারের নিয়মাবলী:</p>
                        <p>১২০০x৪৫০ বা ল্যান্ডস্কেপ রেজোলিউশনের ছবির মান চমৎকার আসবে। এটি মাদ্রাসার সম্পর্কে ও ক্যাম্পাস হেডার হিসেবে ব্যবহৃত হবে।</p>
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL SEAL & SIGNATURE UPLOAD */}
                  <div className="border-t border-emerald-100 pt-5">
                    <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>মাদ্রাসার অফিশিয়াল সিল ও সুপারের ডিজিটাল স্বাক্ষর (ভর্তি ফরম ও মার্কশীটের জন্য)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Official Seal */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {settingsForm.officialSeal ? (
                            <Image
                              src={settingsForm.officialSeal}
                              alt="মাদ্রাসার সিল"
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 text-center font-bold px-1">সিল নেই</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <label className="block text-xs font-bold text-slate-800">মাদ্রাসার অফিশিয়াল সিল / স্ট্যাম্প</label>
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="seal-file"
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer transition"
                            >
                              আপলোড করুন
                            </label>
                            <input
                              id="seal-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSettingsImageUpload(e, 'officialSeal')}
                              className="hidden"
                            />
                            {settingsForm.officialSeal && (
                              <button
                                type="button"
                                onClick={() => setSettingsForm({ ...settingsForm, officialSeal: '' })}
                                className="text-[11px] text-rose-600 hover:underline font-bold"
                              >
                                মুছে ফেলুন
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Principal Signature */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-4">
                        <div className="w-24 h-16 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {settingsForm.principalSignature ? (
                            <Image
                              src={settingsForm.principalSignature}
                              alt="প্রধানের স্বাক্ষর"
                              width={96}
                              height={64}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 text-center font-bold px-1">স্বাক্ষর নেই</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <label className="block text-xs font-bold text-slate-800">সুপারিনটেনডেন্টের ডিজিটাল স্বাক্ষর</label>
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="signature-file"
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer transition"
                            >
                              আপলোড করুন
                            </label>
                            <input
                              id="signature-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSettingsImageUpload(e, 'principalSignature')}
                              className="hidden"
                            />
                            {settingsForm.principalSignature && (
                              <button
                                type="button"
                                onClick={() => setSettingsForm({ ...settingsForm, principalSignature: '' })}
                                className="text-[11px] text-rose-600 hover:underline font-bold"
                              >
                                মুছে ফেলুন
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 2: ACADEMIC DETAILS & GOVERNMENT CODES */}
                {/* ======================================================== */}
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">২. মাদ্রাসার নাম, পরিচয় ও শিক্ষাবোর্ড কোডসমূহ</h3>
                      <p className="text-xs text-slate-500">সরকারি ও প্রাতিষ্ঠানিক ডাটাবেজ তথ্য</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মাদ্রাসার পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রতিষ্ঠা সাল (Established Year)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.established || '১৯৯৫'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, established: e.target.value })}
                        placeholder="যেমন: ১৯৯৫"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মাদ্রাসার নাম (ইংরেজি / English Name)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.englishName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, englishName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রাতিষ্ঠানিক মূল স্লোগান (Motto/Slogan)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.slogan || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                        placeholder="দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        EIIN নম্বর
                      </label>
                      <input
                        type="text"
                        value={settingsForm.eiin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, eiin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-[#006837] focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মাদ্রাসা কোড (Madrasah Code)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.madrasahCode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, madrasahCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        এমপিও কোড (MPO Code)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.mpoCode || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mpoCode: e.target.value })}
                        placeholder="৪২১০৫১২৩"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 3: CONTACT INFO & OFFICE HOURS */}
                {/* ======================================================== */}
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">৩. প্রাতিষ্ঠানিক যোগাযোগ, ঠিকানা ও অফিসের সময়সূচি</h3>
                      <p className="text-xs text-slate-500">অভিভাবক ও শিক্ষার্থীদের যোগাযোগের তথ্য</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রধান মোবাইল নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="+৮৮০১৭১২-৩৪৫৬৭৮"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বিকল্প নম্বর / হেল্পলাইন
                      </label>
                      <input
                        type="text"
                        value={settingsForm.altPhone || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, altPhone: e.target.value })}
                        placeholder="+৮৮০১৮১২-৩৪৫৬৭৮"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রাতিষ্ঠানিক ইমেইল ঠিকানা
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        placeholder="poschimalohali@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মাদ্রাসার পূর্ণ ঠিকানা (ক্যাম্পাস অবস্থান)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        placeholder="পশ্চিম আলোহালী, ডাকঘর: আলোহালী, উপজেলা: দুপচাঁচিয়া, জেলা: বগুড়া"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        উপজেলা ও জেলা
                      </label>
                      <input
                        type="text"
                        value={settingsForm.location || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                        placeholder="দুপচাঁচিয়া, বগুড়া"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        অফিস চলার সময়সূচি (Office Hours)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.officeHours || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, officeHours: e.target.value })}
                        placeholder="শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:৩০"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 4: SOCIAL MEDIA & PORTAL LINKS */}
                {/* ======================================================== */}
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">৪. সামাজিক যোগাযোগ মাধ্যম ও পোর্টাল লিংক</h3>
                      <p className="text-xs text-slate-500">মাদ্রাসার সোশ্যাল পেজ ও চ্যানেল</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ফেসবুক পেজ লিংক (Facebook URL)</label>
                      <input
                        type="url"
                        value={settingsForm.facebookUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/poschimalohali"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ইউটিউব চ্যানেল লিংক (YouTube URL)</label>
                      <input
                        type="url"
                        value={settingsForm.youtubeUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@poschimalohali"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SAVE BUTTON BOTTOM BAR */}
                {/* ======================================================== */}
                <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-emerald-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-[#006837] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Save className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">সকল সেটিংস সংরক্ষণ করতে চান?</h4>
                      <p className="text-xs text-slate-500">সেভ বাটনে চাপলে লোগো, ব্যানার ও সকল তথ্য তাৎক্ষণিক লাইভ ওয়েবসাইটে কার্যকর হবে।</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className={`w-full sm:w-auto relative overflow-hidden group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all duration-300 cursor-pointer btn-shimmer-effect ${
                        settingsSaving
                          ? 'bg-slate-700 text-slate-200 cursor-wait scale-[0.98]'
                          : settingsSaved
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white ring-4 ring-emerald-400/50 shadow-emerald-900/30 scale-105'
                          : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 active:scale-95 btn-pulse-glow'
                      }`}
                    >
                      {settingsSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#DDAA00]" />
                          <span className="tracking-wide">সংরক্ষণ করা হচ্ছে...</span>
                        </>
                      ) : settingsSaved ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-white animate-success-pop" />
                          <span className="tracking-wide font-black">সফলভাবে সংরক্ষিত হয়েছে! 🎉</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
                          <span>সকল সেটিংস ও মিডিয়া সংরক্ষণ করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB: PRAYER TIMES SETTINGS */}
          {activeTab === 'prayer' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#006837]" />
                    <span>ইসলামিক ক্যালেন্ডার ও সালাত সময়সূচি</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">সালাতের সময়সূচি ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-500">
                    মাদ্রাসার মসজিদ ও এলাকার মুসল্লিদের জন্য দৈনিক আযান, জামাত, সাহরি ও ইফতারের সময় আপডেট করুন
                  </p>
                </div>

                {prayerSaved && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>সময়সূচি সফলভাবে সংরক্ষিত হয়েছে!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handlePrayerSubmit} className="space-y-6">
                {/* Active switch */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">হোমপেজে সালাতের সময়সূচি প্রদর্শন</h4>
                    <p className="text-xs text-emerald-700">অন করলে হোমপেজে লাইভ ডিজিটাল ঘড়ি ও ৫ ওয়াক্ত সালাতের কার্ড প্রদর্শিত হবে</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prayerForm.isEnabled}
                      onChange={(e) => setPrayerForm({ ...prayerForm, isEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006837]"></div>
                  </label>
                </div>

                {/* Area Note */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    এলাকা বা অঞ্চলের নোট (Area Label)
                  </label>
                  <input
                    type="text"
                    value={prayerForm.areaNote}
                    onChange={(e) => setPrayerForm({ ...prayerForm, areaNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                    placeholder="যেমন: দুপচাঁচিয়া ও বগুড়া অঞ্চলের স্থানীয় ওয়াক্ত ও জামাত সময়সূচি"
                  />
                </div>

                {/* Prayers 2-column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* ফজর */}
                  <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        <Moon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">ফজর (الفجر)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">আযানের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.fajrAthan}
                          onChange={(e) => setPrayerForm({ ...prayerForm, fajrAthan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                          placeholder="০৪:৪৫"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">জামাতের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.fajrIqamah}
                          onChange={(e) => setPrayerForm({ ...prayerForm, fajrIqamah: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-black text-emerald-800 bg-emerald-50/50"
                          placeholder="০৫:১৫"
                        />
                      </div>
                    </div>
                  </div>

                  {/* সূর্যোদয় */}
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        <Sunrise className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">সূর্যোদয় ও ইশরাক (الشروق)</h4>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">সূর্যোদয়ের সময়</label>
                      <input
                        type="text"
                        value={prayerForm.sunrise}
                        onChange={(e) => setPrayerForm({ ...prayerForm, sunrise: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                        placeholder="০৬:০৫"
                      />
                    </div>
                  </div>

                  {/* যোহর */}
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        <Sun className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">যোহর (الظهر)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">আযানের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.dhuhrAthan}
                          onChange={(e) => setPrayerForm({ ...prayerForm, dhuhrAthan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                          placeholder="১২:১৫"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">জামাতের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.dhuhrIqamah}
                          onChange={(e) => setPrayerForm({ ...prayerForm, dhuhrIqamah: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-black text-emerald-800 bg-emerald-50/50"
                          placeholder="০১:১৫"
                        />
                      </div>
                    </div>
                  </div>

                  {/* আসর */}
                  <div className="bg-white p-4 rounded-2xl border border-orange-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-orange-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs">
                        <Sunset className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">আসর (العصر)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">আযানের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.asrAthan}
                          onChange={(e) => setPrayerForm({ ...prayerForm, asrAthan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                          placeholder="০৪:১৫"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">জামাতের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.asrIqamah}
                          onChange={(e) => setPrayerForm({ ...prayerForm, asrIqamah: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-black text-emerald-800 bg-emerald-50/50"
                          placeholder="০৪:৪৫"
                        />
                      </div>
                    </div>
                  </div>

                  {/* মাগরিব */}
                  <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                        <Sunset className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">মাগরিব (المغرب)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">আযান ও ইফতার</label>
                        <input
                          type="text"
                          value={prayerForm.maghribAthan}
                          onChange={(e) => setPrayerForm({ ...prayerForm, maghribAthan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                          placeholder="০৫:৩৬"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">জামাতের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.maghribIqamah}
                          onChange={(e) => setPrayerForm({ ...prayerForm, maghribIqamah: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-black text-emerald-800 bg-emerald-50/50"
                          placeholder="০৫:৪০"
                        />
                      </div>
                    </div>
                  </div>

                  {/* এশা */}
                  <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                        <Moon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">এশা ও বিতর (العشاء)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">আযানের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.ishaAthan}
                          onChange={(e) => setPrayerForm({ ...prayerForm, ishaAthan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                          placeholder="০৭:০০"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">জামাতের সময়</label>
                        <input
                          type="text"
                          value={prayerForm.ishaIqamah}
                          onChange={(e) => setPrayerForm({ ...prayerForm, ishaIqamah: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-black text-emerald-800 bg-emerald-50/50"
                          placeholder="০৭:৪৫"
                        />
                      </div>
                    </div>
                  </div>

                  {/* জুমুআ */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#006837] text-[#DDAA00] flex items-center justify-center font-bold text-xs">
                        🕌
                      </div>
                      <h4 className="font-bold text-[#006837] text-sm">পবিত্র জুমুআ (শুক্রবার)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">বয়ান ও আযান</label>
                        <input
                          type="text"
                          value={prayerForm.jumuahBayan}
                          onChange={(e) => setPrayerForm({ ...prayerForm, jumuahBayan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                          placeholder="১২:৩০"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">খুতবা ও জামাত</label>
                        <input
                          type="text"
                          value={prayerForm.jumuahIqamah}
                          onChange={(e) => setPrayerForm({ ...prayerForm, jumuahIqamah: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-black text-emerald-800 bg-emerald-50/50"
                          placeholder="০১:৩০"
                        />
                      </div>
                    </div>
                  </div>

                  {/* সাহরি ও তাহাজ্জুদ */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                        🌙
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">সাহরি ও তাহাজ্জুদ শেষ</h4>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">শেষ সময় (ভোর)</label>
                      <input
                        type="text"
                        value={prayerForm.tahajjudEnd}
                        onChange={(e) => setPrayerForm({ ...prayerForm, tahajjudEnd: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold"
                        placeholder="০৪:৪০"
                      />
                    </div>
                  </div>

                  {/* ইফতার */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                        🌅
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">ইফতারের সময়সূচি</h4>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">ইফতারের সময় (সন্ধ্যা)</label>
                      <input
                        type="text"
                        value={prayerForm.iftarTime}
                        onChange={(e) => setPrayerForm({ ...prayerForm, iftarTime: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold text-rose-700 bg-rose-50/40"
                        placeholder="০৫:৩৬"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    * সংরক্ষিত সময়সূচি সরাসরি ওয়েবসাইটে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
                  </div>
                  <button
                    type="submit"
                    disabled={prayerSaving}
                    className={`relative overflow-hidden group inline-flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer btn-shimmer-effect ${
                      prayerSaving
                        ? 'bg-slate-700 text-slate-200 cursor-wait'
                        : prayerSaved
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white ring-4 ring-emerald-400/40 shadow-emerald-900/30 scale-105'
                        : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:scale-95 btn-pulse-glow'
                    }`}
                  >
                    {prayerSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#DDAA00]" />
                        <span>সময়সূচি সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : prayerSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white animate-success-pop" />
                        <span className="font-black">সময়সূচি সংরক্ষিত! ✅</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>সালাতের সময়সূচি সংরক্ষণ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* TAB 16: ADMIN USERS & PERMISSION MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[#006837]" />
                    <span>অ্যাডমিন প্রোফাইল ও পারমিশন কন্ট্রোল</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    মাদ্রাসার প্রশাসনিক ও স্টাফ প্রোফাইল তৈরি করুন এবং প্রতিটি ব্যবহারকারী অ্যাডমিন প্যানেলের কোন কোন মেনু ব্যবহার করতে পারবেন তা নিয়ন্ত্রণ করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddUser}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-[#006837] hover:from-emerald-800 hover:to-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রোফাইল তৈরি করুন</span>
                </button>
              </div>

              {/* Toast Alert */}
              {userToast.show && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{userToast.message}</span>
                </div>
              )}

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* মোট প্রোফাইল */}
                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">{adminUsers.length} জন</div>
                    <div className="text-[11px] font-bold text-slate-500">মোট ইউজার প্রোফাইল</div>
                  </div>
                </div>

                {/* সক্রিয় প্রোফাইল */}
                <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-teal-900">
                      {adminUsers.filter(u => u.isActive).length} জন
                    </div>
                    <div className="text-[11px] font-bold text-teal-700">সক্রিয় ইউজার একাউন্ট</div>
                  </div>
                </div>

                {/* সুপার অ্যাডমিন */}
                <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-amber-900">
                      {adminUsers.filter(u => u.isSuperAdmin).length} জন
                    </div>
                    <div className="text-[11px] font-bold text-amber-800">মাস্টার সুপার অ্যাডমিন</div>
                  </div>
                </div>

                {/* স্টাফ ও ইনচার্জ */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-blue-900">
                      {adminUsers.filter(u => !u.isSuperAdmin).length} জন
                    </div>
                    <div className="text-[11px] font-bold text-blue-700">স্টাফ ও ইনচার্জ প্রোফাইল</div>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-black text-sm text-amber-950">কীভাবে ইউজার ও অপশন পারমিশন কাজ করে?</div>
                  <p className="text-amber-800 leading-relaxed">
                    এখানে আপনি মাদ্রাসার বিভিন্ন দায়িত্বশীল শিক্ষক ও কর্মচারীদের জন্য আলাদা ইউজারনেম ও পাসওয়ার্ড দিয়ে প্রোফাইল তৈরি করতে পারবেন। প্রতিটি প্রোফাইলে ঠিক যে কয়টি মডিউলে টিকচিহ্ন দেওয়া থাকবে, সেই ইউজার অ্যাডমিন প্যানেলে লগইন করার পর শুধুমাত্র সেই নির্দিষ্ট অপশনগুলোই দেখতে ও সম্পাদনা করতে পারবেন। বাকি অপশনগুলো তার স্ক্রিন থেকে স্বয়ংক্রিয়ভাবে লুকিয়ে রাখা হবে।
                  </p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="নাম, ইউজারনেম, পদবী বা মোবাইল দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setUserStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    সকল ({adminUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'active'
                        ? 'bg-emerald-700 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    সক্রিয় ({adminUsers.filter(u => u.isActive).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserStatusFilter('inactive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'inactive'
                        ? 'bg-rose-600 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    নিষ্ক্রিয় ({adminUsers.filter(u => !u.isActive).length})
                  </button>
                </div>
              </div>

              {/* User Profiles Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredUsers.map((user) => {
                  const isVisiblePass = !!visiblePasswords[user.id];
                  const isCurrent = currentAdminUser?.id === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 p-5 space-y-4 shadow-xs hover:shadow-md ${
                        user.isSuperAdmin
                          ? 'border-amber-300 ring-1 ring-amber-200/50 bg-gradient-to-br from-amber-50/20 via-white to-white'
                          : user.isActive
                          ? 'border-slate-200 hover:border-emerald-300'
                          : 'border-slate-200 bg-slate-50/60 opacity-80'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm relative ${
                              user.isSuperAdmin
                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                                : user.isActive
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                                : 'bg-slate-300 text-slate-600'
                            }`}
                          >
                            {user.name.charAt(0) || 'U'}
                            {/* Status Dot */}
                            <span
                              className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                user.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                              title={user.isActive ? 'সক্রিয় অ্যাকাউন্ট' : 'নিষ্ক্রিয় অ্যাকাউন্ট'}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-slate-900 text-sm">{user.name}</h3>
                              {user.isSuperAdmin && (
                                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                                  👑 সুপার অ্যাডমিন
                                </span>
                              )}
                              {isCurrent && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  বর্তমান লগইন
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-emerald-800">{user.role}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-600 font-bold">@{user.username}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              user.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {user.isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>সক্রিয়</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-400" />
                                <span>নিষ্ক্রিয়</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Credentials & Details Strip */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="font-bold text-slate-700">ইউজারনেম:</span>
                          <span className="font-mono font-bold text-slate-900">{user.username}</span>
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="font-bold text-slate-700">পাসওয়ার্ড:</span>
                            <span className="font-mono font-bold text-slate-900">
                              {isVisiblePass ? user.password : '••••••••'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title={isVisiblePass ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                          >
                            {isVisiblePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {user.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="font-bold text-slate-700">মোবাইল:</span>
                            <span className="font-mono text-slate-800">{user.phone}</span>
                          </div>
                        )}

                        {user.email && (
                          <div className="flex items-center gap-2 text-slate-600 truncate">
                            <span className="font-bold text-slate-700">ইমেইল:</span>
                            <span className="truncate text-slate-800">{user.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Permitted Modules Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">
                            অনুমোদিত অপশন ও পারমিশন:
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {user.isSuperAdmin
                              ? 'সকল ১৬টি মডিউলে পূর্ণ অধিকার'
                              : `${(user.permissions || []).length} টি অপশন অনুমোদিত`}
                          </span>
                        </div>

                        {user.isSuperAdmin ? (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>মাস্টার সুপার অ্যাডমিন — অ্যাডমিন প্যানেলের সকল সেটিংস ও অপশনে অ্যাক্সেস বিদ্যমান।</span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50/70 rounded-xl border border-slate-200/70">
                            {(user.permissions || []).map((permId) => {
                              const permInfo = availablePermissions.find(p => p.id === permId);
                              if (!permInfo) return null;
                              return (
                                <span
                                  key={permId}
                                  className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  <span>{permInfo.name || permInfo.title}</span>
                                </span>
                              );
                            })}
                            {(user.permissions || []).length === 0 && (
                              <span className="text-rose-600 text-[11px] font-bold">
                                কোনো অপশন অনুমোদিত নয় (লগইন সীমাবদ্ধ)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>সম্পাদনা ও পারমিশন</span>
                          </button>

                          {/* Quick Preview Test Button */}
                          {user.isActive && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                switchAdminUser(user.id);
                                setUserToast({
                                  show: true,
                                  message: `"${user.name}" হিসেবে অ্যাডমিন প্যানেল প্রিভিউ চালু হয়েছে! প্যানেলে এখন শুধুমাত্র অনুমোদিত অপশনগুলো দৃশ্যমান।`
                                });
                                setTimeout(() => setUserToast({ show: false, message: '' }), 3500);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors cursor-pointer"
                              title="এই ইউজারের দৃষ্টিতে অ্যাডমিন প্যানেল টেস্ট করুন"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>প্রিভিউ দেখুন</span>
                            </button>
                          )}

                          {!user.isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleToggleUserActive(user)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                user.isActive
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {user.isActive ? (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>নিষ্ক্রিয় করুন</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>সক্রিয় করুন</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Quick Copy Credentials Button */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`ইউজারনেম: ${user.username}\nপাসওয়ার্ড: ${user.password}`);
                              setUserToast({ show: true, message: `"${user.name}" এর ইউজারনেম ও পাসওয়ার্ড ক্লিপবোর্ডে কপি হয়েছে!` });
                              setTimeout(() => setUserToast({ show: false, message: '' }), 3000);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="ইউজারনেম ও পাসওয়ার্ড কপি করুন"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {!user.isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="প্রোফাইল মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm">কোনো ইউজার প্রোফাইল পাওয়া যায়নি</h3>
                    <p className="text-xs text-slate-400">
                      অনুসন্ধান শব্দ পরিবর্তন করে দেখুন অথবা নতুন প্রোফাইল তৈরি করুন।
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddUser}
                      className="inline-flex items-center gap-2 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন প্রোফাইল তৈরি</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: ROUTINE MANAGEMENT */}
          {activeTab === 'routine' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> ক্লাস রুটিন
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">ক্লাস ও শিক্ষা রুটিন ব্যবস্থাপনা</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    সকল শ্রেণির দৈনিক পাঠদান সময়সূচি, ঘণ্টা/পিরিয়ড, বিষয় ও দায়িত্বপ্রাপ্ত শিক্ষক নির্ধারণ করুন
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <a
                    href="/routine"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>লাইভ রুটিন দেখুন</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleOpenAddClass}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ নতুন শ্রেণি যুক্ত করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openConfirmModal({
                        title: 'সকল রুটিন রিস্টোর',
                        message: 'আপনি কি সকল শ্রেণির রুটিন ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান? এতে আপনার করা কাস্টম পরিবর্তনগুলো মুছে যাবে।',
                        confirmLabel: 'হ্যাঁ, ডিফল্ট রিস্টোর করুন',
                        cancelLabel: 'বাতিল',
                        type: 'warning',
                        onConfirm: () => {
                          resetRoutinesToDefault();
                          showRoutineAlert('সকল রুটিন সফলভাবে ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে!');
                          closeConfirmModal();
                        }
                      });
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    title="ডিফল্ট রুটিন রিস্টোর করুন"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Class Selector Bar */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-800">রুটিন সম্পাদনার জন্য শ্রেণি নির্বাচন করুন:</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {routines.length}টি শ্রেণি
                    </span>
                  </div>

                  {/* Dropdown for quick access */}
                  <select
                    value={activeRoutine?.id || ''}
                    onChange={(e) => setSelectedRoutineClassId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                  >
                    {(routines || []).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.className} ({(r.periods || []).length}টি পিরিয়ড)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Horizontal Class Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(routines || []).map((r) => {
                    const isCurrent = activeRoutine?.id === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRoutineClassId(r.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/50'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span>{r.className}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isCurrent
                              ? 'bg-emerald-950 text-amber-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {(r.periods || []).length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Class Info & Action Card */}
              {activeRoutine ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="text-lg sm:text-xl font-black text-white">
                          {activeRoutine.className}
                        </h3>
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {(activeRoutine.periods || []).length}টি পিরিয়ড অন্তর্ভুক্ত
                        </span>
                      </div>
                      <div className="text-xs text-emerald-200 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          কার্যকরের তারিখ:{' '}
                          <strong>{activeRoutine.effectiveDate || '০১ জানুয়ারি ২০২৬'}</strong>
                        </span>
                        {activeRoutine.notes && (
                          <span className="text-emerald-300/90 italic">
                            নোট: {activeRoutine.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEditClass(activeRoutine)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-300" />
                        <span>শ্রেণি তথ্য সম্পাদনা</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClass(activeRoutine)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-colors border border-rose-400/30 flex items-center gap-1 cursor-pointer"
                        title="এই শ্রেণির সম্পূর্ণ রুটিন মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                        <span>শ্রেণি মুছুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenAddPeriod}
                        className="px-4 py-2 rounded-xl bg-[#DDAA00] hover:bg-[#c99b00] text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto md:ml-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ নতুন পিরিয়ড যোগ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Periods Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-bold text-slate-800 text-sm">
                          {activeRoutine.className}-এর নিয়মিত বিষয়ভিত্তিক সময়সূচি
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500">
                        মোট পিরিয়ড: <strong>{(activeRoutine.periods || []).length}টি</strong>
                      </span>
                    </div>

                    {(activeRoutine.periods || []).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                            <tr>
                              <th className="py-3 px-4">ক্রম</th>
                              <th className="py-3 px-4">ঘণ্টা / অধিবেশন</th>
                              <th className="py-3 px-4">সময়সূচি</th>
                              <th className="py-3 px-4">বিষয়</th>
                              <th className="py-3 px-4">দায়িত্বপ্রাপ্ত শিক্ষক</th>
                              <th className="py-3 px-4">রুম / কক্ষ</th>
                              <th className="py-3 px-4 text-right">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(activeRoutine.periods || []).map((period, idx) => {
                              const isBreak = Boolean(
                                (period.subject && (period.subject.includes('বিরতি') || period.subject.includes('সালাত'))) ||
                                (period.period && period.period.includes('বিরতি'))
                              );

                              return (
                                <tr
                                  key={period.id || idx}
                                  className={
                                    isBreak
                                      ? 'bg-amber-50/70 font-semibold'
                                      : 'hover:bg-slate-50/80 transition-colors'
                                  }
                                >
                                  <td className="py-3 px-4 font-mono text-slate-400">
                                    {idx + 1}
                                  </td>
                                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                    {period.period}
                                  </td>
                                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                                    {period.time}
                                  </td>
                                  <td className="py-3 px-4 font-bold text-slate-800">
                                    {period.subject}
                                    {isBreak && (
                                      <span className="ml-2 text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                                        বিরতি
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600 font-medium">
                                    {period.teacher}
                                  </td>
                                  <td className="py-3 px-4 text-slate-500 font-mono">
                                    {period.room || '—'}
                                  </td>
                                  <td className="py-3 px-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditPeriod(period)}
                                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                        title="সম্পাদনা করুন"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeletePeriod(period.id, period.period)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                        title="মুছে ফেলুন"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 text-center p-6 space-y-3">
                        <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-slate-700 text-sm">
                          এই শ্রেণিতে এখনো কোনো পিরিয়ড বা ঘণ্টা যুক্ত করা হয়নি
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          নিচের বাটনে ক্লিক করে পাঠদানের ঘণ্টা, সময়, বিষয় ও দায়িত্বপ্রাপ্ত শিক্ষক যোগ করুন।
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenAddPeriod}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-300" />
                          <span>+ ১ম পিরিয়ড যোগ করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
                  <School className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">কোনো শ্রেণি পাওয়া যায়নি</h3>
                  <p className="text-xs text-slate-500">
                    রুটিন তৈরি করতে নতুন শ্রেণি যুক্ত করুন অথবা ডিফল্ট রুটিন রিস্টোর করুন।
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleOpenAddClass}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                    >
                      + নতুন শ্রেণি তৈরি
                    </button>
                    <button
                      type="button"
                      onClick={resetRoutinesToDefault}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      ডিফল্ট রিস্টোর
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ALUMNI (পুরাতন শিক্ষার্থী তালিকা) */}
          {activeTab === 'alumni' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">পুরাতন ও প্রাক্তন শিক্ষার্থী তালিকা (অ্যালামনাই)</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {alumniStudents?.length || 0} জন নিবন্ধিত
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    মাদ্রাসার উত্তীর্ণ শিক্ষার্থীদের ঐতিহাসিক তথ্য, রোল/রেজিস্ট্রেশন, বর্তমান শিক্ষাপ্রতিষ্ঠান ও পেশাগত তথ্য ব্যবস্থাপনা
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/alumni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ওয়েবসাইটে দেখুন</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleExportAlumni}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="সকল প্রাক্তন শিক্ষার্থীর তথ্য JSON আকারে সংরক্ষণ করুন"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>এক্সপোর্ট (JSON)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddAlumni}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ নতুন পুরাতন শিক্ষার্থী যোগ</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-slate-500">মোট নথিভুক্ত শিক্ষার্থী</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{alumniStudents?.length || 0} জন</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ডাটাবেজে সংরক্ষিত</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-emerald-800">পাসের শিক্ষাবর্ষ (ব্যাচ)</div>
                  <div className="text-xl font-black text-emerald-950 mt-1">{availablePassingYears.length}টি ব্যাচ</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">{availablePassingYears[availablePassingYears.length - 1]} থেকে {availablePassingYears[0]}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-amber-800">জিপিএ ৫.০০ / গোল্ডেন</div>
                  <div className="text-xl font-black text-amber-950 mt-1">
                    {(alumniStudents || []).filter(s => s.gpa?.includes('5.00') || s.gpa?.includes('৫.০০') || s.gpa?.includes('A+')).length} জন
                  </div>
                  <div className="text-[10px] text-amber-700 mt-0.5">কৃতী ফলাফল অর্জনকারী</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-blue-800">ফিল্টারকৃত ফলাফল</div>
                  <div className="text-xl font-black text-blue-950 mt-1">{filteredAlumni.length} জন</div>
                  <div className="text-[10px] text-blue-700 mt-0.5">বর্তমান ফিল্টারে প্রদর্শিত</div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={alumniSearch}
                      onChange={(e) => setAlumniSearch(e.target.value)}
                      placeholder="শিক্ষার্থীর নাম, রোল, রেজিঃ, মোবাইল, পেশা বা প্রতিষ্ঠান খুঁজুন..."
                      className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent placeholder:text-slate-400"
                    />
                    {alumniSearch && (
                      <button
                        type="button"
                        onClick={() => setAlumniSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle Buttons */}
                  <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAlumniViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        alumniViewMode === 'table'
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>টেবিল ভিউ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlumniViewMode('cards')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        alumniViewMode === 'cards'
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>কার্ড ভিউ</span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Filters Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-700" />
                      <span>পাসের শিক্ষাবর্ষ (ব্যাচ)</span>
                    </label>
                    <select
                      value={alumniYearFilter}
                      onChange={(e) => setAlumniYearFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="সকল">সকল ব্যাচ / বছর</option>
                      {availablePassingYears.map(yr => (
                        <option key={yr} value={yr}>{yr} ব্যাচ</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-emerald-700" />
                      <span>পরীক্ষার ধরন</span>
                    </label>
                    <select
                      value={alumniExamFilter}
                      onChange={(e) => setAlumniExamFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="সকল">সকল পরীক্ষা</option>
                      <option value="দাখিল পরীক্ষা">দাখিল পরীক্ষা</option>
                      <option value="জেডিসি পরীক্ষা">জেডিসি পরীক্ষা</option>
                      <option value="দাখিল (ভোকেশনাল)">দাখিল (ভোকেশনাল)</option>
                      <option value="ইবতেদায়ী সমাপনী">ইবতেদায়ী সমাপনী</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Book className="w-3 h-3 text-emerald-700" />
                      <span>শাখা / বিভাগ</span>
                    </label>
                    <select
                      value={alumniGroupFilter}
                      onChange={(e) => setAlumniGroupFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="সকল">সকল বিভাগ</option>
                      <option value="সাধারণ বিভাগ">সাধারণ বিভাগ</option>
                      <option value="বিজ্ঞান বিভাগ">বিজ্ঞান বিভাগ</option>
                      <option value="মুজাব্বিদ বিভাগ">মুজাব্বিদ বিভাগ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-rose-600" />
                      <span>রক্তের গ্রুপ</span>
                    </label>
                    <select
                      value={alumniBloodFilter}
                      onChange={(e) => setAlumniBloodFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="সকল">সকল রক্তের গ্রুপ</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Chips & Reset */}
                {(alumniSearch || alumniYearFilter !== 'সকল' || alumniExamFilter !== 'সকল' || alumniGroupFilter !== 'সকল' || alumniBloodFilter !== 'সকল') && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium">সক্রিয় ফিল্টার:</span>
                    {alumniSearch && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        অনুসন্ধান: &ldquo;{alumniSearch}&rdquo;
                        <button type="button" onClick={() => setAlumniSearch('')} className="hover:text-emerald-950 cursor-pointer">×</button>
                      </span>
                    )}
                    {alumniYearFilter !== 'সকল' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        ব্যাচ: {alumniYearFilter}
                        <button type="button" onClick={() => setAlumniYearFilter('সকল')} className="hover:text-emerald-950 cursor-pointer">×</button>
                      </span>
                    )}
                    {alumniExamFilter !== 'সকল' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        পরীক্ষা: {alumniExamFilter}
                        <button type="button" onClick={() => setAlumniExamFilter('সকল')} className="hover:text-emerald-950 cursor-pointer">×</button>
                      </span>
                    )}
                    {alumniGroupFilter !== 'সকল' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        বিভাগ: {alumniGroupFilter}
                        <button type="button" onClick={() => setAlumniGroupFilter('সকল')} className="hover:text-emerald-950 cursor-pointer">×</button>
                      </span>
                    )}
                    {alumniBloodFilter !== 'সকল' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold text-[11px]">
                        রক্ত: {alumniBloodFilter}
                        <button type="button" onClick={() => setAlumniBloodFilter('সকল')} className="hover:text-rose-950 cursor-pointer">×</button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAlumniSearch('');
                        setAlumniYearFilter('সকল');
                        setAlumniExamFilter('সকল');
                        setAlumniGroupFilter('সকল');
                        setAlumniBloodFilter('সকল');
                      }}
                      className="text-emerald-700 font-bold hover:underline ml-1 cursor-pointer"
                    >
                      সব ফিল্টার মুছুন
                    </button>
                  </div>
                )}
              </div>

              {/* Alumni Content: Empty State OR Table View OR Card View */}
              {filteredAlumni.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
                  <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">কোনো পুরাতন শিক্ষার্থী পাওয়া যায়নি</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    আপনার নির্বাচিত ফিল্টারে কোনো রেকর্ড পাওয়া যায়নি। অনুসন্ধান শব্দ পরিবর্তন করুন অথবা নতুন শিক্ষার্থী যোগ করুন।
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAlumniSearch('');
                        setAlumniYearFilter('সকল');
                        setAlumniExamFilter('সকল');
                        setAlumniGroupFilter('সকল');
                        setAlumniBloodFilter('সকল');
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      ফিল্টার রিসেট
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddAlumni}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                    >
                      + নতুন শিক্ষার্থী যোগ করুন
                    </button>
                  </div>
                </div>
              ) : alumniViewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                        <tr>
                          <th className="p-3.5 text-center w-12">#</th>
                          <th className="p-3.5 min-w-[220px]">শিক্ষার্থীর তথ্য ও ছবি</th>
                          <th className="p-3.5 min-w-[160px]">পাসের ব্যাচ ও পরীক্ষা</th>
                          <th className="p-3.5 min-w-[140px]">বিভাগ ও ফলাফল (GPA)</th>
                          <th className="p-3.5 min-w-[190px]">বর্তমান অবস্থান / পেশা</th>
                          <th className="p-3.5 text-center min-w-[120px]">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedAlumni.map((student, idx) => (
                          <tr key={student.id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="p-3.5 text-center font-bold text-slate-400">
                              {(safeAlumniPage - 1) * ALUMNI_PER_PAGE + idx + 1}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                {student.photo ? (
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 relative">
                                    <Image
                                      src={student.photo}
                                      alt={student.name}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-sm flex items-center justify-center shrink-0">
                                    {student.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900 text-[13px]">{student.name}</div>
                                  {student.nameEn && (
                                    <div className="text-[11px] text-slate-500 font-medium">{student.nameEn}</div>
                                  )}
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    রোল: <span className="font-semibold text-slate-600">{student.rollNo || '—'}</span> | রেজিঃ: <span className="font-semibold text-slate-600">{student.regNo || '—'}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] mb-1">
                                <Calendar className="w-3 h-3" />
                                <span>{student.passingYear} ব্যাচ</span>
                              </div>
                              <div className="text-[11px] font-semibold text-slate-700">{student.examType}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="text-[11px] font-semibold text-slate-800 mb-1">{student.group}</div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-[11px]">
                                <Award className="w-3 h-3 text-amber-600" />
                                <span>{student.gpa}</span>
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800 text-[12px] flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span>{student.currentStatus || 'তথ্য দেওয়া হয়নি'}</span>
                              </div>
                              {student.presentInstitute && (
                                <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate max-w-[200px]" title={student.presentInstitute}>
                                  {student.presentInstitute}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setViewingAlumni(student)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="সনদ ও বিস্তারিত প্রোফাইল দেখুন"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditAlumni(student)}
                                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="তথ্য সম্পাদনা করুন"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAlumni(student)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* CARDS GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedAlumni.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Card Header Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{student.passingYear} ব্যাচ</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-xs">
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>{student.gpa}</span>
                          </span>
                        </div>

                        {/* Student Main Info */}
                        <div className="flex items-start gap-3.5 mb-3.5">
                          {student.photo ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600/30 shrink-0 relative shadow-xs">
                              <Image
                                src={student.photo}
                                alt={student.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors truncate">
                              {student.name}
                            </h4>
                            {student.nameEn && (
                              <p className="text-xs text-slate-500 font-medium truncate">{student.nameEn}</p>
                            )}
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {student.examType} • {student.group}
                            </p>
                          </div>
                        </div>

                        {/* Extra metadata list */}
                        <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">রোল / রেজিস্ট্রেশন:</span>
                            <span className="font-semibold text-slate-800">{student.rollNo || '—'} / {student.regNo || '—'}</span>
                          </div>
                          {student.currentStatus && (
                            <div className="flex items-start justify-between text-[11px] gap-2 pt-1 border-t border-slate-200/60">
                              <span className="text-slate-500 shrink-0">পেশা / অবস্থান:</span>
                              <span className="font-bold text-emerald-900 text-right truncate">{student.currentStatus}</span>
                            </div>
                          )}
                          {student.presentInstitute && (
                            <div className="flex items-start justify-between text-[11px] gap-2">
                              <span className="text-slate-500 shrink-0">প্রতিষ্ঠান:</span>
                              <span className="text-slate-700 text-right truncate font-medium">{student.presentInstitute}</span>
                            </div>
                          )}
                          {student.bloodGroup && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">রক্তের গ্রুপ:</span>
                              <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                {student.bloodGroup}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setViewingAlumni(student)}
                          className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>সনদ দেখুন</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAlumni(student)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="এডিট"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAlumni(student)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Alumni Pagination Toolbar (15 Students Per Page with Next Option) */}
              {filteredAlumni.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
                    মোট <strong className="text-slate-900 font-bold">{filteredAlumni.length}</strong> জনের মধ্যে{' '}
                    <strong className="text-slate-900 font-bold">
                      {(safeAlumniPage - 1) * ALUMNI_PER_PAGE + 1}
                    </strong>{' '}
                    -{' '}
                    <strong className="text-slate-900 font-bold">
                      {Math.min(safeAlumniPage * ALUMNI_PER_PAGE, filteredAlumni.length)}
                    </strong>{' '}
                    জন প্রদর্শিত (প্রতি পৃষ্ঠায় ১৫ জন)
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setAlumniPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={safeAlumniPage === 1}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="পূর্ববর্তী পৃষ্ঠা"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>পূর্ববর্তী</span>
                    </button>

                    {Array.from({ length: totalAlumniPages }, (_, i) => i + 1)
                      .filter(pageNumber =>
                        totalAlumniPages <= 7 ||
                        pageNumber === 1 ||
                        pageNumber === totalAlumniPages ||
                        Math.abs(pageNumber - safeAlumniPage) <= 1
                      )
                      .map((pageNumber, i, arr) => (
                        <React.Fragment key={pageNumber}>
                          {i > 0 && arr[i - 1] !== pageNumber - 1 && (
                            <span className="px-1 text-slate-400 text-xs font-bold">...</span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setAlumniPage(pageNumber);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className={`min-w-8 h-8 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              pageNumber === safeAlumniPage
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      type="button"
                      onClick={() => {
                        setAlumniPage(p => Math.min(totalAlumniPages, p + 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={safeAlumniPage === totalAlumniPages}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="পরবর্তী পৃষ্ঠা (Next)"
                    >
                      <span>পরবর্তী (Next)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: STUDENT PROFILES (শিক্ষার্থী প্রোফাইল তৈরি ও ব্যবস্থাপনা) */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <UserCheck className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">শিক্ষার্থী প্রোফাইল ও আইডি কার্ড ব্যবস্থাপনা</h2>
                      <p className="text-xs text-slate-500">মাদ্রাসার নিয়মিত শিক্ষার্থীদের পূর্ণাঙ্গ প্রোফাইল ডাটাবেজ, ডিজিটাল আইডি কার্ড ও তথ্য নিয়ন্ত্রণ</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddStudent}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন শিক্ষার্থী প্রোফাইল তৈরি করুন</span>
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500">মোট শিক্ষার্থী প্রোফাইল</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{students?.length || 0} জন</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">ডাটাবেজে নিবন্ধিত শিক্ষার্থী</div>
                </div>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 shadow-2xs">
                  <div className="text-xs font-semibold text-blue-800">ছাত্র সংখ্যা</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    {students?.filter(s => s.gender === 'ছাত্র' || !s.gender).length || 0} জন
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">মোট ছাত্রদের সংখ্যা</div>
                </div>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 shadow-2xs">
                  <div className="text-xs font-semibold text-rose-800">ছাত্রী সংখ্যা</div>
                  <div className="text-2xl font-black text-rose-950 mt-1">
                    {students?.filter(s => s.gender === 'ছাত্রী').length || 0} জন
                  </div>
                  <div className="text-[11px] text-rose-700 mt-0.5">মোট ছাত্রীদের সংখ্যা</div>
                </div>
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-2xs">
                  <div className="text-xs font-semibold text-emerald-800">নিয়মিত ও সক্রিয়</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    {students?.filter(s => s.status === 'নিয়মিত' || !s.status).length || 0} জন
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">চলতি শিক্ষাবর্ষের শিক্ষার্থী</div>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="নাম, রোল, রেজি বা মোবাইল নম্বর খুঁজুন..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <select
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
                    >
                      <option value="all">সকল শ্রেণি (All Classes)</option>
                      {Array.from(new Set((students || []).map(s => s.classYear).filter(Boolean))).map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={studentBloodFilter}
                      onChange={(e) => setStudentBloodFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
                    >
                      <option value="all">সকল রক্তের গ্রুপ</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(studentSearchQuery || studentClassFilter !== 'all' || studentBloodFilter !== 'all') && (
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <span>
                      ফিল্টার অনুযায়ী শিক্ষার্থী দেখানো হচ্ছে
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentSearchQuery('');
                        setStudentClassFilter('all');
                        setStudentBloodFilter('all');
                      }}
                      className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      ফিল্টার রিসেট করুন
                    </button>
                  </div>
                )}
              </div>

              {/* Student Cards Grid */}
              {(() => {
                const filteredStudents = (students || []).filter((std) => {
                  const q = studentSearchQuery.trim().toLowerCase();
                  const matchesQuery = !q ||
                    (std.name || '').toLowerCase().includes(q) ||
                    (std.nameEn || '').toLowerCase().includes(q) ||
                    (std.rollNo || '').toLowerCase().includes(q) ||
                    (std.regNo || '').toLowerCase().includes(q) ||
                    (std.phone || '').toLowerCase().includes(q) ||
                    (std.guardianPhone || '').toLowerCase().includes(q);
                  const matchesClass = studentClassFilter === 'all' || std.classYear === studentClassFilter;
                  const matchesBlood = studentBloodFilter === 'all' || std.bloodGroup === studentBloodFilter;
                  return matchesQuery && matchesClass && matchesBlood;
                });

                if (filteredStudents.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
                      <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h3 className="font-bold text-slate-700 text-sm">কোনো শিক্ষার্থীর প্রোফাইল পাওয়া যায়নি</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        আপনার অনুসন্ধানের সাথে মিল রেখে কোনো প্রোফাইল পাওয়া যায়নি অথবা এখনও কোনো শিক্ষার্থী নিবন্ধিত হয়নি।
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddStudent}
                        className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>নতুন শিক্ষার্থী প্রোফাইল তৈরি করুন</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredStudents.map((std) => (
                      <div
                        key={std.id || std.rollNo}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Student Header */}
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200 shrink-0 flex items-center justify-center shadow-xs">
                              {std.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={std.photo}
                                  alt={std.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-black text-emerald-800">
                                  {std.name?.charAt(0) || 'শ'}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                  {std.classYear}
                                </span>
                                {std.bloodGroup && (
                                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                                    {std.bloodGroup}
                                  </span>
                                )}
                              </div>

                              <h3 className="font-bold text-slate-900 text-sm truncate mt-1">
                                {std.name}
                              </h3>
                              {std.nameEn && (
                                <p className="text-[11px] text-slate-500 truncate -mt-0.5">{std.nameEn}</p>
                              )}
                              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                                রোল: <strong className="text-slate-900">{std.rollNo}</strong> • রেজি: <strong className="text-slate-900">{std.regNo || '—'}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1 text-slate-600">
                            {std.fatherName && (
                              <div className="truncate">
                                <span className="text-slate-400">পিতা:</span> <strong className="text-slate-800">{std.fatherName}</strong>
                              </div>
                            )}
                            {std.phone && (
                              <div className="font-mono">
                                <span className="text-slate-400">মোবাইল:</span> <strong className="text-emerald-900">{std.phone}</strong>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                              <span>উপস্থিতি: <strong className="text-emerald-800">{std.attendanceRate || '৯৫%'}</strong></span>
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded">
                                {std.feeStatus || 'পরিশোধিত'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between gap-1.5 pt-3 mt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setViewingStudentProfile(std)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>আইডি কার্ড</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStudent(std)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>এডিট</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(std.id, std.name)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold cursor-pointer transition-colors"
                              title="প্রোফাইল মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="যেমন: কামিল (হাদিস), এম.এ (ইসলামিক স্টাডিজ)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>মোবাইল নম্বর</span>
                  </label>
                  <input
                    type="tel"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="017XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ইমেইল অ্যাড্রেস (Email)</span>
                  </label>
                  <input
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="teacher@poschimalohali.edu.bd"
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
                  disabled={teacherSaving}
                  className={`relative overflow-hidden group px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    teacherSaving
                      ? 'bg-emerald-600 opacity-90 cursor-wait'
                      : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 btn-pulse-glow'
                  }`}
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  {teacherSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span>সংরক্ষণ করুন</span>
                    </>
                  )}
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
                    src={info.logo || "/logo.png"}
                    alt={info.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                    unoptimized
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
                  alert('অনুগ্রহ করে ছবির লিঙ্ক (Image URL) অথবা ডিভাইস থেকে ছবি নির্বাচন করুন!');
                  return;
                }
                if (gallerySaving) return;

                setGallerySaving(true);

                if (editingGalleryItem) {
                  updateGalleryItem(editingGalleryItem.id, galleryForm);
                } else {
                  addGalleryItem(galleryForm);
                }

                setTimeout(() => {
                  setGallerySaving(false);
                  setShowGalleryModal(false);
                  setEditingGalleryItem(null);
                  setGalleryForm({
                    title: '',
                    category: 'ক্যাম্পাস',
                    imageUrl: '',
                    date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
                  });
                }, 350);
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
                        openConfirmModal({
                          title: 'গ্যালারি আইটেম মুছে ফেলার নিশ্চিতকরণ',
                          message: `আপনি কি "${editingGalleryItem.title}" ছবিটি গ্যালারি থেকে সম্পূর্ণ মুছে ফেলতে চান?`,
                          confirmLabel: 'হ্যাঁ, মুছে ফেলুন',
                          cancelLabel: 'বাতিল',
                          type: 'danger',
                          onConfirm: () => {
                            deleteGalleryItem(editingGalleryItem.id);
                            setShowGalleryModal(false);
                            setEditingGalleryItem(null);
                            closeConfirmModal();
                          }
                        });
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors w-full sm:w-auto cursor-pointer"
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
                    disabled={gallerySaving}
                    className={`relative overflow-hidden group px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      gallerySaving
                        ? 'bg-emerald-600 opacity-90 cursor-wait'
                        : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 btn-pulse-glow'
                    }`}
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    {gallerySaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>সংরক্ষণ ও ক্লাউড সিঙ্ক হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span>{editingGalleryItem ? 'সংরক্ষণ করুন' : 'গ্যালারিতে যুক্ত করুন'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add / Edit Hero Banner Slide Modal */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingSlide ? 'ব্যানার ফটো সম্পাদনা করুন' : 'নতুন ব্যানার ফটো যুক্ত করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ওয়েবসাইটের মূল হিরো স্লাইডশোতে প্রদর্শিত হবে
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSlideModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlide} className="p-6 space-y-5">
              {/* Size Callout inside modal */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-950 font-medium">
                <span className="text-xl">📐</span>
                <div>
                  <span className="font-bold">প্রস্তাবিত মাপ: ১৯২০ × ৭৫০ পিক্সেল</span> (অ্যাসপেক্ট রেশিও ১৬:৯ বা ২১:৯)।
                  <span className="text-emerald-800 text-[11px] block mt-0.5">ছবি আপলোড করলে স্বয়ংক্রিয়ভাবে সর্বোত্তম কোয়ালিটিতে প্রস্তুত হবে।</span>
                </div>
              </div>

              {/* Upload from device OR enter URL */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  ব্যানার ফটো নির্বাচন করুন *
                </label>

                {/* Direct file upload */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleBannerImageUpload(file, (dataUrl) => {
                            setSlideForm({ ...slideForm, imageUrl: dataUrl });
                          });
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-400 font-bold">অথবা ছবির লিংক পেস্ট করুন</span>
                </div>

                {/* URL Input */}
                <input
                  type="url"
                  value={slideForm.imageUrl}
                  onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... বা অন্য কোনো ছবির সরাসরি লিংক"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 bg-white"
                />

                {/* Quick Sample Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500">দ্রুত ব্যবহারের জন্য ডেমো ফটো ব্যানার:</span>
                  <div className="flex flex-wrap gap-2">
                    {sampleBanners.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSlideForm({ ...slideForm, imageUrl: sample.url })}
                        className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                      >
                        + {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Live Preview */}
                {slideForm.imageUrl && (
                  <div className="mt-3 relative aspect-[21/9] rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner">
                    <Image
                      src={slideForm.imageUrl}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold drop-shadow">
                        লাইভ প্রিভিউ: {slideForm.title || 'ব্যানার শিরোনাম'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Custom Texts for this slide */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    স্লাইড-নির্দিষ্ট টেক্সট (ঐচ্ছিক)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ফাঁকা রাখলে সাধারণ মূল শিরোনাম ও স্লোগান দেখাবে
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    ব্যানার শিরোনাম (Title)
                  </label>
                  <input
                    type="text"
                    value={slideForm.title}
                    onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                    placeholder="যেমন: হিফজুল কুরআন ও নূরানী একাডেমি শাখা"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    উপ-শিরোনাম / স্লোগান (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={slideForm.subtitle}
                    onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                    placeholder="যেমন: তাজবীদসহ বিশুদ্ধ কুরআন তিলাওয়াত ও হিফজের সুব্যবস্থা"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    সংক্ষিপ্ত বিবরণ (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={slideForm.description}
                    onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                    placeholder="এই স্লাইডের জন্য বিশেষ বিবরণ..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Active switch */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-800">
                    এই ফটো ব্যানারটি ওয়েবসাইটে সক্রিয় রাখুন
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slideForm.isActive}
                      onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSlideModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlide ? 'পরিবর্তন সংরক্ষণ করুন' : 'ব্যানারে যুক্ত করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Add / Edit & Permissions Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">
                    {editingUser ? 'প্রোফাইল ও পারমিশন সম্পাদনা' : 'নতুন ইউজার প্রোফাইল তৈরি'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingUser
                      ? `${editingUser.name} (@${editingUser.username}) এর তথ্য ও মডিউল পারমিশন পরিবর্তন করুন`
                      : 'নতুন ইউজার তৈরি করুন এবং অ্যাডমিন প্যানেলের কোন কোন অপশন ব্যবহার করতে পারবে তা নির্ধারণ করুন'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveUser} className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Section 1: বেসিক তথ্য */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>১. বেসিক তথ্য ও পদবী</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="যেমন: মাওলানা আরিফুল ইসলাম"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পদবী / দায়িত্ব <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      placeholder="যেমন: ভর্তি ইনচার্জ / সহকারী শিক্ষক / হিসাবরক্ষক"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="text"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      placeholder="যেমন: 01712-345678"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="যেমন: arif@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: লগইন ক্রেডেনশিয়াল */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>২. লগইন ইউজারনেম ও পাসওয়ার্ড</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইউজারনেম (Username) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
                      <input
                        type="text"
                        required
                        disabled={editingUser?.isSuperAdmin}
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                        placeholder="admission_staff"
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">ইংরেজি ছোট হাতের অক্ষর ও নম্বর</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      লগইন পাসওয়ার্ড <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="পাসওয়ার্ড লিখুন"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">ইউজারকে এই পাসওয়ার্ড দেওয়া হবে</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      অ্যাকাউন্ট স্ট্যাটাস
                    </label>
                    <select
                      disabled={editingUser?.isSuperAdmin}
                      value={userForm.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'active' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="active">সক্রিয় (Active)</option>
                      <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">নিষ্ক্রিয় থাকলে লগইন বন্ধ থাকবে</span>
                  </div>
                </div>
              </div>

              {/* Section 3: পারমিশন মেট্রিক্স */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>৩. অপশন ও মডিউল পারমিশন নির্বাচন</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      যে যে অপশনগুলোতে টিকচিহ্ন থাকবে, এই ইউজার কেবল সেগুলোই দেখতে ও পরিচালনা করতে পারবেন।
                    </p>
                  </div>

                  {!editingUser?.isSuperAdmin && (
                    <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={selectAllPermissions}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="সকল ১৬টি অপশনে অনুমতি দিন"
                      >
                        সবগুলো (১৬টি)
                      </button>
                      <button
                        type="button"
                        onClick={selectAcademicPreset}
                        className="text-[11px] font-bold text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="হাজিরা, শিক্ষক, ফলাফল ও ভর্তি"
                      >
                        🎓 অ্যাকাডেমিক
                      </button>
                      <button
                        type="button"
                        onClick={selectMediaPreset}
                        className="text-[11px] font-bold text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="নোটিশ, টিকার, ব্যানার, গ্যালারি ও সুবিধা"
                      >
                        📢 মিডিয়া ও নোটিশ
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllPermissions}
                        className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        ক্লিয়ার
                      </button>
                    </div>
                  )}
                </div>

                {/* Category Filter Pills & Selection Counter */}
                {!editingUser?.isSuperAdmin && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1">
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setModalPermCategory('all')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          modalPermCategory === 'all'
                            ? 'bg-white text-slate-900 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        সকল ({availablePermissions.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalPermCategory('academic')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          modalPermCategory === 'academic'
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        অ্যাকাডেমিক
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalPermCategory('core')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          modalPermCategory === 'core'
                            ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        প্রাতিষ্ঠানিক
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalPermCategory('media')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          modalPermCategory === 'media'
                            ? 'bg-purple-700 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        মিডিয়া
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalPermCategory('system')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          modalPermCategory === 'system'
                            ? 'bg-slate-700 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        সিস্টেম
                      </button>
                    </div>

                    <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      {userForm.permissions.length}টি অপশন নির্বাচিত
                    </div>
                  </div>
                )}

                {editingUser?.isSuperAdmin ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
                    <div className="font-bold flex items-center gap-2 text-amber-950">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      <span>সুপার অ্যাডমিন অ্যাকাউন্ট</span>
                    </div>
                    <p className="text-amber-800">
                      সুপার অ্যাডমিন প্রোফাইল মাদ্রাসার প্রধান অ্যাডমিন। এই প্রোফাইলের মাধ্যমে স্বয়ংক্রিয়ভাবে সকল ১৬টি অপশনে পূর্ণ মাস্টার এক্সেস বজায় থাকে।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                    {availablePermissions
                      .filter(perm => modalPermCategory === 'all' || perm.category === modalPermCategory)
                      .map((perm) => {
                      const isChecked = userForm.permissions.includes(perm.id);

                      return (
                        <div
                          key={perm.id}
                          onClick={() => togglePermission(perm.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                            isChecked
                              ? 'bg-emerald-50/80 border-emerald-400 shadow-2xs ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div onClick
                            className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                          />
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`font-bold ${isChecked ? 'text-emerald-950 font-black' : 'text-slate-800'}`}>
                                {perm.name || perm.title}
                              </span>
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                                  perm.category === 'academic'
                                    ? 'bg-blue-100 text-blue-800'
                                    : perm.category === 'core'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : perm.category === 'media'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {perm.category === 'academic'
                                  ? 'একাডেমিক'
                                  : perm.category === 'core'
                                  ? 'প্রাতিষ্ঠানিক'
                                  : perm.category === 'media'
                                  ? 'মিডিয়া'
                                  : 'সিস্টেম'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {perm.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-[#006837] hover:from-emerald-800 hover:to-emerald-900 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'পরিবর্তন সংরক্ষণ করুন' : 'প্রোফাইল তৈরি করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 Universal Centered Confirmation Modal (স্ক্রিনের কেন্দ্রে প্রিমিয়াম পপআপ) */}
      {confirmModal.isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeConfirmModal}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative accent strip */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                confirmModal.type === 'danger'
                  ? 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600'
              }`}
            />

            {/* Centered Warning / Trash Icon */}
            <div className="pt-2">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                  confirmModal.type === 'danger'
                    ? 'bg-rose-50 text-rose-600 border-2 border-rose-200 shadow-rose-500/10'
                    : 'bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-amber-500/10'
                }`}
              >
                {confirmModal.type === 'danger' ? (
                  <Trash2 className="w-8 h-8 text-rose-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                )}
              </div>
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {confirmModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                {confirmModal.message}
              </p>
            </div>

            {/* Cancel & Confirm Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {confirmModal.cancelLabel || 'বাতিল'}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer ${
                  confirmModal.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                }`}
              >
                {confirmModal.confirmLabel || 'নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routine Class Add/Edit Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingClassRoutine ? 'শ্রেণির তথ্য সম্পাদনা' : 'নতুন শ্রেণি রুটিনে যোগ করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClassModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শ্রেণির নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={classForm.className}
                  onChange={(e) => setClassForm({ ...classForm, className: e.target.value })}
                  placeholder="যেমন: ৪র্থ শ্রেণি, ৩য় শ্রেণি বা দাখিল বিজ্ঞান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  রুটিন কার্যকরের তারিখ
                </label>
                <input
                  type="text"
                  value={classForm.effectiveDate}
                  onChange={(e) => setClassForm({ ...classForm, effectiveDate: e.target.value })}
                  placeholder="যেমন: ০১ জানুয়ারি ২০২৬"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিশেষ নির্দেশনা / নোট
                </label>
                <textarea
                  rows={2}
                  value={classForm.notes}
                  onChange={(e) => setClassForm({ ...classForm, notes: e.target.value })}
                  placeholder="যেমন: বিশেষ প্রয়োজনে কর্তৃপক্ষ রুটিন পরিবর্তনের ক্ষমতা সংরক্ষণ করে।"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-sm"
                >
                  {editingClassRoutine ? 'সংরক্ষণ করুন' : 'শ্রেণি তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routine Period Add/Edit Modal */}
      {showPeriodModal && activeRoutine && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingPeriod ? 'পিরিয়ড সম্পাদনা' : 'নতুন পিরিয়ড / পাঠদান ঘণ্টা যোগ'}
                  </h3>
                </div>
                <p className="text-[11px] text-emerald-800 font-bold mt-0.5">
                  শ্রেণি: {activeRoutine?.className || ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPeriodModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ঘণ্টা / অধিবেশন <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={periodForm.period}
                    onChange={(e) => setPeriodForm({ ...periodForm, period: e.target.value })}
                    placeholder="যেমন: ১ম ঘণ্টা, ২য় ঘণ্টা বা বিরতি"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['১ম ঘণ্টা', '২য় ঘণ্টা', '৩য় ঘণ্টা', '৪র্থ ঘণ্টা', 'বিরতি', '৫ম ঘণ্টা', '৬ষ্ঠ ঘণ্টা'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPeriodForm({ ...periodForm, period: p })}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সময়সূচি <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={periodForm.time}
                    onChange={(e) => setPeriodForm({ ...periodForm, time: e.target.value })}
                    placeholder="যেমন: ০৯:১৫ - ১০:০০"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  {/* Quick Preset Times */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['০৯:১৫ - ১০:০০', '১০:০০ - ১০:৪৫', '১০:৪৫ - ১১:৩০', '১১:৩০ - ১২:১৫', '১২:১৫ - ০১:১৫', '০১:১৫ - ০২:০০'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPeriodForm({ ...periodForm, time: t })}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিষয়ের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={periodForm.subject}
                  onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })}
                  placeholder="যেমন: কুরআন মাজীদ ও তাজবীদ, সাধারণ গণিত, আরবি ১ম পত্র"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    দায়িত্বপ্রাপ্ত শিক্ষক
                  </label>
                  <input
                    type="text"
                    list="teachersList"
                    value={periodForm.teacher}
                    onChange={(e) => setPeriodForm({ ...periodForm, teacher: e.target.value })}
                    placeholder="শিক্ষকের নাম লিখুন বা সিলেক্ট করুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <datalist id="teachersList">
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name} />
                    ))}
                    <option value="সকল শিক্ষক ও শিক্ষার্থী" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রুম / কক্ষ নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={periodForm.room}
                    onChange={(e) => setPeriodForm({ ...periodForm, room: e.target.value })}
                    placeholder="যেমন: কক্ষ ১০১, বিজ্ঞান ল্যাব"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPeriodModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-sm"
                >
                  {editingPeriod ? 'সংরক্ষণ করুন' : 'পিরিয়ড যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routine Toast Notification */}
      {routineToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{routineToast.message}</span>
        </div>
      )}

      {/* Alumni Add / Edit Modal */}
      {showAlumniModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-800" />
                  <span>{editingAlumni ? 'পুরাতন শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন পুরাতন শিক্ষার্থী নিবন্ধন'}</span>
                </h3>
                <p className="text-xs text-slate-500">মাদ্রাসার প্রাক্তন শিক্ষার্থীর প্রয়োজনীয় তথ্যাদি পূরণ করুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAlumniModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlumni} className="space-y-4 text-xs">
              {/* Section 1: Academic & Exam Info */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-3">
                <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-emerald-700" />
                  <span>মাদ্রাসার শিক্ষা ও ফলাফল সংক্রান্ত তথ্য</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর নাম (বাংলায়) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={alumniForm.name}
                      onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: মোঃ আল-আমিন হোসেন"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর নাম (ইংরেজি)
                    </label>
                    <input
                      type="text"
                      value={alumniForm.nameEn}
                      onChange={(e) => setAlumniForm({ ...alumniForm, nameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="e.g. Md. Al-Amin Hossain"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পাসের শিক্ষাবর্ষ (ব্যাচ)</label>
                    <input
                      type="text"
                      list="passingYearsList"
                      required
                      value={alumniForm.passingYear}
                      onChange={(e) => setAlumniForm({ ...alumniForm, passingYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ২০২৪"
                    />
                    <datalist id="passingYearsList">
                      {['২০২৫', '২০২৪', '২০২৩', '২০২২', '২০২১', '২০২০', '২০১৯', '২০১৮', '২০১৭', '২০১৬', '২০১৫', '২০১০', '২০০৫'].map(y => (
                        <option key={y} value={y} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পরীক্ষার ধরন</label>
                    <select
                      value={alumniForm.examType}
                      onChange={(e) => setAlumniForm({ ...alumniForm, examType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="দাখিল পরীক্ষা">দাখিল পরীক্ষা</option>
                      <option value="জেডিসি পরীক্ষা">জেডিসি পরীক্ষা</option>
                      <option value="দাখিল (ভোকেশনাল)">দাখিল (ভোকেশনাল)</option>
                      <option value="ইবতেদায়ী সমাপনী">ইবতেদায়ী সমাপনী</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শাখা / বিভাগ</label>
                    <select
                      value={alumniForm.group}
                      onChange={(e) => setAlumniForm({ ...alumniForm, group: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="সাধারণ বিভাগ">সাধারণ বিভাগ</option>
                      <option value="বিজ্ঞান বিভাগ">বিজ্ঞান বিভাগ</option>
                      <option value="মুজাব্বিদ বিভাগ">মুজাব্বিদ বিভাগ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্রাপ্ত ফলাফল (GPA)</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.gpa}
                      onChange={(e) => setAlumniForm({ ...alumniForm, gpa: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ৫.০০ (A+)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বোর্ড রোল নম্বর</label>
                    <input
                      type="text"
                      value={alumniForm.rollNo}
                      onChange={(e) => setAlumniForm({ ...alumniForm, rollNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: ১২৩৪৫৬"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">রেজিস্ট্রেশন নম্বর</label>
                    <input
                      type="text"
                      value={alumniForm.regNo}
                      onChange={(e) => setAlumniForm({ ...alumniForm, regNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: ১৯১০১২৩৪৫৬"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Present Career & Higher Education */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-3">
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                  <span>বর্তমান পেশাগত অবস্থান ও উচ্চশিক্ষা</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বর্তমান পেশা / অবস্থান</label>
                    <input
                      type="text"
                      value={alumniForm.currentStatus}
                      onChange={(e) => setAlumniForm({ ...alumniForm, currentStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                      placeholder="যেমন: শিক্ষার্থী (অনার্স ৩য় বর্ষ) / সহকারী শিক্ষক"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বর্তমান প্রতিষ্ঠান / কর্মস্থল</label>
                    <input
                      type="text"
                      value={alumniForm.presentInstitute}
                      onChange={(e) => setAlumniForm({ ...alumniForm, presentInstitute: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                      placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় / নাটোর সরকারি কলেজ"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Personal & Contact Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  <span>ব্যক্তিগত ও যোগাযোগের তথ্য</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      value={alumniForm.fatherName}
                      onChange={(e) => setAlumniForm({ ...alumniForm, fatherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="পিতার নাম"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      value={alumniForm.motherName}
                      onChange={(e) => setAlumniForm({ ...alumniForm, motherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="মাতার নাম"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={alumniForm.phone}
                      onChange={(e) => setAlumniForm({ ...alumniForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="017XXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                    <input
                      type="email"
                      value={alumniForm.email}
                      onChange={(e) => setAlumniForm({ ...alumniForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                    <select
                      value={alumniForm.bloodGroup}
                      onChange={(e) => setAlumniForm({ ...alumniForm, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">স্থায়ী বা বর্তমান ঠিকানা</label>
                    <textarea
                      rows={3}
                      value={alumniForm.address}
                      onChange={(e) => setAlumniForm({ ...alumniForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white resize-none text-xs"
                      placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>শিক্ষার্থীর ছবি (ঐচ্ছিক)</span>
                      </span>
                      {alumniForm.photo && (
                        <button
                          type="button"
                          onClick={() => setAlumniForm({ ...alumniForm, photo: '' })}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>ছবি মুছুন</span>
                        </button>
                      )}
                    </label>

                    {alumniForm.photo ? (
                      <div className="flex items-center gap-3 p-2 rounded-xl border border-emerald-300 bg-emerald-50/60">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-600 shrink-0 relative shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={alumniForm.photo}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>ছবি যুক্ত করা হয়েছে</span>
                          </div>
                          <label
                            htmlFor="alumni-photo-upload"
                            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer inline-flex items-center gap-1 mt-0.5"
                          >
                            <Upload className="w-3 h-3" />
                            <span>অন্য ছবি পরিবর্তন করুন</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="alumni-photo-upload"
                        className="group relative overflow-hidden flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-emerald-500 bg-emerald-50/40 hover:bg-emerald-100/70 hover:border-emerald-700 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs group-hover:scale-105 transition-transform">
                          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                            <Camera className="w-4 h-4" />
                          </div>
                          <span>+ ছবি যুক্ত করুন (Add Photo)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">মোবাইল বা কম্পিউটার থেকে ছবি সিলেক্ট করুন</span>
                      </label>
                    )}

                    <input
                      id="alumni-photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (dataUrl) => {
                            setAlumniForm(prev => ({ ...prev, photo: dataUrl }));
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিশেষ অর্জন বা সম্মাননা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={alumniForm.achievements}
                    onChange={(e) => setAlumniForm({ ...alumniForm, achievements: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    placeholder="যেমন: ক্বেরাত প্রতিযোগিতায় উপজেলা পর্যায়ে ১ম স্থান, জাতীয় হিফজ সনদ"
                  />
                </div>
              </div>

              {/* Form Buttons with Dynamic Pulse & Shimmer Animations */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAlumniModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                  <span>বাতিল</span>
                </button>
                <button
                  type="submit"
                  disabled={alumniSaving}
                  className={`relative overflow-hidden group px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    alumniSaving
                      ? 'bg-emerald-600 opacity-90 cursor-wait'
                      : 'bg-gradient-to-r from-emerald-700 via-[#006837] to-emerald-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-800/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 btn-pulse-glow'
                  }`}
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  {alumniSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{editingAlumni ? 'আপডেট হচ্ছে...' : 'সংরক্ষণ হচ্ছে...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span>{editingAlumni ? 'তথ্য আপডেট করুন' : 'নিবন্ধন সম্পন্ন করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alumni Dossier / Certificate View Modal */}
      {viewingAlumni && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border-2 border-emerald-800 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                🎓 প্রাক্তন শিক্ষার্থী প্রাতিষ্ঠানিক তথ্য ও সনদপত্র
              </span>
              <button
                type="button"
                onClick={() => setViewingAlumni(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Style Box */}
            <div id="alumni-certificate-print" className="p-6 rounded-2xl border-4 border-double border-emerald-700 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/30 text-slate-900 relative overflow-hidden">
              {/* Background watermark icon */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                <School className="w-64 h-64 text-emerald-900" />
              </div>

              {/* Madrasah Header */}
              <div className="text-center pb-4 border-b border-emerald-900/20 mb-5">
                <div className="text-xs font-bold text-emerald-800 tracking-wider">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h3 className="text-lg md:text-xl font-black text-emerald-950 mt-1">
                  পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  ডাকঘর: আলোহালী, উপজেলা: সিংড়া, জেলা: নাটোর • মাদ্রাসা কোড: ১১০৫২ • ইআইআইএন: ১২৪১৫৭৪
                </p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-800 text-white font-bold text-[11px]">
                  প্রাক্তন শিক্ষার্থী প্রশংসাপত্র ও রেকর্ড
                </div>
              </div>

              {/* Student Overview Row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5">
                {viewingAlumni.photo ? (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-700 shadow-md relative shrink-0">
                    <Image
                      src={viewingAlumni.photo}
                      alt={viewingAlumni.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-emerald-100 border-2 border-emerald-700 text-emerald-900 text-3xl font-black flex items-center justify-center shrink-0 shadow-md">
                    {viewingAlumni.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-lg font-black text-slate-900">{viewingAlumni.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {viewingAlumni.passingYear} ব্যাচ
                    </span>
                  </div>
                  {viewingAlumni.nameEn && (
                    <p className="text-xs text-slate-600 font-medium">{viewingAlumni.nameEn}</p>
                  )}
                  <p className="text-xs text-slate-700 pt-0.5">
                    <strong>পরীক্ষা:</strong> {viewingAlumni.examType} ({viewingAlumni.group})
                  </p>
                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-md text-xs border border-amber-300">
                      ফলাফল: {viewingAlumni.gpa}
                    </span>
                    {viewingAlumni.bloodGroup && (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md text-xs border border-rose-300">
                        রক্ত: {viewingAlumni.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 p-4 rounded-xl border border-emerald-900/10">
                <div>
                  <span className="text-slate-500 font-medium">বোর্ড রোল নম্বর:</span>{' '}
                  <span className="font-bold text-slate-900 font-mono">{viewingAlumni.rollNo || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">রেজিস্ট্রেশন নম্বর:</span>{' '}
                  <span className="font-bold text-slate-900 font-mono">{viewingAlumni.regNo || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">পিতার নাম:</span>{' '}
                  <span className="font-bold text-slate-900">{viewingAlumni.fatherName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">মাতার নাম:</span>{' '}
                  <span className="font-bold text-slate-900">{viewingAlumni.motherName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">বর্তমান অবস্থান / পেশা:</span>{' '}
                  <span className="font-bold text-emerald-900">{viewingAlumni.currentStatus || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">বর্তমান প্রতিষ্ঠান:</span>{' '}
                  <span className="font-bold text-slate-900">{viewingAlumni.presentInstitute || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">মোবাইল নম্বর:</span>{' '}
                  <span className="font-bold text-slate-900 font-mono">{viewingAlumni.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">ইমেইল:</span>{' '}
                  <span className="font-bold text-slate-900">{viewingAlumni.email || '—'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium">ঠিকানা:</span>{' '}
                  <span className="font-semibold text-slate-800">{viewingAlumni.address || '—'}</span>
                </div>
                {viewingAlumni.achievements && (
                  <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">বিশেষ কৃতিত্ব ও সম্মাননা:</span>{' '}
                    <span className="font-semibold text-amber-900">{viewingAlumni.achievements}</span>
                  </div>
                )}
              </div>

              {/* Seal & Signature Note */}
              <div className="flex justify-between items-end pt-8 mt-5 border-t border-emerald-900/20 text-[11px] text-slate-600">
                <div className="space-y-1">
                  <div className="font-bold text-emerald-900">পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা</div>
                  <div className="text-[10px] text-slate-500">অনলাইন ডাটাবেজ প্রতিলিপি • ভেরিফাইড অ্যালামনাই</div>
                </div>
                <div className="text-right">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    অধ্যক্ষ / সুপারিনটেনডেন্ট
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const studentToEdit = viewingAlumni;
                    setViewingAlumni(null);
                    handleOpenEditAlumni(studentToEdit);
                  }}
                  className="px-4 py-2 rounded-xl border border-emerald-700 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>তথ্য এডিট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingAlumni(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Add/Edit Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8 max-h-[92vh] flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingResultId ? 'ফলাফল ও নম্বর সংশোধন করুন' : 'নতুন পরীক্ষার ফলাফল যোগ করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">শিক্ষার্থীর পরীক্ষার ফলাফল, বিষয়ভিত্তিক নম্বর ও জিপিএ তথ্য</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveResult} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 text-xs">
              {/* Section 1: Basic Information */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-100 pb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>মৌলিক তথ্য (শিক্ষার্থী ও পরীক্ষা)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={resultForm.studentName}
                      onChange={(e) => setResultForm({ ...resultForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: মোঃ ওমর ফারুক"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      রোল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={resultForm.rollNo}
                      onChange={(e) => setResultForm({ ...resultForm, rollNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: ১০১"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">রেজিস্ট্রেশন নম্বর</label>
                    <input
                      type="text"
                      value={resultForm.regNo}
                      onChange={(e) => setResultForm({ ...resultForm, regNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: ২০২৬১০১০১"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
                    <input
                      type="text"
                      value={resultForm.examName}
                      onChange={(e) => setResultForm({ ...resultForm, examName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: দাখিল প্রাক-নির্বাচনী পরীক্ষা ২০২৬"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শ্রেণি</label>
                    <input
                      type="text"
                      value={resultForm.classYear}
                      onChange={(e) => setResultForm({ ...resultForm, classYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ১০ম শ্রেণি (দাখিল)"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শিক্ষাবর্ষ / সেশন</label>
                    <input
                      type="text"
                      value={resultForm.session}
                      onChange={(e) => setResultForm({ ...resultForm, session: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ২০২৫-২০২৬"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ফলাফল প্রকাশের তারিখ</label>
                    <input
                      type="text"
                      value={resultForm.publishDate}
                      onChange={(e) => setResultForm({ ...resultForm, publishDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ১৮ সেপ্টেম্বর ২০২৬"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Subject-wise marks */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>বিষয়ভিত্তিক নম্বর ও গ্রেড ({resultForm.subjects.length}টি বিষয়)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadSubjectPreset(dakhilSubjectsPreset)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold cursor-pointer"
                    >
                      দাখিল ১০ম প্রিসেট
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSubjectPreset(generalJuniorSubjectsPreset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold cursor-pointer"
                    >
                      জুনিয়র প্রিসেট
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSubjectRow}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>বিষয় যোগ করুন</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="py-2 px-3">বিষয়ের নাম</th>
                        <th className="py-2 px-2 text-center w-20">পূর্ণমান</th>
                        <th className="py-2 px-2 text-center w-24">প্রাপ্ত নম্বর</th>
                        <th className="py-2 px-2 text-center w-20">গ্রেড</th>
                        <th className="py-2 px-2 text-center w-20">পয়েন্ট</th>
                        <th className="py-2 px-2 text-center w-12">মুছুন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {resultForm.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-1.5 px-3">
                            <input
                              type="text"
                              required
                              value={sub.name}
                              onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                              placeholder="বিষয়ের নাম"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white text-xs"
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={sub.fullMarks}
                              onChange={(e) => handleSubjectChange(idx, 'fullMarks', e.target.value)}
                              className="w-full px-2 py-1.5 text-center rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white text-xs font-mono"
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={sub.fullMarks || 100}
                              value={sub.obtainedMarks}
                              onChange={(e) => handleSubjectChange(idx, 'obtainedMarks', e.target.value)}
                              className="w-full px-2 py-1.5 text-center font-bold font-mono text-emerald-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white text-xs"
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <span className={`inline-block px-2 py-1 rounded-md text-[11px] font-bold ${
                              sub.grade === 'F' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800">
                            {sub.point.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubjectRow(idx)}
                              title="বিষয় মুছুন"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Overall GPA and Grade Summary */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>চূড়ান্ত ফলাফল (GPA ও গ্রেড)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const overall = calculateOverallResult(resultForm.subjects);
                      setResultForm({
                        ...resultForm,
                        gpa: overall.gpa,
                        grade: overall.grade,
                        resultStatus: overall.resultStatus
                      });
                    }}
                    className="text-[11px] text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>স্বয়ংক্রিয় হিসাব রিফ্রেশ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">জিপিএ (GPA)</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={5}
                      value={resultForm.gpa}
                      onChange={(e) => setResultForm({ ...resultForm, gpa: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono font-bold text-emerald-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">লেটার গ্রেড</label>
                    <select
                      value={resultForm.grade}
                      onChange={(e) => setResultForm({ ...resultForm, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-bold"
                    >
                      <option value="A+">A+ (৫.০০)</option>
                      <option value="A">A (৪.০০)</option>
                      <option value="A-">A- (৩.৫০)</option>
                      <option value="B">B (৩.০০)</option>
                      <option value="C">C (২.০০)</option>
                      <option value="D">D (১.০০)</option>
                      <option value="F">F (অনুত্তীর্ণ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ফলাফল স্ট্যাটাস</label>
                    <select
                      value={resultForm.resultStatus}
                      onChange={(e) => setResultForm({ ...resultForm, resultStatus: e.target.value as 'উত্তীর্ণ' | 'অনুত্তীর্ণ' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-bold"
                    >
                      <option value="উত্তীর্ণ">উত্তীর্ণ (Passed)</option>
                      <option value="অনুত্তীর্ণ">অনুত্তীর্ণ (Failed)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingResultId ? 'পরিবর্তন সংরক্ষণ করুন' : 'ফলাফল সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Result / Marksheet Modal */}
      {viewingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 border border-slate-200 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base text-slate-900">নম্বরপত্র ও ফলাফল বিবরণী (Marksheet)</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingResult(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Marksheet Container */}
            <div className="p-6 rounded-2xl border-2 border-emerald-900/20 bg-emerald-50/20 space-y-5 print:border-none print:p-0">
              {/* Institution Header */}
              <div className="text-center space-y-1 border-b border-emerald-900/15 pb-4">
                <div className="flex justify-center mb-1">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={56}
                    height={56}
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <h2 className="text-lg font-black text-emerald-950">
                  {info.name}
                </h2>
                <p className="text-[11px] text-slate-600">
                  {info.address} • মাদ্রাসা কোড: {info.madrasahCode} • ইআইআইএন: {info.eiin}
                </p>
                <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs tracking-wide">
                  {viewingResult.examName}
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/90 rounded-xl border border-emerald-900/10 text-xs">
                <div>
                  <span className="text-slate-500">শিক্ষার্থীর নাম:</span>{' '}
                  <strong className="text-slate-900 block font-bold mt-0.5">{viewingResult.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">শ্রেণি:</span>{' '}
                  <strong className="text-slate-900 block font-bold mt-0.5">{viewingResult.classYear}</strong>
                </div>
                <div>
                  <span className="text-slate-500">রোল নম্বর:</span>{' '}
                  <strong className="font-mono text-slate-900 block font-bold mt-0.5">{viewingResult.rollNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">রেজিস্ট্রেশন নম্বর:</span>{' '}
                  <strong className="font-mono text-slate-900 block font-bold mt-0.5">{viewingResult.regNo || '—'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">শিক্ষাবর্ষ:</span>{' '}
                  <span className="text-slate-800 font-semibold">{viewingResult.session}</span>
                </div>
                <div>
                  <span className="text-slate-500">ফলাফল প্রকাশের তারিখ:</span>{' '}
                  <span className="text-slate-800 font-semibold">{viewingResult.publishDate}</span>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div className="overflow-x-auto rounded-xl border border-emerald-900/10 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-900/5 text-emerald-950 border-b border-emerald-900/10 font-bold">
                    <tr>
                      <th className="py-2 px-3">বিষয়</th>
                      <th className="py-2 px-2 text-center">পূর্ণমান</th>
                      <th className="py-2 px-2 text-center">প্রাপ্ত নম্বর</th>
                      <th className="py-2 px-2 text-center">গ্রেড</th>
                      <th className="py-2 px-2 text-center">পয়েন্ট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/5 text-slate-700">
                    {viewingResult.subjects && viewingResult.subjects.length > 0 ? (
                      viewingResult.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/30">
                          <td className="py-2 px-3 font-medium text-slate-900">{sub.name}</td>
                          <td className="py-2 px-2 text-center font-mono">{sub.fullMarks}</td>
                          <td className="py-2 px-2 text-center font-bold font-mono text-emerald-900">{sub.obtainedMarks}</td>
                          <td className="py-2 px-2 text-center font-bold">
                            <span className={sub.grade === 'F' ? 'text-rose-600' : 'text-emerald-800'}>
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center font-bold font-mono">{sub.point.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-3 text-center text-slate-400">
                          কোনো বিষয় তালিকাভুক্ত নেই
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Overall GPA Box */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-900/15 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-semibold">ফলাফলের সার্বিক মূল্যায়ন</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">
                    স্ট্যাটাস: <span className={viewingResult.resultStatus === 'উত্তীর্ণ' ? 'text-emerald-700' : 'text-rose-600'}>{viewingResult.resultStatus}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-950 font-mono">
                    GPA {viewingResult.gpa.toFixed(2)}
                  </div>
                  <div className="text-xs font-bold text-amber-800">
                    লেটার গ্রেড: {viewingResult.grade}
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-8 mt-4 border-t border-emerald-900/15 text-[11px] text-slate-600">
                <div className="text-center">
                  <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                    শ্রেণি শিক্ষক
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    অধ্যক্ষ / সুপারিনটেনডেন্ট
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = viewingResult;
                    setViewingResult(null);
                    handleOpenEditResult(toEdit);
                  }}
                  className="px-4 py-2 rounded-xl border border-emerald-700 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>তথ্য এডিট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingResult(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Toast Notification */}
      {resultToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{resultToast.message}</span>
        </div>
      )}

      {/* Student Profile Add/Edit Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[92vh] flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingStudentId ? 'শিক্ষার্থীর প্রোফাইল সংশোধন করুন' : 'নতুন শিক্ষার্থী প্রোফাইল তৈরি করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">মাদ্রাসার নিয়মিত শিক্ষার্থীর তথ্য, ছবি ও আইডি কার্ড তৈরি</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStudent} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 text-xs">
              {/* Photo Upload Section */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-emerald-600 shrink-0 flex items-center justify-center shadow-xs relative">
                  {studentForm.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={studentForm.photo}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-8 h-8 text-emerald-400" />
                  )}
                  {isCompressingStudentPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px]">
                      প্রসেসিং...
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="font-bold text-slate-800 text-xs">শিক্ষার্থীর পাসপোর্ট সাইজ ছবি</div>
                  <p className="text-[11px] text-slate-500">মোবাইল বা পিসি থেকে পরিষ্কার ছবি আপলোড করুন</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <label className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-[11px] hover:bg-emerald-900 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{studentForm.photo ? 'ছবি পরিবর্তন করুন' : 'ছবি নির্বাচন করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStudentPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {studentForm.photo && (
                      <button
                        type="button"
                        onClick={() => setStudentForm(prev => ({ ...prev, photo: '' }))}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold cursor-pointer"
                      >
                        ছবি মুছুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 1: Basic Identity */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-100 pb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>মৌলিক তথ্য (শিক্ষার্থী ও শ্রেণি)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: মোঃ ওমর ফারুক"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      পূর্ণ নাম (ইংরেজিতে)
                    </label>
                    <input
                      type="text"
                      value={studentForm.nameEn}
                      onChange={(e) => setStudentForm({ ...studentForm, nameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: Md. Omar Faruk"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শ্রেণি <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={studentForm.classYear}
                      onChange={(e) => setStudentForm({ ...studentForm, classYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="১০ম শ্রেণি (দাখিল)">১০ম শ্রেণি (দাখিল)</option>
                      <option value="৯ম শ্রেণি (দাখিল)">৯ম শ্রেণি (দাখিল)</option>
                      <option value="৮ম শ্রেণি (জেডিসি)">৮ম শ্রেণি (জেডিসি)</option>
                      <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                      <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                      <option value="৫ম শ্রেণি (ইবতেদায়ী)">৫ম শ্রেণি (ইবতেদায়ী)</option>
                      <option value="৪র্থ শ্রেণি">৪র্থ শ্রেণি</option>
                      <option value="৩য় শ্রেণি">৩য় শ্রেণি</option>
                      <option value="২য় শ্রেণি">২য় শ্রেণি</option>
                      <option value="১ম শ্রেণি">১ম শ্রেণি</option>
                      <option value="শিশু শ্রেণি / নূরানী">শিশু শ্রেণি / নূরানী</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শিক্ষাবর্ষ / সেশন
                    </label>
                    <input
                      type="text"
                      value={studentForm.session}
                      onChange={(e) => setStudentForm({ ...studentForm, session: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ২০২৫-২০২৬"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      শ্রেণি রোল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentForm.rollNo}
                      onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: ১০১"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">রেজিস্ট্রেশন নম্বর</label>
                    <input
                      type="text"
                      value={studentForm.regNo}
                      onChange={(e) => setStudentForm({ ...studentForm, regNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: ২০২৬১০১০১"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">লিঙ্গ</label>
                    <select
                      value={studentForm.gender}
                      onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="ছাত্র">ছাত্র (Boy)</option>
                      <option value="ছাত্রী">ছাত্রী (Girl)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                    <select
                      value={studentForm.bloodGroup}
                      onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-bold"
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
              </div>

              {/* Section 2: Contact & Guardian Information */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-100 pb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>যোগাযোগ ও অভিভাবকের তথ্য</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর (লগইন নম্বর) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="যেমন: 01711000101"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">এই নম্বর দিয়ে শিক্ষার্থী লগইন করতে পারবে</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">জরুরি অভিভাবক ফোন</label>
                    <input
                      type="text"
                      value={studentForm.guardianPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      placeholder="পিতা বা অভিভাবকের মোবাইল"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      value={studentForm.fatherName}
                      onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="পিতার নাম"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      value={studentForm.motherName}
                      onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="মাতার নাম"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">স্থায়ী ও বর্তমান ঠিকানা</label>
                    <input
                      type="text"
                      value={studentForm.address}
                      onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Status & Fees */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-100 pb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>অ্যাকাডেমিক অবস্থা ও ফি</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">উপস্থিতির হার</label>
                    <input
                      type="text"
                      value={studentForm.attendanceRate}
                      onChange={(e) => setStudentForm({ ...studentForm, attendanceRate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      placeholder="যেমন: ৯৫%"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বেতন ও ফি স্ট্যাটাস</label>
                    <select
                      value={studentForm.feeStatus}
                      onChange={(e) => setStudentForm({ ...studentForm, feeStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="পরিশোধিত">পরিশোধিত (Paid)</option>
                      <option value="আংশিক বকেয়া">আংশিক বকেয়া (Partial)</option>
                      <option value="বকেয়া">বকেয়া (Due)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থী অবস্থা</label>
                    <select
                      value={studentForm.status}
                      onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="নিয়মিত">নিয়মিত (Active)</option>
                      <option value="অনিয়মিত">অনিয়মিত (Irregular)</option>
                      <option value="স্থগিত">স্থগিত (Suspended)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStudentId ? 'পরিবর্তন সংরক্ষণ করুন' : 'প্রোফাইল তৈরি ও সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Student Profile & ID Card Modal */}
      {viewingStudentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8 border border-slate-200 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base text-slate-900">ডিজিটাল স্টুডেন্ট আইডি কার্ড ও প্রোফাইল</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingStudentProfile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable ID Card Container */}
            <div className="p-6 rounded-2xl border-2 border-emerald-900/20 bg-emerald-50/20 space-y-4 print:border-none print:p-0">
              {/* Institution Header */}
              <div className="text-center space-y-1 border-b border-emerald-900/15 pb-4">
                <div className="flex justify-center mb-1">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={52}
                    height={52}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <h2 className="text-base font-black text-emerald-950">
                  {info.name}
                </h2>
                <p className="text-[10px] text-slate-600">
                  {info.address} • কোড: {info.madrasahCode} • ইআইআইএন: {info.eiin}
                </p>
                <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-800 text-white font-bold text-[10px] tracking-wide">
                  শিক্ষার্থী পরিচয়পত্র • STUDENT ID CARD
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-white p-4 rounded-xl border border-emerald-900/10">
                <div className="w-24 h-28 rounded-xl overflow-hidden bg-emerald-50 border-2 border-emerald-700 shrink-0 flex items-center justify-center shadow-xs">
                  {viewingStudentProfile.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={viewingStudentProfile.photo}
                      alt={viewingStudentProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-emerald-800">
                      {viewingStudentProfile.name?.charAt(0) || 'শ'}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 text-xs text-slate-700 w-full">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{viewingStudentProfile.name}</h3>
                    {viewingStudentProfile.nameEn && (
                      <p className="text-[11px] text-slate-500 font-semibold">{viewingStudentProfile.nameEn}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400">শ্রেণি:</span> <strong className="text-slate-900">{viewingStudentProfile.classYear}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">রোল:</span> <strong className="font-mono text-slate-900">{viewingStudentProfile.rollNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">রেজিস্ট্রেশন:</span> <strong className="font-mono text-slate-900">{viewingStudentProfile.regNo || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">সেশন:</span> <strong className="text-slate-900">{viewingStudentProfile.session}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">রক্তের গ্রুপ:</span> <strong className="text-rose-700 font-bold">{viewingStudentProfile.bloodGroup || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">মোবাইল:</span> <strong className="font-mono text-slate-900">{viewingStudentProfile.phone || '—'}</strong>
                    </div>
                  </div>

                  {viewingStudentProfile.fatherName && (
                    <div className="text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-400">পিতার নাম:</span> <strong className="text-slate-800">{viewingStudentProfile.fatherName}</strong>
                    </div>
                  )}
                  {viewingStudentProfile.address && (
                    <div className="text-[11px]">
                      <span className="text-slate-400">ঠিকানা:</span> <span className="text-slate-800">{viewingStudentProfile.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="flex justify-between items-end pt-6 border-t border-emerald-900/15 text-[10px] text-slate-600">
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-900">পশ্চিম আলোহালী ইসলামিয়া দাখিল মাদ্রাসা</div>
                  <div className="text-[9px] text-slate-500">ডিজিটাল স্টুডেন্ট আইডি রেকর্ড</div>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    অধ্যক্ষ / সুপারিনটেনডেন্ট
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>আইডি কার্ড প্রিন্ট করুন</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = viewingStudentProfile;
                    setViewingStudentProfile(null);
                    handleOpenEditStudent(toEdit);
                  }}
                  className="px-4 py-2 rounded-xl border border-emerald-700 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>তথ্য এডিট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingStudentProfile(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Toast Notification */}
      {studentToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{studentToast.message}</span>
        </div>
      )}

      {/* Alumni Toast Notification */}
      {alumniToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{alumniToast.message}</span>
        </div>
      )}
    </div>
  );
}
