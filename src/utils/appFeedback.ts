import { liveSyncEngine } from './liveSyncEngine';

export type HapticStyle = 'light' | 'medium' | 'success';

/**
 * Triggers subtle tactile feedback on supported mobile devices and Android WebViews
 * without ever throwing or blocking UI interaction.
 */
export function triggerHaptic(style: HapticStyle = 'light'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  try {
    if (typeof navigator.vibrate === 'function') {
      if (style === 'success') {
        navigator.vibrate([10, 24, 14]);
      } else if (style === 'medium') {
        navigator.vibrate(14);
      } else {
        navigator.vibrate(8);
      }
    }
  } catch {
    // Ignore restricted vibration contexts
  }
}

/**
 * Syncs Android system status bar and navigation bar colors + icon contrast
 * with SAARTHI's active theme when running inside the Capacitor APK shell.
 */
export async function syncAndroidSystemBars(isDark: boolean): Promise<void> {
  if (!liveSyncEngine.isNativeUpdaterAvailable()) return;
  try {
    const plugin = liveSyncEngine.getNativeUpdaterPlugin();
    if (typeof plugin.setSystemBarsTheme === 'function') {
      await plugin.setSystemBarsTheme({ dark: isDark });
    }
  } catch {
    // Non-fatal if older native plugin build is installed
  }
}

export interface TabScreenMeta {
  titleEn: string;
  titleNe: string;
  parentTab: string;
}

const SCREEN_META_MAP: Record<string, TabScreenMeta> = {
  home: { titleEn: 'SAARTHI', titleNe: 'सारथी', parentTab: 'home' },
  dashboard: { titleEn: 'SAARTHI', titleNe: 'सारथी', parentTab: 'home' },
  services: { titleEn: 'Civic Services', titleNe: 'नागरिक सेवाहरू', parentTab: 'home' },
  finance: { titleEn: 'Finance Hub', titleNe: 'वित्त केन्द्र', parentTab: 'home' },
  calendar: { titleEn: 'BS / AD Calendar', titleNe: 'नेपाली पात्रो', parentTab: 'home' },
  account: { titleEn: 'Account & Sync', titleNe: 'खाता र सिङ्क', parentTab: 'home' },
  tools: { titleEn: 'Utilities & Tools', titleNe: 'दैनिक औजार', parentTab: 'home' },
  explore: { titleEn: 'All Modules', titleNe: 'सम्पूर्ण सेवा', parentTab: 'home' },
  modules: { titleEn: 'All Modules', titleNe: 'सम्पूर्ण सेवा', parentTab: 'home' },
  nepse: { titleEn: 'NEPSE & IPO Suite', titleNe: 'नेप्से र आइपिओ', parentTab: 'finance' },
  forex: { titleEn: 'NRB Forex Rates', titleNe: 'विदेशी मुद्रा दर', parentTab: 'finance' },
  gold: { titleEn: 'Gold & Bullion', titleNe: 'सुनचाँदी दर', parentTab: 'finance' },
  fuel: { titleEn: 'NOC Fuel Prices', titleNe: 'इन्धन मूल्य', parentTab: 'finance' },
  tax: { titleEn: 'Income Tax (IRD)', titleNe: 'आयकर हिसाब', parentTab: 'finance' },
  emi: { titleEn: 'Loan EMI Calc', titleNe: 'ऋण ई.एम.आई.', parentTab: 'finance' },
  receipt: { titleEn: 'Receipt Ledger', titleNe: 'खर्च रसिद', parentTab: 'finance' },
  bluebook: { titleEn: 'Bluebook Tax', titleNe: 'ब्लुबुक कर', parentTab: 'tools' },
  vault: { titleEn: 'Document Vault', titleNe: 'डिजिटल भल्ट', parentTab: 'tools' },
  sajilo: { titleEn: 'Sajilo & FM Radio', titleNe: 'सजिलो र रेडियो', parentTab: 'home' },
  loksewa: { titleEn: 'Lok Sewa & Jobs', titleNe: 'लोक सेवा सूचना', parentTab: 'services' },
  devtrack: { titleEn: 'DevTrack Projects', titleNe: 'विकास परियोजना', parentTab: 'services' },
  rashifal: { titleEn: 'Daily Rashifal', titleNe: 'दैनिक राशिफल', parentTab: 'calendar' },
  'public-apis': { titleEn: 'Public APIs Hub', titleNe: 'पब्लिक ए.पी.आई.', parentTab: 'tools' },
  sitehub: { titleEn: 'AllSite Hub', titleNe: 'वेब निर्देशिका', parentTab: 'tools' },
  osint4all: { titleEn: 'OSINT4ALL', titleNe: 'OSINT निर्देशिका', parentTab: 'tools' },
  links: { titleEn: 'Useful Links', titleNe: 'उपयोगी लिङ्क', parentTab: 'tools' },
  about: { titleEn: 'About SAARTHI', titleNe: 'सारथी बारेमा', parentTab: 'account' },
  vision: { titleEn: 'Our Vision', titleNe: 'हाम्रो दृष्टिकोण', parentTab: 'account' },
  roadmap: { titleEn: 'Roadmap', titleNe: 'रोडम्याप', parentTab: 'account' },
  contact: { titleEn: 'Contact', titleNe: 'सम्पर्क', parentTab: 'account' },
  terms: { titleEn: 'Terms of Service', titleNe: 'सेवा सर्तहरू', parentTab: 'account' },
  privacy: { titleEn: 'Privacy Policy', titleNe: 'गोपनीयता नीति', parentTab: 'account' },
  'account-deletion': { titleEn: 'Account Deletion', titleNe: 'खाता मेटाउने', parentTab: 'account' },
  support: { titleEn: 'Help & Support', titleNe: 'सहायता केन्द्र', parentTab: 'account' },
  donate: { titleEn: 'Support Project', titleNe: 'सहयोग विवरण', parentTab: 'account' },
};

export function getTabScreenMeta(tab: string): TabScreenMeta {
  return (
    SCREEN_META_MAP[tab] || {
      titleEn: 'SAARTHI',
      titleNe: 'सारथी',
      parentTab: 'home',
    }
  );
}
