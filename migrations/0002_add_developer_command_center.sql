-- Migration 0002: Add Developer Command Center & Audit Log Tables
-- Applied At: 2026-08-01

INSERT INTO schema_migrations (version, description)
VALUES ('0002_add_developer_command_center', 'Added audit_logs and release_history tables for Developer Command Center')
ON CONFLICT (version) DO NOTHING;
