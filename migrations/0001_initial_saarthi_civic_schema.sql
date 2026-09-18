-- Migration 0001: Initial SAARTHI Civic Schema
-- Applied At: 2026-08-01

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(32) PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version, description)
VALUES ('0001_initial_saarthi_civic_schema', 'Created users, civic_requests, tax_records, announcements, and ai_conversations tables')
ON CONFLICT (version) DO NOTHING;
