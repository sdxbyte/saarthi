import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  getCurrentTimeCalendarState,
  TimeCalendarState,
  SUPPORTED_TIMEZONES,
  formatCentralDualDate,
  formatToCanonicalUtc,
  getRelativeTimeString,
  DualDatePayload
} from '../utils/timeCalendarEngine';

export interface GlobalTimeContextType {
  timeState: TimeCalendarState;
  adDateFormatted: string;
  bsFormattedEn: string;
  bsFormattedNp: string;
  time12h: string;
  time24h: string;
  timeZone: string;
  gmtOffsetStr: string;
  syncStatus: 'synchronized' | 'syncing' | 'error';
  syncErrorText: string | null;
  lastSyncTime: string | null;
  nextSyncTime: string | null;
  selectedTimeZone: string;
  setSelectedTimeZone: (tz: string) => void;
  refetchTimeSync: () => Promise<void>;
  
  // Format helpers accepting Date | string | number (canonical UTC inputs)
  formatIntlDate: (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatIntlTime: (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatLocalizedDateTime: (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatDualDateLocalized: (date?: Date | string | number) => DualDatePayload;
  formatToCanonicalUtc: (date?: Date | string | number) => string;
  getRelativeTime: (date: Date | string | number) => string;
}

const GlobalTimeContext = createContext<GlobalTimeContextType | undefined>(undefined);

export interface GlobalTimeProviderProps {
  children: ReactNode;
  defaultTimeZone?: string;
}

export const GlobalTimeProvider: React.FC<GlobalTimeProviderProps> = ({
  children,
  defaultTimeZone = 'Asia/Kathmandu',
}) => {
  // Initialize timezone from localStorage, browser locale, or default
  const [selectedTimeZone, setSelectedTimeZoneState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('saarthi_time_zone');
      if (saved) return saved;
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) return detected;
    } catch (e) {
      // Fallback to default
    }
    return defaultTimeZone;
  });

  const setSelectedTimeZone = useCallback((tz: string) => {
    setSelectedTimeZoneState(tz);
    try {
      localStorage.setItem('saarthi_time_zone', tz);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const [timeOffsetMs, setTimeOffsetMs] = useState<number>(0);
  const [syncMeta, setSyncMeta] = useState<{
    lastSyncTime: string | null;
    nextSyncTime: string | null;
    syncStatus: 'synchronized' | 'syncing' | 'error';
    syncErrorText: string | null;
  }>({
    lastSyncTime: null,
    nextSyncTime: null,
    syncStatus: 'syncing',
    syncErrorText: null,
  });

  // Calculate synchronized Date using client clock + server time offset
  const getSynchronizedNow = useCallback(() => {
    return new Date(Date.now() + timeOffsetMs);
  }, [timeOffsetMs]);

  // Safely parse input (Date, ISO UTC string, numeric timestamp) into a Date object
  const parseToDate = useCallback((dateInput?: Date | string | number): Date => {
    if (!dateInput) return getSynchronizedNow();
    if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? getSynchronizedNow() : dateInput;
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? getSynchronizedNow() : parsed;
  }, [getSynchronizedNow]);

  // Current synchronized time state
  const [timeState, setTimeState] = useState<TimeCalendarState>(() =>
    getCurrentTimeCalendarState(new Date(), selectedTimeZone, false, {
      lastSyncTime: syncMeta.lastSyncTime || undefined,
      nextSyncTime: syncMeta.nextSyncTime || undefined,
      syncStatus: syncMeta.syncStatus,
      syncErrorText: syncMeta.syncErrorText,
    })
  );

  // Synchronize with /api/time endpoint
  const refetchTimeSync = useCallback(async () => {
    try {
      setSyncMeta((prev) => ({ ...prev, syncStatus: 'syncing' }));
      const startMs = Date.now();
      const res = await fetch('/api/time');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const roundTripMs = Date.now() - startMs;
      
      // Calculate server time offset taking round-trip latency into account
      const serverUnixMs = json.unixTimestampSec * 1000 + roundTripMs / 2;
      const offset = serverUnixMs - Date.now();
      setTimeOffsetMs(offset);

      const lastSync = json.lastSyncTime || new Date().toISOString();
      const nextSync = json.nextSyncTime || new Date(Date.now() + 30000).toISOString();

      setSyncMeta({
        lastSyncTime: lastSync,
        nextSyncTime: nextSync,
        syncStatus: 'synchronized',
        syncErrorText: null,
      });
    } catch (err: any) {
      console.warn('[GlobalTimeContext] Time sync failed, falling back to local Intl clock:', err);
      setSyncMeta({
        lastSyncTime: new Date().toISOString(),
        nextSyncTime: new Date(Date.now() + 30000).toISOString(),
        syncStatus: 'error',
        syncErrorText: 'Unable to synchronize date and time.',
      });
    }
  }, []);

  // Sync on mount and every 30 seconds
  useEffect(() => {
    refetchTimeSync();
    const interval = setInterval(refetchTimeSync, 30000);
    return () => clearInterval(interval);
  }, [refetchTimeSync]);

  // Update clock every second only if the formatted time actually changes
  useEffect(() => {
    const timer = setInterval(() => {
      const syncedNow = getSynchronizedNow();
      const newState = getCurrentTimeCalendarState(syncedNow, selectedTimeZone, false, {
        lastSyncTime: syncMeta.lastSyncTime || undefined,
        nextSyncTime: syncMeta.nextSyncTime || undefined,
        syncStatus: syncMeta.syncStatus,
        syncErrorText: syncMeta.syncErrorText,
      });

      setTimeState((prev) => {
        if (
          prev.time12h === newState.time12h &&
          prev.bsFormattedEn === newState.bsFormattedEn &&
          prev.syncStatus === newState.syncStatus
        ) {
          return prev;
        }
        return newState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [getSynchronizedNow, selectedTimeZone, syncMeta]);

  // Format date using Intl.DateTimeFormat in localized timezone
  const formatIntlDate = useCallback(
    (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const d = parseToDate(date);
      const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: selectedTimeZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        ...options,
      };
      return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
    },
    [parseToDate, selectedTimeZone]
  );

  // Format time using Intl.DateTimeFormat in localized timezone
  const formatIntlTime = useCallback(
    (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const d = parseToDate(date);
      const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: selectedTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        ...options,
      };
      return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
    },
    [parseToDate, selectedTimeZone]
  );

  // Format full localized date & time string
  const formatLocalizedDateTime = useCallback(
    (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const d = parseToDate(date);
      const dateStr = formatIntlDate(d, { month: 'short', weekday: 'short', ...options });
      const timeStr = formatIntlTime(d, options);
      return `${dateStr}, ${timeStr} (${timeState.gmtOffsetStr})`;
    },
    [parseToDate, formatIntlDate, formatIntlTime, timeState.gmtOffsetStr]
  );

  // Format dual BS/AD date localized to current user timezone
  const formatDualDateLocalized = useCallback(
    (date?: Date | string | number): DualDatePayload => {
      const d = parseToDate(date);
      return formatCentralDualDate(d, selectedTimeZone);
    },
    [parseToDate, selectedTimeZone]
  );

  // Produce canonical UTC ISO 8601 string for all backend/storage data operations
  const formatToCanonicalUtcCallback = useCallback(
    (date?: Date | string | number): string => {
      const d = parseToDate(date);
      return formatToCanonicalUtc(d);
    },
    [parseToDate]
  );

  // Relative time helper ("X minutes ago")
  const getRelativeTime = useCallback(
    (date: Date | string | number): string => {
      const d = parseToDate(date);
      return getRelativeTimeString(d);
    },
    [parseToDate]
  );

  const value = useMemo<GlobalTimeContextType>(
    () => ({
      timeState,
      adDateFormatted: timeState.adDateFormatted,
      bsFormattedEn: timeState.bsFormattedEn,
      bsFormattedNp: timeState.bsFormattedNp,
      time12h: timeState.time12h,
      time24h: timeState.time24h,
      timeZone: selectedTimeZone,
      gmtOffsetStr: timeState.gmtOffsetStr,
      syncStatus: syncMeta.syncStatus,
      syncErrorText: syncMeta.syncErrorText,
      lastSyncTime: syncMeta.lastSyncTime,
      nextSyncTime: syncMeta.nextSyncTime,
      selectedTimeZone,
      setSelectedTimeZone,
      refetchTimeSync,
      formatIntlDate,
      formatIntlTime,
      formatLocalizedDateTime,
      formatDualDateLocalized,
      formatToCanonicalUtc: formatToCanonicalUtcCallback,
      getRelativeTime,
    }),
    [
      timeState,
      selectedTimeZone,
      syncMeta,
      setSelectedTimeZone,
      refetchTimeSync,
      formatIntlDate,
      formatIntlTime,
      formatLocalizedDateTime,
      formatDualDateLocalized,
      formatToCanonicalUtcCallback,
      getRelativeTime,
    ]
  );

  return <GlobalTimeContext.Provider value={value}>{children}</GlobalTimeContext.Provider>;
};

export const useGlobalTime = (): GlobalTimeContextType => {
  const context = useContext(GlobalTimeContext);
  if (!context) {
    throw new Error('useGlobalTime must be used within a GlobalTimeProvider');
  }
  return context;
};
