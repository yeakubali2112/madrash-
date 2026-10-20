'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MadrasahInfo,
  Notice,
  Teacher,
  AdmissionApplication,
  ResultRecord,
  ContactMessage,
  UrgentNoticeItem,
  TickerSettings,
  HeroSettings,
  FacilityItem,
  GalleryItem,
  defaultMadrasahInfo,
  defaultNotices,
  defaultTeachers,
  defaultApplications,
  defaultResults,
  defaultMessages,
  defaultTickerSettings,
  defaultHeroSettings,
  defaultUrgentNotices,
  defaultFacilities,
  defaultGallery,
  PrayerTimeConfig,
  defaultPrayerConfig,
  StudentProfile
} from '@/lib/data';
import {
  getStoredInfo,
  saveStoredInfo,
  getStoredNotices,
  saveStoredNotices,
  getStoredTeachers,
  saveStoredTeachers,
  getStoredApplications,
  saveStoredApplications,
  getStoredResults,
  saveStoredResults,
  getStoredMessages,
  saveStoredMessages,
  getStoredTickerSettings,
  saveStoredTickerSettings,
  getStoredHeroSettings,
  saveStoredHeroSettings,
  getStoredUrgentNotices,
  saveStoredUrgentNotices,
  getStoredFacilities,
  saveStoredFacilities,
  getStoredGallery,
  saveStoredGallery,
  getStoredPrayerConfig,
  saveStoredPrayerConfig,
  isAdminLoggedIn,
  setAdminLoggedIn,
  resetAllData
} from '@/lib/storage';

interface MadrasahContextType {
  info: MadrasahInfo;
  notices: Notice[];
  teachers: Teacher[];
  applications: AdmissionApplication[];
  results: ResultRecord[];
  messages: ContactMessage[];
  urgentNotices: UrgentNoticeItem[];
  tickerSettings: TickerSettings;
  heroSettings: HeroSettings;
  facilities: FacilityItem[];
  gallery: GalleryItem[];
  prayerConfig: PrayerTimeConfig;
  loggedStudent: StudentProfile | null;
  isAdmin: boolean;
  isLoaded: boolean;
  updateInfo: (newInfo: MadrasahInfo) => void;
  updatePrayerConfig: (newConfig: PrayerTimeConfig) => void;
  updateLoggedStudent: (student: StudentProfile | null) => void;
  updateHeroSettings: (newSettings: Partial<HeroSettings>) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  updateTickerSettings: (newSettings: Partial<TickerSettings>) => void;
  addUrgentNotice: (notice: Omit<UrgentNoticeItem, 'id'>) => void;
  updateUrgentNotice: (id: string, notice: Partial<UrgentNoticeItem>) => void;
  deleteUrgentNotice: (id: string) => void;
  toggleUrgentNoticeStatus: (id: string) => void;
  addFacility: (facility: Omit<FacilityItem, 'id'>) => void;
  updateFacility: (id: string, facility: Partial<FacilityItem>) => void;
  deleteFacility: (id: string) => void;
  toggleFacilityStatus: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'order'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  submitApplication: (appData: Omit<AdmissionApplication, 'id' | 'appliedDate' | 'status'>) => AdmissionApplication;
  updateApplicationStatus: (id: string, status: 'অপেক্ষমান' | 'অনুমোদিত' | 'বাতিল', remarks?: string) => void;
  deleteApplication: (id: string) => void;
  addResult: (result: Omit<ResultRecord, 'id'>) => void;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  resetToDefaults: () => void;
}

const MadrasahContext = createContext<MadrasahContextType | undefined>(undefined);

export const MadrasahProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [info, setInfo] = useState<MadrasahInfo>(defaultMadrasahInfo);
  const [notices, setNotices] = useState<Notice[]>(defaultNotices);
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);
  const [applications, setApplications] = useState<AdmissionApplication[]>(defaultApplications);
  const [results, setResults] = useState<ResultRecord[]>(defaultResults);
  const [messages, setMessages] = useState<ContactMessage[]>(defaultMessages);
  const [urgentNotices, setUrgentNotices] = useState<UrgentNoticeItem[]>(defaultUrgentNotices);
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>(defaultTickerSettings);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(defaultHeroSettings);
  const [facilities, setFacilities] = useState<FacilityItem[]>(defaultFacilities);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [prayerConfig, setPrayerConfig] = useState<PrayerTimeConfig>(defaultPrayerConfig);
  const [loggedStudent, setLoggedStudent] = useState<StudentProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setInfo(getStoredInfo());
    setNotices(getStoredNotices());
    setTeachers(getStoredTeachers());
    setApplications(getStoredApplications());
    setResults(getStoredResults());
    setMessages(getStoredMessages());
    setUrgentNotices(getStoredUrgentNotices());
    setTickerSettings(getStoredTickerSettings());
    setHeroSettings(getStoredHeroSettings());
    setFacilities(getStoredFacilities());
    setGallery(getStoredGallery());
    setPrayerConfig(getStoredPrayerConfig());
    setIsAdmin(isAdminLoggedIn());
    try {
      const savedStudent = localStorage.getItem('padm_logged_student');
      if (savedStudent) setLoggedStudent(JSON.parse(savedStudent));
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'padm_hero_settings' || !e.key) {
        setHeroSettings(getStoredHeroSettings());
      }
      if (e.key === 'padm_madrasah_info') setInfo(getStoredInfo());
      if (e.key === 'padm_notices') setNotices(getStoredNotices());
      if (e.key === 'padm_ticker_settings') setTickerSettings(getStoredTickerSettings());
      if (e.key === 'padm_urgent_notices') setUrgentNotices(getStoredUrgentNotices());
      if (e.key === 'padm_prayer_config') setPrayerConfig(getStoredPrayerConfig());
      if (e.key === 'padm_logged_student') {
        try {
          setLoggedStudent(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setLoggedStudent(null);
        }
      }
    };

    const handleStudentSync = (e: any) => {
      setLoggedStudent(e?.detail || null);
    };

    const handleHeroSync = (e: any) => {
      if (e?.detail) {
        setHeroSettings(e.detail);
      } else {
        setHeroSettings(getStoredHeroSettings());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('padm_hero_sync', handleHeroSync);
    window.addEventListener('padm_student_sync', handleStudentSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('padm_hero_sync', handleHeroSync);
      window.removeEventListener('padm_student_sync', handleStudentSync);
    };
  }, []);

  const updateInfo = (newInfo: MadrasahInfo) => {
    setInfo(newInfo);
    saveStoredInfo(newInfo);
  };

  const updatePrayerConfig = (newConfig: PrayerTimeConfig) => {
    setPrayerConfig(newConfig);
    saveStoredPrayerConfig(newConfig);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('padm_prayer_sync', { detail: newConfig }));
    }
  };

  const updateLoggedStudent = (student: StudentProfile | null) => {
    setLoggedStudent(student);
    if (typeof window !== 'undefined') {
      if (student) {
        localStorage.setItem('padm_logged_student', JSON.stringify(student));
      } else {
        localStorage.removeItem('padm_logged_student');
      }
      window.dispatchEvent(new CustomEvent('padm_student_sync', { detail: student }));
    }
  };

  const addNotice = (newNoticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...newNoticeData,
      id: `not-${Date.now()}`
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveStoredNotices(updated);
  };

  const updateNotice = (id: string, updatedFields: Partial<Notice>) => {
    const updated = notices.map(n => n.id === id ? { ...n, ...updatedFields } : n);
    setNotices(updated);
    saveStoredNotices(updated);
  };

  const deleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    saveStoredNotices(updated);
  };

  const updateTickerSettings = (newSettings: Partial<TickerSettings>) => {
    const updated = { ...tickerSettings, ...newSettings };
    setTickerSettings(updated);
    saveStoredTickerSettings(updated);
  };

  const updateHeroSettings = (newSettings: Partial<HeroSettings>) => {
    const updated = { ...heroSettings, ...newSettings };
    setHeroSettings(updated);
    saveStoredHeroSettings(updated);
  };

  const addUrgentNotice = (noticeData: Omit<UrgentNoticeItem, 'id'>) => {
    const newNotice: UrgentNoticeItem = {
      ...noticeData,
      id: `urg-${Date.now()}`
    };
    const updated = [newNotice, ...urgentNotices];
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
  };

  const updateUrgentNotice = (id: string, updatedFields: Partial<UrgentNoticeItem>) => {
    const updated = urgentNotices.map(n => n.id === id ? { ...n, ...updatedFields } : n);
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
  };

  const deleteUrgentNotice = (id: string) => {
    const updated = urgentNotices.filter(n => n.id !== id);
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
  };

  const toggleUrgentNoticeStatus = (id: string) => {
    const updated = urgentNotices.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n);
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
  };

  const addFacility = (facilityData: Omit<FacilityItem, 'id'>) => {
    const newFacility: FacilityItem = {
      ...facilityData,
      id: `fac-${Date.now()}`
    };
    const updated = [...facilities, newFacility];
    setFacilities(updated);
    saveStoredFacilities(updated);
  };

  const updateFacility = (id: string, updatedFields: Partial<FacilityItem>) => {
    const updated = facilities.map(f => f.id === id ? { ...f, ...updatedFields } : f);
    setFacilities(updated);
    saveStoredFacilities(updated);
  };

  const deleteFacility = (id: string) => {
    const updated = facilities.filter(f => f.id !== id);
    setFacilities(updated);
    saveStoredFacilities(updated);
  };

  const toggleFacilityStatus = (id: string) => {
    const updated = facilities.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f);
    setFacilities(updated);
    saveStoredFacilities(updated);
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    saveStoredGallery(updated);
  };

  const updateGalleryItem = (id: string, updatedFields: Partial<GalleryItem>) => {
    const updated = gallery.map(g => g.id === id ? { ...g, ...updatedFields } : g);
    setGallery(updated);
    saveStoredGallery(updated);
  };

  const deleteGalleryItem = (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    saveStoredGallery(updated);
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'order'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
      order: teachers.length + 1
    };
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    saveStoredTeachers(updated);
  };

  const updateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    const updated = teachers.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTeachers(updated);
    saveStoredTeachers(updated);
  };

  const deleteTeacher = (id: string) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    saveStoredTeachers(updated);
  };

  const submitApplication = (appData: Omit<AdmissionApplication, 'id' | 'appliedDate' | 'status'>) => {
    const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
    const newApp: AdmissionApplication = {
      ...appData,
      id: `PADM-2026-${randomIdNumber}`,
      appliedDate: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: 'অপেক্ষমান'
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
    return newApp;
  };

  const updateApplicationStatus = (id: string, status: 'অপেক্ষমান' | 'অনুমোদিত' | 'বাতিল', remarks?: string) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          remarks: remarks !== undefined ? remarks : app.remarks
        };
      }
      return app;
    });
    setApplications(updated);
    saveStoredApplications(updated);
  };

  const deleteApplication = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    saveStoredApplications(updated);
  };

  const addResult = (resultData: Omit<ResultRecord, 'id'>) => {
    const newResult: ResultRecord = {
      ...resultData,
      id: `res-${Date.now()}`
    };
    const updated = [newResult, ...results];
    setResults(updated);
    saveStoredResults(updated);
  };

  const submitContactMessage = (msgData: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    saveStoredMessages(updated);
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
    setMessages(updated);
    saveStoredMessages(updated);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveStoredMessages(updated);
  };

  const loginAdmin = (pass: string) => {
    // Default admin password
    if (pass === 'admin' || pass === 'madrasah123' || pass === '123456') {
      setIsAdmin(true);
      setAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminLoggedIn(false);
  };

  const resetToDefaults = () => {
    resetAllData();
    setInfo(defaultMadrasahInfo);
    setNotices(defaultNotices);
    setTeachers(defaultTeachers);
    setApplications(defaultApplications);
    setResults(defaultResults);
    setMessages(defaultMessages);
    setUrgentNotices(defaultUrgentNotices);
    setTickerSettings(defaultTickerSettings);
    setHeroSettings(defaultHeroSettings);
    setFacilities(defaultFacilities);
    setGallery(defaultGallery);
    setPrayerConfig(defaultPrayerConfig);
  };

  return (
    <MadrasahContext.Provider
      value={{
        info,
        notices,
        urgentNotices,
        tickerSettings,
        heroSettings,
        facilities,
        gallery,
        prayerConfig,
        loggedStudent,
        teachers,
        applications,
        results,
        messages,
        isAdmin,
        isLoaded,
        updateInfo,
        updatePrayerConfig,
        updateLoggedStudent,
        updateHeroSettings,
        addNotice,
        updateNotice,
        deleteNotice,
        updateTickerSettings,
        addUrgentNotice,
        updateUrgentNotice,
        deleteUrgentNotice,
        toggleUrgentNoticeStatus,
        addFacility,
        updateFacility,
        deleteFacility,
        toggleFacilityStatus,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        addResult,
        submitContactMessage,
        markMessageRead,
        deleteMessage,
        loginAdmin,
        logoutAdmin,
        resetToDefaults
      }}
    >
      {children}
    </MadrasahContext.Provider>
  );
};

export const useMadrasah = () => {
  const context = useContext(MadrasahContext);
  if (!context) {
    throw new Error('useMadrasah must be used within a MadrasahProvider');
  }
  return context;
};
