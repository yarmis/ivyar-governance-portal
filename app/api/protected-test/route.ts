import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/access-control/access-control-middleware';
import { Permission } from '@/lib/access-control/access-control-types';

export async function GET(request: NextRequest) {
  return protectedRoute(
    request,
    Permission.ANALYTICS_VIEW,
    async (req) => {
      return NextResponse.json({
        message: '✅ Access Control Works!',
        user: req.user,
        permission: Permission.ANALYTICS_VIEW
      });
    }
  );
}
