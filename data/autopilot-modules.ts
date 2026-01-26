export interface AutopilotModuleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'active' | 'training' | 'offline';
  accuracy: number;
  decisionsToday: number;
  capabilities: string[];
}

export const autopilotModules: AutopilotModuleDefinition[] = [
  {
    id: 'materials',
    name: 'Materials Compliance AI',
    description: 'Automated verification of construction materials against safety standards and building codes',
    icon: 'Hammer',
    category: 'Governance & Oversight',
    status: 'active',
    accuracy: 96.8,
    decisionsToday: 487,
    capabilities: [
      'Real-time materials verification',
      'Building code compliance checking',
      'Safety standard validation',
      'Supplier certification tracking'
    ]
  },
  {
    id: 'zoning',
    name: 'Zoning Intelligence AI',
    description: 'Smart zoning analysis and compliance verification for land development',
    icon: 'Map',
    category: 'Governance & Oversight',
    status: 'active',
    accuracy: 94.2,
    decisionsToday: 312,
    capabilities: [
      'Zoning code interpretation',
      'Land use compliance',
      'Variance requirement detection',
      'Development feasibility analysis'
    ]
  },
  {
    id: 'violations',
    name: 'Violations Detection AI',
    description: 'Automated detection and classification of building code violations',
    icon: 'AlertTriangle',
    category: 'Governance & Oversight',
    status: 'active',
    accuracy: 97.3,
    decisionsToday: 523,
    capabilities: [
      'Violation pattern recognition',
      'Severity classification',
      'Automated notification system',
      'Compliance timeline tracking'
    ]
  },
  {
    id: 'donors',
    name: 'Donor Matching AI',
    description: 'Intelligent matching of development projects with donor priorities and funding',
    icon: 'Users',
    category: 'Governance & Oversight',
    status: 'active',
    accuracy: 93.7,
    decisionsToday: 156,
    capabilities: [
      'Priority alignment scoring',
      'Funding opportunity detection',
      'Impact prediction modeling',
      'Donor requirement matching'
    ]
  },
  {
    id: 'us-construction',
    name: 'US Construction AI',
    description: 'Automated processing and approval of US construction permits and documentation',
    icon: 'Building2',
    category: 'Governance & Oversight',
    status: 'active',
    accuracy: 95.8,
    decisionsToday: 392,
    capabilities: [
      'Permit application processing',
      'Document completeness verification',
      'Code compliance checking',
      'Timeline estimation'
    ]
  },
  {
    id: 'geo',
    name: 'Geospatial Analysis AI',
    description: 'Advanced geospatial intelligence for land development and infrastructure planning',
    icon: 'Globe',
    category: 'Operations & Logistics',
    status: 'active',
    accuracy: 96.1,
    decisionsToday: 278,
    capabilities: [
      'Terrain analysis',
      'Infrastructure feasibility',
      'Environmental impact assessment',
      'Optimal site selection'
    ]
  },
  {
    id: 'procurement',
    name: 'Procurement AI',
    description: 'Intelligent vendor selection and procurement optimization',
    icon: 'ShoppingCart',
    category: 'Finance & Procurement',
    status: 'active',
    accuracy: 94.9,
    decisionsToday: 445,
    capabilities: [
      'Vendor scoring and ranking',
      'Price anomaly detection',
      'Contract compliance',
      'Risk assessment'
    ]
  },
  {
    id: 'freight',
    name: 'Freight Optimization AI',
    description: 'Smart logistics and freight routing for construction materials',
    icon: 'Truck',
    category: 'Operations & Logistics',
    status: 'active',
    accuracy: 97.1,
    decisionsToday: 634,
    capabilities: [
      'Route optimization',
      'Cost minimization',
      'Delivery scheduling',
      'Carrier selection'
    ]
  },
  {
    id: 'routing',
    name: 'Routing Intelligence AI',
    description: 'Advanced routing algorithms for logistics and delivery optimization',
    icon: 'Navigation',
    category: 'Operations & Logistics',
    status: 'active',
    accuracy: 95.4,
    decisionsToday: 521,
    capabilities: [
      'Multi-stop route planning',
      'Traffic pattern analysis',
      'Time window optimization',
      'Fuel efficiency maximization'
    ]
  },
  {
    id: 'hbs',
    name: 'Budget Forecasting AI',
    description: 'Predictive budget analysis and financial planning for infrastructure projects',
    icon: 'TrendingUp',
    category: 'Finance & Procurement',
    status: 'active',
    accuracy: 93.2,
    decisionsToday: 348,
    capabilities: [
      'Cost forecasting',
      'Budget variance analysis',
      'Resource allocation optimization',
      'Financial risk modeling'
    ]
  }
];

export function getAutopilotByCategory() {
  const categories: Record<string, AutopilotModuleDefinition[]> = {};
  
  autopilotModules.forEach(module => {
    if (!categories[module.category]) {
      categories[module.category] = [];
    }
    categories[module.category].push(module);
  });
  
  return categories;
}
