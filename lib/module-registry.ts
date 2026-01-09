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
