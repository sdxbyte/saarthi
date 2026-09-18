// Data Freshness Engine for SAARTHI
// Rule 12: Every dynamic dataset receives a freshness state: 🟢 Fresh, 🟡 Aging, 🟠 Stale, 🔴 Unavailable

export type FreshnessState = 'FRESH' | 'AGING' | 'STALE' | 'UNAVAILABLE';

export interface FreshnessBadgeInfo {
  state: FreshnessState;
  colorClass: string;
  badgeTextEn: string;
  badgeTextNp: string;
  iconSymbol: string;
  ageFormatted: string;
}

export function calculateDataFreshness(
  lastUpdatedTimestampIso: string | undefined,
  freshnessWindowMs: number = 3600000 // default 1 hour
): FreshnessBadgeInfo {
  if (!lastUpdatedTimestampIso) {
    return {
      state: 'UNAVAILABLE',
      colorClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      badgeTextEn: 'Data Unavailable',
      badgeTextNp: 'डाटा उपलब्ध छैन',
      iconSymbol: '🔴',
      ageFormatted: 'N/A',
    };
  }

  const lastUpdate = new Date(lastUpdatedTimestampIso).getTime();
  if (isNaN(lastUpdate)) {
    return {
      state: 'UNAVAILABLE',
      colorClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      badgeTextEn: 'Invalid Timestamp',
      badgeTextNp: 'अमान्य समय',
      iconSymbol: '🔴',
      ageFormatted: 'Invalid',
    };
  }

  const now = Date.now();
  const ageMs = Math.max(0, now - lastUpdate);
  const ageMinutes = Math.floor(ageMs / 60000);
  const ageHours = Math.floor(ageMinutes / 60);

  let ageFormatted = '';
  if (ageMinutes < 1) {
    ageFormatted = 'Just now';
  } else if (ageMinutes < 60) {
    ageFormatted = `${ageMinutes}m ago`;
  } else {
    ageFormatted = `${ageHours}h ${ageMinutes % 60}m ago`;
  }

  // 0 - 50% of window = FRESH
  // 50% - 100% of window = AGING
  // > 100% of window = STALE
  if (ageMs <= freshnessWindowMs * 0.5) {
    return {
      state: 'FRESH',
      colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badgeTextEn: 'Live & Verified',
      badgeTextNp: 'लाइभ तथा प्रमाणित',
      iconSymbol: '🟢',
      ageFormatted,
    };
  } else if (ageMs <= freshnessWindowMs) {
    return {
      state: 'AGING',
      colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badgeTextEn: 'Recent Stream',
      badgeTextNp: 'हालैको अपडेट',
      iconSymbol: '🟡',
      ageFormatted,
    };
  } else {
    return {
      state: 'STALE',
      colorClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      badgeTextEn: 'Last Published Record',
      badgeTextNp: 'अन्तिम प्रकाशित रेकर्ड',
      iconSymbol: '🟠',
      ageFormatted,
    };
  }
}
