import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/access-control/access-control-middleware';
import { Permission } from '@/lib/access-control/access-control-types';
import { Client } from 'pg';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
          [id]
        );
        
        const readiness = await client.query(
          `SELECT * FROM module_launch_readiness WHERE module_id = $1`,
          [id]
        );

        return NextResponse.json({
          success: true,
          moduleId: id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
            id,
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