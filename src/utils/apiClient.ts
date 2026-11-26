import { Capacitor } from '@capacitor/core';

export const DEFAULT_PRODUCTION_API_BASE = 'https://saarthi.dpdns.org';

let fetchPatched = false;

/**
 * Returns true when SAARTHI is executing inside the self-contained native Android APK shell
 * (Capacitor WebView) rather than inside a standard web browser.
 */
export function isNativeAndroidShell(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (Capacitor.isNativePlatform()) return true;
  } catch {
    // Ignore bridge lookup issues
  }
  if (import.meta.env.VITE_IS_NATIVE_APK === 'true') return true;
  const proto = window.location?.protocol || '';
  const host = window.location?.hostname || '';
  if (proto === 'capacitor:') return true;
  if (proto === 'https:' && host === 'localhost') return true;
  return false;
}

/**
 * Resolves the authoritative backend server origin.
 * - Website / dev browser: '' (uses same-origin /api/*)
 * - Standalone Capacitor APK: 'https://saarthi.dpdns.org' (or VITE_API_BASE_URL override)
 */
export function getApiBaseUrl(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  if (isNativeAndroidShell()) {
    return configured || DEFAULT_PRODUCTION_API_BASE;
  }
  return configured;
}

export function resolveApiUrl(inputUrl: string): string {
  if (!inputUrl.startsWith('/api/')) return inputUrl;
  const base = getApiBaseUrl();
  return base ? `${base}${inputUrl}` : inputUrl;
}

/**
 * Installs a transparent global fetch interceptor so every relative `/api/*` request inside
 * the standalone Capacitor APK syncs automatically with the live SAARTHI server.
 */
export function installUniversalApiFetch(): void {
  if (typeof window === 'undefined' || fetchPatched) return;
  fetchPatched = true;

  const runningInApk = isNativeAndroidShell();
  const base = getApiBaseUrl();

  // In standard web browsers without a separate API origin, native relative /api/* fetch needs no wrapper.
  if (!runningInApk && !base) {
    return;
  }

  const nativeFetch = window.fetch.bind(window);

  const wrappedFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const targetUrl = resolveApiUrl(input);
      const nextInit: RequestInit = { ...init };
      if (runningInApk) {
        const headers = new Headers(nextInit.headers || {});
        if (!headers.has('X-Saarthi-Client')) {
          headers.set('X-Saarthi-Client', 'android-apk');
        }
        nextInit.headers = headers;
        if (!nextInit.credentials) {
          nextInit.credentials = 'include';
        }
      }
      return nativeFetch(targetUrl, nextInit);
    }

    if (input instanceof URL && input.origin === window.location.origin && input.pathname.startsWith('/api/')) {
      const targetUrl = resolveApiUrl(`${input.pathname}${input.search}`);
      const nextInit: RequestInit = { ...init };
      if (runningInApk) {
        const headers = new Headers(nextInit.headers || {});
        if (!headers.has('X-Saarthi-Client')) {
          headers.set('X-Saarthi-Client', 'android-apk');
        }
        nextInit.headers = headers;
        if (!nextInit.credentials) {
          nextInit.credentials = 'include';
        }
      }
      return nativeFetch(targetUrl, nextInit);
    }

    if (input instanceof Request) {
      try {
        const urlObj = new URL(input.url);
        if (urlObj.origin === window.location.origin && urlObj.pathname.startsWith('/api/')) {
          const rewritten = resolveApiUrl(`${urlObj.pathname}${urlObj.search}`);
          if (rewritten !== input.url) {
            const headers = new Headers(input.headers);
            if (runningInApk && !headers.has('X-Saarthi-Client')) {
              headers.set('X-Saarthi-Client', 'android-apk');
            }
            const nextReq = new Request(rewritten, {
              method: input.method,
              headers,
              body: input.body,
              mode: 'cors',
              credentials: runningInApk ? 'include' : input.credentials,
              cache: input.cache,
              redirect: input.redirect,
              referrer: input.referrer,
              integrity: input.integrity,
            });
            return nativeFetch(nextReq, init);
          }
        }
      } catch {
        // Fallback to native fetch on URL parse failures
      }
    }

    return nativeFetch(input, init);
  };

  try {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || desc.writable) {
      window.fetch = wrappedFetch;
    } else if (desc.configurable) {
      Object.defineProperty(window, 'fetch', {
        value: wrappedFetch,
        writable: true,
        enumerable: desc.enumerable ?? true,
        configurable: true,
      });
    }
  } catch {
    // Never crash app startup if the host WebView/browser marks window.fetch non-configurable readonly
  }
}
