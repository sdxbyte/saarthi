import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sdxbyte.saarthi',
  appName: 'SAARTHI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['saarthi.dpdns.org', '*.saarthi.dpdns.org'],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
