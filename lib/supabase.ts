/**
 * Supabase Cloud Storage Client
 * Uses native fetch (PostgREST API) to connect directly to Supabase
 * enabling real-time cross-device synchronization without npm dependency issues.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('padm_supabase_url');
    const localKey = localStorage.getItem('padm_supabase_key');
    if (localUrl && localKey) {
      return { url: localUrl.trim().replace(/\/$/, ''), anonKey: localKey.trim() };
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://roctmcrkhthljjbbfnal.supabase.co';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-9XWdKyGtuHP12L2WAh9Qw_lFQ1NH-_';
  return {
    url: envUrl.trim().replace(/\/$/, ''),
    anonKey: envKey.trim()
  };
};

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window === 'undefined') return;
  if (url && anonKey) {
    localStorage.setItem('padm_supabase_url', url.trim().replace(/\/$/, ''));
    localStorage.setItem('padm_supabase_key', anonKey.trim());
  } else {
    localStorage.removeItem('padm_supabase_url');
    localStorage.removeItem('padm_supabase_key');
  }
};

/**
 * Fetch all stored keys from Supabase `madrasah_store` table
 */
export async function fetchCloudStore(): Promise<Record<string, any> | null> {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  try {
    const res = await fetch(`${config.url}/rest/v1/madrasah_store?select=*`, {
      method: 'GET',
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn('Failed to fetch from Supabase:', res.status, res.statusText);
      return null;
    }

    const rows: Array<{ key: string; data: any }> = await res.json();
    const storeMap: Record<string, any> = {};
    for (const row of rows) {
      storeMap[row.key] = row.data;
    }
    return storeMap;
  } catch (err) {
    console.error('Error fetching Supabase cloud store:', err);
    return null;
  }
}

/**
 * Save / Upsert a single key into Supabase `madrasah_store` table
 */
export async function saveCloudKey(key: string, data: any): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/madrasah_store`, {
      method: 'POST',
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        key,
        data,
        updated_at: new Date().toISOString()
      })
    });

    return res.ok;
  } catch (err) {
    console.error(`Error saving key ${key} to Supabase:`, err);
    return false;
  }
}

/**
 * Bulk save all current data into Supabase (Initial seed/migration)
 */
export async function syncAllToCloud(allData: Record<string, any>): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return false;

  try {
    const payload = Object.entries(allData).map(([key, data]) => ({
      key,
      data,
      updated_at: new Date().toISOString()
    }));

    const res = await fetch(`${config.url}/rest/v1/madrasah_store`, {
      method: 'POST',
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.error('Error syncing all data to Supabase:', err);
    return false;
  }
}
