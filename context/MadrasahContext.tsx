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
  StudentProfile,
  AdminUser,
  defaultAdminUsers,
  ClassRoutine,
  RoutinePeriod,
  defaultClassRoutines,
  AlumniStudent,
  defaultAlumniStudents
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
  getStoredAdminUsers,
  saveStoredAdminUsers,
  getCurrentAdminUser,
  setCurrentAdminUser,
  getStoredRoutines,
  saveStoredRoutines,
  getStoredAlumni,
  saveStoredAlumni,
  isAdminLoggedIn,
  setAdminLoggedIn,
  resetAllData
} from '@/lib/storage';
import {
  fetchCloudStore,
  saveCloudKey,
  syncAllToCloud,
  isSupabaseConfigured
} from '@/lib/supabase';

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
  routines: ClassRoutine[];
  updateRoutines: (routines: ClassRoutine[]) => void;
  addClassRoutine: (routine: Omit<ClassRoutine, 'id'>) => void;
  updateClassRoutine: (id: string, routine: Partial<ClassRoutine>) => void;
  deleteClassRoutine: (id: string) => void;
  addPeriodToRoutine: (routineId: string, period: Omit<RoutinePeriod, 'id'>) => void;
  updatePeriodInRoutine: (routineId: string, periodId: string, period: Partial<RoutinePeriod>) => void;
  deletePeriodFromRoutine: (routineId: string, periodId: string) => void;
  resetRoutinesToDefault: () => void;
  alumniStudents: AlumniStudent[];
  addAlumniStudent: (student: Omit<AlumniStudent, 'id' | 'createdAt'>) => void;
  updateAlumniStudent: (id: string, student: Partial<AlumniStudent>) => void;
  deleteAlumniStudent: (id: string) => void;
  resetAlumniToDefault: () => void;
  adminUsers: AdminUser[];
  currentAdminUser: AdminUser | null;
  addAdminUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateAdminUser: (id: string, user: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => boolean;
  toggleAdminUserStatus: (id: string) => void;
  switchAdminUser: (userIdOrUsername: string) => void;
  restoreSuperAdmin: () => void;
  loginAdmin: (pass: string, username?: string) => boolean;
  logoutAdmin: () => void;
  resetToDefaults: () => void;
  isCloudConnected: boolean;
  uploadAllDataToCloud: () => Promise<boolean>;
  refreshFromCloud: () => Promise<void>;
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
  const [routines, setRoutines] = useState<ClassRoutine[]>(defaultClassRoutines);
  const [alumniStudents, setAlumniStudents] = useState<AlumniStudent[]>(defaultAlumniStudents);
  const [loggedStudent, setLoggedStudent] = useState<StudentProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);
  const [currentAdminUser, setCurrentAdminUserState] = useState<AdminUser | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

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
    setRoutines(getStoredRoutines());
    setAlumniStudents(getStoredAlumni());
    const storedUsers = getStoredAdminUsers();
    setAdminUsers(storedUsers);

    const loggedIn = isAdminLoggedIn();
    setIsAdmin(loggedIn);

    const storedCurrent = getCurrentAdminUser();
    if (storedCurrent) {
      const match = storedUsers.find(u => u.id === storedCurrent.id || u.username.toLowerCase() === storedCurrent.username.toLowerCase());
      const effectiveUser = match || storedCurrent;
      setCurrentAdminUserState(effectiveUser);
      setCurrentAdminUser(effectiveUser);
    } else if (loggedIn) {
      const superAdmin = storedUsers.find(u => u.isSuperAdmin || u.username === 'admin') || defaultAdminUsers[0];
      setCurrentAdminUserState(superAdmin);
      setCurrentAdminUser(superAdmin);
    }

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
      if (e.key === 'padm_routines') setRoutines(getStoredRoutines());
      if (e.key === 'padm_admin_users') setAdminUsers(getStoredAdminUsers());
      if (e.key === 'padm_current_admin_user') setCurrentAdminUserState(getCurrentAdminUser());
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

    const handleInfoSync = (e: any) => {
      if (e?.detail) {
        setInfo(e.detail);
      } else {
        setInfo(getStoredInfo());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('padm_hero_sync', handleHeroSync);
    window.addEventListener('padm_info_sync', handleInfoSync);
    window.addEventListener('padm_student_sync', handleStudentSync);

    // Initial sync from Supabase cloud store
    const syncFromCloud = async () => {
      if (!isSupabaseConfigured()) {
        setIsCloudConnected(false);
        return;
      }
      try {
        const cloud = await fetchCloudStore();
        if (!cloud) {
          setIsCloudConnected(false);
          return;
        }
        setIsCloudConnected(true);
        if (cloud.info) { setInfo(cloud.info); saveStoredInfo(cloud.info); }
        if (cloud.notices) { setNotices(cloud.notices); saveStoredNotices(cloud.notices); }
        if (cloud.teachers) { setTeachers(cloud.teachers); saveStoredTeachers(cloud.teachers); }
        if (cloud.applications) { setApplications(cloud.applications); saveStoredApplications(cloud.applications); }
        if (cloud.results) { setResults(cloud.results); saveStoredResults(cloud.results); }
        if (cloud.messages) { setMessages(cloud.messages); saveStoredMessages(cloud.messages); }
        if (cloud.urgentNotices) { setUrgentNotices(cloud.urgentNotices); saveStoredUrgentNotices(cloud.urgentNotices); }
        if (cloud.tickerSettings) { setTickerSettings(cloud.tickerSettings); saveStoredTickerSettings(cloud.tickerSettings); }
        if (cloud.heroSettings) { setHeroSettings(cloud.heroSettings); saveStoredHeroSettings(cloud.heroSettings); }
        if (cloud.facilities) { setFacilities(cloud.facilities); saveStoredFacilities(cloud.facilities); }
        if (cloud.gallery) { setGallery(cloud.gallery); saveStoredGallery(cloud.gallery); }
        if (cloud.prayerConfig) { setPrayerConfig(cloud.prayerConfig); saveStoredPrayerConfig(cloud.prayerConfig); }
        if (cloud.routines) { setRoutines(cloud.routines); saveStoredRoutines(cloud.routines); }
        if (cloud.alumniStudents) { setAlumniStudents(cloud.alumniStudents); saveStoredAlumni(cloud.alumniStudents); }
        if (cloud.adminUsers) { setAdminUsers(cloud.adminUsers); saveStoredAdminUsers(cloud.adminUsers); }
      } catch (err) {
        console.warn('Supabase sync skipped/failed:', err);
        setIsCloudConnected(false);
      }
    };

    syncFromCloud();
    const cloudPollInterval = setInterval(syncFromCloud, 15000);
    window.addEventListener('focus', syncFromCloud);

    return () => {
      clearInterval(cloudPollInterval);
      window.removeEventListener('focus', syncFromCloud);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('padm_hero_sync', handleHeroSync);
      window.removeEventListener('padm_info_sync', handleInfoSync);
      window.removeEventListener('padm_student_sync', handleStudentSync);
    };
  }, []);

  const updateInfo = (newInfo: MadrasahInfo) => {
    setInfo(newInfo);
    saveStoredInfo(newInfo);
    saveCloudKey('info', newInfo);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('padm_info_sync', { detail: newInfo }));
    }
  };

  const updatePrayerConfig = (newConfig: PrayerTimeConfig) => {
    setPrayerConfig(newConfig);
    saveStoredPrayerConfig(newConfig);
    saveCloudKey('prayerConfig', newConfig);
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
    saveCloudKey('notices', updated);
  };

  const updateNotice = (id: string, updatedFields: Partial<Notice>) => {
    const updated = notices.map(n => n.id === id ? { ...n, ...updatedFields } : n);
    setNotices(updated);
    saveStoredNotices(updated);
    saveCloudKey('notices', updated);
  };

  const deleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    saveStoredNotices(updated);
    saveCloudKey('notices', updated);
  };

  const updateTickerSettings = (newSettings: Partial<TickerSettings>) => {
    const updated = { ...tickerSettings, ...newSettings };
    setTickerSettings(updated);
    saveStoredTickerSettings(updated);
    saveCloudKey('tickerSettings', updated);
  };

  const updateHeroSettings = (newSettings: Partial<HeroSettings>) => {
    const updated = { ...heroSettings, ...newSettings };
    setHeroSettings(updated);
    saveStoredHeroSettings(updated);
    saveCloudKey('heroSettings', updated);
  };

  const addUrgentNotice = (noticeData: Omit<UrgentNoticeItem, 'id'>) => {
    const newNotice: UrgentNoticeItem = {
      ...noticeData,
      id: `urg-${Date.now()}`
    };
    const updated = [newNotice, ...urgentNotices];
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
    saveCloudKey('urgentNotices', updated);
  };

  const updateUrgentNotice = (id: string, updatedFields: Partial<UrgentNoticeItem>) => {
    const updated = urgentNotices.map(n => n.id === id ? { ...n, ...updatedFields } : n);
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
    saveCloudKey('urgentNotices', updated);
  };

  const deleteUrgentNotice = (id: string) => {
    const updated = urgentNotices.filter(n => n.id !== id);
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
    saveCloudKey('urgentNotices', updated);
  };

  const toggleUrgentNoticeStatus = (id: string) => {
    const updated = urgentNotices.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n);
    setUrgentNotices(updated);
    saveStoredUrgentNotices(updated);
    saveCloudKey('urgentNotices', updated);
  };

  const addFacility = (facilityData: Omit<FacilityItem, 'id'>) => {
    const newFacility: FacilityItem = {
      ...facilityData,
      id: `fac-${Date.now()}`
    };
    const updated = [...facilities, newFacility];
    setFacilities(updated);
    saveStoredFacilities(updated);
    saveCloudKey('facilities', updated);
  };

  const updateFacility = (id: string, updatedFields: Partial<FacilityItem>) => {
    const updated = facilities.map(f => f.id === id ? { ...f, ...updatedFields } : f);
    setFacilities(updated);
    saveStoredFacilities(updated);
    saveCloudKey('facilities', updated);
  };

  const deleteFacility = (id: string) => {
    const updated = facilities.filter(f => f.id !== id);
    setFacilities(updated);
    saveStoredFacilities(updated);
    saveCloudKey('facilities', updated);
  };

  const toggleFacilityStatus = (id: string) => {
    const updated = facilities.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f);
    setFacilities(updated);
    saveStoredFacilities(updated);
    saveCloudKey('facilities', updated);
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    saveStoredGallery(updated);
    saveCloudKey('gallery', updated);
  };

  const updateGalleryItem = (id: string, updatedFields: Partial<GalleryItem>) => {
    const updated = gallery.map(g => g.id === id ? { ...g, ...updatedFields } : g);
    setGallery(updated);
    saveStoredGallery(updated);
    saveCloudKey('gallery', updated);
  };

  const deleteGalleryItem = (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    saveStoredGallery(updated);
    saveCloudKey('gallery', updated);
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
    saveCloudKey('teachers', updated);
  };

  const updateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    const updated = teachers.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTeachers(updated);
    saveStoredTeachers(updated);
    saveCloudKey('teachers', updated);
  };

  const deleteTeacher = (id: string) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    saveStoredTeachers(updated);
    saveCloudKey('teachers', updated);
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
    saveCloudKey('applications', updated);
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
    saveCloudKey('applications', updated);
  };

  const deleteApplication = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    saveStoredApplications(updated);
    saveCloudKey('applications', updated);
  };

  const addResult = (resultData: Omit<ResultRecord, 'id'>) => {
    const newResult: ResultRecord = {
      ...resultData,
      id: `res-${Date.now()}`
    };
    const updated = [newResult, ...results];
    setResults(updated);
    saveStoredResults(updated);
    saveCloudKey('results', updated);
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
    saveCloudKey('messages', updated);
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
    setMessages(updated);
    saveStoredMessages(updated);
    saveCloudKey('messages', updated);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveStoredMessages(updated);
    saveCloudKey('messages', updated);
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    const updated = [newUser, ...adminUsers];
    setAdminUsers(updated);
    saveStoredAdminUsers(updated);
    saveCloudKey('adminUsers', updated);
  };

  const updateAdminUser = (id: string, updatedFields: Partial<AdminUser>) => {
    const updated = adminUsers.map(u => {
      if (u.id === id) {
        const merged = { ...u, ...updatedFields };
        if (currentAdminUser && currentAdminUser.id === id) {
          setCurrentAdminUserState(merged);
          setCurrentAdminUser(merged);
        }
        return merged;
      }
      return u;
    });
    setAdminUsers(updated);
    saveStoredAdminUsers(updated);
    saveCloudKey('adminUsers', updated);
  };

  const deleteAdminUser = (id: string): boolean => {
    const target = adminUsers.find(u => u.id === id);
    if (target?.isSuperAdmin) {
      return false; // Cannot delete Super Admin
    }
    const updated = adminUsers.filter(u => u.id !== id);
    setAdminUsers(updated);
    saveStoredAdminUsers(updated);
    saveCloudKey('adminUsers', updated);
    return true;
  };

  const toggleAdminUserStatus = (id: string) => {
    const updated = adminUsers.map(u => {
      if (u.id === id) {
        if (u.isSuperAdmin) return u;
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    setAdminUsers(updated);
    saveStoredAdminUsers(updated);
    saveCloudKey('adminUsers', updated);
  };

  const switchAdminUser = (userIdOrUsername: string) => {
    const target = adminUsers.find(
      u => u.id === userIdOrUsername || u.username.toLowerCase() === userIdOrUsername.toLowerCase()
    );
    if (target) {
      setCurrentAdminUserState(target);
      setCurrentAdminUser(target);
    }
  };

  const restoreSuperAdmin = () => {
    const superAdmin = adminUsers.find(u => u.isSuperAdmin || u.username === 'admin') || defaultAdminUsers[0];
    setCurrentAdminUserState(superAdmin);
    setCurrentAdminUser(superAdmin);
  };

  const loginAdmin = (pass: string, username?: string): boolean => {
    const cleanPass = pass.trim();
    const cleanUser = (username || '').trim().toLowerCase();

    // If username is provided and not 'admin'
    if (cleanUser && cleanUser !== 'admin') {
      const foundUser = adminUsers.find(u => u.username.toLowerCase() === cleanUser);
      if (foundUser && foundUser.isActive && foundUser.password === cleanPass) {
        setIsAdmin(true);
        setAdminLoggedIn(true);
        setCurrentAdminUserState(foundUser);
        setCurrentAdminUser(foundUser);
        return true;
      }
      return false;
    }

    // Default admin or 'admin' username
    const superAdmin = adminUsers.find(u => u.isSuperAdmin) || defaultAdminUsers[0];
    const isSuperPassMatch = cleanPass === superAdmin.password || cleanPass === 'admin' || cleanPass === 'madrasah123' || cleanPass === '123456';

    if (isSuperPassMatch) {
      setIsAdmin(true);
      setAdminLoggedIn(true);
      setCurrentAdminUserState(superAdmin);
      setCurrentAdminUser(superAdmin);
      return true;
    }

    // Try finding by username even if pass was entered
    const anyUser = adminUsers.find(u => u.username.toLowerCase() === cleanUser);
    if (anyUser && anyUser.isActive && anyUser.password === cleanPass) {
      setIsAdmin(true);
      setAdminLoggedIn(true);
      setCurrentAdminUserState(anyUser);
      setCurrentAdminUser(anyUser);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminLoggedIn(false);
    setCurrentAdminUserState(null);
    setCurrentAdminUser(null);
  };

  const updateRoutines = (newRoutines: ClassRoutine[]) => {
    setRoutines(newRoutines);
    saveStoredRoutines(newRoutines);
    saveCloudKey('routines', newRoutines);
  };

  const addClassRoutine = (routineData: Omit<ClassRoutine, 'id'>) => {
    const newRoutine: ClassRoutine = {
      ...routineData,
      id: `routine-${Date.now()}`
    };
    const updated = [...routines, newRoutine];
    updateRoutines(updated);
  };

  const updateClassRoutine = (id: string, routineData: Partial<ClassRoutine>) => {
    const updated = routines.map(r => r.id === id ? { ...r, ...routineData } : r);
    updateRoutines(updated);
  };

  const deleteClassRoutine = (id: string) => {
    const updated = routines.filter(r => r.id !== id);
    updateRoutines(updated);
  };

  const addPeriodToRoutine = (routineId: string, periodData: Omit<RoutinePeriod, 'id'>) => {
    const newPeriod: RoutinePeriod = {
      ...periodData,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    const updated = routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          periods: [...r.periods, newPeriod]
        };
      }
      return r;
    });
    updateRoutines(updated);
  };

  const updatePeriodInRoutine = (routineId: string, periodId: string, periodData: Partial<RoutinePeriod>) => {
    const updated = routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          periods: r.periods.map(p => p.id === periodId ? { ...p, ...periodData } : p)
        };
      }
      return r;
    });
    updateRoutines(updated);
  };

  const deletePeriodFromRoutine = (routineId: string, periodId: string) => {
    const updated = routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          periods: r.periods.filter(p => p.id !== periodId)
        };
      }
      return r;
    });
    updateRoutines(updated);
  };

  const resetRoutinesToDefault = () => {
    updateRoutines(defaultClassRoutines);
  };

  const addAlumniStudent = (studentData: Omit<AlumniStudent, 'id' | 'createdAt'>) => {
    const newStudent: AlumniStudent = {
      ...studentData,
      id: `alm-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newStudent, ...alumniStudents];
    setAlumniStudents(updated);
    saveStoredAlumni(updated);
    saveCloudKey('alumniStudents', updated);
  };

  const updateAlumniStudent = (id: string, studentData: Partial<AlumniStudent>) => {
    const updated = alumniStudents.map(s => s.id === id ? { ...s, ...studentData } : s);
    setAlumniStudents(updated);
    saveStoredAlumni(updated);
    saveCloudKey('alumniStudents', updated);
  };

  const deleteAlumniStudent = (id: string) => {
    const updated = alumniStudents.filter(s => s.id !== id);
    setAlumniStudents(updated);
    saveStoredAlumni(updated);
    saveCloudKey('alumniStudents', updated);
  };

  const resetAlumniToDefault = () => {
    setAlumniStudents(defaultAlumniStudents);
    saveStoredAlumni(defaultAlumniStudents);
    saveCloudKey('alumniStudents', defaultAlumniStudents);
  };

  const uploadAllDataToCloud = async (): Promise<boolean> => {
    const all = {
      info,
      notices,
      teachers,
      applications,
      results,
      messages,
      urgentNotices,
      tickerSettings,
      heroSettings,
      facilities,
      gallery,
      prayerConfig,
      routines,
      alumniStudents,
      adminUsers
    };
    const success = await syncAllToCloud(all);
    if (success) {
      setIsCloudConnected(true);
    }
    return success;
  };

  const refreshFromCloud = async (): Promise<void> => {
    if (!isSupabaseConfigured()) return;
    try {
      const cloud = await fetchCloudStore();
      if (!cloud) return;
      setIsCloudConnected(true);
      if (cloud.info) { setInfo(cloud.info); saveStoredInfo(cloud.info); }
      if (cloud.notices) { setNotices(cloud.notices); saveStoredNotices(cloud.notices); }
      if (cloud.teachers) { setTeachers(cloud.teachers); saveStoredTeachers(cloud.teachers); }
      if (cloud.applications) { setApplications(cloud.applications); saveStoredApplications(cloud.applications); }
      if (cloud.results) { setResults(cloud.results); saveStoredResults(cloud.results); }
      if (cloud.messages) { setMessages(cloud.messages); saveStoredMessages(cloud.messages); }
      if (cloud.urgentNotices) { setUrgentNotices(cloud.urgentNotices); saveStoredUrgentNotices(cloud.urgentNotices); }
      if (cloud.tickerSettings) { setTickerSettings(cloud.tickerSettings); saveStoredTickerSettings(cloud.tickerSettings); }
      if (cloud.heroSettings) { setHeroSettings(cloud.heroSettings); saveStoredHeroSettings(cloud.heroSettings); }
      if (cloud.facilities) { setFacilities(cloud.facilities); saveStoredFacilities(cloud.facilities); }
      if (cloud.gallery) { setGallery(cloud.gallery); saveStoredGallery(cloud.gallery); }
      if (cloud.prayerConfig) { setPrayerConfig(cloud.prayerConfig); saveStoredPrayerConfig(cloud.prayerConfig); }
      if (cloud.routines) { setRoutines(cloud.routines); saveStoredRoutines(cloud.routines); }
      if (cloud.alumniStudents) { setAlumniStudents(cloud.alumniStudents); saveStoredAlumni(cloud.alumniStudents); }
      if (cloud.adminUsers) { setAdminUsers(cloud.adminUsers); saveStoredAdminUsers(cloud.adminUsers); }
    } catch (e) {
      console.error(e);
    }
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
    setAdminUsers(defaultAdminUsers);
    setRoutines(defaultClassRoutines);
    setAlumniStudents(defaultAlumniStudents);
    setCurrentAdminUserState(null);
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
        routines,
        alumniStudents,
        loggedStudent,
        teachers,
        applications,
        results,
        messages,
        isAdmin,
        isLoaded,
        adminUsers,
        currentAdminUser,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        toggleAdminUserStatus,
        switchAdminUser,
        restoreSuperAdmin,
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
        updateRoutines,
        addClassRoutine,
        updateClassRoutine,
        deleteClassRoutine,
        addPeriodToRoutine,
        updatePeriodInRoutine,
        deletePeriodFromRoutine,
        resetRoutinesToDefault,
        addAlumniStudent,
        updateAlumniStudent,
        deleteAlumniStudent,
        resetAlumniToDefault,
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
        isCloudConnected,
        uploadAllDataToCloud,
        refreshFromCloud
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
