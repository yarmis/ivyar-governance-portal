import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/access-control/access-control-middleware';
import { Permission } from '@/lib/access-control/access-control-types';
import { getAllModules } from '@/lib/module-registry';

export async function GET(request: NextRequest) {
  return protectedRoute(
    request,
    Permission.SYSTEM_VIEW_CONFIG,
    async (req) => {
      const modules = getAllModules();
      
      return NextResponse.json({
        success: true,
        total: modules.length,
        modules: modules.map(m => ({
          id: m.id,
          name: m.name,
          description: m.description,
          category: m.category,
          status: m.status,
          route: m.route,
          icon: m.icon,
          version: m.version,
          apiEndpoints: m.apiEndpoints?.length || 0
        }))
      });
    }
  );
}
