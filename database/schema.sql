-- ============================================================
-- SAARTHI CIVIC TECHNOLOGY PLATFORM - COMPREHENSIVE DATABASE SCHEMA
-- Version: 1.4.2
-- Database Dialect: PostgreSQL / CockroachDB / Cloud SQL Compatible
-- ============================================================

-- 1. USERS & RBAC TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32),
  role VARCHAR(32) DEFAULT 'CITIZEN', -- 'CITIZEN', 'ADMIN', 'DEVELOPER', 'OFFICIAL'
  is_verified BOOLEAN DEFAULT FALSE,
  province_id INT,
  district VARCHAR(100),
  municipality VARCHAR(100),
  ward_number INT,
  citizenship_number VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CIVIC REQUESTS & COMPLAINTS
CREATE TABLE IF NOT EXISTS civic_requests (
  id VARCHAR(64) PRIMARY KEY,
  tracking_id VARCHAR(32) UNIQUE NOT NULL,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(64) NOT NULL, -- 'ROADS', 'WATER', 'ELECTRICITY', 'TAX_INQUIRY', 'MALPOT', 'OTHER'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location_address VARCHAR(255),
  province VARCHAR(64),
  district VARCHAR(64),
  ward_no INT,
  status VARCHAR(32) DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'
  priority VARCHAR(16) DEFAULT 'MEDIUM',
  assigned_department VARCHAR(128),
  attachment_urls TEXT[],
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 3. TAX & BLUEBOOK RECORDS
CREATE TABLE IF NOT EXISTS tax_records (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  tax_type VARCHAR(64) NOT NULL, -- 'INCOME_TAX', 'BLUEBOOK_VEHICLE', 'PROPERTY_MALPOT', 'BUSINESS'
  fiscal_year VARCHAR(16) NOT NULL, -- e.g. '2081/82'
  calculated_amount NUMERIC(12, 2) NOT NULL,
  paid_amount NUMERIC(12, 2) DEFAULT 0.00,
  status VARCHAR(32) DEFAULT 'UNPAID', -- 'UNPAID', 'PARTIAL', 'PAID', 'EXEMPT'
  payment_receipt_no VARCHAR(100),
  vehicle_engine_cc INT,
  vehicle_type VARCHAR(32),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ANNOUNCEMENTS & NOTICES
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL, -- 'NEPSE', 'LOK_SEWA', 'TAX_NOTICE', 'GOVT_CIRCULAR', 'EMERGENCY'
  body TEXT NOT NULL,
  official_link VARCHAR(512),
  is_featured BOOLEAN DEFAULT FALSE,
  published_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI CONVERSATIONS & GROUNDING LOGS
CREATE TABLE IF NOT EXISTS ai_conversations (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(128) NOT NULL,
  user_query TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  language VARCHAR(8) DEFAULT 'en',
  grounding_sources JSONB,
  receipt_scan_data JSONB,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SYSTEM AUDIT & SECURITY LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  category VARCHAR(32) NOT NULL, -- 'AUTH', 'BACKUP', 'GITHUB', 'VERSION', 'FEATURE', 'SETTINGS'
  severity VARCHAR(16) NOT NULL, -- 'INFO', 'WARN', 'CRITICAL'
  admin_email VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DEVELOPER RELEASE & BACKUP MANIFEST
CREATE TABLE IF NOT EXISTS release_history (
  version VARCHAR(32) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_date VARCHAR(32) NOT NULL,
  backup_type VARCHAR(32) NOT NULL, -- 'Auto Sync', 'Manual Backup'
  author VARCHAR(255) NOT NULL,
  commit_hash VARCHAR(64) NOT NULL,
  repo_url VARCHAR(255),
  file_count INT DEFAULT 0,
  total_size VARCHAR(32),
  summary_json JSONB NOT NULL,
  developer_notes TEXT,
  pre_sync_review JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_civic_user_id ON civic_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_civic_status ON civic_requests(status);
CREATE INDEX IF NOT EXISTS idx_tax_user_fiscal ON tax_records(user_id, fiscal_year);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
