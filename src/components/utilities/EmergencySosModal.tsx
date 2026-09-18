import React, { useState } from 'react';
import { Siren, PhoneCall, X, MapPin, AlertTriangle, ShieldAlert } from 'lucide-react';
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
  const [sosTriggered, setSosTriggered] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSos = () => {
    setSosTriggered(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren className="w-6 h-6 text-yellow-300 animate-pulse" />
            <h2 className="font-extrabold text-lg">
              {currentLang === 'ne' ? 'नेपाल आकस्मिक सेवा तथा SOS साइरन' : 'Nepal Emergency SOS & Hotlines'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Quick One-Tap Trigger */}
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-center space-y-3">
            <div className="text-xs font-bold text-red-300 uppercase tracking-wider">
              {currentLang === 'ne' ? 'तत्काल आकस्मिक सहायता' : 'Instant Emergency Siren Broadcast'}
            </div>

            <button
              onClick={handleTriggerSos}
              className={`w-full py-4 rounded-xl font-extrabold text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                sosTriggered
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
              }`}
            >
              <Siren className="w-5 h-5" />
              <span>
                {sosTriggered
                  ? currentLang === 'ne'
                    ? 'SOS सक्रिय! GPS लोकेसन प्रहरीलाई पठाइयो'
                    : 'SOS Active! GPS Location Broadcast Sent'
                  : currentLang === 'ne'
                  ? 'एक ट्यापमा SOS साइरन बजाउनुहोस्'
                  : 'Trigger Emergency SOS Siren'}
              </span>
            </button>

            {sosTriggered && (
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-amber-300 space-y-1 text-left">
                <div className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Current GPS Coordinates: 27.7172° N, 85.3240° E (Kathmandu)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated SMS alert dispatched to registered emergency contacts and Nepal Police 100.
                </p>
              </div>
            )}
          </div>

          {/* Directory list */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'ne' ? 'आकस्मिक हटलाइन नम्बरहरू' : 'Direct Hotline Directory'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {MOCK_EMERGENCY.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{currentLang === 'ne' ? item.nameNp : item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.location}</div>
                  </div>
                  <a
                    href={`tel:${item.number}`}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{item.number}</span>
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
