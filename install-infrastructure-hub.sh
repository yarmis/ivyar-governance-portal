#!/bin/bash

# ============================================================================
# IVYAR Infrastructure & Logistics Hub - Installation Script
# Version: 1.0.0
# Date: January 16, 2026
# ============================================================================

set -e  # Exit on error

echo "🏗️  IVYAR Infrastructure & Logistics Hub Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from your IVYAR repo root directory"
    exit 1
fi

echo "✅ Detected IVYAR project"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p types
mkdir -p docs/modules
mkdir -p app/api/v1/infrastructure/assets
mkdir -p app/infrastructure-hub
mkdir -p prisma/backups

echo "✅ Directories created"
echo ""

# Backup existing Prisma schema
if [ -f "prisma/schema.prisma" ]; then
    echo "💾 Backing up existing Prisma schema..."
    cp prisma/schema.prisma "prisma/backups/schema.backup.$(date +%Y%m%d-%H%M%S).prisma"
    echo "✅ Backup created"
fi

echo ""
echo "📝 Creating files..."
echo ""

# ============================================================================
# FILE 1: TypeScript Types
# ============================================================================

echo "Creating types/infrastructure-logistics.ts..."

cat > types/infrastructure-logistics.ts << 'TYPESCRIPT_TYPES_EOF'
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
TYPESCRIPT_TYPES_EOF

echo "✅ types/infrastructure-logistics.ts created"

# ============================================================================
# FILE 2: README Documentation
# ============================================================================

echo "Creating docs/modules/infrastructure-logistics-hub.md..."

cat > docs/modules/infrastructure-logistics-hub.md << 'README_EOF'
# 🏗️ Infrastructure & Logistics Hub

**Version:** 1.0.0  
**Status:** Development  
**Module Type:** Core Vertical

## Overview

Unified digital layer for infrastructure asset management and logistics tracking.

## Features

### Infrastructure
- Asset Registry (roads, bridges, hospitals, etc.)
- Project & Works Tracking
- Inspections & Compliance
- Risk & Anomaly Detection

### Logistics
- Cargo & Shipment Registry
- Routes & Transport Management
- Hubs, Ports & Warehouses
- Customs & Documentation
- Real-time Tracking

## Installation

See main README for setup instructions.

## API Endpoints

### Infrastructure
- `GET /api/v1/infrastructure/assets` - List assets
- `POST /api/v1/infrastructure/assets` - Create asset
- `GET /api/v1/infrastructure/projects` - List projects

### Logistics
- `GET /api/v1/logistics/shipments` - List shipments
- `POST /api/v1/logistics/cargo` - Register cargo
- `GET /api/v1/logistics/routes` - List routes

## Database Schema

Uses PostgreSQL with PostGIS extension for geospatial data.

Key tables:
- `assets` - Infrastructure assets
- `projects` - Reconstruction projects  
- `shipments` - Cargo shipments
- `routes` - Transport routes

## UI Components

- Infrastructure Dashboard (`/infrastructure-hub`)
- Logistics Dashboard (`/logistics-hub`)

## Pilot Scenarios

See architecture documentation for pilot details.

---

**Built in USA 🇺🇸 • Inspired by Ukraine 💙💛 • For the World 🌍**
README_EOF

echo "✅ docs/modules/infrastructure-logistics-hub.md created"

# ============================================================================
# FILE 3: Prisma Schema Addition
# ============================================================================

echo "Creating prisma/infrastructure-logistics-models.prisma (for manual merge)..."

cat > prisma/infrastructure-logistics-models.prisma << 'PRISMA_EOF'
// ============================================================================
// INFRASTRUCTURE & LOGISTICS HUB - PRISMA MODELS
// 
// IMPORTANT: These models need to be MANUALLY MERGED into your main schema.prisma
// DO NOT replace your existing schema.prisma with this file!
// 
// Steps to merge:
// 1. Open prisma/schema.prisma
// 2. Copy models below one-by-one
// 3. Check for naming conflicts
// 4. Run: npx prisma format
// 5. Run: npx prisma validate
// 6. Run: npx prisma migrate dev --name add-infrastructure-logistics
// ============================================================================

// Add this to datasource if not present:
// extensions = [postgis]

// ============================================================================
// INFRASTRUCTURE MODELS
// ============================================================================

model Asset {
  id          String      @id @default(uuid())
  type        AssetType
  name        String
  description String?
  status      AssetStatus
  
  location    Json
  geometry    Unsupported("geometry(GEOMETRY, 4326)")
  
  ownerId    String
  operatorId String?
  
  specifications Json
  capacity       Json?
  
  constructionCost Json?
  estimatedValue   Json?
  
  parentAssetId String?
  parentAsset   Asset?  @relation("AssetHierarchy", fields: [parentAssetId], references: [id])
  childAssets   Asset[] @relation("AssetHierarchy")
  
  tags     String[]
  metadata Json
  
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  deletedAt DateTime?
  deletedBy String?
  
  projects             ProjectAsset[]
  cargosDestination    Cargo[]        @relation("CargoDestination")
  shipmentsDestination Shipment[]     @relation("ShipmentDestination")
  
  @@index([type])
  @@index([status])
  @@index([ownerId])
  @@map("assets")
}

enum AssetType {
  ROAD
  BRIDGE
  TUNNEL
  RAILWAY
  AIRPORT
  PORT
  POWER_PLANT
  SUBSTATION
  WATER_TREATMENT
  HOSPITAL
  SCHOOL
  WAREHOUSE
  OTHER
}

enum AssetStatus {
  OPERATIONAL
  UNDER_CONSTRUCTION
  DAMAGED
  UNDER_REPAIR
  DECOMMISSIONED
}

model Project {
  id          String       @id @default(uuid())
  name        String
  description String
  phase       ProjectPhase
  
  startDate       DateTime
  plannedEndDate  DateTime
  actualEndDate   DateTime?
  
  budget    Json
  spent     Json
  committed Json
  
  donorIds      String[]
  implementerId String
  contractorIds String[]
  
  progressPercentage Float
  
  tags     String[]
  metadata Json
  
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  deletedAt DateTime?
  
  assets    ProjectAsset[]
  cargos    Cargo[]
  shipments Shipment[]
  
  @@index([phase])
  @@map("projects")
}

model ProjectAsset {
  projectId String
  assetId   String
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  asset   Asset   @relation(fields: [assetId], references: [id], onDelete: Cascade)
  
  assignedAt DateTime @default(now())
  
  @@id([projectId, assetId])
  @@map("project_assets")
}

enum ProjectPhase {
  PLANNING
  DESIGN
  PROCUREMENT
  CONSTRUCTION
  INSPECTION
  HANDOVER
  COMPLETED
  ON_HOLD
  CANCELLED
}

// ============================================================================
// LOGISTICS MODELS
// ============================================================================

model Cargo {
  id          String    @id @default(uuid())
  type        CargoType
  description String
  
  quantity      Json
  declaredValue Json
  
  hsCode                String?
  dangerous             Boolean @default(false)
  temperatureControlled Boolean @default(false)
  
  consignorId String
  consigneeId String
  
  projectId String?
  assetId   String?
  
  metadata Json
  
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  
  project   Project?        @relation(fields: [projectId], references: [id])
  asset     Asset?          @relation("CargoDestination", fields: [assetId], references: [id])
  shipments ShipmentCargo[]
  
  @@index([type])
  @@index([projectId])
  @@map("cargos")
}

enum CargoType {
  CONSTRUCTION_MATERIALS
  EQUIPMENT
  MEDICAL_SUPPLIES
  FOOD
  HUMANITARIAN_AID
  MACHINERY
  OTHER
}

model Shipment {
  id     String          @id @default(uuid())
  status ShipmentStatus
  
  routeId      String
  currentLegId String?
  
  plannedDeparture DateTime
  actualDeparture  DateTime?
  estimatedArrival DateTime
  actualArrival    DateTime?
  
  currentLocation Json?
  lastUpdate      DateTime @default(now())
  
  carrierId String
  vehicleId String?
  
  events   Json
  metadata Json
  
  projectId String?
  assetId   String?
  
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  
  route    Route           @relation(fields: [routeId], references: [id])
  project  Project?        @relation(fields: [projectId], references: [id])
  asset    Asset?          @relation("ShipmentDestination", fields: [assetId], references: [id])
  cargos   ShipmentCargo[]
  
  @@index([status])
  @@index([routeId])
  @@map("shipments")
}

model ShipmentCargo {
  shipmentId String
  cargoId    String
  
  shipment Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  cargo    Cargo    @relation(fields: [cargoId], references: [id], onDelete: Cascade)
  
  assignedAt DateTime @default(now())
  
  @@id([shipmentId, cargoId])
  @@map("shipment_cargos")
}

enum ShipmentStatus {
  PLANNED
  IN_TRANSIT
  CUSTOMS_CLEARANCE
  DELIVERED
  DELAYED
  CANCELLED
}

model Route {
  id   String        @id @default(uuid())
  name String
  mode TransportMode
  
  origin      Json
  destination Json
  geometry    Unsupported("geometry(LINESTRING, 4326)")
  
  legs              Json
  totalDistance     Json
  estimatedDuration Float
  
  preferredCarriers String[]
  restrictions      String[]
  metadata          Json
  
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  
  shipments Shipment[]
  
  @@index([mode])
  @@map("routes")
}

enum TransportMode {
  ROAD
  RAIL
  SEA
  AIR
  MULTIMODAL
}

// ============================================================================
// RISK MODEL
// ============================================================================

model RiskScore {
  id String @id @default(uuid())
  
  entityType RiskEntityType
  entityId   String
  score      Float
  severity   RiskSeverity
  status     RiskStatus
  factors    Json
  assignedTo String?
  notes      String?
  
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  
  @@index([entityType, entityId])
  @@index([severity])
  @@map("risk_scores")
}

enum RiskEntityType {
  ASSET
  PROJECT
  CARGO
  SHIPMENT
  ROUTE
}

enum RiskSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RiskStatus {
  DETECTED
  INVESTIGATING
  MITIGATED
  RESOLVED
  FALSE_POSITIVE
}
PRISMA_EOF

echo "✅ prisma/infrastructure-logistics-models.prisma created"
echo "⚠️  IMPORTANT: Manually merge this into your main schema.prisma!"

# ============================================================================
# FILE 4: Next.js Page Component
# ============================================================================

echo "Creating app/infrastructure-hub/page.tsx..."

cat > app/infrastructure-hub/page.tsx << 'NEXTJS_PAGE_EOF'
/**
 * Infrastructure Hub Dashboard Page
 */

'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export default function InfrastructureHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🏗️ Infrastructure Hub
          </h1>
          <p className="text-slate-400">
            Real-time infrastructure monitoring and governance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Assets" value="0" icon="🏛️" />
          <StatCard title="Active Projects" value="0" icon="🚧" />
          <StatCard title="Inspections Due" value="0" icon="📋" />
          <StatCard title="Critical Risks" value="0" icon="⚠️" />
        </div>

        {/* Main Content */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-8">
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-semibold mb-2">
              Infrastructure Hub Coming Soon
            </h2>
            <p className="text-slate-400 mb-6">
              Asset registry, project tracking, and inspections module
            </p>
            <div className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              Module in development
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <FeatureCard
              title="Asset Registry"
              description="Track infrastructure assets with geospatial data"
              icon="🗺️"
            />
            <FeatureCard
              title="Project Tracking"
              description="Monitor reconstruction projects and budgets"
              icon="📊"
            />
            <FeatureCard
              title="Risk Detection"
              description="AI-powered anomaly and corruption detection"
              icon="🔍"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
NEXTJS_PAGE_EOF

echo "✅ app/infrastructure-hub/page.tsx created"

# ============================================================================
# COMPLETION
# ============================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Files created:"
echo "  ✅ types/infrastructure-logistics.ts"
echo "  ✅ docs/modules/infrastructure-logistics-hub.md"
echo "  ⚠️  prisma/infrastructure-logistics-models.prisma (needs manual merge)"
echo "  ✅ app/infrastructure-hub/page.tsx"
echo ""
echo "🔧 Next steps:"
echo ""
echo "1. Merge Prisma models:"
echo "   - Open prisma/infrastructure-logistics-models.prisma"
echo "   - Copy models into prisma/schema.prisma"
echo "   - Run: npx prisma format"
echo "   - Run: npx prisma validate"
echo ""
echo "2. Install PostGIS extension:"
echo "   psql -d your_database -c \"CREATE EXTENSION IF NOT EXISTS postgis;\""
echo ""
echo "3. Run database migration:"
echo "   npx prisma migrate dev --name add-infrastructure-logistics"
echo ""
echo "4. Generate Prisma client:"
echo "   npx prisma generate"
echo ""
echo "5. Test the new page:"
echo "   npm run dev"
echo "   Open: http://localhost:3000/infrastructure-hub"
echo ""
echo "6. Commit changes:"
echo "   git add ."
echo "   git commit -m \"feat: Add Infrastructure & Logistics Hub module\""
echo "   git push origin feature/infrastructure-logistics-hub"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🇺🇸💙💛 Built in USA • Inspired by Ukraine • For the World"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Слава Україні! 💙💛"
echo ""
