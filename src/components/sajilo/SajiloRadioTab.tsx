import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Search,
  MapPin,
  Sparkles,
  Signal,
  CheckCircle2,
  Square,
  AlertCircle,
} from 'lucide-react';
import { useRadioAudio } from '../../context/RadioAudioContext';
import { RadioStation } from '../../types/sajiloTypes';

interface SajiloRadioTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloRadioTab: React.FC<SajiloRadioTabProps> = ({ currentLang, devanagariNumerals }) => {
  const {
    currentStation,
    isPlaying,
    isLoading,
    error,
    volume,
    isMuted,
    playStation,
    pauseStation,
    togglePlay,
    setVolume,
    toggleMute,
    stopStation,
  } = useRadioAudio();

  const [stations, setStations] = useState<RadioStation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [isFetchingStations, setIsFetchingStations] = useState(true);

  useEffect(() => {
    fetch('/api/live/radio-stations')
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.stations && Array.isArray(payload.stations)) {
          setStations(payload.stations);
        }
      })
      .catch((e) => console.warn('Radio stations fetch notice:', e))
      .finally(() => setIsFetchingStations(false));
  }, []);

  const filteredStations = stations.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nameNp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity =
      selectedCity === 'all' ||
      st.location.toLowerCase().includes(selectedCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* 1. Radio Hero Player Board */}
      <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-[#14161b] via-[#1a1d24] to-[#121418] border border-[#262a31] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Station Visual Info */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center shrink-0 text-[#00e599] relative">
              <Radio className="w-8 h-8 sm:w-10 sm:h-10" />
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-[#00e599] animate-pulse" />
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-[#00e599] border border-emerald-500/30">
                  {currentStation ? currentStation.frequency : '100.0 MHz'}
                </span>
                <span className="text-xs font-mono text-[#8b909b]">
                  {currentStation ? currentStation.bitrate : '128 kbps'} • Live Stereo
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#edeef0] tracking-tight truncate">
                {currentStation
                  ? currentLang === 'ne' ? currentStation.nameNp : currentStation.name
                  : currentLang === 'ne' ? 'रेडियो नेपाल (राष्ट्रिय प्रसारण)' : 'Radio Nepal (National Stream)'}
              </h2>

              <p className="text-xs text-[#8b909b] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {currentStation
                    ? currentLang === 'ne' ? currentStation.locationNp : currentStation.location
                    : 'Singha Durbar, Kathmandu'}
                </span>
              </p>
            </div>
          </div>

          {/* Equalizer & Audio Controls */}
          <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
            {/* Animated Equalizer Waveform */}
            <div className="flex items-end gap-1 h-8 px-4 py-1 rounded-xl bg-[#0f1115] border border-[#262a31]">
              {[12, 24, 16, 28, 20, 32, 14, 26, 18, 22].map((height, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-[#00e599]' : 'bg-[#262a31]'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(4, Math.sin(idx + Date.now() / 200) * 16 + 16)}px` : '4px',
                  }}
                />
              ))}
            </div>

            {/* Playback Controls & Volume Slider */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-[#1f232b] hover:bg-[#262a31] text-[#8b909b] hover:text-[#edeef0] transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-[#00e599] h-1.5 rounded-lg bg-[#262a31] cursor-pointer"
                title="Volume"
              />

              <button
                onClick={() => {
                  if (!currentStation && stations.length > 0) {
                    playStation(stations[0]);
                  } else {
                    togglePlay();
                  }
                }}
                disabled={isLoading}
                className="w-12 h-12 rounded-xl bg-[#00e599] text-[#0a0b0d] font-bold flex items-center justify-center hover:bg-[#00c985] transition-transform active:scale-95 shadow-lg shadow-[#00e599]/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#0a0b0d] border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {currentStation && (
                <button
                  onClick={stopStation}
                  className="p-2 rounded-xl bg-[#1f232b] hover:bg-[#262a31] text-[#8b909b] hover:text-red-400 transition-colors"
                  title="Stop"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 2. Station Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b909b]" />
          <input
            type="text"
            placeholder={currentLang === 'ne' ? 'स्टेशन वा फ्रिक्वेन्सी खोज्नुहोस्...' : 'Search station name or frequency...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14161b] border border-[#262a31] focus:border-[#00e599] text-xs text-[#edeef0] placeholder-[#8b909b] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Kathmandu', 'Lalitpur', 'Pokhara'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedCity === city
                  ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 font-bold'
                  : 'bg-[#14161b] text-[#8b909b] hover:text-[#edeef0] border border-[#262a31]'
              }`}
            >
              {city === 'all' ? (currentLang === 'ne' ? 'सबै स्टेशनहरू' : 'All Regions') : city}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Stations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => {
          const isSelected = currentStation?.id === station.id;
          const isCurrentPlaying = isSelected && isPlaying;

          return (
            <div
              key={station.id}
              onClick={() => {
                if (isSelected && isPlaying) {
                  pauseStation();
                } else {
                  playStation(station);
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${
                isSelected
                  ? 'bg-[#1a211d] border-[#00e599]/60 shadow-lg'
                  : 'bg-[#14161b] border-[#262a31] hover:border-[#00e599]/30 hover:bg-[#171a21]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isCurrentPlaying
                        ? 'bg-[#00e599] text-[#0a0b0d]'
                        : 'bg-[#1f232b] text-[#8b909b] group-hover:text-[#edeef0]'
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#edeef0]">
                      {currentLang === 'ne' ? station.nameNp : station.name}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold text-[#00e599]">
                      {station.frequency}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f232b] text-[#8b909b] shrink-0">
                  {station.bitrate}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#262a31]/60 flex items-center justify-between text-[11px] text-[#8b909b]">
                <span className="truncate">{currentLang === 'ne' ? station.locationNp : station.location}</span>
                <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                  {isCurrentPlaying ? 'Streaming...' : 'Click to Play'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
