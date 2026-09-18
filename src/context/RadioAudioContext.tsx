import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { RadioStation } from '../types/sajiloTypes';

interface RadioAudioContextType {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  volume: number;
  isMuted: boolean;
  playStation: (station: RadioStation) => void;
  pauseStation: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  stopStation: () => void;
}

const RadioAudioContext = createContext<RadioAudioContextType | undefined>(undefined);

export const RadioAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize persistent audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'none';

      audio.addEventListener('play', () => {
        setIsPlaying(true);
        setIsLoading(false);
        setError(null);
      });

      audio.addEventListener('playing', () => {
        setIsPlaying(true);
        setIsLoading(false);
        setError(null);
      });

      audio.addEventListener('waiting', () => {
        setIsLoading(true);
      });

      audio.addEventListener('pause', () => {
        setIsPlaying(false);
        setIsLoading(false);
      });

      audio.addEventListener('error', (e) => {
        console.warn('Radio audio stream error:', e);
        setIsLoading(false);
        setIsPlaying(false);
        setError('Stream connection interrupted or geo-restricted. Retrying...');
      });

      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  const playStation = (station: RadioStation) => {
    if (!audioRef.current) return;
    setError(null);
    setIsLoading(true);
    setCurrentStation(station);

    try {
      audioRef.current.pause();
      audioRef.current.src = station.streamUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('Error starting primary radio stream, trying fallback:', err);
          if (station.fallbackStreamUrl) {
            audioRef.current!.src = station.fallbackStreamUrl;
            audioRef.current!
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
              })
              .catch((err2) => {
                console.warn('Fallback stream also failed:', err2);
                setIsLoading(false);
                setIsPlaying(false);
                setError('Unable to connect to live stream server. Please try another station.');
              });
          } else {
            setIsLoading(false);
            setIsPlaying(false);
            setError('Stream unavailable at this moment.');
          }
        });
    } catch (e: any) {
      setIsLoading(false);
      setIsPlaying(false);
      setError(e?.message || 'Playback error');
    }
  };

  const pauseStation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!currentStation || !audioRef.current) return;
    if (isPlaying) {
      pauseStation();
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => playStation(currentStation));
    }
  };

  const stopStation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentStation(null);
    setError(null);
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  };

  return (
    <RadioAudioContext.Provider
      value={{
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
      }}
    >
      {children}
    </RadioAudioContext.Provider>
  );
};

export const useRadioAudio = (): RadioAudioContextType => {
  const context = useContext(RadioAudioContext);
  if (!context) {
    throw new Error('useRadioAudio must be used within a RadioAudioProvider');
  }
  return context;
};
