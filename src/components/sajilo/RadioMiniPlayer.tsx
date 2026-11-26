import React from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Radio, ExternalLink } from 'lucide-react';
import { useRadioAudio } from '../../context/RadioAudioContext';

interface RadioMiniPlayerProps {
  onOpenRadioTab?: () => void;
  onOpenFullRadio?: () => void;
  currentLang?: 'en' | 'ne';
}

export const RadioMiniPlayer: React.FC<RadioMiniPlayerProps> = ({
  onOpenRadioTab,
  onOpenFullRadio,
  currentLang = 'en',
}) => {
  const { currentStation, isPlaying, isLoading, error, isMuted, togglePlay, toggleMute, stopStation } = useRadioAudio();
  const handleOpenRadio = onOpenFullRadio || onOpenRadioTab;

  if (!currentStation) return null;

  return (
    <aside
      aria-label="Live Radio Mini Player"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-blue-200 dark:border-blue-800 rounded-xl shadow-2xl p-3 text-slate-900 dark:text-slate-100 transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
            <Radio className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs truncate">
                {currentLang === 'ne' ? currentStation.nameNp : currentStation.name}
              </span>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 shrink-0 tabular-nums">
                {currentStation.frequency}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <span>{isLoading ? 'Connecting...' : isPlaying ? 'Live' : 'Paused'}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{currentLang === 'ne' ? currentStation.locationNp : currentStation.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white flex items-center justify-center hover:bg-[#132f57] dark:hover:bg-blue-500 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {handleOpenRadio && (
            <button
              type="button"
              onClick={handleOpenRadio}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Open Radio Hub"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={stopStation}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Stop & Close"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-300 font-mono truncate">
          {error}
        </div>
      )}
    </aside>
  );
};
