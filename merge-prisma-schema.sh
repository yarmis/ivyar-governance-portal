#!/bin/bash

echo "🔄 Merging Infrastructure & Logistics models into main schema..."

# Check if backup exists
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Error: prisma/schema.prisma not found!"
    exit 1
fi

# Add PostGIS extension if not present
if ! grep -q "postgis" prisma/schema.prisma; then
    echo "📦 Adding PostGIS extension to datasource..."
    
    # Find the datasource block and add extensions
    sed -i.bak '/datasource db {/,/}/ {
        /provider/a\
  extensions = [postgis]
    }' prisma/schema.prisma
fi

# Append new models from infrastructure-logistics-models.prisma
echo ""
echo "📝 Appending new models..."

cat >> prisma/schema.prisma << 'EOF'

// ============================================================================
// INFRASTRUCTURE & LOGISTICS HUB MODELS
// Added: $(date)
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

EOF

echo "✅ Models merged successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. npx prisma format"
echo "2. npx prisma validate"
echo "3. npx prisma migrate dev --name add-infrastructure-logistics"

