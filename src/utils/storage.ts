import { LabFullData } from '../types';
import { initialLabData } from '../data/initialLabData';

export const LAB_STORAGE_KEY = 'jnu_msa_stat_lab_data_v6';
const LEGACY_STORAGE_KEYS = [
  'jnu_msa_stat_lab_data',
  'jnu_msa_stat_lab_data_v1',
  'jnu_msa_stat_lab_data_v2',
  'jnu_msa_stat_lab_data_v3',
  'jnu_msa_stat_lab_data_v4',
  'jnu_msa_stat_lab_data_v5',
  'jnu_msa_stat_lab_data_backup'
];

const DB_NAME = 'jnu_msa_lab_db';
const STORE_NAME = 'lab_data_store';
const DB_VERSION = 1;

/**
 * Open or initialize IndexedDB connection
 */
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save data to IndexedDB asynchronously
 */
export async function saveToIndexedDB(data: LabFullData): Promise<void> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data, 'current_lab_data');
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB save failed:', err);
  }
}

/**
 * Load data from IndexedDB
 */
export async function loadFromIndexedDB(): Promise<LabFullData | null> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('current_lab_data');
    return new Promise((resolve) => {
      request.onsuccess = () => {
        db.close();
        resolve(request.result || null);
      };
      request.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('IndexedDB load failed:', err);
    return null;
  }
}

/**
 * Cleans up legacy localStorage keys to free up space
 */
export function cleanLegacyStorageKeys(): void {
  try {
    LEGACY_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (e) {
    console.warn('Could not clean legacy storage keys:', e);
  }
}

/**
 * Load lab data synchronously on startup (falling back to initialLabData)
 */
export function getInitialLabDataSync(): LabFullData {
  cleanLegacyStorageKeys();
  try {
    const saved = localStorage.getItem(LAB_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.lab && parsed.professor) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not load lab data from localStorage:', e);
  }
  return initialLabData;
}

/**
 * Safe save function that handles localStorage quota limits gracefully
 * and persists to both localStorage and IndexedDB
 */
export function persistLabData(data: LabFullData): void {
  // Always persist to IndexedDB asynchronously as durable storage
  saveToIndexedDB(data).catch(() => {});

  // Clean legacy keys first
  cleanLegacyStorageKeys();

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(LAB_STORAGE_KEY, serialized);
  } catch (e: any) {
    console.warn('localStorage.setItem quota warning, attempting recovery:', e);

    // If quota exceeded, try cleaning all unnecessary localStorage keys
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key !== LAB_STORAGE_KEY && !key.includes('admin_pin')) {
          localStorage.removeItem(key);
        }
      }
      // Retry saving
      localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(data));
      return;
    } catch (retryError) {
      console.warn('localStorage full even after cleanup, fallback to IndexedDB:', retryError);
    }
  }
}
