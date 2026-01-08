// app/api/procurement/route.ts
// Construction Intelligence Platform API
// PunchOut (cXML/OCI), Catalogs, Compliance, Export

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

type ProcurementPlatform = 'ariba' | 'coupa' | 'ivalua' | 'jaggaer';
type MaterialCategory = 'concrete' | 'steel' | 'lumber' | 'insulation' | 'electrical' | 'plumbing' | 'hvac';
type CatalogFormat = 'cif' | 'csv' | 'cxml' | 'excel';

interface CatalogItem {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierPartId: string;
  name: string;
  description: string;
  category: MaterialCategory;
  unspsc: string;
  price: number;
  currency: string;
  unit: string;
  minOrderQty: number;
  leadDays: number;
  inStock: boolean;
  compliance: string[];
  manufacturerName?: string;
  imageUrl?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const CATALOG_ITEMS: CatalogItem[] = [
  { id: 'mat-001', supplierId: 'sup-001', supplierName: 'BuildMaster Supply', supplierPartId: 'BMS-CONC-M400', name: 'Portland Cement M400', description: 'High-strength Portland cement for structural applications', category: 'concrete', unspsc: '30111601', price: 125.00, currency: 'USD', unit: 'BAG', minOrderQty: 10, leadDays: 3, inStock: true, compliance: ['ASTM C150', 'DSTU B V.2.7-46', 'EN 197-1'], manufacturerName: 'CemTech Industries' },
  { id: 'mat-002', supplierId: 'sup-001', supplierName: 'BuildMaster Supply', supplierPartId: 'BMS-REBAR-A500C', name: 'Reinforcing Steel Bar A500C', description: 'High-strength reinforcing steel bar for concrete structures', category: 'steel', unspsc: '30102001', price: 850.00, currency: 'USD', unit: 'TON', minOrderQty: 1, leadDays: 5, inStock: true, compliance: ['ASTM A615', 'DSTU 3760', 'ISO 6935'], manufacturerName: 'SteelWorks UA' },
  { id: 'mat-003', supplierId: 'sup-002', supplierName: 'American Building Materials', supplierPartId: 'ABM-LUM-2X4-SPF', name: 'Dimensional Lumber 2x4 SPF', description: 'Spruce-Pine-Fir dimensional lumber for framing', category: 'lumber', unspsc: '30103601', price: 4.50, currency: 'USD', unit: 'EA', minOrderQty: 100, leadDays: 2, inStock: true, compliance: ['IBC 2021', 'IRC 2021', 'ASTM D6555'], manufacturerName: 'Pacific Lumber Co.' },
  { id: 'mat-004', supplierId: 'sup-002', supplierName: 'American Building Materials', supplierPartId: 'ABM-INS-R19-BATT', name: 'Fiberglass Insulation R-19 Batt', description: 'Unfaced fiberglass batt insulation for walls and floors', category: 'insulation', unspsc: '30141501', price: 0.85, currency: 'USD', unit: 'SQF', minOrderQty: 500, leadDays: 3, inStock: true, compliance: ['IBC 2021', 'IECC 2021', 'ASTM C665'], manufacturerName: 'Owens Corning' },
  { id: 'mat-005', supplierId: 'sup-003', supplierName: 'ProElectric Supply', supplierPartId: 'PES-WIRE-12AWG-THHN', name: 'THHN Wire 12 AWG Solid Copper', description: 'Thermoplastic high heat-resistant nylon-coated wire', category: 'electrical', unspsc: '26121600', price: 0.45, currency: 'USD', unit: 'FT', minOrderQty: 500, leadDays: 2, inStock: true, compliance: ['NEC 2023', 'NFPA 70', 'UL 83'], manufacturerName: 'Southwire' },
  { id: 'mat-006', supplierId: 'sup-003', supplierName: 'ProElectric Supply', supplierPartId: 'PES-PVC-2IN-SCH40', name: 'PVC Pipe Schedule 40 2"', description: 'Schedule 40 PVC pipe for drainage and vent applications', category: 'plumbing', unspsc: '40142001', price: 8.50, currency: 'USD', unit: 'EA', minOrderQty: 50, leadDays: 2, inStock: true, compliance: ['IPC 2021', 'ASTM D1785', 'NSF 14'], manufacturerName: 'Charlotte Pipe' },
  { id: 'mat-007', supplierId: 'sup-004', supplierName: 'HVAC Distributors Inc', supplierPartId: 'HVC-SPLIT-12K', name: 'Mini-Split AC Unit 12000 BTU', description: 'Ductless mini-split air conditioning system', category: 'hvac', unspsc: '40101701', price: 1250.00, currency: 'USD', unit: 'EA', minOrderQty: 1, leadDays: 14, inStock: false, compliance: ['IECC 2021', 'AHRI 210/240', 'EPA 608'], manufacturerName: 'Mitsubishi Electric' },
];

const PLATFORMS = [
  { id: 'ariba', name: 'SAP Ariba', status: 'connected', catalogFormat: 'CIF 3.0', punchOutProtocol: 'cXML', apiType: 'cxml', lastSync: '2025-01-07T14:30:00Z', itemCount: 1250 },
  { id: 'coupa', name: 'Coupa', status: 'connected', catalogFormat: 'CSV', punchOutProtocol: 'cXML/OCI', apiType: 'rest', lastSync: '2025-01-07T12:15:00Z', itemCount: 1180 },
  { id: 'ivalua', name: 'Ivalua', status: 'pending', catalogFormat: 'CSV/XML', punchOutProtocol: 'cXML', apiType: 'rest', lastSync: null, itemCount: 0 },
  { id: 'jaggaer', name: 'Jaggaer', status: 'disconnected', catalogFormat: 'CIF/XML', punchOutProtocol: 'cXML/OCI', apiType: 'rest', lastSync: null, itemCount: 0 },
];

const PUNCHOUT_SESSIONS = [
  { id: 'PO-001', platform: 'ariba', buyerCookie: 'abc123', buyerName: 'Turner Construction', buyerEmail: 'procurement@turner.com', startTime: '2025-01-07T09:15:00Z', endTime: '2025-01-07T09:45:00Z', status: 'completed', items: 24, totalValue: 45600 },
  { id: 'PO-002', platform: 'coupa', buyerCookie: 'def456', buyerName: 'Skanska USA', buyerEmail: 'purchasing@skanska.com', startTime: '2025-01-07T10:30:00Z', endTime: null, status: 'active', items: 12, totalValue: 23400 },
  { id: 'PO-003', platform: 'ariba', buyerCookie: 'ghi789', buyerName: 'Bechtel Corp', buyerEmail: 'supply@bechtel.com', startTime: '2025-01-07T11:45:00Z', endTime: '2025-01-07T12:20:00Z', status: 'completed', items: 8, totalValue: 12800 },
];

const COMPLIANCE_RULES = [
  { id: 'rule-001', standard: 'IBC', code: 'IBC-2021', section: '1903.1', title: 'Concrete Strength', country: 'US', categories: ['concrete'], severity: 'critical' },
  { id: 'rule-002', standard: 'NEC', code: 'NEC-2023', section: '310.16', title: 'Conductor Ampacity', country: 'US', categories: ['electrical'], severity: 'critical' },
  { id: 'rule-003', standard: 'DSTU', code: 'DSTU 3760', section: '5.1', title: 'Reinforcing Steel', country: 'UA', categories: ['steel'], severity: 'critical' },
  { id: 'rule-004', standard: 'IECC', code: 'IECC-2021', section: 'R402.1', title: 'Insulation R-Value', country: 'US', categories: ['insulation'], severity: 'major' },
];

// ============================================================================
// EXPORT GENERATORS
// ============================================================================

function generateCIF(items: CatalogItem[]): string {
  let cif = `CIF_I_V3.0\n`;
  cif += `LOADMODE: F\n`;
  cif += `CODEFORMAT: UNSPSC\n`;
  cif += `CURRENCY: USD\n`;
  cif += `SUPPLIERID_DOMAIN: NetworkID\n`;
  cif += `ITEMCOUNT: ${items.length}\n\n`;
  cif += `DATA\n`;
  cif += `Supplier ID\tSupplier Part ID\tManufacturer Part ID\tItem Description\tSPSC Code\tUnit Price\tUnit of Measure\tLead Time\tManufacturer Name\tURL\n`;
  
  items.forEach(item => {
    cif += `${item.supplierId}\t${item.supplierPartId}\t${item.supplierPartId}\t${item.description}\t${item.unspsc}\t${item.price}\t${item.unit}\t${item.leadDays}\t${item.manufacturerName || ''}\t${item.imageUrl || ''}\n`;
  });
  
  cif += `ENDOFDATA\n`;
  return cif;
}

function generateCSV(items: CatalogItem[]): string {
  const headers = [
    'Supplier Part Number', 'Name', 'Description', 'Price', 'Currency',
    'Unit of Measure', 'UNSPSC', 'Lead Time Days', 'Min Order Qty',
    'In Stock', 'Manufacturer', 'Compliance Codes'
  ];
  
  let csv = headers.join(',') + '\n';
  
  items.forEach(item => {
    const row = [
      item.supplierPartId,
      `"${item.name}"`,
      `"${item.description}"`,
      item.price,
      item.currency,
      item.unit,
      item.unspsc,
      item.leadDays,
      item.minOrderQty,
      item.inStock ? 'Yes' : 'No',
      item.manufacturerName || '',
      `"${item.compliance.join('; ')}"`
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

function generateCXML(items: CatalogItem[], supplierId: string): string {
  const timestamp = new Date().toISOString();
  
  let cxml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  cxml += `<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.050/cXML.dtd">\n`;
  cxml += `<cXML payloadID="${Date.now()}@constructionintel.com" timestamp="${timestamp}">\n`;
  cxml += `  <Header>\n`;
  cxml += `    <From>\n`;
  cxml += `      <Credential domain="NetworkID">\n`;
  cxml += `        <Identity>${supplierId}</Identity>\n`;
  cxml += `      </Credential>\n`;
  cxml += `    </From>\n`;
  cxml += `    <To>\n`;
  cxml += `      <Credential domain="NetworkID">\n`;
  cxml += `        <Identity>BUYER</Identity>\n`;
  cxml += `      </Credential>\n`;
  cxml += `    </To>\n`;
  cxml += `    <Sender>\n`;
  cxml += `      <Credential domain="NetworkID">\n`;
  cxml += `        <Identity>ConstructionIntelligence</Identity>\n`;
  cxml += `      </Credential>\n`;
  cxml += `    </Sender>\n`;
  cxml += `  </Header>\n`;
  cxml += `  <Message>\n`;
  cxml += `    <ProductActivity>\n`;
  
  items.forEach(item => {
    cxml += `      <Product>\n`;
    cxml += `        <ProductID>\n`;
    cxml += `          <SupplierPartID>${item.supplierPartId}</SupplierPartID>\n`;
    cxml += `        </ProductID>\n`;
    cxml += `        <ProductDetails>\n`;
    cxml += `          <Description xml:lang="en">${item.description}</Description>\n`;
    cxml += `          <UnitPrice>\n`;
    cxml += `            <Money currency="${item.currency}">${item.price}</Money>\n`;
    cxml += `          </UnitPrice>\n`;
    cxml += `          <UnitOfMeasure>${item.unit}</UnitOfMeasure>\n`;
    cxml += `          <Classification domain="UNSPSC">${item.unspsc}</Classification>\n`;
    cxml += `          <ManufacturerName>${item.manufacturerName || ''}</ManufacturerName>\n`;
    cxml += `          <LeadTime>${item.leadDays}</LeadTime>\n`;
    cxml += `        </ProductDetails>\n`;
    cxml += `      </Product>\n`;
  });
  
  cxml += `    </ProductActivity>\n`;
  cxml += `  </Message>\n`;
  cxml += `</cXML>`;
  
  return cxml;
}

function generatePunchOutSetupResponse(punchOutUrl: string, buyerCookie: string): string {
  const timestamp = new Date().toISOString();
  
  let response = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  response += `<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.050/cXML.dtd">\n`;
  response += `<cXML payloadID="${Date.now()}@constructionintel.com" timestamp="${timestamp}">\n`;
  response += `  <Response>\n`;
  response += `    <Status code="200" text="OK">Success</Status>\n`;
  response += `    <PunchOutSetupResponse>\n`;
  response += `      <StartPage>\n`;
  response += `        <URL>${punchOutUrl}?buyerCookie=${encodeURIComponent(buyerCookie)}</URL>\n`;
  response += `      </StartPage>\n`;
  response += `    </PunchOutSetupResponse>\n`;
  response += `  </Response>\n`;
  response += `</cXML>`;
  
  return response;
}

function generatePunchOutOrderMessage(session: typeof PUNCHOUT_SESSIONS[0], items: CatalogItem[]): string {
  const timestamp = new Date().toISOString();
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  let message = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  message += `<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.050/cXML.dtd">\n`;
  message += `<cXML payloadID="${Date.now()}@constructionintel.com" timestamp="${timestamp}">\n`;
  message += `  <Message>\n`;
  message += `    <PunchOutOrderMessage>\n`;
  message += `      <BuyerCookie>${session.buyerCookie}</BuyerCookie>\n`;
  message += `      <PunchOutOrderMessageHeader operationAllowed="create">\n`;
  message += `        <Total>\n`;
  message += `          <Money currency="USD">${total.toFixed(2)}</Money>\n`;
  message += `        </Total>\n`;
  message += `      </PunchOutOrderMessageHeader>\n`;
  
  items.forEach((item, idx) => {
    message += `      <ItemIn quantity="1">\n`;
    message += `        <ItemID>\n`;
    message += `          <SupplierPartID>${item.supplierPartId}</SupplierPartID>\n`;
    message += `          <SupplierPartAuxiliaryID>${item.id}</SupplierPartAuxiliaryID>\n`;
    message += `        </ItemID>\n`;
    message += `        <ItemDetail>\n`;
    message += `          <UnitPrice>\n`;
    message += `            <Money currency="${item.currency}">${item.price}</Money>\n`;
    message += `          </UnitPrice>\n`;
    message += `          <Description xml:lang="en">${item.name}</Description>\n`;
    message += `          <UnitOfMeasure>${item.unit}</UnitOfMeasure>\n`;
    message += `          <Classification domain="UNSPSC">${item.unspsc}</Classification>\n`;
    message += `          <ManufacturerPartID>${item.supplierPartId}</ManufacturerPartID>\n`;
    message += `          <ManufacturerName>${item.manufacturerName || ''}</ManufacturerName>\n`;
    message += `        </ItemDetail>\n`;
    message += `      </ItemIn>\n`;
  });
  
  message += `    </PunchOutOrderMessage>\n`;
  message += `  </Message>\n`;
  message += `</cXML>`;
  
  return message;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';

  try {
    switch (action) {
      // ==================== DASHBOARD ====================
      case 'dashboard': {
        const connectedPlatforms = PLATFORMS.filter(p => p.status === 'connected').length;
        const todayOrders = PUNCHOUT_SESSIONS.filter(s => s.status === 'completed').length;
        const todayValue = PUNCHOUT_SESSIONS.filter(s => s.status === 'completed').reduce((s, p) => s + p.totalValue, 0);
        
        return NextResponse.json({
          success: true,
          data: {
            catalog: {
              totalItems: CATALOG_ITEMS.length,
              categories: [...new Set(CATALOG_ITEMS.map(i => i.category))].length,
              inStock: CATALOG_ITEMS.filter(i => i.inStock).length,
            },
            platforms: {
              total: PLATFORMS.length,
              connected: connectedPlatforms,
              pending: PLATFORMS.filter(p => p.status === 'pending').length,
            },
            punchOut: {
              activeSessions: PUNCHOUT_SESSIONS.filter(s => s.status === 'active').length,
              todayOrders,
              todayValue,
            },
            compliance: {
              standards: [...new Set(COMPLIANCE_RULES.map(r => r.standard))].length,
              rules: COMPLIANCE_RULES.length,
              complianceRate: 94,
            },
          },
        });
      }

      // ==================== CATALOG ====================
      case 'catalog': {
        const category = searchParams.get('category');
        const search = searchParams.get('search')?.toLowerCase();
        
        let items = [...CATALOG_ITEMS];
        if (category && category !== 'all') items = items.filter(i => i.category === category);
        if (search) items = items.filter(i => 
          i.name.toLowerCase().includes(search) || 
          i.description.toLowerCase().includes(search) ||
          i.supplierPartId.toLowerCase().includes(search)
        );
        
        return NextResponse.json({ success: true, data: items, total: items.length });
      }

      case 'catalog-item': {
        const id = searchParams.get('id');
        const item = CATALOG_ITEMS.find(i => i.id === id);
        if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
      }

      // ==================== PLATFORMS ====================
      case 'platforms': {
        return NextResponse.json({ success: true, data: PLATFORMS });
      }

      case 'platform': {
        const id = searchParams.get('id');
        const platform = PLATFORMS.find(p => p.id === id);
        if (!platform) return NextResponse.json({ success: false, error: 'Platform not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: platform });
      }

      // ==================== PUNCHOUT SESSIONS ====================
      case 'punchout-sessions': {
        const platform = searchParams.get('platform');
        const status = searchParams.get('status');
        
        let sessions = [...PUNCHOUT_SESSIONS];
        if (platform && platform !== 'all') sessions = sessions.filter(s => s.platform === platform);
        if (status && status !== 'all') sessions = sessions.filter(s => s.status === status);
        
        return NextResponse.json({ success: true, data: sessions, total: sessions.length });
      }

      case 'punchout-session': {
        const id = searchParams.get('id');
        const session = PUNCHOUT_SESSIONS.find(s => s.id === id);
        if (!session) return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: session });
      }

      // ==================== COMPLIANCE ====================
      case 'compliance-rules': {
        const country = searchParams.get('country');
        const category = searchParams.get('category');
        
        let rules = [...COMPLIANCE_RULES];
        if (country && country !== 'all') rules = rules.filter(r => r.country === country);
        if (category && category !== 'all') rules = rules.filter(r => r.categories.includes(category as MaterialCategory));
        
        return NextResponse.json({ success: true, data: rules, total: rules.length });
      }

      case 'compliance-check': {
        const itemId = searchParams.get('itemId');
        const country = (searchParams.get('country') || 'US') as 'UA' | 'US';
        
        const item = CATALOG_ITEMS.find(i => i.id === itemId);
        if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        
        const applicableRules = COMPLIANCE_RULES.filter(r => 
          r.country === country && r.categories.includes(item.category)
        );
        
        const checks = applicableRules.map(rule => ({
          ruleId: rule.id,
          standard: rule.standard,
          section: rule.section,
          status: item.compliance.some(c => c.includes(rule.standard)) ? 'pass' : 'review',
          message: item.compliance.some(c => c.includes(rule.standard)) 
            ? `Compliant with ${rule.standard}` 
            : `${rule.standard} certification required`,
        }));
        
        return NextResponse.json({
          success: true,
          data: {
            itemId: item.id,
            itemName: item.name,
            country,
            checks,
            overallStatus: checks.every(c => c.status === 'pass') ? 'compliant' : 'review_required',
          },
        });
      }

      // ==================== EXPORT ====================
      case 'export': {
        const format = (searchParams.get('format') || 'csv') as CatalogFormat;
        const category = searchParams.get('category');
        
        let items = [...CATALOG_ITEMS];
        if (category && category !== 'all') items = items.filter(i => i.category === category);
        
        let content: string;
        let contentType: string;
        let filename: string;
        
        switch (format) {
          case 'cif':
            content = generateCIF(items);
            contentType = 'text/plain';
            filename = 'catalog.cif';
            break;
          case 'csv':
            content = generateCSV(items);
            contentType = 'text/csv';
            filename = 'catalog.csv';
            break;
          case 'cxml':
            content = generateCXML(items, 'ConstructionIntelligence');
            contentType = 'application/xml';
            filename = 'catalog.xml';
            break;
          default:
            content = generateCSV(items);
            contentType = 'text/csv';
            filename = 'catalog.csv';
        }
        
        return NextResponse.json({
          success: true,
          data: {
            format,
            itemCount: items.length,
            content,
            contentType,
            filename,
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Procurement API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      // ==================== PUNCHOUT SETUP ====================
      case 'punchout-setup': {
        const { platform, buyerCookie, browserFormPost, fromIdentity, toIdentity, userEmail } = body;
        
        // Validate request
        if (!platform || !buyerCookie || !browserFormPost) {
          return NextResponse.json({ 
            success: false, 
            error: 'Missing required fields: platform, buyerCookie, browserFormPost' 
          }, { status: 400 });
        }
        
        // Check if platform is supported
        const platformConfig = PLATFORMS.find(p => p.id === platform);
        if (!platformConfig) {
          return NextResponse.json({ success: false, error: 'Unsupported platform' }, { status: 400 });
        }
        
        // Generate PunchOut URL
        const punchOutUrl = `https://app.constructionintelligence.com/punchout/store`;
        
        // Create session
        const sessionId = `PO-${Date.now()}`;
        
        // Return cXML response
        const cxmlResponse = generatePunchOutSetupResponse(punchOutUrl, buyerCookie);
        
        return NextResponse.json({
          success: true,
          data: {
            sessionId,
            punchOutUrl: `${punchOutUrl}?buyerCookie=${encodeURIComponent(buyerCookie)}`,
            cxmlResponse,
            platform,
            createdAt: new Date().toISOString(),
          },
        });
      }

      // ==================== PUNCHOUT ORDER ====================
      case 'punchout-order': {
        const { sessionId, buyerCookie, items } = body;
        
        if (!sessionId || !buyerCookie || !items || !Array.isArray(items)) {
          return NextResponse.json({ 
            success: false, 
            error: 'Missing required fields: sessionId, buyerCookie, items' 
          }, { status: 400 });
        }
        
        // Get item details
        const orderItems = items.map((itemId: string) => 
          CATALOG_ITEMS.find(i => i.id === itemId)
        ).filter(Boolean) as CatalogItem[];
        
        // Mock session
        const session = { 
          id: sessionId, 
          buyerCookie, 
          platform: 'ariba' as ProcurementPlatform,
          buyerName: 'Buyer',
          buyerEmail: '',
          startTime: new Date().toISOString(),
          endTime: null,
          status: 'completed' as const,
          items: orderItems.length,
          totalValue: orderItems.reduce((sum, i) => sum + i.price, 0)
        };
        
        // Generate PunchOut Order Message
        const orderMessage = generatePunchOutOrderMessage(session, orderItems);
        
        return NextResponse.json({
          success: true,
          data: {
            sessionId,
            itemCount: orderItems.length,
            total: orderItems.reduce((sum, i) => sum + i.price, 0),
            currency: 'USD',
            cxmlOrderMessage: orderMessage,
          },
        });
      }

      // ==================== CATALOG SYNC ====================
      case 'sync-catalog': {
        const { platform, format } = body;
        
        if (!platform) {
          return NextResponse.json({ success: false, error: 'Platform required' }, { status: 400 });
        }
        
        const platformConfig = PLATFORMS.find(p => p.id === platform);
        if (!platformConfig) {
          return NextResponse.json({ success: false, error: 'Platform not found' }, { status: 404 });
        }
        
        // Generate catalog in appropriate format
        const catalogFormat = format || (platform === 'ariba' ? 'cif' : 'csv');
        const content = catalogFormat === 'cif' 
          ? generateCIF(CATALOG_ITEMS)
          : catalogFormat === 'cxml'
          ? generateCXML(CATALOG_ITEMS, 'ConstructionIntelligence')
          : generateCSV(CATALOG_ITEMS);
        
        return NextResponse.json({
          success: true,
          message: `Catalog synced to ${platformConfig.name}`,
          data: {
            platform,
            format: catalogFormat,
            itemCount: CATALOG_ITEMS.length,
            syncedAt: new Date().toISOString(),
          },
        });
      }

      // ==================== COMPLIANCE REPORT ====================
      case 'compliance-report': {
        const { itemIds, country } = body;
        
        const items = itemIds 
          ? CATALOG_ITEMS.filter(i => itemIds.includes(i.id))
          : CATALOG_ITEMS;
        
        const targetCountry = country || 'US';
        
        const applicableRules = COMPLIANCE_RULES.filter(r => r.country === targetCountry);
        
        const checks = items.flatMap(item => {
          const itemRules = applicableRules.filter(r => r.categories.includes(item.category));
          return itemRules.map(rule => ({
            itemId: item.id,
            itemName: item.name,
            ruleId: rule.id,
            standard: rule.standard,
            status: item.compliance.some(c => c.includes(rule.standard)) ? 'pass' : 'review',
          }));
        });
        
        const summary = {
          total: checks.length,
          passed: checks.filter(c => c.status === 'pass').length,
          review: checks.filter(c => c.status === 'review').length,
          complianceRate: Math.round((checks.filter(c => c.status === 'pass').length / checks.length) * 100),
        };
        
        return NextResponse.json({
          success: true,
          data: {
            country: targetCountry,
            itemCount: items.length,
            summary,
            checks,
            generatedAt: new Date().toISOString(),
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Procurement API POST Error:', error);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
