// lib/hbs/core/tenant.ts
// HBS Governance Core - Multi-tenant Management v1.0

// ============================================================================
// TYPES
// ============================================================================

export type TenantStatus = 'active' | 'suspended' | 'pending' | 'archived';

export type TenantScope = 'national' | 'regional' | 'pilot' | 'demo';

export type TenantModule = 
  | 'health'
  | 'access'
  | 'aviation'
  | 'business'
  | 'emigrant'
  | 'governance';

export interface Tenant {
  id: string;
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  flag: string;
  scope: TenantScope;
  status: TenantStatus;
  modules: TenantModule[];
  config: TenantConfig;
  limits: TenantLimits;
  contacts: TenantContact[];
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
  suspendedAt?: string;
}

export interface TenantConfig {
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  theme?: {
    primaryColor?: string;
    logoUrl?: string;
  };
  features: Record<string, boolean>;
  integrations: TenantIntegration[];
  policies?: string[]; // Override policy IDs
}

export interface TenantIntegration {
  type: 'sso' | 'registry' | 'payment' | 'notification' | 'storage';
  provider: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface TenantLimits {
  maxUsers: number;
  maxAdmins: number;
  maxStorageGB: number;
  maxApiCallsPerDay: number;
  retentionDays: number;
}

export interface TenantContact {
  type: 'admin' | 'technical' | 'billing' | 'security';
  name: string;
  email: string;
  phone?: string;
}

export interface TenantUsage {
  tenantId: string;
  period: string;
  users: number;
  admins: number;
  storageUsedGB: number;
  apiCalls: number;
  decisions: number;
  audits: number;
  violations: number;
}

export interface TenantContext {
  tenantId: string;
  module: TenantModule;
  scope: TenantScope;
  userId?: string;
  userRole?: string;
  sessionId?: string;
}

// ============================================================================
// CORE ENGINE
// ============================================================================

export class TenantManager {
  private tenants: Map<string, Tenant> = new Map();
  private usage: TenantUsage[] = [];
  private currentContext: TenantContext | null = null;

  // Register a tenant
  register(tenant: Tenant): void {
    this.tenants.set(tenant.id, tenant);
  }

  // Get tenant by ID
  getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.get(tenantId);
  }

  // Get all tenants
  getAllTenants(filters?: {
    status?: TenantStatus;
    scope?: TenantScope;
    country?: string;
    module?: TenantModule;
  }): Tenant[] {
    let tenants = Array.from(this.tenants.values());

    if (filters?.status) tenants = tenants.filter(t => t.status === filters.status);
    if (filters?.scope) tenants = tenants.filter(t => t.scope === filters.scope);
    if (filters?.country) tenants = tenants.filter(t => t.countryCode === filters.country);
    if (filters?.module) tenants = tenants.filter(t => t.modules.includes(filters.module!));

    return tenants;
  }

  // Update tenant
  update(tenantId: string, updates: Partial<Tenant>): Tenant | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const updated: Tenant = {
      ...tenant,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.tenants.set(tenantId, updated);
    return updated;
  }

  // Activate tenant
  activate(tenantId: string): Tenant | null {
    return this.update(tenantId, {
      status: 'active',
      activatedAt: new Date().toISOString(),
    });
  }

  // Suspend tenant
  suspend(tenantId: string, reason?: string): Tenant | null {
    return this.update(tenantId, {
      status: 'suspended',
      suspendedAt: new Date().toISOString(),
    });
  }

  // Check if tenant has module
  hasModule(tenantId: string, module: TenantModule): boolean {
    const tenant = this.tenants.get(tenantId);
    return tenant?.status === 'active' && tenant.modules.includes(module);
  }

  // Check if tenant has feature
  hasFeature(tenantId: string, feature: string): boolean {
    const tenant = this.tenants.get(tenantId);
    return tenant?.status === 'active' && tenant.config.features[feature] === true;
  }

  // Check tenant limits
  checkLimit(tenantId: string, metric: keyof TenantLimits, current: number): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;
    return current < tenant.limits[metric];
  }

  // Record usage
  recordUsage(usage: Omit<TenantUsage, 'period'>): void {
    const period = new Date().toISOString().substring(0, 10);
    const existing = this.usage.find(
      u => u.tenantId === usage.tenantId && u.period === period
    );

    if (existing) {
      Object.assign(existing, {
        users: Math.max(existing.users, usage.users),
        admins: Math.max(existing.admins, usage.admins),
        storageUsedGB: usage.storageUsedGB,
        apiCalls: existing.apiCalls + (usage.apiCalls || 0),
        decisions: existing.decisions + (usage.decisions || 0),
        audits: existing.audits + (usage.audits || 0),
        violations: existing.violations + (usage.violations || 0),
      });
    } else {
      this.usage.push({ ...usage, period });
    }
  }

  // Get usage history
  getUsage(tenantId: string, days: number = 30): TenantUsage[] {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    return this.usage
      .filter(u => u.tenantId === tenantId && u.period >= cutoff)
      .sort((a, b) => a.period.localeCompare(b.period));
  }

  // Set current context
  setContext(context: TenantContext): void {
    this.currentContext = context;
  }

  // Get current context
  getContext(): TenantContext | null {
    return this.currentContext;
  }

  // Clear context
  clearContext(): void {
    this.currentContext = null;
  }

  // Get tenant statistics
  getStats(): {
    totalTenants: number;
    activeTenants: number;
    byStatus: Record<string, number>;
    byScope: Record<string, number>;
    byCountry: Record<string, number>;
    byModule: Record<string, number>;
  } {
    const tenants = Array.from(this.tenants.values());
    const byStatus: Record<string, number> = {};
    const byScope: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byModule: Record<string, number> = {};

    for (const tenant of tenants) {
      byStatus[tenant.status] = (byStatus[tenant.status] || 0) + 1;
      byScope[tenant.scope] = (byScope[tenant.scope] || 0) + 1;
      byCountry[tenant.countryCode] = (byCountry[tenant.countryCode] || 0) + 1;
      for (const module of tenant.modules) {
        byModule[module] = (byModule[module] || 0) + 1;
      }
    }

    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      byStatus,
      byScope,
      byCountry,
      byModule,
    };
  }
}

// ============================================================================
// DEFAULT TENANTS
// ============================================================================

export const DEFAULT_TENANTS: Tenant[] = [
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
    config: {
      timezone: 'Europe/Kyiv',
      locale: 'uk',
      currency: 'UAH',
      dateFormat: 'DD.MM.YYYY',
      features: {
        mfa: true,
        sso: true,
        audit: true,
        export: true,
        api: true,
      },
      integrations: [
        { type: 'sso', provider: 'Diia', enabled: true, config: {} },
      ],
    },
    limits: {
      maxUsers: 100000,
      maxAdmins: 500,
      maxStorageGB: 1000,
      maxApiCallsPerDay: 1000000,
      retentionDays: 2555, // 7 years
    },
    contacts: [
      { type: 'admin', name: 'Main Admin', email: 'admin@msp.gov.ua' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
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
    config: {
      timezone: 'Europe/Warsaw',
      locale: 'pl',
      currency: 'PLN',
      dateFormat: 'DD.MM.YYYY',
      features: {
        mfa: true,
        sso: true,
        audit: true,
        export: true,
        api: true,
      },
      integrations: [
        { type: 'sso', provider: 'Profil Zaufany', enabled: true, config: {} },
      ],
    },
    limits: {
      maxUsers: 50000,
      maxAdmins: 200,
      maxStorageGB: 500,
      maxApiCallsPerDay: 500000,
      retentionDays: 2555,
    },
    contacts: [
      { type: 'admin', name: 'Main Admin', email: 'admin@mc.gov.pl' },
    ],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
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
    config: {
      timezone: 'Asia/Tbilisi',
      locale: 'ka',
      currency: 'GEL',
      dateFormat: 'DD.MM.YYYY',
      features: {
        mfa: true,
        sso: true,
        audit: true,
        export: true,
        api: false,
      },
      integrations: [],
    },
    limits: {
      maxUsers: 20000,
      maxAdmins: 100,
      maxStorageGB: 200,
      maxApiCallsPerDay: 200000,
      retentionDays: 1825, // 5 years
    },
    contacts: [
      { type: 'admin', name: 'Main Admin', email: 'admin@justice.gov.ge' },
    ],
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
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
    config: {
      timezone: 'Europe/Chisinau',
      locale: 'ro',
      currency: 'MDL',
      dateFormat: 'DD.MM.YYYY',
      features: {
        mfa: true,
        sso: false,
        audit: true,
        export: true,
        api: false,
      },
      integrations: [],
    },
    limits: {
      maxUsers: 10000,
      maxAdmins: 50,
      maxStorageGB: 100,
      maxApiCallsPerDay: 100000,
      retentionDays: 1825,
    },
    contacts: [
      { type: 'admin', name: 'Main Admin', email: 'admin@social.gov.md' },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
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
    config: {
      timezone: 'Africa/Nairobi',
      locale: 'en',
      currency: 'KES',
      dateFormat: 'DD/MM/YYYY',
      features: {
        mfa: true,
        sso: false,
        audit: true,
        export: false,
        api: false,
      },
      integrations: [],
    },
    limits: {
      maxUsers: 30000,
      maxAdmins: 100,
      maxStorageGB: 150,
      maxApiCallsPerDay: 150000,
      retentionDays: 1825,
    },
    contacts: [
      { type: 'admin', name: 'Main Admin', email: 'admin@interior.go.ke' },
    ],
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
];

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const tenantManager = new TenantManager();

// Register default tenants
DEFAULT_TENANTS.forEach(tenant => tenantManager.register(tenant));

// ============================================================================
// MIDDLEWARE HELPER
// ============================================================================

export function withTenant<T>(
  tenantId: string,
  module: TenantModule,
  fn: (context: TenantContext) => T
): T {
  const tenant = tenantManager.getTenant(tenantId);
  if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
  if (tenant.status !== 'active') throw new Error(`Tenant not active: ${tenantId}`);
  if (!tenant.modules.includes(module)) throw new Error(`Module not enabled: ${module}`);

  const context: TenantContext = {
    tenantId,
    module,
    scope: tenant.scope,
  };

  tenantManager.setContext(context);
  try {
    return fn(context);
  } finally {
    tenantManager.clearContext();
  }
}
