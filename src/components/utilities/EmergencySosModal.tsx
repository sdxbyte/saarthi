import React, { useState } from 'react';
import { Siren, PhoneCall, X, MapPin, Navigation, Copy, Check } from 'lucide-react';
import { MOCK_EMERGENCY } from '../../data/bankingAndUtilitiesData';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'en' | 'ne';
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'ready' | 'error'>('idle');
  const [geoError, setGeoError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleLocateDevice = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('error');
      setGeoError(
        currentLang === 'ne'
          ? 'यो ब्राउजर वा डिभाइसमा GPS लोकेसन उपलब्ध छैन।'
          : 'Device geolocation is unavailable in this browser.'
      );
      return;
    }

    setGeoStatus('locating');
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setGeoStatus('ready');
      },
      (err) => {
        setGeoStatus('error');
        setGeoError(
          err.message ||
            (currentLang === 'ne'
              ? 'लोकेसन अनुमति अस्वीकृत वा उपलब्ध छैन।'
              : 'Location permission denied or GPS unavailable.')
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCopyLocation = async () => {
    if (!coords) return;
    const text = `Emergency location: ${coords.lat}, ${coords.lng} (https://maps.google.com/?q=${coords.lat},${coords.lng})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0F172A] border border-red-300 dark:border-red-500/40 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Siren className="w-5 h-5 text-white shrink-0" />
            <h2 className="font-bold text-base sm:text-lg">
              {currentLang === 'ne' ? 'नेपाल आकस्मिक हटलाइन तथा लोकेसन' : 'Nepal Emergency Hotlines & GPS'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={currentLang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
            className="p-1.5 rounded-lg hover:bg-red-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Honest Geolocation & Direct Call Notice */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">
                  {currentLang === 'ne' ? 'डिभाइस GPS र सिधा कल' : 'Device GPS & Direct Call'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {currentLang === 'ne'
                    ? 'आकस्मिक कल सिधै डिभाइसको फोन डायलरबाट गर्नुहोस्। स्वचालित SMS यहाँबाट पठाइँदैन।'
                    : 'Use direct hotline buttons below to call from your device dialer. No background SMS is auto-sent.'}
                </p>
              </div>
              <a
                href="tel:100"
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold min-h-[44px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'प्रहरी १००' : 'Call 100'}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleLocateDevice}
              disabled={geoStatus === 'locating'}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800/80 text-xs font-semibold text-[#0B1F3A] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Navigation className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>
                {geoStatus === 'locating'
                  ? currentLang === 'ne'
                    ? 'डिभाइस GPS प्राप्त गरिँदै...'
                    : 'Reading device GPS...'
                  : currentLang === 'ne'
                  ? 'मेरो वास्तविक GPS निर्देशाङ्क देखाउनुहोस्'
                  : 'Get My Live Device GPS Coordinates'}
              </span>
            </button>

            {geoStatus === 'ready' && coords && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-[#0B1F3A] dark:text-white flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="tabular-nums">
                      {coords.lat}, {coords.lng} (±{coords.accuracy}m)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCopyLocation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (currentLang === 'ne' ? 'कपी भयो' : 'Copied') : (currentLang === 'ne' ? 'कपी' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {geoStatus === 'error' && geoError && (
              <p className="text-xs text-red-700 dark:text-red-300 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-lg px-3 py-2">
                {geoError}
              </p>
            )}
          </div>

          {/* Directory list */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {currentLang === 'ne' ? 'आधिकारिक आकस्मिक हटलाइनहरू' : 'Official Emergency Hotlines'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {MOCK_EMERGENCY.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B1F3A] dark:text-white truncate">
                      {currentLang === 'ne' ? item.nameNp : item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.location}</div>
                  </div>
                  <a
                    href={`tel:${item.number}`}
                    className="shrink-0 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 min-h-[40px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{item.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
