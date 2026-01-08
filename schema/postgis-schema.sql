-- ============================================================================
-- GEO UTILITIES PLATFORM - POSTGIS DATABASE SCHEMA
-- Version: 1.0.0
-- Compatible with: PostgreSQL 14+ with PostGIS 3.4+
-- ============================================================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- ============================================================================
-- 1. UTILITIES (UA + US)
-- ============================================================================

CREATE TABLE utilities (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL CHECK (country_code IN ('UA', 'US')),
    provider_name TEXT NOT NULL,
    short_name VARCHAR(50),
    utility_type VARCHAR(50) NOT NULL CHECK (utility_type IN ('water', 'gas', 'electricity', 'heat', 'sewer', 'telecom')),
    
    -- Location fields
    state VARCHAR(50),           -- US only
    oblast VARCHAR(100),         -- UA only
    county VARCHAR(100),
    
    -- Business data
    customers_count INTEGER,
    network_length_km NUMERIC,
    founded_year INTEGER,
    regulatory_id VARCHAR(100),
    license_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    
    -- Contact info (JSONB for flexibility)
    contact_info JSONB DEFAULT '{}',
    -- Example: {"address": "...", "phone": "...", "email": "...", "emergency": "...", "website": "...", "hours": "..."}
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}',
    
    -- Geospatial
    service_area GEOMETRY(MultiPolygon, 4326),
    bounding_box GEOMETRY(Polygon, 4326),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for utilities
CREATE INDEX idx_utilities_country ON utilities(country_code);
CREATE INDEX idx_utilities_type ON utilities(utility_type);
CREATE INDEX idx_utilities_state ON utilities(state);
CREATE INDEX idx_utilities_oblast ON utilities(oblast);
CREATE INDEX idx_utilities_status ON utilities(status);
CREATE INDEX idx_utilities_service_area_gist ON utilities USING GIST(service_area);
CREATE INDEX idx_utilities_bbox_gist ON utilities USING GIST(bounding_box);

-- ============================================================================
-- 2. TECHNICAL CONDITIONS (UA)
-- ============================================================================

CREATE TABLE technical_conditions (
    id SERIAL PRIMARY KEY,
    utility_id INTEGER REFERENCES utilities(id) ON DELETE CASCADE,
    utility_type VARCHAR(50) NOT NULL,
    
    -- Title
    title TEXT NOT NULL,
    title_uk TEXT,
    description TEXT,
    
    -- Requirements
    requirements TEXT[],
    documents_needed JSONB DEFAULT '[]',
    -- Example: [{"name": "Application", "name_uk": "Заява", "required": true, "template_url": "..."}]
    
    -- Processing
    processing_time_days INTEGER,
    validity_days INTEGER DEFAULT 730,
    
    -- Cost
    cost_min NUMERIC,
    cost_max NUMERIC,
    cost_currency VARCHAR(3) DEFAULT 'UAH',
    cost_notes TEXT,
    
    -- Links
    application_url TEXT,
    regulatory_basis TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for technical_conditions
CREATE INDEX idx_tech_cond_utility_id ON technical_conditions(utility_id);
CREATE INDEX idx_tech_cond_type ON technical_conditions(utility_type);

-- ============================================================================
-- 3. TARIFFS
-- ============================================================================

CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    utility_id INTEGER REFERENCES utilities(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    unit VARCHAR(20) NOT NULL,  -- kWh, m³, Gcal, etc.
    currency VARCHAR(3) DEFAULT 'USD',
    
    customer_type VARCHAR(50) CHECK (customer_type IN ('residential', 'commercial', 'industrial')),
    effective_date DATE NOT NULL,
    expiration_date DATE,
    
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for tariffs
CREATE INDEX idx_tariffs_utility ON tariffs(utility_id);
CREATE INDEX idx_tariffs_type ON tariffs(customer_type);
CREATE INDEX idx_tariffs_effective ON tariffs(effective_date);

-- ============================================================================
-- 4. SERVICE AREAS (US)
-- ============================================================================

CREATE TABLE service_areas_us (
    id SERIAL PRIMARY KEY,
    district_type VARCHAR(50) NOT NULL CHECK (district_type IN ('water', 'fire', 'school', 'sewer', 'trash', 'utility')),
    
    name TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    county VARCHAR(100),
    
    population INTEGER,
    established_year INTEGER,
    website TEXT,
    
    contact_info JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Geospatial
    service_area GEOMETRY(MultiPolygon, 4326),
    bounding_box GEOMETRY(Polygon, 4326),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for service_areas_us
CREATE INDEX idx_service_areas_type ON service_areas_us(district_type);
CREATE INDEX idx_service_areas_state ON service_areas_us(state);
CREATE INDEX idx_service_areas_county ON service_areas_us(county);
CREATE INDEX idx_service_areas_geom_gist ON service_areas_us USING GIST(service_area);

-- ============================================================================
-- 5. FEMA FLOOD ZONES (US)
-- ============================================================================

CREATE TABLE flood_zones_us (
    id SERIAL PRIMARY KEY,
    zone_type VARCHAR(10) NOT NULL CHECK (zone_type IN ('A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE', 'X', 'X500', 'D')),
    sub_type VARCHAR(50),
    
    -- Location
    state VARCHAR(2) NOT NULL,
    county VARCHAR(100) NOT NULL,
    community_id VARCHAR(20),
    community_name TEXT,
    panel_number VARCHAR(20),
    
    -- Flood data
    effective_date DATE,
    base_flood_elevation NUMERIC,  -- feet
    static_bfe BOOLEAN DEFAULT FALSE,
    floodway BOOLEAN DEFAULT FALSE,
    coastal_high_hazard BOOLEAN DEFAULT FALSE,
    
    -- Risk assessment
    risk_level VARCHAR(20) CHECK (risk_level IN ('minimal', 'low', 'moderate', 'high', 'severe')),
    insurance_required BOOLEAN DEFAULT FALSE,
    special_flood_hazard_area BOOLEAN DEFAULT FALSE,
    
    metadata JSONB DEFAULT '{}',
    -- Example: {"map_revision_date": "...", "study_type": "...", "vertical_datum": "NAVD88"}
    
    -- Geospatial
    geometry GEOMETRY(MultiPolygon, 4326),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for flood_zones_us
CREATE INDEX idx_flood_zones_type ON flood_zones_us(zone_type);
CREATE INDEX idx_flood_zones_state ON flood_zones_us(state);
CREATE INDEX idx_flood_zones_county ON flood_zones_us(county);
CREATE INDEX idx_flood_zones_risk ON flood_zones_us(risk_level);
CREATE INDEX idx_flood_zones_sfha ON flood_zones_us(special_flood_hazard_area);
CREATE INDEX idx_flood_zones_geom_gist ON flood_zones_us USING GIST(geometry);

-- ============================================================================
-- 6. ELEVATION POINTS
-- ============================================================================

CREATE TABLE elevation_points (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL,
    
    elevation_meters NUMERIC NOT NULL,
    elevation_feet NUMERIC GENERATED ALWAYS AS (elevation_meters * 3.28084) STORED,
    
    source VARCHAR(50) CHECK (source IN ('SRTM', 'EU-DEM', 'USGS', 'LIDAR')),
    accuracy_meters NUMERIC,
    capture_date DATE,
    
    -- Geospatial
    location GEOGRAPHY(Point, 4326) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for elevation_points
CREATE INDEX idx_elevation_country ON elevation_points(country_code);
CREATE INDEX idx_elevation_source ON elevation_points(source);
CREATE INDEX idx_elevation_loc_gist ON elevation_points USING GIST(location);

-- ============================================================================
-- 7. TOPOGRAPHY TILES
-- ============================================================================

CREATE TABLE topography_tiles (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL,
    
    -- Tile coordinates
    z INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    
    -- Tile data
    layer_type VARCHAR(20) CHECK (layer_type IN ('topo', 'hillshade', 'dem', 'contour')),
    format VARCHAR(10) DEFAULT 'png',
    tile_url TEXT,
    tile_data BYTEA,  -- Optional: store tile directly
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_code, layer_type, z, x, y)
);

-- Indexes for topography_tiles
CREATE INDEX idx_topo_tiles_zxy ON topography_tiles(country_code, z, x, y);
CREATE INDEX idx_topo_tiles_layer ON topography_tiles(layer_type);

-- ============================================================================
-- 8. SOIL MAPS (US - NRCS)
-- ============================================================================

CREATE TABLE soil_maps_us (
    id SERIAL PRIMARY KEY,
    
    -- NRCS identifiers
    mukey VARCHAR(20) NOT NULL,      -- Map Unit Key
    musym VARCHAR(10),               -- Map Unit Symbol
    muname TEXT,                     -- Map Unit Name
    
    -- Location
    state VARCHAR(2) NOT NULL,
    county VARCHAR(100),
    survey_area VARCHAR(20),
    
    -- Soil properties
    hydrologic_group VARCHAR(10) CHECK (hydrologic_group IN ('A', 'B', 'C', 'D', 'A/D', 'B/D', 'C/D')),
    drainage_class VARCHAR(50),
    flood_frequency VARCHAR(50),
    farmland_class VARCHAR(100),
    slope_range VARCHAR(50),
    depth_to_water_table INTEGER,  -- cm
    
    -- Components (JSONB for multiple soil types)
    components JSONB DEFAULT '[]',
    -- Example: [{"cokey": "...", "compname": "...", "comppct": 45, "taxclname": "...", "taxorder": "..."}]
    
    metadata JSONB DEFAULT '{}',
    
    -- Geospatial
    geometry GEOMETRY(MultiPolygon, 4326),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for soil_maps_us
CREATE INDEX idx_soil_mukey ON soil_maps_us(mukey);
CREATE INDEX idx_soil_state ON soil_maps_us(state);
CREATE INDEX idx_soil_hydro ON soil_maps_us(hydrologic_group);
CREATE INDEX idx_soil_geom_gist ON soil_maps_us USING GIST(geometry);

-- ============================================================================
-- 9. AUDIT LOG
-- ============================================================================

CREATE TABLE geo_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    action VARCHAR(20) CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id VARCHAR(100),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit log
CREATE INDEX idx_audit_table ON geo_audit_log(table_name, record_id);
CREATE INDEX idx_audit_created ON geo_audit_log(created_at);

-- ============================================================================
-- SPATIAL QUERY EXAMPLES
-- ============================================================================

-- Find utilities at a point
-- SELECT * FROM utilities
-- WHERE ST_Contains(service_area, ST_SetSRID(ST_Point(-80.1918, 25.7617), 4326));

-- Find flood zones at a point
-- SELECT * FROM flood_zones_us
-- WHERE ST_Intersects(geometry, ST_SetSRID(ST_Point(-80.1918, 25.7617), 4326));

-- Find nearest elevation point
-- SELECT elevation_meters, ST_Distance(location, ST_SetSRID(ST_Point(-80.1918, 25.7617), 4326)) as distance
-- FROM elevation_points
-- ORDER BY location <-> ST_SetSRID(ST_Point(-80.1918, 25.7617), 4326)
-- LIMIT 1;

-- Find service areas within buffer
-- SELECT * FROM service_areas_us
-- WHERE ST_DWithin(
--     service_area,
--     ST_SetSRID(ST_Point(-118.2437, 34.0522), 4326),
--     0.1  -- ~10km
-- );

-- ============================================================================
-- UPDATE TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_utilities_update
    BEFORE UPDATE ON utilities
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_service_areas_update
    BEFORE UPDATE ON service_areas_us
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_tech_cond_update
    BEFORE UPDATE ON technical_conditions
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
