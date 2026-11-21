import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { GlobalTimeProvider } from './context/GlobalTimeContext.tsx';
import { installUniversalApiFetch, isNativeAndroidShell } from './utils/apiClient.ts';
import './index.css';

installUniversalApiFetch();

if (typeof window !== 'undefined' && !isNativeAndroidShell() && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      // Offline cache ready
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GlobalTimeProvider>
        <App />
      </GlobalTimeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
