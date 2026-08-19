import { pgTable, text, integer, bigint, timestamp, serial } from 'drizzle-orm/pg-core';

export const updateCounters = pgTable('update_counters', {
  key: text('key').primaryKey(),
  val: bigint('val', { mode: 'number' }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const emailCounters = pgTable('email_counters', {
  key: text('key').primaryKey(),
  val: bigint('val', { mode: 'number' }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const updateManifests = pgTable('update_manifests', {
  id: serial('id').primaryKey(),
  updateId: text('update_id').notNull().unique(),
  updateNumber: integer('update_number').notNull().unique(),
  version: text('version').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  timestampUtc: bigint('timestamp_utc', { mode: 'number' }).notNull(),
  timezone: text('timezone').notNull(),
  adDate: text('ad_date').notNull(),
  bsDate: text('bs_date').notNull(),
  status: text('status').notNull(),
  changeManifest: text('change_manifest').notNull(),
  githubStatus: text('github_status').notNull(),
  githubCommitSha: text('github_commit_sha'),
  emailStatus: text('email_status').notNull(),
  emailNumber: integer('email_number'),
  title: text('title'),
  summary: text('summary'),
  updateType: text('update_type'),
  synchronizationId: text('synchronization_id'),
  repoUrl: text('repo_url'),
  finalStatus: text('final_status'),
  adTimeStr: text('ad_time_str'),
  dayOfWeek: text('day_of_week'),
});

export const emailRecords = pgTable('email_records', {
  id: serial('id').primaryKey(),
  emailNumber: integer('email_number').notNull().unique(),
  updateId: text('update_id').notNull(),
  status: text('status').notNull(),
  providerMessageId: text('provider_message_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sentAt: timestamp('sent_at'),
  retryCount: integer('retry_count').default(0).notNull(),
  errorMessage: text('error_message'),
  synchronizationId: text('synchronization_id'),
  version: text('version'),
  updateNumber: integer('update_number'),
  recipient: text('recipient'),
  subject: text('subject'),
  mode: text('mode'),
});

export const idempotencyLocks = pgTable('idempotency_locks', {
  lockKey: text('lock_key').primaryKey(),
  updateId: text('update_id'),
  operationType: text('operation_type'),
  status: text('status').notNull(),
  owner: text('owner').notNull(),
  acquiredAt: timestamp('acquired_at').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  completedAt: timestamp('completed_at'),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  eventId: text('event_id'),
  updateId: text('update_id'),
  eventType: text('event_type').notNull(),
  actor: text('actor').notNull(),
  timestampUtc: bigint('timestamp_utc', { mode: 'number' }).notNull(),
  timezone: text('timezone').notNull(),
  adDate: text('ad_date').notNull(),
  bsDate: text('bs_date').notNull(),
  result: text('result'),
  githubCommitSha: text('github_commit_sha'),
  emailProviderId: text('email_provider_id'),
  metadata: text('metadata'),
  sourceId: text('source_id'),
  action: text('action'),
  riskLevel: text('risk_level'),
  timestampIso: text('timestamp_iso'),
});

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'CITIZEN' | 'ADMIN' | 'DEVELOPER' | 'OFFICIAL';
  isVerified: boolean;
  createdAt: string;
}
