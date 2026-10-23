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
  VideoItem,
  defaultVideos,
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
  AdminUser,
  defaultAdminUsers,
  availablePermissions,
  ClassRoutine,
  RoutinePeriod,
  defaultClassRoutines,
  AlumniStudent,
  defaultAlumniStudents,
  StudentProfile,
  defaultStudents
} from './data';

const STORAGE_KEYS = {
  INFO: 'padm_madrasah_info',
  NOTICES: 'padm_notices',
  TEACHERS: 'padm_teachers',
  APPLICATIONS: 'padm_applications',
  RESULTS: 'padm_results',
  MESSAGES: 'padm_messages',
  AUTH: 'padm_admin_logged_in',
  URGENT_NOTICES: 'padm_urgent_notices',
  TICKER_SETTINGS: 'padm_ticker_settings',
  HERO_SETTINGS: 'padm_hero_settings',
  FACILITIES: 'padm_facilities',
  GALLERY: 'padm_gallery',
  VIDEOS: 'padm_videos',
  PRAYER_CONFIG: 'padm_prayer_config',
  ADMIN_USERS: 'padm_admin_users',
  CURRENT_ADMIN_USER: 'padm_current_admin_user',
  ROUTINES: 'padm_routines',
  ALUMNI: 'padm_alumni_students',
  STUDENTS: 'padm_students'
};

export const getStoredInfo = (): MadrasahInfo => {
  if (typeof window === 'undefined') return defaultMadrasahInfo;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INFO);
    if (!data) return defaultMadrasahInfo;
    const parsed = JSON.parse(data);
    return {
      ...defaultMadrasahInfo,
      ...parsed,
      stats: {
        ...defaultMadrasahInfo.stats,
        ...(parsed.stats || {})
      }
    };
  } catch {
    return defaultMadrasahInfo;
  }
};

export const saveStoredInfo = (info: MadrasahInfo) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(info));
  } catch (err) {
    console.error('Error saving info to storage:', err);
  }
};

export const getStoredNotices = (): Notice[] => {
  if (typeof window === 'undefined') return defaultNotices;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return data ? JSON.parse(data) : defaultNotices;
  } catch {
    return defaultNotices;
  }
};

export const saveStoredNotices = (notices: Notice[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  } catch (err) {
    console.error('Error saving notices to storage:', err);
  }
};

export const getStoredTeachers = (): Teacher[] => {
  if (typeof window === 'undefined') return defaultTeachers;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return data ? JSON.parse(data) : defaultTeachers;
  } catch {
    return defaultTeachers;
  }
};

export const saveStoredTeachers = (teachers: Teacher[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  } catch (err) {
    console.error('Error saving teachers to storage:', err);
  }
};

export const getStoredApplications = (): AdmissionApplication[] => {
  if (typeof window === 'undefined') return defaultApplications;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : defaultApplications;
  } catch {
    return defaultApplications;
  }
};

export const saveStoredApplications = (apps: AdmissionApplication[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving applications to storage:', err);
  }
};

export const addAdmissionApplication = (app: AdmissionApplication) => {
  const current = getStoredApplications();
  const updated = [app, ...current];
  saveStoredApplications(updated);
  return updated;
};

export const getStoredResults = (): ResultRecord[] => {
  if (typeof window === 'undefined') return defaultResults;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return data ? JSON.parse(data) : defaultResults;
  } catch {
    return defaultResults;
  }
};

export const saveStoredResults = (results: ResultRecord[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (err) {
    console.error('Error saving results to storage:', err);
  }
};

export const getStoredMessages = (): ContactMessage[] => {
  if (typeof window === 'undefined') return defaultMessages;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : defaultMessages;
  } catch {
    return defaultMessages;
  }
};

export const saveStoredMessages = (messages: ContactMessage[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.error('Error saving messages to storage:', err);
  }
};

export const addContactMessage = (msg: ContactMessage) => {
  const current = getStoredMessages();
  const updated = [msg, ...current];
  saveStoredMessages(updated);
  return updated;
};

export const getStoredTickerSettings = (): TickerSettings => {
  if (typeof window === 'undefined') return defaultTickerSettings;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TICKER_SETTINGS);
    return data ? JSON.parse(data) : defaultTickerSettings;
  } catch {
    return defaultTickerSettings;
  }
};

export const saveStoredTickerSettings = (settings: TickerSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TICKER_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving ticker settings to storage:', err);
  }
};

export const getStoredUrgentNotices = (): UrgentNoticeItem[] => {
  if (typeof window === 'undefined') return defaultUrgentNotices;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.URGENT_NOTICES);
    return data ? JSON.parse(data) : defaultUrgentNotices;
  } catch {
    return defaultUrgentNotices;
  }
};

export const saveStoredUrgentNotices = (notices: UrgentNoticeItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.URGENT_NOTICES, JSON.stringify(notices));
  } catch (err) {
    console.error('Error saving urgent notices to storage:', err);
  }
};

export const getStoredFacilities = (): FacilityItem[] => {
  if (typeof window === 'undefined') return defaultFacilities;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FACILITIES);
    return data ? JSON.parse(data) : defaultFacilities;
  } catch {
    return defaultFacilities;
  }
};

export const saveStoredFacilities = (facilities: FacilityItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
  } catch (err) {
    console.error('Error saving facilities to storage:', err);
  }
};

export const getStoredGallery = (): GalleryItem[] => {
  if (typeof window === 'undefined') return defaultGallery;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return data ? JSON.parse(data) : defaultGallery;
  } catch {
    return defaultGallery;
  }
};

export const saveStoredGallery = (gallery: GalleryItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  } catch (err) {
    console.error('Error saving gallery to storage:', err);
  }
};

export const getStoredVideos = (): VideoItem[] => {
  if (typeof window === 'undefined') return defaultVideos;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    return data ? JSON.parse(data) : defaultVideos;
  } catch {
    return defaultVideos;
  }
};

export const saveStoredVideos = (videos: VideoItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  } catch (err) {
    console.error('Error saving videos to storage:', err);
  }
};

export const getStoredHeroSettings = (): HeroSettings => {
  if (typeof window === 'undefined') return defaultHeroSettings;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HERO_SETTINGS);
    if (!data) return defaultHeroSettings;
    const parsed = JSON.parse(data);
    return {
      ...defaultHeroSettings,
      ...parsed,
      slides: parsed.slides && parsed.slides.length > 0 ? parsed.slides : defaultHeroSettings.slides
    };
  } catch {
    return defaultHeroSettings;
  }
};

export const saveStoredHeroSettings = (settings: HeroSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('padm_hero_sync', { detail: settings }));
  } catch (err) {
    console.error('Error saving hero settings:', err);
  }
};

export const resetAllData = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(defaultMadrasahInfo));
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(defaultNotices));
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(defaultTeachers));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(defaultApplications));
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(defaultResults));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(defaultMessages));
  localStorage.setItem(STORAGE_KEYS.URGENT_NOTICES, JSON.stringify(defaultUrgentNotices));
  localStorage.setItem(STORAGE_KEYS.TICKER_SETTINGS, JSON.stringify(defaultTickerSettings));
  localStorage.setItem(STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(defaultHeroSettings));
  localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(defaultFacilities));
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(defaultGallery));
  localStorage.setItem(STORAGE_KEYS.PRAYER_CONFIG, JSON.stringify(defaultPrayerConfig));
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(defaultAdminUsers));
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(defaultClassRoutines));
  localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(defaultAlumniStudents));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
};

export const getStoredAlumni = (): AlumniStudent[] => {
  if (typeof window === 'undefined') return defaultAlumniStudents;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALUMNI);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(defaultAlumniStudents));
      return defaultAlumniStudents;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(defaultAlumniStudents));
      return defaultAlumniStudents;
    }
    return parsed;
  } catch {
    return defaultAlumniStudents;
  }
};

export const saveStoredAlumni = (alumni: AlumniStudent[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(alumni));
  } catch (err) {
    console.error('Error saving alumni to storage:', err);
  }
};

export const getStoredStudents = (): StudentProfile[] => {
  if (typeof window === 'undefined') return defaultStudents;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents));
      return defaultStudents;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents));
      return defaultStudents;
    }
    return parsed;
  } catch {
    return defaultStudents;
  }
};

export const saveStoredStudents = (students: StudentProfile[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to storage:', err);
  }
};

export const getStoredRoutines = (): ClassRoutine[] => {
  if (typeof window === 'undefined') return defaultClassRoutines;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(defaultClassRoutines));
      return defaultClassRoutines;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(defaultClassRoutines));
      return defaultClassRoutines;
    }
    const healed: ClassRoutine[] = parsed.map((item: any, idx: number) => ({
      id: item.id || `routine-${idx}-${Date.now()}`,
      className: item.className || `শ্রেণি ${idx + 1}`,
      effectiveDate: item.effectiveDate || '০১ জানুয়ারি ২০২৬',
      notes: item.notes || '',
      periods: Array.isArray(item.periods)
        ? item.periods.map((p: any, pIdx: number) => ({
            id: p.id || `p-${pIdx}-${Date.now()}`,
            period: p.period || `${pIdx + 1}ম ঘণ্টা`,
            time: p.time || '০৯:১৫ - ১০:০০',
            subject: p.subject || '',
            teacher: p.teacher || '',
            room: p.room || ''
          }))
        : []
    }));
    return healed;
  } catch {
    return defaultClassRoutines;
  }
};

export const saveStoredRoutines = (routines: ClassRoutine[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  } catch (err) {
    console.error('Error saving class routines:', err);
  }
};

export const getStoredAdminUsers = (): AdminUser[] => {
  if (typeof window === 'undefined') return defaultAdminUsers;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(defaultAdminUsers));
      return defaultAdminUsers;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(defaultAdminUsers));
      return defaultAdminUsers;
    }

    const allPermIds = availablePermissions.map(p => p.id);
    let modified = false;
    let hasSuper = false;

    const healedUsers: AdminUser[] = parsed.map((user: any) => {
      const isSuper = user.isSuperAdmin === true || user.username === 'admin' || (user.role && String(user.role).toLowerCase().includes('সুপার'));
      if (isSuper) {
        hasSuper = true;
        const currentPerms = Array.isArray(user.permissions) ? user.permissions : [];
        const missingPerms = allPermIds.filter(id => !currentPerms.includes(id));
        if (missingPerms.length > 0 || !user.isSuperAdmin) {
          modified = true;
          return {
            ...user,
            isSuperAdmin: true,
            permissions: allPermIds
          };
        }
      }
      return {
        ...user,
        permissions: Array.isArray(user.permissions) ? user.permissions : []
      };
    });

    if (!hasSuper) {
      healedUsers.unshift(defaultAdminUsers[0]);
      modified = true;
    }

    if (modified) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(healedUsers));
    }

    return healedUsers;
  } catch {
    return defaultAdminUsers;
  }
};

export const saveStoredAdminUsers = (users: AdminUser[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving admin users to storage:', err);
  }
};

export const getCurrentAdminUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (!parsed) return null;
    if (parsed.username === 'admin' || parsed.isSuperAdmin) {
      const allPermIds = availablePermissions.map(p => p.id);
      return {
        ...parsed,
        isSuperAdmin: true,
        permissions: allPermIds
      };
    }
    return parsed;
  } catch {
    return null;
  }
};

export const setCurrentAdminUser = (user: AdminUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN_USER, JSON.stringify(user));
    } catch (err) {
      console.error('Error saving current admin user:', err);
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN_USER);
  }
};

export const getStoredPrayerConfig = (): PrayerTimeConfig => {
  if (typeof window === 'undefined') return defaultPrayerConfig;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRAYER_CONFIG);
    return data ? JSON.parse(data) : defaultPrayerConfig;
  } catch {
    return defaultPrayerConfig;
  }
};

export const saveStoredPrayerConfig = (config: PrayerTimeConfig) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PRAYER_CONFIG, JSON.stringify(config));
};

export const isAdminLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
};

export const setAdminLoggedIn = (status: boolean) => {
  if (typeof window === 'undefined') return;
  if (status) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
};
