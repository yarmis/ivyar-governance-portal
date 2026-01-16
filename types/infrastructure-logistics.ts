/**
 * IVYAR INFRASTRUCTURE & LOGISTICS HUB
 * TypeScript Type Definitions
 * 
 * @module types/infrastructure-logistics
 * @version 1.0.0
 * @description Comprehensive type system for infrastructure and logistics governance
 */

// ============================================================================
// SHARED TYPES
// ============================================================================

export type UUID = string;
export type ISODate = string; // ISO 8601 format
export type GeoJSON = {
  type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  coordinates: number[] | number[][] | number[][][];
  properties?: Record<string, any>;
};

export type Currency = 'USD' | 'EUR' | 'UAH' | 'GBP';
export type Country = 'UA' | 'US' | 'PL' | 'RO' | 'MD'; // Extendable

export interface Money {
  amount: number;
  currency: Currency;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country: Country;
  postalCode?: string;
}

export interface AuditInfo {
  createdAt: ISODate;
  createdBy: UUID;
  updatedAt: ISODate;
  updatedBy: UUID;
  deletedAt?: ISODate;
  deletedBy?: UUID;
}

export interface Attachment {
  id: UUID;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  hash: string;
  uploadedAt: ISODate;
  uploadedBy: UUID;
}

// ============================================================================
// RISK & ANOMALY TYPES
// ============================================================================

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'detected' | 'investigating' | 'mitigated' | 'resolved' | 'false-positive';

export interface RiskFactor {
  type: string;
  score: number;
  description: string;
  evidence?: string[];
  detectedAt: ISODate;
}

export interface RiskScore {
  id: UUID;
  entityType: 'asset' | 'project' | 'cargo' | 'shipment' | 'route' | 'supplier';
  entityId: UUID;
  score: number;
  severity: RiskSeverity;
  status: RiskStatus;
  factors: RiskFactor[];
  assignedTo?: UUID;
  notes?: string;
}

// ============================================================================
// INFRASTRUCTURE DOMAIN
// ============================================================================

export type AssetType = 
  | 'road' | 'bridge' | 'tunnel' | 'railway' | 'airport' | 'port'
  | 'power-plant' | 'substation' | 'water-treatment' | 'wastewater-plant'
  | 'hospital' | 'school' | 'government-building' | 'warehouse' | 'other';

export type AssetStatus = 
  | 'operational' | 'under-construction' | 'damaged' | 'under-repair' | 'decommissioned';

export interface Asset {
  id: UUID;
  type: AssetType;
  name: string;
  description?: string;
  status: AssetStatus;
  location: Location;
  geometry: GeoJSON;
  ownerId: UUID;
  operatorId?: UUID;
  specifications: Record<string, any>;
  capacity?: { value: number; unit: string };
  constructionCost?: Money;
  estimatedValue?: Money;
  projectIds: UUID[];
  parentAssetId?: UUID;
  attachments: Attachment[];
  tags: string[];
  metadata: Record<string, any>;
}

export type ProjectPhase = 
  | 'planning' | 'design' | 'procurement' | 'construction'
  | 'inspection' | 'handover' | 'completed' | 'on-hold' | 'cancelled';

export interface Project {
  id: UUID;
  name: string;
  description: string;
  phase: ProjectPhase;
  startDate: ISODate;
  plannedEndDate: ISODate;
  actualEndDate?: ISODate;
  budget: Money;
  spent: Money;
  committed: Money;
  donorIds: UUID[];
  implementerId: UUID;
  contractorIds: UUID[];
  contractId?: UUID;
  progressPercentage: number;
  milestones: Milestone[];
  riskScoreId?: UUID;
  attachments: Attachment[];
  tags: string[];
  metadata: Record<string, any>;
}

export interface Milestone {
  id: UUID;
  projectId: UUID;
  name: string;
  description?: string;
  plannedDate: ISODate;
  actualDate?: ISODate;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  deliverables: string[];
  completionPercentage: number;
}

// ============================================================================
// LOGISTICS DOMAIN
// ============================================================================

export type CargoType = 
  | 'construction-materials' | 'equipment' | 'medical-supplies'
  | 'food' | 'humanitarian-aid' | 'machinery' | 'other';

export type ShipmentStatus = 
  | 'planned' | 'in-transit' | 'customs-clearance' | 'delivered' | 'delayed' | 'cancelled';

export interface Cargo {
  id: UUID;
  type: CargoType;
  description: string;
  quantity: { value: number; unit: string };
  declaredValue: Money;
  hsCode?: string;
  dangerous: boolean;
  temperatureControlled: boolean;
  consignorId: UUID;
  consigneeId: UUID;
  projectId?: UUID;
  assetId?: UUID;
  documents: {
    invoice?: UUID;
    packingList?: UUID;
    certificate?: UUID;
    insurance?: UUID;
  };
  metadata: Record<string, any>;
}

export interface Shipment {
  id: UUID;
  status: ShipmentStatus;
  cargoIds: UUID[];
  routeId: UUID;
  currentLegId?: UUID;
  plannedDeparture: ISODate;
  actualDeparture?: ISODate;
  estimatedArrival: ISODate;
  actualArrival?: ISODate;
  currentLocation?: Location;
  lastUpdate: ISODate;
  carrierId: UUID;
  vehicleId?: string;
  billOfLading?: UUID;
  customsDeclarations: UUID[];
  events: ShipmentEvent[];
  riskScoreId?: UUID;
  metadata: Record<string, any>;
}

export interface ShipmentEvent {
  id: string;
  timestamp: ISODate;
  type: 'departure' | 'arrival' | 'customs-entry' | 'customs-exit' | 'delay' | 'incident' | 'location-update';
  location?: Location;
  description: string;
  metadata?: Record<string, any>;
}

export type TransportMode = 'road' | 'rail' | 'sea' | 'air' | 'multimodal';

export interface Route {
  id: UUID;
  name: string;
  mode: TransportMode;
  origin: Location;
  destination: Location;
  geometry: GeoJSON;
  legs: RouteLeg[];
  totalDistance: { value: number; unit: 'km' | 'mi' };
  estimatedDuration: number;
  hubIds: UUID[];
  shipmentIds: UUID[];
  preferredCarriers?: UUID[];
  restrictions?: string[];
  metadata: Record<string, any>;
}

export interface RouteLeg {
  id: string;
  sequence: number;
  mode: TransportMode;
  from: Location;
  to: Location;
  distance: { value: number; unit: 'km' | 'mi' };
  estimatedDuration: number;
  geometry: GeoJSON;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: ISODate;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: ISODate;
}

export interface DashboardMetrics {
  infrastructure: {
    totalAssets: number;
    assetsByType: Record<string, number>;
    assetsByStatus: Record<string, number>;
    totalProjects: number;
    projectsByPhase: Record<string, number>;
    totalBudget: Money;
    totalSpent: Money;
    averageProgress: number;
    upcomingInspections: number;
  };
  logistics: {
    totalShipments: number;
    shipmentsInTransit: number;
    shipmentsDelayed: number;
    totalCargo: { value: number; unit: string };
    activeRoutes: number;
  };
  risks: {
    totalRisks: number;
    risksBySeverity: Record<RiskSeverity, number>;
    unresolvedCritical: number;
  };
}
