-- ============================================================================
-- IVYAR Access Control System - Database Schema
-- PostgreSQL 17.x
-- ============================================================================

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS access_category CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS audit_event_type CASCADE;

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User Roles (RBAC)
CREATE TYPE user_role AS ENUM (
  'USER',        -- Citizen/Business (CIVIL)
  'OPERATOR',    -- Operational Worker (OPS)
  'ADMIN',       -- Module Administrator (ADM)
  'ADMIN_MAX'    -- Sovereign Administrator (ROOT)
);

-- Access Categories
CREATE TYPE access_category AS ENUM (
  'CIVIL',  -- Citizen/Business Access
  'OPS',    -- Operational Access
  'ADM',    -- Administrative Access
  'ROOT'    -- Sovereign/Root Governance
);

-- User Status
CREATE TYPE user_status AS ENUM (
  'ACTIVE',
  'SUSPENDED',
  'BLOCKED',
  'PENDING_VERIFICATION'
);

-- Audit Event Types
CREATE TYPE audit_event_type AS ENUM (
  'LOGIN',
  'LOGOUT',
  'ACCESS_GRANTED',
  'ACCESS_DENIED',
  'PERMISSION_CHECK',
  'ROLE_CHANGED',
  'MFA_REQUIRED',
  'MFA_VERIFIED',
  'SUSPICIOUS_ACTIVITY',
  'DATA_ACCESS',
  'DATA_MODIFICATION',
  'CONFIG_CHANGE'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users Table (enhanced)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  category access_category NOT NULL DEFAULT 'CIVIL',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  
  -- Personal Info
  first_name TEXT,
  last_name TEXT,
  organization TEXT,
  phone TEXT,
  
  -- Security
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret TEXT,
  violations INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 0,
  inactive_days INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  password_changed_at TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_type audit_event_type NOT NULL,
  user_id TEXT,
  user_role user_role,
  action TEXT NOT NULL,
  resource TEXT,
  resource_id TEXT,
  allowed BOOLEAN NOT NULL,
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  device_id TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Foreign Key
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sessions Table (for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  mfa_verified BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  device_id TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Security Alerts Table
CREATE TABLE IF NOT EXISTS security_alerts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Role History Table (for audit trail of role changes)
CREATE TABLE IF NOT EXISTS role_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  old_role user_role,
  new_role user_role NOT NULL,
  changed_by TEXT NOT NULL,
  reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_category ON users(category);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_allowed ON audit_logs(allowed);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON security_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log role changes
CREATE OR REPLACE FUNCTION log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO role_history (user_id, old_role, new_role, changed_by, reason)
    VALUES (
      NEW.id,
      OLD.role,
      NEW.role,
      COALESCE(current_setting('app.current_user_id', TRUE), 'system'),
      COALESCE(current_setting('app.role_change_reason', TRUE), 'Manual change')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for role changes
DROP TRIGGER IF EXISTS log_user_role_change ON users;
CREATE TRIGGER log_user_role_change
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_role_change();

-- ============================================================================
-- INITIAL DATA / VIEWS
-- ============================================================================

-- View for user permissions summary
CREATE OR REPLACE VIEW user_permissions_summary AS
SELECT 
  u.id,
  u.email,
  u.role,
  u.category,
  u.status,
  u.organization,
  COUNT(DISTINCT al.id) FILTER (WHERE al.allowed = TRUE) as granted_access_count,
  COUNT(DISTINCT al.id) FILTER (WHERE al.allowed = FALSE) as denied_access_count,
  MAX(al.timestamp) as last_access_attempt,
  u.last_login_at
FROM users u
LEFT JOIN audit_logs al ON al.user_id = u.id AND al.event_type IN ('ACCESS_GRANTED', 'ACCESS_DENIED')
GROUP BY u.id, u.email, u.role, u.category, u.status, u.organization, u.last_login_at;

-- View for security dashboard
CREATE OR REPLACE VIEW security_dashboard AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  event_type,
  COUNT(*) as event_count,
  COUNT(*) FILTER (WHERE allowed = FALSE) as denied_count,
  COUNT(DISTINCT user_id) as unique_users
FROM audit_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp), event_type
ORDER BY hour DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'Core users table with RBAC roles and access categories';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail of all access attempts';
COMMENT ON TABLE user_sessions IS 'Active user sessions with MFA status';
COMMENT ON TABLE security_alerts IS 'Security incidents and anomaly detections';
COMMENT ON TABLE role_history IS 'History of all role changes for compliance';

COMMENT ON TYPE user_role IS 'RBAC roles: USER (CIVIL), OPERATOR (OPS), ADMIN (ADM), ADMIN_MAX (ROOT)';
COMMENT ON TYPE access_category IS 'Access categories: CIVIL, OPS, ADM, ROOT';
