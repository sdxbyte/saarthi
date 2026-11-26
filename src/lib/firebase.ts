import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  Firestore,
  getDocFromServer,
  getFirestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig?.projectId &&
      firebaseConfig.projectId !== 'remixed-project-id' &&
      firebaseConfig?.apiKey &&
      firebaseConfig?.firestoreDatabaseId &&
      firebaseConfig.firestoreDatabaseId !== 'remixed-firestore-database-id'
  );
}

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;

export async function testConnection(): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Permission denied when unauthenticated still proves Firestore server reachability
    return true;
  }
}

if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && !(import.meta as any).vitest) {
  if (!connectionTested) {
    connectionTested = true;
    void testConnection();
  }
}

export async function checkRedirectAuthResult() {
  if (!isFirebaseConfigured()) return null;
  try {
    return await getRedirectResult(auth);
  } catch {
    return null;
  }
}

export async function signInWithGoogleAccount() {
  const inNativeApk =
    typeof window !== 'undefined' &&
    ((window as any)?.Capacitor?.isNativePlatform?.() ||
      import.meta.env.VITE_IS_NATIVE_APK === 'true' ||
      window.location?.protocol === 'capacitor:' ||
      (window.location?.protocol === 'https:' && window.location?.hostname === 'localhost'));

  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err: any) {
    const code = err?.code || '';
    if (inNativeApk) {
      const wrapped: any = new Error(
        'Google popup sign-in is blocked inside the Android WebView. Use Cloud Email & Password below with your same email to sync seamlessly with the website.'
      );
      wrapped.code = 'auth/webview-google-blocked';
      throw wrapped;
    }
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw err;
  }
}

export async function signInWithEmailAccount(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signUpWithEmailAccount(
  email: string,
  password: string,
  displayName?: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim().slice(0, 120) });
  }
  await sendEmailVerification(cred.user);
  return cred;
}

export async function resendVerificationForCurrentUser() {
  if (!auth.currentUser) {
    throw new Error('No active signed-in account found.');
  }
  await sendEmailVerification(auth.currentUser);
}

export async function reloadCurrentFirebaseUser() {
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  return auth.currentUser;
}

export async function sendFirebasePasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function signOutFirebaseAccount() {
  return firebaseSignOut(auth);
}

export { firebaseConfig, app };
