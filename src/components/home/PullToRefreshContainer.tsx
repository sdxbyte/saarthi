import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ArrowDown, CheckCircle2, Sparkles, Clock } from 'lucide-react';

interface PullToRefreshContainerProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  lastRefreshedAt?: string;
}

export const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
  children,
  onRefresh,
  currentLang,
  theme = 'dark',
  lastRefreshedAt = 'Just now'
}) => {
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  const [startY, setStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [justRefreshed, setJustRefreshed] = useState<boolean>(false);

  // Maximum pull distance pixels & activation threshold
  const PULL_THRESHOLD = 75;
  const MAX_PULL = 130;

  const getScrollTop = () => {
    return window.scrollY || document.documentElement.scrollTop || (containerRef.current ? containerRef.current.scrollTop : 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (getScrollTop() <= 0 && !isRefreshing) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null && getScrollTop() <= 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0) {
        // Elastic resistance formula
        const damped = Math.min(MAX_PULL, Math.pow(diff, 0.85));
        setPullDistance(damped);
      } else {
        setPullDistance(0);
      }
    }
  };

  const executeRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(PULL_THRESHOLD);

    try {
      await onRefresh();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 3000);
      }, 600);
    }
  };

  const handleTouchEnd = () => {
    if (startY !== null) {
      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        executeRefresh();
      } else {
        setPullDistance(0);
      }
      setStartY(null);
    }
  };

  // Mouse drag support for desktop testing
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (getScrollTop() <= 0 && !isRefreshing) {
      setStartY(e.clientY);
      setIsMouseDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDragging || startY === null || isRefreshing) return;
    if (getScrollTop() <= 0) {
      const diff = e.clientY - startY;
      if (diff > 0) {
        const damped = Math.min(MAX_PULL, Math.pow(diff, 0.85));
        setPullDistance(damped);
      } else {
        setPullDistance(0);
      }
    }
  };

  const handleMouseUp = () => {
    if (isMouseDragging) {
      setIsMouseDragging(false);
      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        executeRefresh();
      } else {
        setPullDistance(0);
      }
      setStartY(null);
    }
  };

  const pullPercentage = Math.min(100, Math.round((pullDistance / PULL_THRESHOLD) * 100));

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative select-none"
    >
      {/* Top Banner Status Bar & Manual Pull Button */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 mb-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {currentLang === 'ne'
              ? `अन्तिम अपडेट: ${lastRefreshedAt}`
              : `Last Updated: ${lastRefreshedAt}`}
          </span>
          {justRefreshed && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {currentLang === 'ne' ? 'सबै फिडहरू अद्यावधिक' : 'All Feeds Refreshed'}
            </span>
          )}
        </div>

        <button
          onClick={executeRefresh}
          disabled={isRefreshing}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-amber-200'
              : 'bg-slate-100 border-slate-200 text-amber-700 hover:bg-slate-200'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-400' : 'text-amber-400'}`} />
          <span>
            {isRefreshing
              ? currentLang === 'ne'
                ? 'अपडेट हुँदैछ...'
                : 'Refreshing Feeds...'
              : currentLang === 'ne'
              ? 'स्वाइप / क्लिक गरी अद्यावधिक गर्नुहोस्'
              : 'Pull / Click to Refresh Feeds'}
          </span>
        </button>
      </div>

      {/* Pull-to-Refresh Visual Indicator (Appears when dragging down or refreshing) */}
      <AnimatePresence>
        {(pullDistance > 10 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: Math.max(50, pullDistance) }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="overflow-hidden flex flex-col items-center justify-center py-2"
          >
            <div
              className={`px-5 py-2.5 rounded-full border shadow-xl backdrop-blur-md flex items-center gap-3 transition-all ${
                isDark
                  ? 'bg-slate-900/95 border-amber-500/40 text-amber-300'
                  : 'bg-white/95 border-amber-400 text-amber-800'
              }`}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-rose-400" />
                  <span className="text-xs font-mono font-bold">
                    {currentLang === 'ne'
                      ? 'NEPSE, सुन र राजपत्र फिडहरू अद्यावधिक हुँदैछन्...'
                      : 'Updating IPOs, Gold & Gazette Feeds...'}
                  </span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: pullDistance >= PULL_THRESHOLD ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowDown className={`w-5 h-5 ${pullDistance >= PULL_THRESHOLD ? 'text-emerald-400' : 'text-amber-400'}`} />
                  </motion.div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-mono font-bold">
                      {pullDistance >= PULL_THRESHOLD
                        ? currentLang === 'ne'
                          ? 'छाड्नुहोस् र अद्यावधिक गर्नुहोस्'
                          : 'Release to Refresh Feeds'
                        : currentLang === 'ne'
                        ? 'अझै तल तान्नुहोस्...'
                        : 'Pull down to refresh...'}
                    </span>
                    <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all ${
                          pullDistance >= PULL_THRESHOLD ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${pullPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Wrapped Content with Translate Y animation during pull */}
      <motion.div
        animate={{ y: isRefreshing ? 20 : Math.min(60, pullDistance * 0.4) }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
