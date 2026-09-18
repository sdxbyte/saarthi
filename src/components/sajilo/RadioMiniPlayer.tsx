import React from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Radio, ExternalLink } from 'lucide-react';
import { useRadioAudio } from '../../context/RadioAudioContext';

interface RadioMiniPlayerProps {
  onOpenRadioTab?: () => void;
  onOpenFullRadio?: () => void;
  currentLang?: 'en' | 'ne';
}

export const RadioMiniPlayer: React.FC<RadioMiniPlayerProps> = ({ onOpenRadioTab, onOpenFullRadio, currentLang = 'en' }) => {
  const { currentStation, isPlaying, isLoading, error, isMuted, togglePlay, toggleMute, stopStation } = useRadioAudio();
  const handleOpenRadio = onOpenFullRadio || onOpenRadioTab;

  if (!currentStation) return null;

  return (
    <aside
      aria-label="Live Radio Mini Player"
      className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] bg-[#14161b]/95 backdrop-blur-md border border-[#00e599]/40 rounded-xl shadow-2xl p-3 text-[#edeef0] transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Station Info & Equalizer */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-[#00e599] relative">
            <Radio className="w-5 h-5" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00e599] animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs truncate text-[#edeef0]">
                {currentLang === 'ne' ? currentStation.nameNp : currentStation.name}
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-[#00e599] border border-emerald-500/30 shrink-0">
                {currentStation.frequency}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#8b909b] truncate">
              {isLoading ? (
                <span className="text-amber-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Connecting...
                </span>
              ) : isPlaying ? (
                <span className="text-[#00e599] font-mono flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5 h-2">
                    <span className="w-0.5 h-2 bg-[#00e599] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3 bg-[#00e599] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-1.5 bg-[#00e599] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  LIVE ON AIR
                </span>
              ) : (
                <span className="text-[#8b909b]">Paused</span>
              )}
              <span>•</span>
              <span className="truncate">{currentLang === 'ne' ? currentStation.locationNp : currentStation.location}</span>
            </div>
          </div>
        </div>

        {/* Right: Audio Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-[#8b909b] hover:text-[#edeef0] hover:bg-[#262a31] transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-lg bg-[#00e599] text-[#0a0b0d] flex items-center justify-center font-bold hover:bg-[#00c985] transition-transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {handleOpenRadio && (
            <button
              onClick={handleOpenRadio}
              className="p-1.5 rounded-lg text-[#8b909b] hover:text-[#00e599] hover:bg-[#262a31] transition-colors"
              title="Open Sajilo Radio Hub"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={stopStation}
            className="p-1.5 rounded-lg text-[#8b909b] hover:text-red-400 hover:bg-[#262a31] transition-colors"
            title="Stop & Close"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-1.5 text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded truncate">
          {error}
        </div>
      )}
    </aside>
  );
};
