import * as schema from './schema.ts';

// GitHub-Centric Zero-Cost Persistence Authority Architecture
// External paid/trial databases (Cloud SQL, Postgres, Firestore, etc.) are strictly disabled.

export const isPostgresConfigured = (): boolean => {
  return false;
};

export const createPool = (): any => {
  return null;
};

export const getPostgresPool = (): any => null;

export const db = null as any;

export async function checkPostgresHealth(): Promise<{
  connected: boolean;
  stateStore: string;
  error?: string;
}> {
  return {
    connected: false,
    stateStore: 'GitHub Repository State Authority (sdxbyte/saarthi)',
    error: 'External paid database disabled. System running on $0-Cost GitHub Persistence Architecture.',
  };
}

