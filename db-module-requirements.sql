-- Module Launch Requirements Schema

-- Requirement categories
CREATE TYPE requirement_category AS ENUM (
  'technical',
  'security',
  'compliance',
  'documentation',
  'testing',
  'business'
);

-- Requirement status
CREATE TYPE requirement_status AS ENUM (
  'not_started',
  'in_progress',
  'blocked',
  'completed',
  'waived'
);

-- Priority levels
CREATE TYPE priority_level AS ENUM (
  'critical',
  'high',
  'medium',
  'low'
);

-- Module launch requirements table
CREATE TABLE IF NOT EXISTS module_requirements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category requirement_category NOT NULL,
  priority priority_level NOT NULL DEFAULT 'medium',
  status requirement_status NOT NULL DEFAULT 'not_started',
  
  -- Assignment
  assigned_to TEXT,
  assigned_team TEXT,
  
  -- Progress tracking
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  estimated_hours INTEGER,
  actual_hours INTEGER,
  
  -- Dependencies
  dependencies TEXT[], -- Array of requirement IDs
  blocks TEXT[], -- Array of requirement IDs this blocks
  
  -- Dates
  due_date TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  blocked_at TIMESTAMP,
  blocked_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  acceptance_criteria TEXT[],
  verification_method TEXT,
  
  -- Audit
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Module launch checklist templates
CREATE TABLE IF NOT EXISTS launch_checklist_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  module_category TEXT,
  requirements JSONB NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Module launch history
CREATE TABLE IF NOT EXISTS module_launch_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  module_id TEXT NOT NULL,
  version TEXT,
  launch_type TEXT, -- 'pilot', 'beta', 'production'
  
  -- Requirements snapshot
  total_requirements INTEGER,
  completed_requirements INTEGER,
  waived_requirements INTEGER,
  completion_percentage INTEGER,
  
  -- Launch details
  launched_by TEXT,
  launched_at TIMESTAMP DEFAULT NOW(),
  rollback_plan TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_module_requirements_module ON module_requirements(module_id);
CREATE INDEX IF NOT EXISTS idx_module_requirements_status ON module_requirements(status);
CREATE INDEX IF NOT EXISTS idx_module_requirements_category ON module_requirements(category);
CREATE INDEX IF NOT EXISTS idx_module_requirements_assigned ON module_requirements(assigned_to);
CREATE INDEX IF NOT EXISTS idx_module_requirements_due_date ON module_requirements(due_date);

-- Triggers
DROP TRIGGER IF EXISTS update_module_requirements_updated_at ON module_requirements;
CREATE TRIGGER update_module_requirements_updated_at
  BEFORE UPDATE ON module_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views
CREATE OR REPLACE VIEW module_launch_readiness AS
SELECT 
  module_id,
  COUNT(*) as total_requirements,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'blocked') as blocked,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
  COUNT(*) FILTER (WHERE status = 'waived') as waived,
  COUNT(*) FILTER (WHERE priority = 'critical' AND status != 'completed' AND status != 'waived') as critical_blockers,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'completed' OR status = 'waived')::NUMERIC / COUNT(*)::NUMERIC) * 100
  ) as completion_percentage
FROM module_requirements
GROUP BY module_id;

COMMENT ON TABLE module_requirements IS 'Module launch requirements and readiness tracking';
COMMENT ON VIEW module_launch_readiness IS 'Real-time launch readiness dashboard';
