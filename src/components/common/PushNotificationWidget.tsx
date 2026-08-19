import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Calendar,
  Briefcase,
  FileCheck,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  X,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export interface PushAlert {
  id: string;
  titleEn: string;
  titleNe: string;
  messageEn: string;
  messageNe: string;
  category: 'tax' | 'loksewa' | 'bluebook' | 'ird';
  targetTab: string;
  dueDateEn: string;
  dueDateNe: string;
  urgency: 'high' | 'medium' | 'normal';
  timestamp: string;
  read: boolean;
}

interface PushNotificationWidgetProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  setActiveTab: (tab: string) => void;
  onCloseMobileSidebar?: () => void;
}

const INITIAL_ALERTS: PushAlert[] = [
  {
    id: 'push-1',
    titleEn: 'IRD Q4 Tax Return Deadline',
    titleNe: 'आन्तरिक राजस्व: चौथो त्रैमासिक कर दाखिला',
    messageEn: 'e-Filing deadline in 4 days! Avoid 0.1% daily penalty on delayed returns.',
    messageNe: '४ दिन बाँकी छ! ०.१% जरिवानाबाट बच्न अनलाइन कर विवरण बुझाउनुहोस्।',
    category: 'ird',
    targetTab: 'ird',
    dueDateEn: '4 Days Left (Shrawan 30)',
    dueDateNe: '४ दिन बाँकी (साउन ३०)',
    urgency: 'high',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'push-2',
    titleEn: 'Lok Sewa Section Officer Opening',
    titleNe: 'लोक सेवा आयोग: अधिकृत तथा खरिदार दरखास्त',
    messageEn: '450 Gazetted 3rd Class vacancies closing on Shrawan 28! Apply on portal.',
    messageNe: '४५० पदको लागि दरखास्त म्याद साउन २८ मा सकिँदैछ! अनलाइन भर्नुहोस्।',
    category: 'loksewa',
    targetTab: 'loksewa',
    dueDateEn: '2 Days Left (Shrawan 28)',
    dueDateNe: '२ दिन बाँकी (साउन २८)',
    urgency: 'high',
    timestamp: '25 mins ago',
    read: false,
  },
  {
    id: 'push-3',
    titleEn: 'Bluebook Annual Vehicle Tax',
    titleNe: 'बागमती प्रदेश सवारी साधन कर नवीकरण',
    messageEn: '10% early payment rebate ends in 6 days for Bagmati Province.',
    messageNe: 'बागमती प्रदेशको १०% छुट सुविधा लिन ६ दिन भित्र नवीकरण गर्नुहोस्।',
    category: 'bluebook',
    targetTab: 'bluebook',
    dueDateEn: '6 Days Left',
    dueDateNe: '६ दिन बाँकी',
    urgency: 'medium',
    timestamp: '1 hour ago',
    read: true,
  },
  {
    id: 'push-4',
    titleEn: 'Income Tax Slab Assessment 2083/84',
    titleNe: 'आर्थिक वर्ष २०८३/८४ आयकर गणना',
    messageEn: 'Updated Social Security Fund (SSF) tax exemption limits calculated.',
    messageNe: 'सामाजिक सुरक्षा कोष (SSF) आयकर छुट सीमा अद्यावधिक गरिएको छ।',
    category: 'tax',
    targetTab: 'tax',
    dueDateEn: 'FY 2083/84 Active',
    dueDateNe: 'आ.व. २०८३/८४ लागू',
    urgency: 'normal',
    timestamp: '3 hours ago',
    read: true,
  },
];

const EXTRA_DYNAMIC_ALERTS: Omit<PushAlert, 'id' | 'timestamp' | 'read'>[] = [
  {
    titleEn: 'NEA Engineer Civil Service Exam',
    titleNe: 'नेपाल विद्युत प्राधिकरण: ईन्जिनियर परीक्षा नतिजा',
    messageEn: 'Written examination admit cards released. Exam scheduled for Bhadra 12.',
    messageNe: 'लिखित परीक्षाको प्रवेशपत्र उपलब्ध छ। भदौ १२ मा परीक्षा।',
    category: 'loksewa',
    targetTab: 'loksewa',
    dueDateEn: 'Exam: Bhadra 12',
    dueDateNe: 'परीक्षा: भदौ १२',
    urgency: 'high',
  },
  {
    titleEn: 'PAN Card Address Update Reminder',
    titleNe: 'ई-पान: वडा स्तरको बायोमेट्रिक अद्यावधिक',
    messageEn: 'Update your Ward number in IRD portal to auto-link local property tax.',
    messageNe: 'स्थानीय कर जोड्न आन्तरिक राजस्व पोर्टलमा वडा नम्बर अद्यावधिक गर्नुहोस्।',
    category: 'ird',
    targetTab: 'ird',
    dueDateEn: 'Urgent Action',
    dueDateNe: 'जरुरी अद्यावधिक',
    urgency: 'medium',
  },
  {
    titleEn: 'Nepal Bank Ltd Trainee Officer',
    titleNe: 'नेपाल बैंक लिमिटेड: खुला प्रतियोगिता दरखास्त',
    messageEn: 'Last day to apply without double fee. Apply online via SAARTHI Loksewa link.',
    messageNe: 'दोब्बर दस्तुर बिना आवेदन दिने अन्तिम दिन।',
    category: 'loksewa',
    targetTab: 'loksewa',
    dueDateEn: '1 Day Left',
    dueDateNe: '१ दिन बाँकी',
    urgency: 'high',
  },
];

export const PushNotificationWidget: React.FC<PushNotificationWidgetProps> = ({
  currentLang,
  theme,
  setActiveTab,
  onCloseMobileSidebar,
}) => {
  const [alerts, setAlerts] = useState<PushAlert[]>(INITIAL_ALERTS);
  const [activeToast, setActiveToast] = useState<PushAlert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'tax' | 'loksewa'>('all');

  // Periodic Simulated Push Alert Timer (Emulating background server pushes)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < EXTRA_DYNAMIC_ALERTS.length) {
        const template = EXTRA_DYNAMIC_ALERTS[index];
        const newAlert: PushAlert = {
          ...template,
          id: `push-dyn-${Date.now()}`,
          timestamp: 'Just now',
          read: false,
        };

        setAlerts((prev) => [newAlert, ...prev]);
        setActiveToast(newAlert);

        // Auto hide toast after 6 seconds
        setTimeout(() => {
          setActiveToast((current) => (current?.id === newAlert.id ? null : current));
        }, 6000);

        index++;
      }
    }, 22000); // Trigger dynamic push every 22 seconds

    return () => clearInterval(interval);
  }, []);

  const triggerManualPush = () => {
    const randomIndex = Math.floor(Math.random() * EXTRA_DYNAMIC_ALERTS.length);
    const template = EXTRA_DYNAMIC_ALERTS[randomIndex];
    const newAlert: PushAlert = {
      ...template,
      id: `push-manual-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setActiveToast(newAlert);

    setTimeout(() => {
      setActiveToast((current) => (current?.id === newAlert.id ? null : current));
    }, 6000);
  };

  const handleAlertClick = (alertItem: PushAlert) => {
    // Mark as read
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertItem.id ? { ...a, read: true } : a))
    );
    // Dismiss toast if active
    if (activeToast?.id === alertItem.id) {
      setActiveToast(null);
    }
    // Navigate to module
    setActiveTab(alertItem.targetTab);
    if (onCloseMobileSidebar) {
      onCloseMobileSidebar();
    }
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'tax') return a.category === 'ird' || a.category === 'tax' || a.category === 'bluebook';
    if (filter === 'loksewa') return a.category === 'loksewa';
    return true;
  });

  const isDark = theme === 'dark';

  return (
    <div className="space-y-2 my-3">
      {/* Floating Simulated Push Toast Notification Banner */}
      {activeToast && (
        <div
          className={`p-3 rounded-xl border shadow-xl relative animate-in slide-in-from-top duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-red-950/90 via-slate-900 to-amber-950/90 border-red-500/50 text-white'
              : 'bg-gradient-to-r from-red-50 via-white to-amber-50 border-red-300 text-slate-900'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1">
                <BellRing className="w-3 h-3 text-red-500 animate-bounce" />
                <span>{currentLang === 'ne' ? 'नयाँ सिम्युलेटेड पुस अलर्ट' : 'LIVE PUSH ALERT'}</span>
              </span>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-1.5 space-y-1">
            <h4 className="text-xs font-bold leading-snug text-amber-400">
              {currentLang === 'ne' ? activeToast.titleNe : activeToast.titleEn}
            </h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              {currentLang === 'ne' ? activeToast.messageNe : activeToast.messageEn}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-red-500/20 text-[10px]">
            <span className="font-mono text-slate-400">
              {currentLang === 'ne' ? activeToast.dueDateNe : activeToast.dueDateEn}
            </span>
            <button
              onClick={() => handleAlertClick(activeToast)}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1 transition-all shadow"
            >
              <span>{currentLang === 'ne' ? 'मोड्युल खोल्नुहोस्' : 'Open Module'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Sidebar Widget Box */}
      <div
        className={`rounded-xl border transition-all ${
          isDark
            ? 'bg-slate-950/80 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* Header bar */}
        <div className="p-2.5 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-left flex-1"
          >
            <div className="relative">
              <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 min-w-[14px] h-[14px] text-[9px] font-extrabold rounded-full bg-red-600 text-white flex items-center justify-center border border-slate-900 font-mono">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate text-slate-200">
                {currentLang === 'ne' ? 'म्याद र पुस अलर्टहरू' : 'Push Alerts & Deadlines'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                {unreadCount > 0
                  ? (currentLang === 'ne' ? `${unreadCount} नयाँ सूचना` : `${unreadCount} Unread Deadlines`)
                  : (currentLang === 'ne' ? 'सबै हेरिएको छ' : 'All Up to Date')}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={triggerManualPush}
              className="p-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all"
              title="Test Push Notification simulation"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">{currentLang === 'ne' ? 'टेस्ट पुस' : 'Test'}</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
              title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="px-2.5 pb-2.5 space-y-2 border-t border-slate-800/80 pt-2">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-1 text-[10px] font-semibold">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    filter === 'all'
                      ? 'bg-red-600 text-white font-bold'
                      : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  All ({alerts.length})
                </button>
                <button
                  onClick={() => setFilter('tax')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    filter === 'tax'
                      ? 'bg-red-600 text-white font-bold'
                      : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Tax/IRD
                </button>
                <button
                  onClick={() => setFilter('loksewa')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    filter === 'loksewa'
                      ? 'bg-red-600 text-white font-bold'
                      : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Lok Sewa
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-slate-400 hover:text-emerald-400 text-[9.5px] font-mono flex items-center gap-0.5"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Read All</span>
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
              {filteredAlerts.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-2">No alerts in this filter.</p>
              ) : (
                filteredAlerts.map((item) => {
                  const CategoryIcon =
                    item.category === 'loksewa'
                      ? Briefcase
                      : item.category === 'bluebook'
                      ? Shield
                      : FileCheck;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAlertClick(item)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all relative group ${
                        !item.read
                          ? isDark
                            ? 'bg-slate-900 border-red-500/40 hover:border-red-400 text-slate-100 shadow-sm'
                            : 'bg-white border-red-300 hover:border-red-400 text-slate-900 shadow-sm'
                          : isDark
                          ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 text-slate-400'
                          : 'bg-slate-100/80 border-slate-200 hover:bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {!item.read && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}

                      <div className="flex items-start gap-2">
                        <div
                          className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                            item.urgency === 'high'
                              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                              : item.urgency === 'medium'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          <CategoryIcon className="w-3.5 h-3.5" />
                        </div>

                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center justify-between pr-3">
                            <h5 className="font-bold text-[11px] truncate leading-tight group-hover:text-red-400 transition-colors">
                              {currentLang === 'ne' ? item.titleNe : item.titleEn}
                            </h5>
                          </div>
                          <p className="text-[10px] opacity-80 line-clamp-2 mt-0.5 leading-tight">
                            {currentLang === 'ne' ? item.messageNe : item.messageEn}
                          </p>

                          <div className="flex items-center justify-between mt-1.5 text-[9.5px] font-mono opacity-90">
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{currentLang === 'ne' ? item.dueDateNe : item.dueDateEn}</span>
                            </span>
                            <span className="text-slate-500">{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
