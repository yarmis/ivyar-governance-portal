-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('client', 'attorney', 'employer', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'blocked', 'removed');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('ROAD', 'BRIDGE', 'TUNNEL', 'RAILWAY', 'AIRPORT', 'PORT', 'POWER_PLANT', 'SUBSTATION', 'WATER_TREATMENT', 'HOSPITAL', 'SCHOOL', 'WAREHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('OPERATIONAL', 'UNDER_CONSTRUCTION', 'DAMAGED', 'UNDER_REPAIR', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "ProjectPhase" AS ENUM ('PLANNING', 'DESIGN', 'PROCUREMENT', 'CONSTRUCTION', 'INSPECTION', 'HANDOVER', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CargoType" AS ENUM ('CONSTRUCTION_MATERIALS', 'EQUIPMENT', 'MEDICAL_SUPPLIES', 'FOOD', 'HUMANITARIAN_AID', 'MACHINERY', 'OTHER');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PLANNED', 'IN_TRANSIT', 'CUSTOMS_CLEARANCE', 'DELIVERED', 'DELAYED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('ROAD', 'RAIL', 'SEA', 'AIR', 'MULTIMODAL');

-- CreateEnum
CREATE TYPE "RiskEntityType" AS ENUM ('ASSET', 'PROJECT', 'CARGO', 'SHIPMENT', 'ROUTE');

-- CreateEnum
CREATE TYPE "RiskSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('DETECTED', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'client',
    "category" TEXT NOT NULL DEFAULT 'Worker',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "first_name" TEXT,
    "last_name" TEXT,
    "organization" TEXT,
    "violations" INTEGER NOT NULL DEFAULT 0,
    "risk_score" INTEGER NOT NULL DEFAULT 0,
    "inactive_days" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_audit" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_alerts" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "email" TEXT,
    "ip_address" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "stage" TEXT,
    "description" TEXT,
    "total_delay_days" INTEGER NOT NULL DEFAULT 0,
    "breach_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actor" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rollout_strategy" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autopilot_decisions" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "recommended_action" TEXT NOT NULL,
    "risk_level" TEXT NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT,
    "reasoning_trace" JSONB,
    "safety_check" JSONB,
    "human_approval_required" BOOLEAN NOT NULL DEFAULT false,
    "country_code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "processing_time_ms" INTEGER NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopilot_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autopilot_comparisons" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "v7_decision_id" TEXT NOT NULL,
    "v8_decision_id" TEXT NOT NULL,
    "action_changed" BOOLEAN NOT NULL,
    "risk_score_delta" DOUBLE PRECISION NOT NULL,
    "confidence_delta" DOUBLE PRECISION NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopilot_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circuit_breaker_state" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "last_failure_at" TIMESTAMP(3),
    "last_state_change" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "circuit_breaker_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "AssetStatus" NOT NULL,
    "location" JSONB NOT NULL,
    "ownerId" TEXT NOT NULL,
    "operatorId" TEXT,
    "specifications" JSONB NOT NULL,
    "capacity" JSONB,
    "constructionCost" JSONB,
    "estimatedValue" JSONB,
    "parentAssetId" TEXT,
    "tags" TEXT[],
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phase" "ProjectPhase" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualEndDate" TIMESTAMP(3),
    "budget" JSONB NOT NULL,
    "spent" JSONB NOT NULL,
    "committed" JSONB NOT NULL,
    "donorIds" TEXT[],
    "implementerId" TEXT NOT NULL,
    "contractorIds" TEXT[],
    "progressPercentage" DOUBLE PRECISION NOT NULL,
    "tags" TEXT[],
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assets" (
    "projectId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_assets_pkey" PRIMARY KEY ("projectId","assetId")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" TEXT NOT NULL,
    "type" "CargoType" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" JSONB NOT NULL,
    "declaredValue" JSONB NOT NULL,
    "hsCode" TEXT,
    "dangerous" BOOLEAN NOT NULL DEFAULT false,
    "temperatureControlled" BOOLEAN NOT NULL DEFAULT false,
    "consignorId" TEXT NOT NULL,
    "consigneeId" TEXT NOT NULL,
    "projectId" TEXT,
    "assetId" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "routeId" TEXT NOT NULL,
    "currentLegId" TEXT,
    "plannedDeparture" TIMESTAMP(3) NOT NULL,
    "actualDeparture" TIMESTAMP(3),
    "estimatedArrival" TIMESTAMP(3) NOT NULL,
    "actualArrival" TIMESTAMP(3),
    "currentLocation" JSONB,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carrierId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "events" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "projectId" TEXT,
    "assetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_cargos" (
    "shipmentId" TEXT NOT NULL,
    "cargoId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_cargos_pkey" PRIMARY KEY ("shipmentId","cargoId")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mode" "TransportMode" NOT NULL,
    "origin" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "legs" JSONB NOT NULL,
    "totalDistance" JSONB NOT NULL,
    "estimatedDuration" DOUBLE PRECISION NOT NULL,
    "preferredCarriers" TEXT[],
    "restrictions" TEXT[],
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_scores" (
    "id" TEXT NOT NULL,
    "entityType" "RiskEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "severity" "RiskSeverity" NOT NULL,
    "status" "RiskStatus" NOT NULL,
    "factors" JSONB NOT NULL,
    "assignedTo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "risk_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "login_audit_email_idx" ON "login_audit"("email");

-- CreateIndex
CREATE INDEX "login_audit_timestamp_idx" ON "login_audit"("timestamp");

-- CreateIndex
CREATE INDEX "security_alerts_type_idx" ON "security_alerts"("type");

-- CreateIndex
CREATE INDEX "security_alerts_status_idx" ON "security_alerts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "cases_case_number_key" ON "cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_case_number_idx" ON "cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_user_id_idx" ON "cases"("user_id");

-- CreateIndex
CREATE INDEX "timeline_events_case_id_idx" ON "timeline_events"("case_id");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "feature_flags_key_idx" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "autopilot_decisions_request_id_key" ON "autopilot_decisions"("request_id");

-- CreateIndex
CREATE INDEX "autopilot_decisions_version_idx" ON "autopilot_decisions"("version");

-- CreateIndex
CREATE INDEX "autopilot_decisions_country_code_idx" ON "autopilot_decisions"("country_code");

-- CreateIndex
CREATE INDEX "autopilot_decisions_action_type_idx" ON "autopilot_decisions"("action_type");

-- CreateIndex
CREATE INDEX "autopilot_decisions_created_at_idx" ON "autopilot_decisions"("created_at");

-- CreateIndex
CREATE INDEX "autopilot_comparisons_similarity_idx" ON "autopilot_comparisons"("similarity");

-- CreateIndex
CREATE INDEX "autopilot_comparisons_created_at_idx" ON "autopilot_comparisons"("created_at");

-- CreateIndex
CREATE INDEX "assets_type_idx" ON "assets"("type");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE INDEX "assets_ownerId_idx" ON "assets"("ownerId");

-- CreateIndex
CREATE INDEX "projects_phase_idx" ON "projects"("phase");

-- CreateIndex
CREATE INDEX "cargos_type_idx" ON "cargos"("type");

-- CreateIndex
CREATE INDEX "cargos_projectId_idx" ON "cargos"("projectId");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_routeId_idx" ON "shipments"("routeId");

-- CreateIndex
CREATE INDEX "routes_mode_idx" ON "routes"("mode");

-- CreateIndex
CREATE INDEX "risk_scores_entityType_entityId_idx" ON "risk_scores"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "risk_scores_severity_idx" ON "risk_scores"("severity");

-- AddForeignKey
ALTER TABLE "login_audit" ADD CONSTRAINT "login_audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_parentAssetId_fkey" FOREIGN KEY ("parentAssetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assets" ADD CONSTRAINT "project_assets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assets" ADD CONSTRAINT "project_assets_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "cargos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "cargos_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_cargos" ADD CONSTRAINT "shipment_cargos_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_cargos" ADD CONSTRAINT "shipment_cargos_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
