// app/api/hbs/tenants/route.ts
// HBS Tenants API Route

import { NextRequest, NextResponse } from 'next/server';

interface Tenant {
  id: string;
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  flag: string;
  scope: 'national' | 'regional' | 'pilot' | 'demo';
  status: 'active' | 'suspended' | 'pending' | 'archived';
  modules: string[];
  config: {
    timezone: string;
    locale: string;
    currency: string;
  };
  limits: {
    maxUsers: number;
    maxAdmins: number;
    maxStorageGB: number;
  };
  usage?: {
    users: number;
    admins: number;
    storageUsedGB: number;
  };
  createdAt: string;
  activatedAt?: string;
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: 'TEN-UA-001',
    name: 'Ukraine MSPS',
    fullName: 'Ministry of Social Policy of Ukraine',
    country: 'Ukraine',
    countryCode: 'UA',
    flag: '🇺🇦',
    scope: 'national',
    status: 'active',
    modules: ['health', 'access', 'governance', 'emigrant'],
    config: { timezone: 'Europe/Kyiv', locale: 'uk', currency: 'UAH' },
    limits: { maxUsers: 100000, maxAdmins: 500, maxStorageGB: 1000 },
    usage: { users: 45230, admins: 312, storageUsedGB: 456 },
    createdAt: '2024-01-01T00:00:00Z',
    activatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'TEN-PL-001',
    name: 'Poland MoD',
    fullName: 'Ministry of Digital Affairs of Poland',
    country: 'Poland',
    countryCode: 'PL',
    flag: '🇵🇱',
    scope: 'national',
    status: 'active',
    modules: ['health', 'access', 'governance'],
    config: { timezone: 'Europe/Warsaw', locale: 'pl', currency: 'PLN' },
    limits: { maxUsers: 50000, maxAdmins: 200, maxStorageGB: 500 },
    usage: { users: 28100, admins: 145, storageUsedGB: 234 },
    createdAt: '2024-03-01T00:00:00Z',
    activatedAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'TEN-GE-001',
    name: 'Georgia MoJ',
    fullName: 'Ministry of Justice of Georgia',
    country: 'Georgia',
    countryCode: 'GE',
    flag: '🇬🇪',
    scope: 'national',
    status: 'active',
    modules: ['health', 'access', 'governance'],
    config: { timezone: 'Asia/Tbilisi', locale: 'ka', currency: 'GEL' },
    limits: { maxUsers: 20000, maxAdmins: 100, maxStorageGB: 200 },
    usage: { users: 12400, admins: 67, storageUsedGB: 89 },
    createdAt: '2024-06-01T00:00:00Z',
    activatedAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'TEN-MD-001',
    name: 'Moldova MLSP',
    fullName: 'Ministry of Labor and Social Protection of Moldova',
    country: 'Moldova',
    countryCode: 'MD',
    flag: '🇲🇩',
    scope: 'pilot',
    status: 'active',
    modules: ['health', 'access'],
    config: { timezone: 'Europe/Chisinau', locale: 'ro', currency: 'MDL' },
    limits: { maxUsers: 10000, maxAdmins: 50, maxStorageGB: 100 },
    usage: { users: 5200, admins: 28, storageUsedGB: 34 },
    createdAt: '2025-01-01T00:00:00Z',
    activatedAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'TEN-KE-001',
    name: 'Kenya MoI',
    fullName: 'Ministry of Interior of Kenya',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    scope: 'pilot',
    status: 'pending',
    modules: ['access', 'governance'],
    config: { timezone: 'Africa/Nairobi', locale: 'en', currency: 'KES' },
    limits: { maxUsers: 30000, maxAdmins: 100, maxStorageGB: 150 },
    createdAt: '2025-10-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const scope = searchParams.get('scope');
  const country = searchParams.get('country');

  let tenants = [...MOCK_TENANTS];

  if (status) tenants = tenants.filter(t => t.status === status);
  if (scope) tenants = tenants.filter(t => t.scope === scope);
  if (country) tenants = tenants.filter(t => t.countryCode === country);

  return NextResponse.json({
    success: true,
    data: tenants,
    meta: {
      total: tenants.length,
      active: tenants.filter(t => t.status === 'active').length,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.countryCode || !body.modules) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Create new tenant
    const newTenant: Tenant = {
      id: `TEN-${body.countryCode}-${Date.now()}`,
      name: body.name,
      fullName: body.fullName || body.name,
      country: body.country || body.countryCode,
      countryCode: body.countryCode,
      flag: body.flag || '🏳️',
      scope: body.scope || 'pilot',
      status: 'pending',
      modules: body.modules,
      config: body.config || { timezone: 'UTC', locale: 'en', currency: 'USD' },
      limits: body.limits || { maxUsers: 10000, maxAdmins: 50, maxStorageGB: 100 },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newTenant,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
