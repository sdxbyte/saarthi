import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bell,
  Bookmark,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import himalayanHeroImg from '../../assets/images/saarthi_himalayan_hero_1795643294663.jpg';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { useSyncAuth } from '../../context/SyncAuthContext';
import {
  DASHBOARD_LAYOUT_SYNC_ID,
  DASHBOARD_WIDGET_CATALOG,
  DashboardPreferences,
  DashboardWidgetId,
  DEFAULT_WIDGET_ORDER,
  decodeDashboardPrefsFromSync,
  encodeDashboardPrefsForSync,
  loadLocalDashboardPreferences,
  loadRecentModules,
  RecentModuleEntry,
  saveLocalDashboardPreferences,
} from '../../services/dashboardPrefsService';
import { Button, Card, EmptyState, SectionHeader } from '../ui';

interface EditorialHomeViewProps {
  currentLang: 'en' | 'ne';
  onNavigateTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
}

interface LiveHighlightState {
  loading: boolean;
  forexText: string;
  forexMeta: string;
  goldText: string;
  goldMeta: string;
  fuelText: string;
  nepseText: string;
  nepseMeta: string;
  ipoCountText: string;
  notices: Array<{ title: string; source: string; url?: string; date?: string }>;
}

export const EditorialHomeView: React.FC<EditorialHomeViewProps> = ({
  currentLang,
  onNavigateTab,
  onOpenSearch,
  onOpenAccount,
}) => {
  const { timeState } = useGlobalTime();
  const {
    userProfile,
    savedItems,
    vaultDocs,
    keeperItems,
    conflicts,
    syncStatus,
    toggleSavedItem,
    upsertSavedItemRecord,
  } = useSyncAuth();

  const isNe = currentLang === 'ne';

  const [prefs, setPrefs] = useState<DashboardPreferences>(() => loadLocalDashboardPreferences());
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [recentModules, setRecentModules] = useState<RecentModuleEntry[]>(() => loadRecentModules());

  // Sync dashboard preferences from cloud savedItems if newer
  useEffect(() => {
    const cloudPrefRecord = savedItems.find((s) => s.id === DASHBOARD_LAYOUT_SYNC_ID);
    if (!cloudPrefRecord) return;
    const decoded = decodeDashboardPrefsFromSync(cloudPrefRecord.tags, cloudPrefRecord.subtitle);
    if (decoded && decoded.updatedAtIso > prefs.updatedAtIso) {
      setPrefs(saveLocalDashboardPreferences(decoded));
    }
  }, [savedItems, prefs.updatedAtIso]);

  useEffect(() => {
    setRecentModules(loadRecentModules());
  }, []);

  const persistDashboardPrefs = (next: DashboardPreferences) => {
    const savedLocal = saveLocalDashboardPreferences(next);
    setPrefs(savedLocal);
    const encoded = encodeDashboardPrefsForSync(savedLocal);
    if (upsertSavedItemRecord) {
      void upsertSavedItemRecord({
        id: DASHBOARD_LAYOUT_SYNC_ID,
        kind: 'note',
        targetId: 'dashboard-layout',
        title: 'SAARTHI Dashboard Layout Preferences',
        subtitle: encoded.subtitle,
        tags: encoded.tags,
        pinned: false,
      });
    }
  };

  const moveWidget = (id: DashboardWidgetId, direction: 'up' | 'down') => {
    const idx = prefs.widgetOrder.indexOf(id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= prefs.widgetOrder.length) return;
    const nextOrder = [...prefs.widgetOrder];
    const [moved] = nextOrder.splice(idx, 1);
    nextOrder.splice(targetIdx, 0, moved);
    persistDashboardPrefs({ ...prefs, widgetOrder: nextOrder });
  };

  const toggleWidgetVisibility = (id: DashboardWidgetId) => {
    const hidden = prefs.hiddenWidgets.includes(id)
      ? prefs.hiddenWidgets.filter((w) => w !== id)
      : [...prefs.hiddenWidgets, id];
    persistDashboardPrefs({ ...prefs, hiddenWidgets: hidden });
  };

  const resetDefaultLayout = () => {
    persistDashboardPrefs({
      widgetOrder: [...DEFAULT_WIDGET_ORDER],
      hiddenWidgets: [],
      updatedAtIso: new Date().toISOString(),
    });
  };

  const [liveState, setLiveState] = useState<LiveHighlightState>({
    loading: true,
    forexText: isNe ? 'राष्ट्र बैंक दर लोड हुँदैछ...' : 'Loading NRB official rates...',
    forexMeta: 'Nepal Rastra Bank',
    goldText: isNe ? 'सुनचाँदी दर लोड हुँदैछ...' : 'Loading bullion rates...',
    goldMeta: 'FENEGOSIDA',
    fuelText: isNe ? 'इन्धन मूल्य जाँच हुँदैछ...' : 'Loading NOC fuel tariff...',
    nepseText: isNe ? 'नेप्से तथ्याङ्क लोड हुँदैछ...' : 'Loading NEPSE feed...',
    nepseMeta: 'Nepal Stock Exchange',
    ipoCountText: isNe ? 'आइपिओ विवरण जाँच हुँदैछ...' : 'Checking CDSC IPO pipeline...',
    notices: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function loadOfficialFeeds() {
      try {
        const [forexRes, metalsRes, fuelRes, nepseRes, ipoRes, newsRes] = await Promise.allSettled([
          fetch('/api/live/forex').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/live/metals').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/live/fuel').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/live/nepse').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/live/nepse/ipo').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/live/news').then((r) => (r.ok ? r.json() : null)),
        ]);

        if (cancelled) return;

        const unavailable = 'Official data is currently unavailable.';

        // 1. NRB Forex (never invent values)
        let forexText = unavailable;
        let forexMeta = 'Nepal Rastra Bank (NRB)';
        if (forexRes.status === 'fulfilled' && forexRes.value?.data) {
          const rates = Array.isArray(forexRes.value.data)
            ? forexRes.value.data
            : forexRes.value.data?.rates || [];
          const usd = rates.find(
            (r: any) => String(r.code || r.currency?.iso3 || '').toUpperCase() === 'USD'
          );
          if (usd && (usd.buy || usd.sell)) {
            forexText = `USD ${usd.buy} buy / ${usd.sell} sell`;
            forexMeta = forexRes.value.dataSource || forexMeta;
          }
        }

        // 2. Bullion Metals (never invent values)
        let goldText = unavailable;
        let goldMeta = 'FENEGOSIDA';
        if (metalsRes.status === 'fulfilled' && metalsRes.value?.data) {
          const items = Array.isArray(metalsRes.value.data)
            ? metalsRes.value.data
            : metalsRes.value.data?.rates || [];
          const fineGold = items.find(
            (m: any) =>
              m.id === 'fine-gold-24k' ||
              /fine\s*gold|hallmark|chapawal|chhapawal/i.test(String(m.categoryEn || m.item || m.name || ''))
          );
          const tolaVal = fineGold?.nprPerTola ?? fineGold?.perTola;
          if (fineGold && tolaVal) {
            goldText = `NPR ${Number(tolaVal).toLocaleString()} / tola`;
            goldMeta = metalsRes.value.dataSource || goldMeta;
          }
        }

        // 2b. NOC Fuel Tariff
        let fuelText = unavailable;
        if (fuelRes.status === 'fulfilled' && fuelRes.value) {
          const fuelItems = Array.isArray(fuelRes.value.tariffs)
            ? fuelRes.value.tariffs
            : Array.isArray(fuelRes.value.data)
            ? fuelRes.value.data
            : [];
          const petrol = fuelItems.find((f: any) =>
            /petrol/i.test(String(f.itemEn || f.item || ''))
          );
          if (petrol && petrol.priceNpr) {
            fuelText = `Petrol NPR ${Number(petrol.priceNpr).toFixed(2)}/${petrol.unitEn || petrol.unit || 'L'}`;
          }
        }

        // 3. NEPSE Market (never invent values)
        let nepseText = unavailable;
        let nepseMeta = 'Nepal Stock Exchange (NEPSE)';
        if (nepseRes.status === 'fulfilled' && nepseRes.value?.data) {
          const idx = nepseRes.value.data?.index || nepseRes.value.data?.indices?.[0];
          if (idx && typeof idx.value === 'number') {
            const sign = (idx.pChange ?? 0) >= 0 ? '+' : '';
            nepseText = `${idx.value.toFixed(2)} (${sign}${Number(idx.pChange ?? 0).toFixed(2)}%)`;
            nepseMeta = nepseRes.value.dataSource || nepseMeta;
          }
        }

        // 4. IPO Pipeline count
        let ipoCountText = unavailable;
        if (ipoRes.status === 'fulfilled' && ipoRes.value?.data) {
          const ipos = Array.isArray(ipoRes.value.data)
            ? ipoRes.value.data
            : ipoRes.value.data?.ipos || [];
          const openIpos = ipos.filter(
            (i: any) => String(i.status || '').toLowerCase() === 'open'
          );
          ipoCountText =
            ipos.length > 0
              ? `${openIpos.length} open / ${ipos.length} tracked`
              : 'No active IPO entries';
        }

        // 5. Public notices / market headlines
        const notices: Array<{ title: string; source: string; url?: string; date?: string }> = [];
        if (newsRes.status === 'fulfilled' && newsRes.value?.data) {
          const articles = Array.isArray(newsRes.value.data)
            ? newsRes.value.data
            : newsRes.value.data?.articles || [];
          for (const art of articles.slice(0, 4)) {
            if (art?.title) {
              notices.push({
                title: art.title,
                source: art.source || art.publisher || 'Verified Feed',
                url: art.url,
                date: art.publishedAt || art.date,
              });
            }
          }
        }

        setLiveState({
          loading: false,
          forexText,
          forexMeta,
          goldText,
          goldMeta,
          fuelText,
          nepseText,
          nepseMeta,
          ipoCountText,
          notices,
        });
      } catch {
        if (!cancelled) {
          setLiveState((prev) => ({
            ...prev,
            loading: false,
            forexText: 'Official data is currently unavailable.',
            goldText: 'Official data is currently unavailable.',
            fuelText: 'Official data is currently unavailable.',
            nepseText: 'Official data is currently unavailable.',
            ipoCountText: 'Official data is currently unavailable.',
          }));
        }
      }
    }

    void loadOfficialFeeds();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derive genuine notifications (upcoming expiry alerts + sync conflicts)
  const notifications = useMemo(() => {
    const items: Array<{ id: string; kind: 'warning' | 'info'; title: string; detail: string; targetTab: string }> = [];
    if (conflicts.length > 0) {
      items.push({
        id: 'sync-conflict',
        kind: 'warning',
        title: isNe
          ? `${conflicts.length} सिङ्क द्वन्द्व समाधान गर्न बाँकी`
          : `${conflicts.length} sync conflict(s) require review`,
        detail: isNe
          ? 'हेडरको सिङ्क बटन थिचेर सुरक्षित संस्करण छान्नुहोस्।'
          : 'Tap the Sync status badge in header or Account to resolve safely.',
        targetTab: 'account',
      });
    }
    const nowMs = Date.now();
    for (const k of keeperItems) {
      if (!k.expiryDateAd) continue;
      const diffDays = Math.ceil((new Date(k.expiryDateAd).getTime() - nowMs) / 86400000);
      if (diffDays <= (k.remindDaysBefore ?? 30) && diffDays >= -7) {
        items.push({
          id: `keeper-${k.id}`,
          kind: diffDays <= 7 ? 'warning' : 'info',
          title: `${k.title}`,
          detail:
            diffDays < 0
              ? isNe
                ? `${Math.abs(diffDays)} दिन अघि म्याद सकियो`
                : `Expired ${Math.abs(diffDays)} day(s) ago (${k.expiryDateAd})`
              : isNe
              ? `${diffDays} दिन बाँकी (${k.expiryDateAd})`
              : `Due in ${diffDays} day(s) (${k.expiryDateAd})`,
          targetTab: 'sajilo',
        });
      }
    }
    if (!userProfile.isLoggedIn && (vaultDocs.length > 0 || keeperItems.length > 0)) {
      items.push({
        id: 'cloud-backup-hint',
        kind: 'info',
        title: isNe ? 'क्लाउड सिङ्क सक्रिय गर्नुहोस्' : 'Enable cross-device cloud sync',
        detail: isNe
          ? 'तपाईँका कागजात र रिमाइन्डर वेब र एन्ड्रोइडमा साझा गर्न साइन इन गर्नुहोस्।'
          : 'Sign in to sync your local Vault documents and reminders across Web and Android.',
        targetTab: 'account',
      });
    }
    return items.slice(0, 6);
  }, [conflicts.length, isNe, keeperItems, userProfile.isLoggedIn, vaultDocs.length]);

  // Visible saved items excluding internal dashboard layout metadata record
  const userShortcuts = useMemo(
    () => savedItems.filter((item) => item.id !== DASHBOARD_LAYOUT_SYNC_ID),
    [savedItems]
  );

  const frequentServices = [
    {
      id: 'nepse',
      title: isNe ? 'नेप्से र आइपिओ' : 'NEPSE & IPO Suite',
      category: isNe ? 'वित्त · सेयर बजार' : 'Finance · Capital Market',
      source: liveState.nepseMeta,
      highlight: liveState.loading ? (isNe ? 'सिङ्क हुँदैछ...' : 'Syncing feed...') : liveState.nepseText,
      icon: TrendingUp,
    },
    {
      id: 'forex',
      title: isNe ? 'विदेशी मुद्रा दर (NRB)' : 'Nepal Forex Rates',
      category: isNe ? 'वित्त · विनिमय दर' : 'Finance · Currency',
      source: liveState.forexMeta,
      highlight: liveState.loading ? (isNe ? 'सिङ्क हुँदैछ...' : 'Syncing feed...') : liveState.forexText,
      icon: DollarSign,
    },
    {
      id: 'gold',
      title: isNe ? 'सुन, चाँदी र इन्धन' : 'Gold, Silver & Fuel',
      category: isNe ? 'वित्त · वस्तु दर' : 'Finance · Commodities',
      source: liveState.goldMeta,
      highlight: liveState.loading ? (isNe ? 'सिङ्क हुँदैछ...' : 'Syncing feed...') : liveState.goldText,
      icon: Coins,
    },
    {
      id: 'calendar',
      title: isNe ? 'विक्रम संवत् पात्रो' : 'BS / AD Calendar',
      category: isNe ? 'औजार · तिथि र बिदा' : 'Tools · Date & Tithi',
      source: 'Nepal Panchanga',
      highlight: isNe ? timeState.bsFormattedNp : timeState.bsFormattedEn,
      icon: Calendar,
    },
    {
      id: 'bluebook',
      title: isNe ? 'ब्लुबुक र सवारी कर' : 'Bluebook & Vehicle Tax',
      category: isNe ? 'नागरिक · यातायात' : 'Civic · DoTM Transport',
      source: 'Provincial FY 2083/84',
      highlight: isNe ? 'दुई र चार पाङ्ग्रे कर' : 'Two & Four Wheelers',
      icon: Car,
    },
    {
      id: 'vault',
      title: isNe ? 'नागरिक डिजिटल भल्ट' : 'Citizen Document Vault',
      category: isNe ? 'खाता · क्रस-डिभाइस सिङ्क' : 'Account · Cross-Device Sync',
      source: userProfile.isLoggedIn ? 'Cloud + IndexedDB' : 'Local IndexedDB',
      highlight: isNe
        ? `${vaultDocs.length} कागजात · ${keeperItems.length} रिमाइन्डर`
        : `${vaultDocs.length} doc(s) · ${keeperItems.length} reminder(s)`,
      icon: Lock,
    },
  ];

  const hiddenWidgetSet = new Set(prefs.hiddenWidgets);
  const hiddenWidgetsList = DASHBOARD_WIDGET_CATALOG.filter((w) => hiddenWidgetSet.has(w.id));

  const renderWidgetControls = (widgetId: DashboardWidgetId, index: number) => {
    if (!isCustomizing) return null;
    const meta = DASHBOARD_WIDGET_CATALOG.find((w) => w.id === widgetId);
    const isHidden = hiddenWidgetSet.has(widgetId);
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs">
        <span className="font-semibold text-[#0B1F3A] dark:text-blue-200">
          {isNe ? meta?.titleNe : meta?.titleEn}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => moveWidget(widgetId, 'up')}
            disabled={index === 0}
            className="min-h-[34px] px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
            title="Move up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => moveWidget(widgetId, 'down')}
            disabled={index === prefs.widgetOrder.length - 1}
            className="min-h-[34px] px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
            title="Move down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleWidgetVisibility(widgetId)}
            className="min-h-[34px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
          >
            {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isHidden ? (isNe ? 'देखाउनुहोस्' : 'Show') : isNe ? 'लुकाउनुहोस्' : 'Hide'}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderWidget = (widgetId: DashboardWidgetId, index: number) => {
    const isHidden = hiddenWidgetSet.has(widgetId);
    if (isHidden && !isCustomizing) return null;

    let body: React.ReactNode = null;

    if (widgetId === 'live_snapshot') {
      body = (
        <section className="space-y-3">
          <SectionHeader
            title={isNe ? 'आधिकारिक वित्तीय झलक' : 'Official Market & Rate Snapshot'}
            subtitle={
              isNe
                ? 'प्रमाणित सार्वजनिक स्रोतबाट मात्र (अनुमानित वा नक्कली तथ्याङ्क बिना)'
                : 'Live verified source snapshots (no estimated or synthetic figures)'
            }
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('finance')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
              >
                {isNe ? 'वित्त केन्द्र →' : 'Finance Hub →'}
              </button>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('forex')}
              className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                {liveState.forexMeta}
              </span>
              <span className="text-sm font-semibold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-1 block truncate">
                {liveState.forexText}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('gold')}
              className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                {liveState.goldMeta}
              </span>
              <span className="text-sm font-semibold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-1 block truncate">
                {liveState.goldText}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('nepse')}
              className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                {liveState.nepseMeta}
              </span>
              <span className="text-sm font-semibold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-1 block truncate">
                {liveState.nepseText}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('gold')}
              className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">
                NOC · CDSC {isNe ? 'ताजा विवरण' : 'Feed'}
              </span>
              <span className="text-sm font-semibold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-1 block truncate">
                {liveState.fuelText !== 'Official data is currently unavailable.'
                  ? `${liveState.fuelText} · ${liveState.ipoCountText}`
                  : liveState.ipoCountText}
              </span>
            </button>
          </div>
        </section>
      );
    } else if (widgetId === 'personal_shortcuts') {
      body = (
        <section className="space-y-3">
          <SectionHeader
            title={isNe ? 'सुरक्षित सर्टकटहरू' : 'Saved Shortcuts & Watchlist'}
            action={
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                {userShortcuts.length} {isNe ? 'सिङ्क गरिएको' : 'synced'}
              </span>
            }
          />
          {userShortcuts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {userShortcuts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateTab(item.targetId)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-blue-400 dark:hover:border-blue-600 text-left transition-colors cursor-pointer flex items-center justify-between gap-2 min-h-[48px]"
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <Card className="p-4 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isNe
                  ? 'कुनै सर्टकट पिन गरिएको छैन। तलका सेवा कार्डको बुकमार्क आइकन थिचेर छिटो पहुँचमा थप्नुहोस्।'
                  : 'No shortcuts pinned yet. Tap the bookmark icon on any service card below to pin it across devices.'}
              </p>
              <Button variant="secondary" size="sm" onClick={() => onNavigateTab('services')}>
                {isNe ? 'सेवाहरू हेर्नुहोस्' : 'Browse Services'}
              </Button>
            </Card>
          )}
        </section>
      );
    } else if (widgetId === 'recent_services') {
      if (recentModules.length === 0 && !isCustomizing) return null;
      body = (
        <section className="space-y-3">
          <SectionHeader
            title={isNe ? 'भर्खरै प्रयोग गरिएका सेवाहरू' : 'Recently Used'}
            subtitle={
              isNe ? 'तपाईँले भर्खरै खोल्नुभएको मोड्युलमा छिटो फर्किनुहोस्।' : 'Jump straight back into your recently visited modules.'
            }
          />
          {recentModules.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {recentModules.map((entry) => (
                <button
                  key={entry.tab}
                  type="button"
                  onClick={() => onNavigateTab(entry.tab)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-blue-400 dark:hover:border-blue-600 text-left transition-colors cursor-pointer space-y-1 min-h-[48px]"
                >
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{entry.category}</span>
                  </span>
                  <span className="text-xs font-semibold text-[#0B1F3A] dark:text-white block truncate">
                    {isNe ? entry.titleNe : entry.titleEn}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title={isNe ? 'अहिलेसम्म कुनै इतिहास छैन' : 'No recent modules yet'}
              description={
                isNe
                  ? 'तपाईँले खोल्नुभएका सेवा र औजारहरू स्वतः यहाँ देखिनेछन्।'
                  : 'Modules you open will appear here automatically for quick access.'
              }
            />
          )}
        </section>
      );
    } else if (widgetId === 'frequent_services') {
      body = (
        <section className="space-y-4">
          <SectionHeader
            title={isNe ? 'धेरै प्रयोग हुने सेवाहरू' : 'Frequently Used Services'}
            subtitle={
              isNe
                ? 'बजार दर, कर तथा ई.एम.आई. हिसाब, पात्रो र सिङ्क गरिएको भल्टमा सीधा पहुँच।'
                : 'Direct access to market feeds, tax & EMI calculators, civic directories, and your synced vault.'
            }
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('services')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
              >
                {isNe ? 'सबै सेवा →' : 'All Services →'}
              </button>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frequentServices.map((svc) => {
              const Icon = svc.icon;
              const isSaved = userShortcuts.some((s) => s.targetId === svc.id);
              return (
                <div
                  key={svc.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-blue-400 dark:hover:border-blue-600 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {svc.category} · {svc.source}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          void toggleSavedItem({
                            id: `shortcut-${svc.id}`,
                            kind: 'shortcut',
                            targetId: svc.id,
                            title: svc.title,
                            pinned: !isSaved,
                          })
                        }
                        className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        title={isSaved ? 'Remove shortcut' : 'Pin shortcut'}
                        aria-label={isSaved ? `Unpin ${svc.title}` : `Pin ${svc.title}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateTab(svc.id)}
                      className="w-full text-left group cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {svc.title}
                        </h3>
                      </div>
                      <p className="text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                        {svc.highlight}
                      </p>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onNavigateTab(svc.id)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer inline-flex items-center gap-1 min-h-[32px]"
                    >
                      <span>{isNe ? 'मोड्युल खोल्नुहोस्' : 'Open Module'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    } else if (widgetId === 'civic_tax') {
      body = (
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0B1F3A] dark:text-white">
              {isNe ? 'नागरिक तथा कर सेवाहरू' : 'Civic & Tax Services'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('services')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {isNe ? 'सबै सेवा →' : 'All Services →'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              {
                tab: 'tax',
                title: isNe ? 'आयकर हिसाब (IRD)' : 'Income Tax Calculator',
                desc: isNe ? 'आ.व. २०८३/८४ एकल तथा दम्पती कर स्ल्याब' : 'IRD FY 2083/84 individual & married slabs',
              },
              {
                tab: 'emi',
                title: isNe ? 'ऋण ई.एम.आई. तालिका' : 'Loan EMI Amortization',
                desc: isNe ? 'मासिक किस्ता तथा ब्याज विवरण' : 'Monthly installment & interest breakdown',
              },
              {
                tab: 'loksewa',
                title: isNe ? 'लोक सेवा र रोजगारी' : 'Lok Sewa & Career Notices',
                desc: isNe ? 'लोक सेवा, शिक्षक सेवा र सूचना' : 'PSC, TSC & public vacancy listings',
              },
              {
                tab: 'devtrack',
                title: isNe ? 'DevTrack परियोजना' : 'DevTrack Projects',
                desc: isNe ? 'राष्ट्रिय पूर्वाधार प्रगति निगरानी' : 'National infrastructure progress monitoring',
              },
            ].map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] hover:border-blue-400 dark:hover:border-blue-600 text-left transition-colors cursor-pointer space-y-1 min-h-[68px]"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">{item.title}</span>
                <span className="text-slate-600 dark:text-slate-400 block">{item.desc}</span>
              </button>
            ))}
          </div>
        </Card>
      );
    } else if (widgetId === 'important_notices') {
      body = (
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0B1F3A] dark:text-white">
              {isNe ? 'महत्त्वपूर्ण सार्वजनिक सूचनाहरू' : 'Important Public Notices'}
            </h2>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {isNe ? 'प्रमाणित स्रोत' : 'Verified Feeds'}
            </span>
          </div>

          {liveState.notices.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {liveState.notices.map((n, idx) => (
                <li key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                    {n.source}{n.date ? ` · ${n.date}` : ''}
                  </span>
                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-start gap-1"
                    >
                      <span>{n.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    </a>
                  ) : (
                    <span className="font-medium text-slate-900 dark:text-slate-100 block">{n.title}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {liveState.loading
                ? isNe
                  ? 'प्रमाणित सार्वजनिक सूचना लोड हुँदैछ...'
                  : 'Loading verified public notices...'
                : isNe
                ? 'हाल प्रत्यक्ष सूचना फिड उपलब्ध छैन। आधिकारिक सेवा पोर्टलका लागि सेवा निर्देशिका खोल्नुहोस्।'
                : 'No live public notices available right now. Open Finance or Civic Services for direct source portals.'}
            </p>
          )}
        </Card>
      );
    }

    return (
      <div key={widgetId} className={`space-y-2 ${isHidden ? 'opacity-50' : ''}`}>
        {renderWidgetControls(widgetId, index)}
        {body}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 space-y-8">
      {/* Himalayan Dawn Editorial Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-[#1E3A5F] bg-[#0B1F3A] text-white shadow-sm">
        <img
          src={himalayanHeroImg}
          alt={isNe ? 'हिमाली शृङ्खला पृष्ठभूमि' : 'Nepal Himalayan peaks at calm dawn'}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-55 pointer-events-none select-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#081529]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60"
        />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-blue-200">
              <span>
                {userProfile.isLoggedIn
                  ? isNe
                    ? `स्वागत छ, ${userProfile.name}`
                    : `Welcome back, ${userProfile.name}`
                  : isNe
                  ? 'सारथी एकीकृत डिजिटल मञ्च'
                  : 'SAARTHI Unified Workspace'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{isNe ? timeState.bsFormattedNp : `${timeState.bsFormattedEn} BS`}</span>
              <span aria-hidden="true">·</span>
              <span>{timeState.adDateFormatted} AD</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight [text-wrap:balance]">
              {isNe
                ? 'नेपालका आधिकारिक वित्तीय तथ्याङ्क, नागरिक सेवा र सिङ्क गरिएको व्यक्तिगत रेकर्ड।'
                : 'Authentic financial feeds, civic tools, and synced personal records for Nepal.'}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              {isNe
                ? 'वेबसाइट, पी.डब्लु.ए. र एन्ड्रोइड ए.पी.के. भरि एउटै खाता, अफलाइन-प्रथम भण्डारण र प्रमाणित सार्वजनिक स्रोतहरू।'
                : 'One unified account across Website, PWA, and Android APK with offline-first storage and verified public sources.'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>{isNe ? 'मोड्युल र दर खोज्नुहोस्' : 'Search Modules & Services'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="relative min-h-[44px] min-w-[44px] px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                aria-label="Open notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="font-mono text-[11px] tabular-nums">{notifications.length}</span>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCustomizing((prev) => !prev)}
                className="min-h-[40px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 bg-[#0B1F3A]/80 hover:bg-[#102A4C] text-blue-100 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {isCustomizing
                    ? isNe
                      ? 'सम्पन्न गर्नुहोस्'
                      : 'Done Customizing'
                    : isNe
                    ? 'ड्यासबोर्ड मिलाउनुहोस्'
                    : 'Customize Layout'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('services')}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{isNe ? 'सेवा निर्देशिका' : 'Services Directory'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Inbox Drawer / Panel */}
      {isNotificationsOpen && (
        <Card className="p-4 sm:p-5 space-y-3 border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isNe ? 'सूचना तथा रिमाइन्डर केन्द्र' : 'Notifications & Reminders'}</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {isNe ? 'बन्द गर्नुहोस्' : 'Close'}
            </button>
          </div>

          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if (n.targetTab === 'account' && onOpenAccount) {
                      onOpenAccount();
                    } else {
                      onNavigateTab(n.targetTab);
                    }
                  }}
                  className="w-full py-2.5 flex items-start justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/60 px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    {n.kind === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-[#0B1F3A] dark:text-white block">
                        {n.title}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">
                        {n.detail}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isNe
                ? `कुनै नयाँ चेतावनी छैन। सिङ्क अवस्था: ${syncStatus}।`
                : `All caught up. Current account sync status: ${syncStatus}.`}
            </p>
          )}
        </Card>
      )}

      {/* Customization Toolbar (Add / Restore hidden widgets + Reset) */}
      {isCustomizing && (
        <Card className="p-4 space-y-3 border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-[#0F1E36]/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                {isNe ? 'ड्यासबोर्ड विजेट व्यवस्थापन' : 'Customize Dashboard Widgets'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isNe
                  ? 'विजेट माथि/तल सार्नुहोस् वा लुकाउनुहोस्। यो सेटिङ तपाईँको खातामा सिङ्क हुन्छ।'
                  : 'Reorder or hide sections below. Layout changes save locally and sync across signed-in devices.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={resetDefaultLayout}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isNe ? 'डिफल्ट राख्नुहोस्' : 'Reset Default'}</span>
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsCustomizing(false)}>
                <span>{isNe ? 'सम्पन्न' : 'Done'}</span>
              </Button>
            </div>
          </div>

          {hiddenWidgetsList.length > 0 && (
            <div className="pt-2 border-t border-blue-200 dark:border-blue-900 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {isNe ? 'लुकाइएका थप्नुहोस्:' : 'Restore hidden widgets:'}
              </span>
              {hiddenWidgetsList.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => toggleWidgetVisibility(w.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-[#0B1F3A] dark:text-white hover:border-blue-400 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{isNe ? w.titleNe : w.titleEn}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Dynamic Ordered Dashboard Widgets */}
      <div className="space-y-10">
        {prefs.widgetOrder.map((widgetId, index) => renderWidget(widgetId, index))}
      </div>
    </div>
  );
};
