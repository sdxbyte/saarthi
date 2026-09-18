import { KeeperItem, KeeperStatus } from '../types/sajiloTypes';
import { convertAdToBs } from './bsAdConverter';

const KEEPER_STORAGE_KEY = 'saarthi_sajilo_keeper_items';

const DEFAULT_ITEMS: KeeperItem[] = [
  {
    id: 'keeper-1',
    title: 'Nepali Machine Readable Passport (MRP/e-Passport)',
    category: 'passport',
    documentNumber: 'PA1089422',
    expiryDateAd: '2027-05-14',
    expiryDateBs: '2084-01-31',
    remindDaysBefore: 90,
    notes: 'Renew at Department of Passport, Tripureshwor or District Administration Office.',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'keeper-2',
    title: 'Two-Wheeler Bluebook Annual Tax & Insurance',
    category: 'bluebook',
    documentNumber: 'BA 85 PA 4920',
    expiryDateAd: '2026-10-25',
    expiryDateBs: '2083-07-09',
    remindDaysBefore: 30,
    notes: 'Pay transport tax at Transport Management Office (DoTM Ekantakuna/Gurjudhara) or online.',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
  },
  {
    id: 'keeper-3',
    title: 'Smart Card Driving License (Cat A & B)',
    category: 'license',
    documentNumber: '01-06-00849201',
    expiryDateAd: '2028-11-12',
    expiryDateBs: '2085-07-27',
    remindDaysBefore: 60,
    notes: 'Renewable 3 months before expiry at Yatayat Karyalaya.',
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'keeper-4',
    title: 'Home Internet & NEA Electricity Bill Cycle',
    category: 'bill',
    documentNumber: 'NEA-KTM-8942',
    expiryDateAd: '2026-09-30',
    expiryDateBs: '2083-06-14',
    remindDaysBefore: 7,
    notes: 'Pay electricity bill within 7 days for 2% rebate at NEA counters or eSewa/Khalti.',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
];

export function getKeeperItems(): KeeperItem[] {
  if (typeof window === 'undefined') return DEFAULT_ITEMS;
  try {
    const raw = localStorage.getItem(KEEPER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(KEEPER_STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
      return DEFAULT_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error('Failed to read keeper items from storage:', e);
  }
  return DEFAULT_ITEMS;
}

export function saveKeeperItem(item: Omit<KeeperItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): KeeperItem {
  const items = getKeeperItems();
  const nowIso = new Date().toISOString();

  let savedItem: KeeperItem;
  if (item.id) {
    // Update
    savedItem = {
      ...item,
      id: item.id,
      expiryDateBs: item.expiryDateBs || convertAdToBs(item.expiryDateAd),
      createdAt: items.find((i) => i.id === item.id)?.createdAt || nowIso,
      updatedAt: nowIso,
    };
    const updatedList = items.map((i) => (i.id === item.id ? savedItem : i));
    localStorage.setItem(KEEPER_STORAGE_KEY, JSON.stringify(updatedList));
  } else {
    // Create new
    savedItem = {
      ...item,
      id: `keeper-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      expiryDateBs: item.expiryDateBs || convertAdToBs(item.expiryDateAd),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    items.unshift(savedItem);
    localStorage.setItem(KEEPER_STORAGE_KEY, JSON.stringify(items));
  }

  return savedItem;
}

export function deleteKeeperItem(id: string): boolean {
  const items = getKeeperItems();
  const filtered = items.filter((i) => i.id !== id);
  localStorage.setItem(KEEPER_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function computeDaysLeft(expiryDateAd: string): number {
  if (!expiryDateAd) return 0;
  const expiry = new Date(expiryDateAd + 'T00:00:00Z');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const diffMs = expiry.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function computeKeeperStatus(item: KeeperItem): { status: KeeperStatus; daysLeft: number } {
  const daysLeft = computeDaysLeft(item.expiryDateAd);

  if (daysLeft < 0) {
    return { status: 'expired', daysLeft };
  } else if (daysLeft <= 7) {
    return { status: 'urgent', daysLeft };
  } else if (daysLeft <= (item.remindDaysBefore || 30)) {
    return { status: 'expiring_soon', daysLeft };
  }
  return { status: 'safe', daysLeft };
}

export function exportKeeperJson(): string {
  const items = getKeeperItems();
  return JSON.stringify(items, null, 2);
}

export function importKeeperJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      localStorage.setItem(KEEPER_STORAGE_KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) {
    console.error('Failed to import keeper JSON:', e);
  }
  return false;
}
