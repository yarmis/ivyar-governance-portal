#!/bin/bash

echo "🚀 IVYAR Module Launch Requirements System"
echo "=========================================="
echo ""

# 1. Database Schema
echo "📊 Phase 1: Creating Database Schema..."

cat > db-module-requirements.sql << 'SQL'
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
SQL

echo "✅ Created database schema"

# 2. TypeScript Types
echo ""
echo "📝 Phase 2: Creating TypeScript Types..."

mkdir -p lib/launch-requirements

cat > lib/launch-requirements/types.ts << 'TYPESCRIPT'
/**
 * Module Launch Requirements System
 */

export enum RequirementCategory {
  TECHNICAL = 'technical',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  BUSINESS = 'business'
}

export enum RequirementStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  WAIVED = 'waived'
}

export enum PriorityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface ModuleRequirement {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  category: RequirementCategory;
  priority: PriorityLevel;
  status: RequirementStatus;
  
  assignedTo?: string;
  assignedTeam?: string;
  
  progressPercentage: number;
  estimatedHours?: number;
  actualHours?: number;
  
  dependencies?: string[];
  blocks?: string[];
  
  dueDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  blockedAt?: Date;
  blockedReason?: string;
  
  acceptanceCriteria?: string[];
  verificationMethod?: string;
  
  metadata?: Record<string, any>;
  
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LaunchReadiness {
  moduleId: string;
  totalRequirements: number;
  completed: number;
  blocked: number;
  inProgress: number;
  waived: number;
  criticalBlockers: number;
  completionPercentage: number;
}

export interface LaunchChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  moduleCategory?: string;
  requirements: Partial<ModuleRequirement>[];
}
TYPESCRIPT

echo "✅ Created TypeScript types"

# 3. API Endpoints
echo ""
echo "🔌 Phase 3: Creating API Endpoints..."

mkdir -p app/api/modules/\[id\]/requirements

cat > app/api/modules/\[id\]/requirements/route.ts << 'TYPESCRIPT'
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/access-control/access-control-middleware';
import { Permission } from '@/lib/access-control/access-control-types';
import { Client } from 'pg';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return protectedRoute(
    request,
    Permission.SYSTEM_VIEW_CONFIG,
    async (req) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      try {
        await client.connect();
        
        const requirements = await client.query(
          `SELECT * FROM module_requirements WHERE module_id = $1 ORDER BY priority DESC, due_date ASC`,
          [params.id]
        );
        
        const readiness = await client.query(
          `SELECT * FROM module_launch_readiness WHERE module_id = $1`,
          [params.id]
        );

        return NextResponse.json({
          success: true,
          moduleId: params.id,
          requirements: requirements.rows,
          readiness: readiness.rows[0] || null
        });
      } finally {
        await client.end();
      }
    }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return protectedRoute(
    request,
    Permission.SYSTEM_MANAGE_MODULES,
    async (req) => {
      const body = await request.json();
      
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      try {
        await client.connect();
        
        const result = await client.query(
          `INSERT INTO module_requirements (
            module_id, title, description, category, priority, 
            status, assigned_to, assigned_team, estimated_hours,
            due_date, acceptance_criteria, verification_method,
            created_by
          ) VALUES ($1, $2, $3, $4::requirement_category, $5::priority_level, 
                    $6::requirement_status, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *`,
          [
            params.id,
            body.title,
            body.description,
            body.category,
            body.priority || 'medium',
            body.status || 'not_started',
            body.assignedTo,
            body.assignedTeam,
            body.estimatedHours,
            body.dueDate,
            body.acceptanceCriteria,
            body.verificationMethod,
            req.user?.id
          ]
        );

        return NextResponse.json({
          success: true,
          requirement: result.rows[0]
        });
      } finally {
        await client.end();
      }
    }
  );
}
TYPESCRIPT

echo "✅ Created requirements API"

# 4. Launch Dashboard Component
echo ""
echo "🎨 Phase 4: Creating Launch Dashboard..."

mkdir -p components/launch-requirements

cat > components/launch-requirements/LaunchDashboard.tsx << 'TYPESCRIPT'
'use client';

import { useState, useEffect } from 'react';

interface Requirement {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  progressPercentage: number;
  dueDate?: string;
}

interface Readiness {
  totalRequirements: number;
  completed: number;
  blocked: number;
  inProgress: number;
  completionPercentage: number;
  criticalBlockers: number;
}

interface Props {
  moduleId: string;
  moduleName: string;
}

export default function LaunchDashboard({ moduleId, moduleName }: Props) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/modules/${moduleId}/requirements`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequirements(data.requirements);
          setReadiness(data.readiness);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  const categoryColors: Record<string, string> = {
    technical: 'bg-blue-500/20 text-blue-500',
    security: 'bg-red-500/20 text-red-500',
    compliance: 'bg-purple-500/20 text-purple-500',
    documentation: 'bg-yellow-500/20 text-yellow-500',
    testing: 'bg-green-500/20 text-green-500',
    business: 'bg-orange-500/20 text-orange-500'
  };

  const statusColors: Record<string, string> = {
    not_started: 'bg-gray-500/20 text-gray-500',
    in_progress: 'bg-blue-500/20 text-blue-500',
    blocked: 'bg-red-500/20 text-red-500',
    completed: 'bg-green-500/20 text-green-500',
    waived: 'bg-yellow-500/20 text-yellow-500'
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{moduleName} - Launch Requirements</h1>
        <p className="text-gray-400 mb-8">Track progress towards production launch</p>

        {readiness && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold">{readiness.totalRequirements}</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{readiness.completed}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{readiness.inProgress}</div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold text-red-500">{readiness.blocked}</div>
              <div className="text-gray-400 text-sm">Blocked</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold">{readiness.completionPercentage}%</div>
              <div className="text-gray-400 text-sm">Complete</div>
            </div>
          </div>
        )}

        <div className="bg-[#1a1f3a] rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Requirements Checklist</h2>
          
          {requirements.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No requirements defined yet. Add requirements to track launch readiness.
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.map(req => (
                <div key={req.id} className="bg-[#0d1117] p-4 rounded-lg border border-[#2a2f4a]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{req.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${categoryColors[req.category] || 'bg-gray-500/20 text-gray-500'}`}>
                          {req.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${statusColors[req.status] || 'bg-gray-500/20 text-gray-500'}`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      {req.dueDate && (
                        <div className="text-sm text-gray-500">
                          Due: {new Date(req.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{req.progressPercentage}%</div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#1a1f3a] rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${req.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
TYPESCRIPT

echo "✅ Created launch dashboard component"

# 5. Summary
echo ""
echo "✅ Phase 5: Module Launch Requirements System Created!"
echo "======================================================="
echo ""
echo "📊 Created:"
echo "  ✓ Database schema (module_requirements table)"
echo "  ✓ TypeScript types"
echo "  ✓ API endpoints (/api/modules/[id]/requirements)"
echo "  ✓ Launch dashboard component"
echo "  ✓ Real-time readiness tracking"
echo ""
echo "🔌 Next Steps:"
echo "  1. Apply database schema:"
echo "     psql \"\$DATABASE_URL\" -f db-module-requirements.sql"
echo ""
echo "  2. Add to module page:"
echo "     import LaunchDashboard from '@/components/launch-requirements/LaunchDashboard'"
echo ""
echo "  3. Access API:"
echo "     GET /api/modules/procurement/requirements"
echo ""
echo "📚 Features:"
echo "  • Track requirements by category (technical, security, compliance, etc.)"
echo "  • Priority levels (critical, high, medium, low)"
echo "  • Progress tracking with percentages"
echo "  • Dependencies and blockers"
echo "  • Real-time readiness dashboard"
echo "  • Launch history and rollback plans"
echo ""
