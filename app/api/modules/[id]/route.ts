import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/access-control/access-control-middleware';
import { Permission } from '@/lib/access-control/access-control-types';
import { getModuleById } from '@/lib/module-registry';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return protectedRoute(
    request,
    Permission.SYSTEM_VIEW_CONFIG,
    async (req) => {
      const module = getModuleById(params.id);
      
      if (!module) {
        return NextResponse.json(
          { error: 'Module not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        module
      });
    }
  );
}
