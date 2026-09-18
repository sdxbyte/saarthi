/**
 * SAARTHI DESIGN SYSTEM TOKENS
 * 
 * Directly aligned with the precision macOS system palette & typography of Sajilo (Patro skin)
 * by Adarsha Acharya (https://github.com/adarshaacharya/sajilo).
 * 
 * Principles:
 * - Solid, opaque surfaces (Window vibrancy / flat surfaces without stacking excessive glassmorphism).
 * - High contrast WCAG AA adherence (Text 12.8:1 on dark surface, 16.8:1 on light surface).
 * - Accent: Nepali Heritage Gilt Gold (#D4A84A on dark, #8A6414 on light).
 * - Semantic alerts: Sindoor Red (#FF6A52 / #C93A22), Forest Positive (#4ECF8A / #0F7A3D).
 * - Restrained typography, subtle hairline borders, 8px-12px radii, no giant neon gradients.
 */

export const DESIGN_TOKENS = {
  // Theme Palettes
  dark: {
    canvas: '#1c1c1e',
    chrome: '#1c1c1e',
    surface: '#2c2c2e',
    surfaceRaised: '#2c2c2e',
    surfaceHover: '#3a3a3c',
    surfaceSubtle: '#242426',
    border: '#38383a',
    borderMuted: '#2f2f31',
    divider: '#2f2f31',
    text: '#f5f5f7',
    textSecondary: '#aeaeb2',
    textMuted: '#98989d',
    accent: '#d4a84a',
    accentMark: '#d4a84a',
    accentFill: '#d4a84a',
    accentInk: '#1c1c1e',
    accentMuted: 'rgba(212, 168, 74, 0.14)',
    holiday: '#ff6a52',
    positive: '#4ecf8a',
    negative: '#ff6a52',
    weatherTint: '#6aa9dd',
    forexTint: '#5cc79b',
    controlBg: '#1c1c1e',
    controlBorder: '#48484a',
    cardShadow: '0 1px 2px rgba(0, 0, 0, 0.24)',
  },
  light: {
    canvas: '#f2f2f7',
    chrome: '#f2f2f7',
    surface: '#ffffff',
    surfaceRaised: '#ffffff',
    surfaceHover: '#e8e8ed',
    surfaceSubtle: '#f8f8fa',
    border: '#d8d8dd',
    borderMuted: '#e3e3e8',
    divider: '#e3e3e8',
    text: '#1d1d1f',
    textSecondary: '#545458',
    textMuted: '#6e6e73',
    accent: '#8a6414',
    accentMark: '#8a6414',
    accentFill: '#8a6414',
    accentInk: '#ffffff',
    accentMuted: 'rgba(138, 100, 20, 0.10)',
    holiday: '#c93a22',
    positive: '#0f7a3d',
    negative: '#c93a22',
    weatherTint: '#2f6fa8',
    forexTint: '#1a7f52',
    controlBg: '#ffffff',
    controlBorder: '#c6c6cb',
    cardShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif',
    fontMono: '"SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '14px',
    '3xl': '16px',
    card: '10px',
    full: '9999px',
  },
} as const;

export type DesignPalette = typeof DESIGN_TOKENS.dark;
