import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Maximize2,
  Play,
  Pause,
  ArrowUpRight,
} from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { useRadioAudio } from '../../context/RadioAudioContext';
import { getKeeperItems, computeKeeperStatus } from '../../utils/sajiloKeeperStore';

interface SajiloTrayPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullView: () => void;
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloTrayPopover: React.FC<SajiloTrayPopoverProps> = ({
  isOpen,
  onClose,
  onOpenFullView,
  currentLang,
  devanagariNumerals,
}) => {
  const [activeTab, setActiveTab] = useState<'glance' | 'bazar' | 'radio' | 'keeper'>('glance');
  const { timeState } = useGlobalTime();
  const { currentStation, isPlaying, togglePlay } = useRadioAudio();
  const [keeperAlerts, setKeeperAlerts] = useState<any[]>([]);

  const [rates, setRates] = useState<{
    gold?: string;
    silver?: string;
    petrol?: string;
    diesel?: string;
    lpg?: string;
    ktmWeather?: string;
    ktmAqi?: string;
    nepseIndex?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;
    const items = getKeeperItems();
    const alerts = items
      .map((i) => ({ ...i, ...computeKeeperStatus(i) }))
      .filter((i) => i.status !== 'safe')
      .slice(0, 3);
    setKeeperAlerts(alerts);

    Promise.all([
      fetch('/api/live/metals').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/api/live/fuel').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/api/live/weather').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/api/live/nepse').then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([metalsJson, fuelJson, weatherJson, nepseJson]) => {
      const mList = Array.isArray(metalsJson?.data) ? metalsJson.data : [];
      const gold = mList.find((m: any) => m.id === 'fine-gold-24k' || /fine/i.test(m.categoryEn || ''));
      const silver = mList.find((m: any) => m.id === 'silver' || /silver/i.test(m.categoryEn || ''));

      const fList = Array.isArray(fuelJson?.tariffs)
        ? fuelJson.tariffs
        : Array.isArray(fuelJson?.data)
          ? fuelJson.data
          : [];
      const petrol = fList.find((f: any) => /petrol/i.test(f.productEn || f.name || ''));
      const diesel = fList.find((f: any) => /diesel/i.test(f.productEn || f.name || ''));
      const lpg = fList.find((f: any) => /lpg/i.test(f.productEn || f.name || ''));

      const wList = Array.isArray(weatherJson?.data) ? weatherJson.data : [];
      const ktm = wList.find((c: any) => /kathmandu/i.test(c.city || '')) || wList[0];

      const idx = nepseJson?.data?.indices?.[0];

      setRates({
        gold: typeof gold?.nprPerTola === 'number' ? gold.nprPerTola.toLocaleString('en-IN') : undefined,
        silver: typeof silver?.nprPerTola === 'number' ? silver.nprPerTola.toLocaleString('en-IN') : undefined,
        petrol: typeof petrol?.priceNpr === 'number' ? petrol.priceNpr.toFixed(2) : undefined,
        diesel: typeof diesel?.priceNpr === 'number' ? diesel.priceNpr.toFixed(2) : undefined,
        lpg: typeof lpg?.priceNpr === 'number' ? lpg.priceNpr.toLocaleString('en-IN') : undefined,
        ktmWeather:
          typeof ktm?.temperature === 'number'
            ? `Kathmandu: ${Math.round(ktm.temperature)}°C`
            : undefined,
        ktmAqi: typeof ktm?.aqiUs === 'number' ? `AQI: ${ktm.aqiUs}` : undefined,
        nepseIndex:
          typeof idx?.index === 'number' ? idx.index.toLocaleString('en-US', { minimumFractionDigits: 2 }) : undefined,
      });
    });
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sajilo Quick Tray Popover"
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-900 dark:text-slate-100">
        {/* Tray Header */}
        <div className="px-4 py-3 bg-[#0B1F3A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-xs tracking-wide flex items-center gap-2">
              <span>{currentLang === 'ne' ? 'सजिलो द्रुत ट्रे' : 'Sajilo Quick Tray'}</span>
              <span className="text-[10px] font-mono text-blue-200">SAARTHI</span>
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullView();
              }}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Expand to Full Screen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date & Time Bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="font-semibold text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
          </div>
          <div className="font-mono text-blue-600 dark:text-blue-400 text-xs font-semibold tabular-nums">
            {timeState.time12h}
          </div>
        </div>

        {/* Mini Tab Switcher */}
        <div className="grid grid-cols-4 p-1.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono">
          {[
            { id: 'glance', label: 'Glance' },
            { id: 'bazar', label: 'Bazar' },
            { id: 'radio', label: 'Radio' },
            { id: 'keeper', label: 'Keeper' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as 'glance' | 'bazar' | 'radio' | 'keeper')}
              className={`py-1.5 rounded-md text-center transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white dark:bg-[#0F172A] text-[#0B1F3A] dark:text-blue-300 font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'glance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Gold (Tola)</span>
                  <span className="font-mono font-bold tabular-nums text-[#0B1F3A] dark:text-white text-sm">
                    {rates.gold ? `रू. ${formatDigits(rates.gold)}` : '—'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Petrol (Litre)</span>
                  <span className="font-mono font-bold tabular-nums text-[#0B1F3A] dark:text-white text-sm">
                    {rates.petrol ? `रू. ${formatDigits(rates.petrol)}` : '—'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#0B1F3A] dark:text-white">
                    {rates.ktmWeather || 'Kathmandu Weather'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    {rates.ktmWeather ? 'Open-Meteo' : 'Unavailable offline'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono tabular-nums bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {rates.ktmAqi ? formatDigits(rates.ktmAqi) : '—'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs">
                    <span className="font-semibold text-[#0B1F3A] dark:text-white block">
                      {currentStation ? currentStation.name : 'Radio Nepal 100.0 MHz'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isPlaying ? 'Playing stream' : 'Broadcast radio'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white flex items-center justify-center cursor-pointer"
                  aria-label={isPlaying ? 'Pause radio' : 'Play radio'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              </div>

              {keeperAlerts.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                    Expiring Documents
                  </span>
                  <div className="mt-1 space-y-1">
                    {keeperAlerts.map((a) => (
                      <div key={a.id} className="flex justify-between text-[11px]">
                        <span className="text-[#0B1F3A] dark:text-white truncate max-w-[200px]">{a.title}</span>
                        <span className="text-amber-700 dark:text-amber-300 font-mono tabular-nums">
                          {formatDigits(a.daysLeft)} days
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bazar' && (
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                Sources: FENEGOSIDA, NOC &amp; NEPSE
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Fine Gold (Tola)', val: rates.gold ? `रू. ${formatDigits(rates.gold)}` : '—' },
                  { name: 'Silver (Tola)', val: rates.silver ? `रू. ${formatDigits(rates.silver)}` : '—' },
                  { name: 'Petrol (Litre)', val: rates.petrol ? `रू. ${formatDigits(rates.petrol)}` : '—' },
                  { name: 'Diesel (Litre)', val: rates.diesel ? `रू. ${formatDigits(rates.diesel)}` : '—' },
                  { name: 'LPG Gas Cylinder', val: rates.lpg ? `रू. ${formatDigits(rates.lpg)}` : '—' },
                  { name: 'NEPSE Index', val: rates.nepseIndex ? formatDigits(rates.nepseIndex) : '—' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                    <span className="font-mono font-bold tabular-nums text-[#0B1F3A] dark:text-white">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'radio' && (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#0B1F3A] dark:text-white block">
                    {currentStation ? currentStation.name : 'Radio Nepal'}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                    {currentStation ? currentStation.frequency : '100.0 MHz'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold text-xs cursor-pointer"
                >
                  {isPlaying ? 'Pause' : 'Play Live'}
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                Open Full Sajilo view to browse all 10+ Nepali FM stations.
              </div>
            </div>
          )}

          {activeTab === 'keeper' && (
            <div className="space-y-2 text-xs">
              {keeperAlerts.length === 0 ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 font-mono text-xs">
                  All documents and renewals are up to date.
                </div>
              ) : (
                keeperAlerts.map((k) => (
                  <div
                    key={k.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex justify-between font-semibold text-[#0B1F3A] dark:text-white">
                      <span className="truncate">{k.title}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono tabular-nums shrink-0">
                        {formatDigits(k.daysLeft)}d
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Expiry: {k.expiryDateAd}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Tray Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-[#0B1220] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullView();
            }}
            className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Sajilo Essentials</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
};
