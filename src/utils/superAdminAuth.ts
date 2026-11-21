export interface SuperAdminCreds {
  username: string;
  email: string;
  passwordHashOrPlain: string;
  lastUpdated: string;
}

export interface DelegatedAdminAccount {
  id: string;
  usernameOrEmail: string;
  name: string;
  role: 'Admin' | 'Moderator' | 'Support';
  department: string;
  passwordHashOrPlain: string;
  status: 'Active' | 'Revoked';
  dateAdded: string;
}

const STORAGE_KEY = 'saarthi_super_admin_creds';
const DELEGATED_KEY = 'saarthi_delegated_admin_accounts';
const ADMIN_TOKEN_KEY = 'saarthi_admin_session_token';

// Standard typed SHA-256 for client credential verification
function sha256Sync(str: string): string {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a;
  let H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19;

  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    }
  }

  const bitLength = utf8.length * 8;
  utf8.push(0x80);
  while ((utf8.length % 64) !== 56) {
    utf8.push(0);
  }

  for (let i = 7; i >= 0; i--) {
    utf8.push((bitLength >>> (i * 8)) & 0xff);
  }

  const words: number[] = [];
  for (let i = 0; i < utf8.length; i += 4) {
    words.push((utf8[i] << 24) | (utf8[i + 1] << 16) | (utf8[i + 2] << 8) | utf8[i + 3]);
  }

  const W: number[] = new Array(64);
  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t++) {
      W[t] = words[i + t];
    }
    for (let t = 16; t < 64; t++) {
      const s0 = ((W[t - 15] >>> 7) | (W[t - 15] << 25)) ^ ((W[t - 15] >>> 18) | (W[t - 15] << 14)) ^ (W[t - 15] >>> 3);
      const s1 = ((W[t - 2] >>> 17) | (W[t - 2] << 15)) ^ ((W[t - 2] >>> 19) | (W[t - 2] << 13)) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }

    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

    for (let t = 0; t < 64; t++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
    H5 = (H5 + f) | 0;
    H6 = (H6 + g) | 0;
    H7 = (H7 + h) | 0;
  }

  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4) + toHex(H5) + toHex(H6) + toHex(H7);
}

export function hashAdminPassword(password: string): string {
  return sha256Sync(`saarthi_admin_salt_2026_${password}`);
}

export function getAdminSessionToken(): string {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAdminSessionToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {}
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = getAdminSessionToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }
  return headers;
}

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const token = getAdminSessionToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('x-admin-token', token);
  }
  return fetch(input, {
    ...init,
    credentials: 'include',
    headers,
  });
}

export async function logoutAdminAsync(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Best-effort server session revocation
  } finally {
    setAdminSessionToken(null);
  }
}

export function getSuperAdminCreds(): SuperAdminCreds {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.username) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse super admin creds:', e);
    }
  }
  return {
    username: 'S.adhikari',
    email: 'sudipadhikari8107@gmail.com',
    passwordHashOrPlain: '',
    lastUpdated: new Date().toISOString(),
  };
}

export function saveSuperAdminCreds(creds: SuperAdminCreds): void {
  const sanitized = {
    ...creds,
    passwordHashOrPlain: creds.passwordHashOrPlain ? hashAdminPassword(creds.passwordHashOrPlain) : '',
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
}

export function updateSuperAdminPassword(newPassword: string): void {
  const current = getSuperAdminCreds();
  const updated: SuperAdminCreds = {
    ...current,
    passwordHashOrPlain: hashAdminPassword(newPassword),
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getDelegatedAdmins(): DelegatedAdminAccount[] {
  const saved = localStorage.getItem(DELEGATED_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse delegated admins:', e);
    }
  }
  return [];
}

export function saveDelegatedAdmins(list: DelegatedAdminAccount[]): void {
  localStorage.setItem(DELEGATED_KEY, JSON.stringify(list));
}

export function addDelegatedAdmin(account: Omit<DelegatedAdminAccount, 'id' | 'dateAdded'>): DelegatedAdminAccount {
  const current = getDelegatedAdmins();
  const newAccount: DelegatedAdminAccount = {
    ...account,
    id: `ADM-DEL-${Date.now().toString().slice(-4)}`,
    passwordHashOrPlain: hashAdminPassword(account.passwordHashOrPlain),
    dateAdded: new Date().toISOString().substring(0, 10),
  };
  const updated = [newAccount, ...current];
  saveDelegatedAdmins(updated);
  return newAccount;
}

export function revokeDelegatedAdmin(id: string): void {
  const current = getDelegatedAdmins();
  const updated = current.map((item) => (item.id === id ? { ...item, status: 'Revoked' as const } : item));
  saveDelegatedAdmins(updated);
}

export async function authenticateAdminAsync(
  usernameOrEmail: string,
  passwordAttempt: string
): Promise<{
  authenticated: boolean;
  isSuperAdmin: boolean;
  token?: string;
  userProfile?: {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Admin' | 'Moderator' | 'Support';
    department: string;
    permissions: string[];
  };
  errorMessage?: string;
}> {
  const cleanInput = usernameOrEmail.trim();

  if (!cleanInput || !passwordAttempt) {
    return {
      authenticated: false,
      isSuperAdmin: false,
      errorMessage: 'Username/email and password are required.',
    };
  }

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: cleanInput,
        password: passwordAttempt,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && data.userProfile) {
      if (data.token) {
        setAdminSessionToken(data.token);
      }
      return {
        authenticated: true,
        isSuperAdmin: data.userProfile.role === 'Super Admin',
        token: data.token,
        userProfile: data.userProfile,
      };
    }

    return {
      authenticated: false,
      isSuperAdmin: false,
      errorMessage: data.message || data.error || `Authentication failed (HTTP ${res.status}).`,
    };
  } catch {
    return {
      authenticated: false,
      isSuperAdmin: false,
      errorMessage: 'Unable to reach SAARTHI authentication server. Admin access requires live server verification.',
    };
  }
}

export function verifyAdminAuthentication(): {
  authenticated: boolean;
  isSuperAdmin: boolean;
  errorMessage: string;
} {
  return {
    authenticated: false,
    isSuperAdmin: false,
    errorMessage: 'Synchronous client-side admin authentication is disabled. Use server-verified authenticateAdminAsync.',
  };
}

export function verifySuperAdminLogin() {
  return {
    isValid: false,
    isSuperAdminIdentifier: false,
  };
}
