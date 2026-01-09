#!/bin/bash

echo "🚀 IVYAR Super Smart Module Integration"
echo "========================================"
echo ""

# Кольори
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📊 Phase 1: Analyzing Existing Modules"
echo "---------------------------------------"

# Знайдемо всі модулі
MODULES_FOUND=0
ROUTES_FOUND=0

echo "Scanning filesystem..."

# Рахуємо page.tsx файли
while IFS= read -r file; do
  MODULES_FOUND=$((MODULES_FOUND + 1))
  route=$(echo "$file" | sed 's|app||' | sed 's|/page.tsx||' | sed 's|\[locale\]|/us|' | sed 's|\[slug\]|*|')
  echo -e "${BLUE}📄${NC} $route"
done < <(find app -name "page.tsx" | grep -v node_modules)

# Рахуємо API routes
echo ""
echo "API Routes:"
while IFS= read -r file; do
  ROUTES_FOUND=$((ROUTES_FOUND + 1))
  route=$(echo "$file" | sed 's|app||' | sed 's|/route.ts||')
  echo -e "${BLUE}🔌${NC} $route"
done < <(find app/api -name "route.ts" 2>/dev/null | grep -v node_modules)

echo ""
echo -e "${GREEN}Found:${NC} $MODULES_FOUND pages, $ROUTES_FOUND API routes"

echo ""
echo "📋 Phase 2: Creating Module Registry"
echo "-------------------------------------"

# Створимо module registry
cat > lib/module-registry.ts << 'TYPESCRIPT'
/**
 * IVYAR Module Registry
 * Central registry of all modules with metadata and permissions
 */

import { Permission } from './access-control/access-control-types';

export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'business' | 'admin' | 'emigrant' | 'logistics' | 'construction';
  status: 'live' | 'pilot' | 'beta' | 'design' | 'dev';
  route: string;
  apiEndpoints?: string[];
  requiredPermissions: Permission[];
  icon?: string;
  version?: string;
}

export const MODULE_REGISTRY: ModuleMetadata[] = [
  // Core Modules
  {
    id: 'hbs',
    name: 'HBS Module',
    description: 'Humanitarian Budget System - AI-powered governance',
    category: 'core',
    status: 'live',
    route: '/us/hbs',
    apiEndpoints: ['/api/hbs', '/api/hbs/autopilot', '/api/hbs/ai'],
    requiredPermissions: [Permission.SYSTEM_VIEW_CONFIG],
    icon: '🏛️',
    version: '3.0'
  },
  {
    id: 'procurement',
    name: 'Procurement Engine',
    description: 'AI-powered procurement and vendor management',
    category: 'core',
    status: 'live',
    route: '/modules/procurement',
    apiEndpoints: ['/api/procurement', '/api/hbs/check/procurement'],
    requiredPermissions: [Permission.PROCUREMENT_VIEW],
    icon: '📋',
    version: '2.1'
  },
  {
    id: 'logistics',
    name: 'Logistics Engine',
    description: 'Supply chain and delivery optimization',
    category: 'logistics',
    status: 'pilot',
    route: '/modules/logistics',
    apiEndpoints: ['/api/hbs/check/logistics'],
    requiredPermissions: [Permission.LOGISTICS_VIEW],
    icon: '🚚',
    version: '1.5'
  },
  {
    id: 'donor-dashboard',
    name: 'Donor Dashboard',
    description: 'Transparency for humanitarian donors',
    category: 'business',
    status: 'design',
    route: '/modules/donor-dashboard',
    apiEndpoints: ['/api/donors', '/api/hbs/check/donor'],
    requiredPermissions: [Permission.ANALYTICS_VIEW],
    icon: '🤝'
  },
  {
    id: 'insurance',
    name: 'Insurance Module',
    description: 'Policy management and claims processing',
    category: 'business',
    status: 'live',
    route: '/modules/insurance',
    requiredPermissions: [Permission.INSURANCE_VIEW_POLICY],
    icon: '🛡️'
  },
  {
    id: 'payments',
    name: 'Payments Module',
    description: 'Secure payment processing',
    category: 'business',
    status: 'live',
    route: '/modules/payments',
    apiEndpoints: ['/api/payments'],
    requiredPermissions: [Permission.PAYMENTS_VIEW],
    icon: '💳'
  },
  {
    id: 'freight',
    name: 'Direct Freight',
    description: 'Freight forwarding and logistics',
    category: 'logistics',
    status: 'live',
    route: '/freight',
    apiEndpoints: ['/api/freight/ai', '/api/freight/documents'],
    requiredPermissions: [Permission.LOGISTICS_VIEW],
    icon: '🚛'
  },
  {
    id: 'reconstruction',
    name: 'Reconstruction Module',
    description: 'Post-conflict reconstruction management',
    category: 'construction',
    status: 'pilot',
    route: '/modules/reconstruction',
    requiredPermissions: [Permission.PROCUREMENT_VIEW],
    icon: '🏗️'
  },
  {
    id: 'construction',
    name: 'Construction Portal',
    description: 'Building permits and inspections',
    category: 'construction',
    status: 'live',
    route: '/construction',
    apiEndpoints: ['/api/construction'],
    requiredPermissions: [Permission.PROCUREMENT_VIEW],
    icon: '🏗️'
  },
  {
    id: 'emigrant',
    name: 'Emigrant Services',
    description: 'Housing, banking, and job assistance',
    category: 'emigrant',
    status: 'live',
    route: '/emigrant',
    requiredPermissions: [Permission.CITIZEN_VIEW_OWN],
    icon: '🌍'
  },
  {
    id: 'trade',
    name: 'Trade Module',
    description: 'International trade management',
    category: 'business',
    status: 'live',
    route: '/modules/trade',
    requiredPermissions: [Permission.BUSINESS_SUBMIT_DOCS],
    icon: '🏪'
  },
  {
    id: 'admin',
    name: 'Admin Dashboard',
    description: 'System administration and governance',
    category: 'admin',
    status: 'live',
    route: '/admin',
    requiredPermissions: [Permission.SYSTEM_VIEW_CONFIG],
    icon: '⚙️'
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Data analytics and reporting',
    category: 'admin',
    status: 'live',
    route: '/analytics',
    requiredPermissions: [Permission.ANALYTICS_VIEW],
    icon: '📊'
  }
];

export function getModuleById(id: string): ModuleMetadata | undefined {
  return MODULE_REGISTRY.find(m => m.id === id);
}

export function getModulesByCategory(category: string): ModuleMetadata[] {
  return MODULE_REGISTRY.filter(m => m.category === category);
}

export function getModulesByStatus(status: string): ModuleMetadata[] {
  return MODULE_REGISTRY.filter(m => m.status === status);
}

export function getAllModules(): ModuleMetadata[] {
  return MODULE_REGISTRY;
}
TYPESCRIPT

echo -e "${GREEN}✓${NC} Created lib/module-registry.ts"

echo ""
echo "🔐 Phase 3: Creating Unified Module API"
echo "----------------------------------------"

# Створимо unified API для всіх модулів
mkdir -p app/api/modules

cat > app/api/modules/route.ts << 'TYPESCRIPT'
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
TYPESCRIPT

echo -e "${GREEN}✓${NC} Created app/api/modules/route.ts"

# API для окремого модуля
cat > app/api/modules/[id]/route.ts << 'TYPESCRIPT'
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
TYPESCRIPT

echo -e "${GREEN}✓${NC} Created app/api/modules/[id]/route.ts"

echo ""
echo "📊 Phase 4: Creating Integration Dashboard"
echo "-------------------------------------------"

# Dashboard component
cat > components/ModuleDashboard.tsx << 'TYPESCRIPT'
'use client';

import { useState, useEffect } from 'react';

interface Module {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  route: string;
  icon: string;
  version?: string;
  apiEndpoints: number;
}

export default function ModuleDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setModules(data.modules);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredModules = filter === 'all' 
    ? modules 
    : modules.filter(m => m.category === filter);

  const categories = ['all', 'core', 'business', 'admin', 'emigrant', 'logistics', 'construction'];

  if (loading) {
    return <div className="p-8">Loading modules...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">IVYAR Module Dashboard</h1>
        <p className="text-gray-400 mb-8">Integrated access to all {modules.length} modules</p>

        {/* Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                filter === cat 
                  ? 'bg-blue-600' 
                  : 'bg-[#1a1f3a] hover:bg-[#252b4a]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1f3a] p-6 rounded-lg">
            <div className="text-3xl font-bold">{modules.length}</div>
            <div className="text-gray-400">Total Modules</div>
          </div>
          <div className="bg-[#1a1f3a] p-6 rounded-lg">
            <div className="text-3xl font-bold text-green-500">
              {modules.filter(m => m.status === 'live').length}
            </div>
            <div className="text-gray-400">Live</div>
          </div>
          <div className="bg-[#1a1f3a] p-6 rounded-lg">
            <div className="text-3xl font-bold text-orange-500">
              {modules.filter(m => m.status === 'pilot').length}
            </div>
            <div className="text-gray-400">Pilot</div>
          </div>
          <div className="bg-[#1a1f3a] p-6 rounded-lg">
            <div className="text-3xl font-bold">
              {modules.reduce((sum, m) => sum + m.apiEndpoints, 0)}
            </div>
            <div className="text-gray-400">API Endpoints</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            
              key={module.id}
              href={module.route}
              className="bg-[#1a1f3a] p-6 rounded-lg border border-[#2a2f4a] hover:border-blue-500 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{module.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  module.status === 'live' ? 'bg-green-500/20 text-green-500' :
                  module.status === 'pilot' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {module.status.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{module.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{module.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{module.category}</span>
                {module.version && <span>v{module.version}</span>}
              </div>
              
              {module.apiEndpoints > 0 && (
                <div className="mt-4 pt-4 border-t border-[#2a2f4a]">
                  <span className="text-xs text-gray-500">
                    {module.apiEndpoints} API endpoints
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
TYPESCRIPT

echo -e "${GREEN}✓${NC} Created components/ModuleDashboard.tsx"

# Dashboard page
mkdir -p app/dashboard
cat > app/dashboard/page.tsx << 'TYPESCRIPT'
import ModuleDashboard from '@/components/ModuleDashboard';

export default function DashboardPage() {
  return <ModuleDashboard />;
}
TYPESCRIPT

echo -e "${GREEN}✓${NC} Created app/dashboard/page.tsx"

echo ""
echo "✅ Phase 5: Integration Summary"
echo "================================"
echo ""
echo -e "${GREEN}Completed:${NC}"
echo "  ✓ Module Registry (13 modules)"
echo "  ✓ Unified Module API"
echo "  ✓ Individual Module API"
echo "  ✓ Integration Dashboard"
echo "  ✓ Access Control Integration"
echo ""
echo -e "${BLUE}Access Dashboard:${NC}"
echo "  http://localhost:3000/dashboard"
echo ""
echo -e "${BLUE}API Endpoints:${NC}"
echo "  GET /api/modules          - List all modules"
echo "  GET /api/modules/[id]     - Get module details"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. npm run dev"
echo "  2. Open http://localhost:3000/dashboard"
echo "  3. Test module integration"
echo ""
