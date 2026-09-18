import React, { useState } from 'react';

export type LogoVariant = 'main' | 'compact' | 'wordmark' | 'full' | 'hero';
export type LogoTheme = 'dark' | 'light' | 'auto';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

interface SaarthiLogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: LogoSize;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  altText?: string;
}

export const SaarthiLogo: React.FC<SaarthiLogoProps> = ({
  variant = 'main',
  theme = 'auto',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
  altText = 'SAARTHI Official Platform Logo',
}) => {
  const [imgStage, setImgStage] = useState<number>(0); // 0: /saarthi_logo.png, 1: /saarthi_logo.jpg, 2: /logo.png, 3: SVG fallback

  const imageSources = [
    '/saarthi_logo.png',
    '/saarthi_logo.jpg',
    '/logo.png',
  ];

  const handleImageError = () => {
    setImgStage((prev) => (prev < imageSources.length ? prev + 1 : prev));
  };

  // Size calculations
  let iconSize = 38;
  let textSize = 'text-xl';
  let tagSize = 'text-[9px]';

  if (typeof size === 'number') {
    iconSize = size;
  } else {
    switch (size) {
      case 'sm':
        iconSize = 28;
        textSize = 'text-base sm:text-lg';
        tagSize = 'text-[8px]';
        break;
      case 'md':
        iconSize = 38;
        textSize = 'text-lg sm:text-xl';
        tagSize = 'text-[9px]';
        break;
      case 'lg':
        iconSize = 52;
        textSize = 'text-xl sm:text-2xl';
        tagSize = 'text-[10px]';
        break;
      case 'xl':
        iconSize = 72;
        textSize = 'text-2xl sm:text-3xl';
        tagSize = 'text-xs';
        break;
      case '2xl':
        iconSize = 96;
        textSize = 'text-3xl sm:text-4xl';
        tagSize = 'text-sm';
        break;
    }
  }

  // Theme styles
  const isDark = theme === 'dark' || theme === 'auto';

  // Crisp SVG Emblem Fallback when raster images fail or in extreme offline/low-bandwidth modes
  const SvgEmblem = ({ width, height }: { width: number; height: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 max-w-full max-h-full"
    >
      <rect width="100" height="100" rx="22" fill="#020617" />
      <rect x="2" y="2" width="96" height="96" rx="20" stroke="url(#logo_grad)" strokeWidth="3" opacity="0.6" />
      <path
        d="M50 12 L82 28 L82 62 L50 88 L18 62 L18 28 Z"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="26"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        S
      </text>
      <defs>
        <linearGradient id="logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="0.5" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Official SAARTHI Brand Emblem Image Element with multi-level fallbacks
  const LogoImage = ({ customClass }: { customClass?: string }) => {
    if (imgStage >= imageSources.length) {
      return <SvgEmblem width={iconSize} height={iconSize} />;
    }

    return (
      <img
        src={imageSources[imgStage]}
        alt={altText}
        onError={handleImageError}
        referrerPolicy="no-referrer"
        loading="eager"
        className={customClass || 'w-full h-full object-cover rounded-xl'}
      />
    );
  };

  const LogoIconContainer = () => (
    <div
      className="relative shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800/80 ring-1 ring-amber-500/20"
      style={{ width: iconSize, height: iconSize }}
    >
      <LogoImage />
    </div>
  );

  if (variant === 'hero' || variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center justify-center cursor-pointer group select-none ${className}`}
        title="SAARTHI Official Brand Logo"
      >
        <div className="relative shrink-0 flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800/90 ring-2 ring-amber-500/30 p-1.5 transition-all duration-300 group-hover:scale-102">
          {imgStage < imageSources.length ? (
            <img
              src={imageSources[imgStage]}
              alt={altText}
              onError={handleImageError}
              referrerPolicy="no-referrer"
              loading="eager"
              className="max-w-full h-auto object-contain rounded-xl sm:rounded-2xl"
              style={{ maxHeight: typeof size === 'number' ? size : 180, maxWidth: '100%' }}
            />
          ) : (
            <SvgEmblem width={typeof size === 'number' ? size : 140} height={typeof size === 'number' ? size : 140} />
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center cursor-pointer group select-none shrink-0 ${className}`}
        title="SAARTHI Official Digital Platform"
      >
        <LogoIconContainer />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none max-w-full ${className}`}
    >
      {variant !== 'wordmark' && <LogoIconContainer />}

      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
          <span
            className={`font-black tracking-wider uppercase font-sans ${textSize} truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            SAARTHI
          </span>

          <span className="shrink-0 inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-[8px] sm:text-[9px] uppercase tracking-wider">
            OFFICIAL
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-semibold tracking-widest uppercase mt-1 truncate hidden sm:block ${tagSize} ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Empowering Citizens
          </span>
        )}
      </div>
    </div>
  );
};

