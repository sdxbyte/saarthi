import { UserProfile, VaultDocument } from '../types';

// Standard typed SHA-256 implementation for offline/client password hashing
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

export function hashPassword(password: string, email: string): string {
  const salt = `saarthi_salt_${email.trim().toLowerCase()}_sec_2026`;
  return sha256Sync(`${salt}:${password}`);
}

export interface CitizenAccount {
  id: string;
  fullName: string;
  email: string; // lowercase
  mobileNumber: string;
  passwordHash: string; // SHA-256 salted hash
  nagarikId?: string;
  citizenshipNo?: string;
  registeredAt: string;
  role: 'user'; // STRICTLY 'user' - NEVER ADMIN
}

const CITIZEN_ACCOUNTS_KEY = 'saarthi_registered_citizens_db';
const ACTIVE_SESSION_KEY = 'saarthi_active_citizen_session';
const USER_DOCS_PREFIX = 'saarthi_citizen_docs_';

// Retrieve all registered citizen accounts
export function getRegisteredCitizens(): CitizenAccount[] {
  try {
    const raw = localStorage.getItem(CITIZEN_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading citizen database:', e);
    return [];
  }
}

// Save citizen database
function saveCitizenAccounts(accounts: CitizenAccount[]) {
  try {
    localStorage.setItem(CITIZEN_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving citizen database:', e);
  }
}

// Get active citizen session
export function getActiveCitizenSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Set active citizen session
export function setActiveCitizenSession(profile: UserProfile | null) {
  if (profile) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

/**
 * Register a new Nepali Citizen Account
 */
export function registerCitizenAccount(data: {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  nagarikId?: string;
}): { success: boolean; message?: string; profile?: UserProfile } {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanName = data.fullName.trim();
  const cleanPhone = data.mobileNumber.trim();

  if (!cleanName) {
    return { success: false, message: 'Please enter your full name as per your citizenship document.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }
  if (!cleanPhone || cleanPhone.length < 7) {
    return { success: false, message: 'Please enter a valid mobile number.' };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  const existingAccounts = getRegisteredCitizens();
  const duplicate = existingAccounts.find((acc) => acc.email === cleanEmail);
  if (duplicate) {
    return { success: false, message: 'An account with this email address already exists. Please log in.' };
  }

  const userId = 'CITIZEN-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const hashedPassword = hashPassword(data.password, cleanEmail);
  const newAccount: CitizenAccount = {
    id: userId,
    fullName: cleanName,
    email: cleanEmail,
    mobileNumber: cleanPhone,
    passwordHash: hashedPassword,
    nagarikId: data.nagarikId?.trim() || undefined,
    registeredAt: new Date().toISOString().substring(0, 10),
    role: 'user', // STRICTLY CITIZEN
  };

  existingAccounts.push(newAccount);
  saveCitizenAccounts(existingAccounts);

  const profile: UserProfile = {
    isLoggedIn: true,
    name: newAccount.fullName,
    email: newAccount.email,
    phone: newAccount.mobileNumber,
    nagarikId: newAccount.nagarikId,
    memberSince: newAccount.registeredAt,
  };

  setActiveCitizenSession(profile);

  // Initialize seed documents for new user
  const initialDocs: VaultDocument[] = [
    {
      id: 'doc_' + Date.now() + '_1',
      title: 'Citizenship Certificate',
      documentType: 'Citizenship',
      docNumber: 'NP-' + Math.floor(100000 + Math.random() * 900000),
      issueDate: '2078-01-15',
      issuer: 'District Administration Office',
      createdAt: new Date().toISOString().substring(0, 10),
    },
  ];
  saveUserDocuments(newAccount.email, initialDocs);

  return { success: true, profile };
}

/**
 * Citizen Login Verification
 * Generic non-revealing error message when authentication fails.
 */
export function authenticateCitizen(
  emailInput: string,
  passwordInput: string
): { success: boolean; message?: string; profile?: UserProfile } {
  const cleanEmail = emailInput.trim().toLowerCase();

  if (!cleanEmail || !passwordInput) {
    return { success: false, message: 'Invalid email address or password. Please try again.' };
  }

  const accounts = getRegisteredCitizens();
  const account = accounts.find((acc) => acc.email === cleanEmail);

  if (!account) {
    // GENERIC SECURITY RESPONSE - DO NOT REVEAL WHICH WAS WRONG
    return { success: false, message: 'Invalid email address or password. Access denied.' };
  }

  const expectedHash = hashPassword(passwordInput, cleanEmail);
  const isMatch = account.passwordHash === expectedHash || account.passwordHash === passwordInput; // handle upgrade if old plaintext

  if (!isMatch) {
    return { success: false, message: 'Invalid email address or password. Access denied.' };
  }

  // Automatic hash upgrade if legacy plaintext account
  if (account.passwordHash === passwordInput) {
    account.passwordHash = expectedHash;
    saveCitizenAccounts(accounts);
  }

  const profile: UserProfile = {
    isLoggedIn: true,
    name: account.fullName,
    email: account.email,
    phone: account.mobileNumber,
    nagarikId: account.nagarikId,
    memberSince: account.registeredAt,
  };

  setActiveCitizenSession(profile);
  return { success: true, profile };
}

/**
 * Logout Active Citizen
 */
export function logoutCitizen() {
  setActiveCitizenSession(null);
}

/**
 * Get Documents for a specific Citizen Email
 */
export function getUserDocuments(userEmail?: string): VaultDocument[] {
  if (!userEmail) return [];
  const key = USER_DOCS_PREFIX + userEmail.trim().toLowerCase();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Save Documents for a specific Citizen Email
 */
export function saveUserDocuments(userEmail: string, docs: VaultDocument[]) {
  if (!userEmail) return;
  const key = USER_DOCS_PREFIX + userEmail.trim().toLowerCase();
  try {
    localStorage.setItem(key, JSON.stringify(docs));
  } catch (e) {
    console.error('Error saving user documents:', e);
  }
}
