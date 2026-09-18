import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  ShoppingBag,
  Bell,
  Compass,
  Calendar,
  Sparkles,
  ExternalLink,
  Coins,
  Fuel,
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

  useEffect(() => {
    if (isOpen) {
      const items = getKeeperItems();
      const alerts = items
        .map((i) => ({ ...i, ...computeKeeperStatus(i) }))
        .filter((i) => i.status !== 'safe')
        .slice(0, 3);
      setKeeperAlerts(alerts);
    }
  }, [isOpen]);

  // Handle escape key
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
      aria-label="Sajilo Menu-Bar Tray Popover"
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-md bg-[#14161b] border border-[#262a31] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-[#edeef0]">
        {/* Tray Header (macOS / Windows Tray style) */}
        <div className="p-3.5 bg-[#171a21] border-b border-[#262a31] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
            <h3 className="font-bold text-xs text-[#edeef0] tracking-wide flex items-center gap-1.5">
              <span>Sajilo Quick Tray</span>
              <span className="text-[10px] font-mono font-normal text-[#8b909b]">BS 2083</span>
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onClose();
                onOpenFullView();
              }}
              className="p-1.5 rounded-lg text-[#8b909b] hover:text-[#00e599] hover:bg-[#1f232b] transition-colors"
              title="Expand to Full Screen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8b909b] hover:text-[#edeef0] hover:bg-[#1f232b] transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date & Time Mini Banner */}
        <div className="px-4 py-2.5 bg-[#121418] border-b border-[#262a31]/60 flex items-center justify-between text-xs">
          <div className="font-bold text-[#edeef0]">
            {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
          </div>
          <div className="font-mono text-[#00e599] text-xs font-semibold">
            {timeState.time12h}
          </div>
        </div>

        {/* Mini Tab Switcher */}
        <div className="grid grid-cols-4 p-1.5 bg-[#121418] border-b border-[#262a31]/60 text-[11px] font-mono">
          {[
            { id: 'glance', label: 'Glance' },
            { id: 'bazar', label: 'Bazar' },
            { id: 'radio', label: 'Radio' },
            { id: 'keeper', label: 'Keeper' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-1 rounded-md text-center transition-colors ${
                activeTab === t.id
                  ? 'bg-[#1f232b] text-[#00e599] font-bold shadow'
                  : 'text-[#8b909b] hover:text-[#edeef0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Tab 1: Glance */}
          {activeTab === 'glance' && (
            <div className="space-y-3">
              {/* Metal & Fuel Quick Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#1a1d24] border border-[#262a31]">
                  <span className="text-[10px] text-[#8b909b] block">Gold (Tola)</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">रू. {formatDigits('152,400')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1a1d24] border border-[#262a31]">
                  <span className="text-[10px] text-[#8b909b] block">Petrol (Litre)</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">रू. {formatDigits('170.00')}</span>
                </div>
              </div>

              {/* Weather Mini Bar */}
              <div className="p-2.5 rounded-xl bg-[#1a1d24] border border-[#262a31] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#edeef0]">Kathmandu: 24°C</span>
                  <span className="text-[10px] text-[#8b909b] block">Partly Cloudy</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/15 text-yellow-400">
                  AQI: {formatDigits('74')} (Moderate)
                </span>
              </div>

              {/* Radio Quick Play */}
              <div className="p-2.5 rounded-xl bg-[#1a1d24] border border-[#262a31] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#00e599]" />
                  <div className="text-xs">
                    <span className="font-bold text-[#edeef0] block">
                      {currentStation ? currentStation.name : 'Radio Nepal 100.0 MHz'}
                    </span>
                    <span className="text-[10px] text-[#8b909b]">
                      {isPlaying ? 'Live Streaming' : 'Live FM Broadcast'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={togglePlay}
                  className="w-7 h-7 rounded-lg bg-[#00e599] text-[#0a0b0d] flex items-center justify-center font-bold hover:bg-[#00c985]"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              </div>

              {/* Keeper Alerts Snippet */}
              {keeperAlerts.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Expiring Documents:
                  </span>
                  <div className="mt-1 space-y-1">
                    {keeperAlerts.map((a) => (
                      <div key={a.id} className="flex justify-between text-[11px]">
                        <span className="text-[#edeef0] truncate max-w-[200px]">{a.title}</span>
                        <span className="text-amber-400 font-mono">{formatDigits(a.daysLeft)} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Bazar */}
          {activeTab === 'bazar' && (
            <div className="space-y-3 text-xs">
              <div className="p-2 rounded-lg bg-[#1a1d24] font-mono text-[10px] text-[#8b909b]">
                Authentic Rates: KFVMDB, FENEGOSIDA, NOC
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Fine Gold (Tola)', val: 'रू. 152,400', tag: '24K' },
                  { name: 'Silver (Tola)', val: 'रू. 1,820', tag: 'Fine' },
                  { name: 'Petrol (Litre)', val: 'रू. 170.00', tag: 'NOC' },
                  { name: 'Diesel (Litre)', val: 'रू. 160.00', tag: 'NOC' },
                  { name: 'LPG Gas Cylinder', val: 'रू. 1,895', tag: '14.2kg' },
                  { name: 'Tomato Big (Kalimati / KG)', val: 'रू. 60.00', tag: 'Avg' },
                  { name: 'Potato Red (Kalimati / KG)', val: 'रू. 54.00', tag: 'Avg' },
                  { name: 'NEPSE Index', val: '2,748.65 (+24.81)', tag: 'Live' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#1a1d24] flex items-center justify-between">
                    <span className="text-[#edeef0]">{item.name}</span>
                    <span className="font-mono font-bold text-[#00e599]">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Radio */}
          {activeTab === 'radio' && (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#edeef0] block">
                    {currentStation ? currentStation.name : 'Radio Nepal'}
                  </span>
                  <span className="text-[10px] text-[#00e599] font-mono">
                    {currentStation ? currentStation.frequency : '100.0 MHz'}
                  </span>
                </div>
                <button
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-lg bg-[#00e599] text-[#0a0b0d] font-bold text-xs"
                >
                  {isPlaying ? 'Pause' : 'Play Live'}
                </button>
              </div>

              <div className="text-[10px] font-mono text-[#8b909b] pt-1">
                Open Full Sajilo view to browse all 10+ Nepali FM stations.
              </div>
            </div>
          )}

          {/* Tab 4: Keeper */}
          {activeTab === 'keeper' && (
            <div className="space-y-2 text-xs">
              {keeperAlerts.length === 0 ? (
                <div className="text-center py-6 text-[#8b909b] font-mono text-xs">
                  All documents and renewals are safe!
                </div>
              ) : (
                keeperAlerts.map((k) => (
                  <div key={k.id} className="p-2.5 rounded-xl bg-[#1a1d24] border border-[#262a31] space-y-1">
                    <div className="flex justify-between font-bold text-[#edeef0]">
                      <span className="truncate">{k.title}</span>
                      <span className="text-amber-400 font-mono shrink-0">{formatDigits(k.daysLeft)}d</span>
                    </div>
                    <div className="text-[10px] text-[#8b909b]">Expiry: {k.expiryDateAd}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Tray Footer */}
        <div className="p-3 bg-[#171a21] border-t border-[#262a31] flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenFullView();
            }}
            className="text-xs font-mono font-bold text-[#00e599] hover:underline flex items-center gap-1"
          >
            <span>Open Full Sajilo Essentials</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-[#8b909b]">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
};
