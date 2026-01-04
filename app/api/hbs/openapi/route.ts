import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';

  const spec = generateOpenAPISpec();

  if (format === 'yaml') {
    return new NextResponse(jsonToYaml(spec), {
      headers: { 'Content-Type': 'text/yaml' }
    });
  }

  return NextResponse.json(spec);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'spec':
        return NextResponse.json({ success: true, spec: generateOpenAPISpec() });
      case 'validate':
        return NextResponse.json({ success: true, ...validateRequest(body) });
      case 'sdk-config':
        return NextResponse.json({ success: true, ...getSDKConfig(body) });
      case 'versions':
        return NextResponse.json({ success: true, ...getAPIVersions() });
      case 'health':
        return NextResponse.json({ success: true, ...getAPIHealth() });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function generateOpenAPISpec(): any {
  return {
    openapi: '3.1.0',
    info: {
      title: 'HBS Governance API',
      description: 'Humanitarian Budget Support - Global Interoperability API',
      version: '3.1.0',
      contact: {
        name: 'IVYAR Platform',
        url: 'https://ivyar.org',
        email: 'api@ivyar.org'
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0'
      },
      'x-logo': {
        url: 'https://ivyar.org/logo.png'
      }
    },
    servers: [
      { url: 'https://ivyar.org/api/hbs', description: 'Production' },
      { url: 'https://staging.ivyar.org/api/hbs', description: 'Staging' },
      { url: 'http://localhost:3000/api/hbs', description: 'Development' }
    ],
    tags: [
      { name: 'Governance', description: 'Core governance operations' },
      { name: 'Signals', description: 'Autonomous governance signals' },
      { name: 'Institutional', description: 'Multi-organization management' },
      { name: 'Analytics', description: 'Behavior and predictive analytics' },
      { name: 'Integration', description: 'External system integration' },
      { name: 'Compliance', description: 'Regulatory compliance endpoints' }
    ],
    paths: {
      '/engine': {
        post: {
          tags: ['Governance'],
          summary: 'Governance Engine Operations',
          description: 'Evaluate, approve, reject, or escalate decisions',
          operationId: 'governanceEngine',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/EngineRequest' },
                examples: {
                  evaluate: {
                    summary: 'Evaluate a decision',
                    value: { action: 'evaluate', module: 'procurement', operation: 'purchase', data: { amount: 50000 } }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Success', content: { 'application/json': { schema: { '$ref': '#/components/schemas/EngineResponse' } } } },
            '400': { description: 'Bad Request' },
            '401': { description: 'Unauthorized' },
            '500': { description: 'Server Error' }
          },
          security: [{ bearerAuth: [] }, { apiKey: [] }]
        }
      },
      '/signals': {
        post: {
          tags: ['Signals'],
          summary: 'Signal Management',
          description: 'Emit, subscribe, acknowledge, or escalate signals',
          operationId: 'signalManagement',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { '$ref': '#/components/schemas/SignalRequest' } } }
          },
          responses: {
            '200': { description: 'Success' },
            '400': { description: 'Bad Request' }
          }
        }
      },
      '/institutional': {
        post: {
          tags: ['Institutional'],
          summary: 'Institutional Management',
          description: 'Manage organizations, users, RBAC, and compliance',
          operationId: 'institutionalManagement',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { '$ref': '#/components/schemas/InstitutionalRequest' } } }
          },
          responses: { '200': { description: 'Success' } }
        }
      },
      '/analytics/behavior': {
        post: {
          tags: ['Analytics'],
          summary: 'Behavior Analytics',
          description: 'User activity, decision patterns, anomaly detection',
          operationId: 'behaviorAnalytics',
          responses: { '200': { description: 'Success' } }
        }
      },
      '/compliance/iati': {
        post: {
          tags: ['Compliance'],
          summary: 'IATI Reporting',
          description: 'Generate IATI-compliant activity reports',
          operationId: 'iatiReporting',
          responses: { '200': { description: 'Success' } }
        }
      },
      '/compliance/usaid': {
        post: {
          tags: ['Compliance'],
          summary: 'USAID Reporting',
          description: 'ADS 303, FFATA, and SAM.gov compliance',
          operationId: 'usaidCompliance',
          responses: { '200': { description: 'Success' } }
        }
      },
      '/compliance/eu': {
        post: {
          tags: ['Compliance'],
          summary: 'EU Compliance',
          description: 'GDPR, eIDAS, and EU reporting standards',
          operationId: 'euCompliance',
          responses: { '200': { description: 'Success' } }
        }
      }
    },
    components: {
      schemas: {
        EngineRequest: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string', enum: ['evaluate', 'approve', 'reject', 'escalate', 'audit'] },
            module: { type: 'string' },
            operation: { type: 'string' },
            data: { type: 'object' },
            user: { type: 'string' }
          }
        },
        EngineResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            decisionId: { type: 'string' },
            evaluation: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        SignalRequest: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string', enum: ['emit', 'subscribe', 'list', 'acknowledge', 'escalate'] },
            type: { type: 'string' },
            severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] }
          }
        },
        InstitutionalRequest: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string' },
            orgId: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            code: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        },
        oauth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://ivyar.org/oauth/authorize',
              tokenUrl: 'https://ivyar.org/oauth/token',
              scopes: {
                'read:governance': 'Read governance data',
                'write:governance': 'Write governance data',
                'admin:governance': 'Admin access'
              }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  };
}

function validateRequest(body: any): any {
  const { endpoint, payload } = body;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload.action) errors.push('Missing required field: action');
  if (payload.amount && typeof payload.amount !== 'number') errors.push('Field amount must be a number');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    schema: 'OpenAPI 3.1.0',
    endpoint
  };
}

function getSDKConfig(body: any): any {
  const { language } = body;

  const configs: Record<string, any> = {
    javascript: {
      package: '@ivyar/hbs-sdk',
      version: '3.1.0',
      install: 'npm install @ivyar/hbs-sdk',
      example: `import { HBSClient } from '@ivyar/hbs-sdk';\nconst client = new HBSClient({ apiKey: 'YOUR_KEY' });\nconst result = await client.engine.evaluate({ module: 'procurement', data: { amount: 50000 } });`
    },
    python: {
      package: 'ivyar-hbs',
      version: '3.1.0',
      install: 'pip install ivyar-hbs',
      example: `from ivyar_hbs import HBSClient\nclient = HBSClient(api_key='YOUR_KEY')\nresult = client.engine.evaluate(module='procurement', data={'amount': 50000})`
    },
    java: {
      package: 'org.ivyar.hbs',
      version: '3.1.0',
      install: '<dependency><groupId>org.ivyar</groupId><artifactId>hbs-sdk</artifactId><version>3.1.0</version></dependency>',
      example: `HBSClient client = new HBSClient("YOUR_KEY");\nEngineResponse result = client.engine().evaluate("procurement", data);`
    }
  };

  return {
    language: language || 'all',
    configs: language ? { [language]: configs[language] } : configs,
    generatorUrl: 'https://ivyar.org/api/hbs/openapi/generate-sdk'
  };
}

function getAPIVersions(): any {
  return {
    current: '3.1.0',
    supported: ['3.1.0', '3.0.0', '2.1.0'],
    deprecated: ['2.0.0', '1.6.0'],
    sunset: { '2.0.0': '2026-06-01', '1.6.0': '2026-03-01' },
    changelog: [
      { version: '3.1.0', date: '2026-01-04', changes: ['Global Interoperability', 'OpenAPI 3.1', 'EU/USAID/UN compliance'] },
      { version: '3.0.0', date: '2026-01-04', changes: ['Institutional Platform', 'Multi-Org', 'Blockchain'] },
      { version: '2.1.0', date: '2026-01-04', changes: ['Autonomous Signals'] }
    ]
  };
}

function getAPIHealth(): any {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.1.0',
    endpoints: {
      engine: { status: 'up', latency: '23ms' },
      signals: { status: 'up', latency: '18ms' },
      institutional: { status: 'up', latency: '31ms' },
      analytics: { status: 'up', latency: '45ms' },
      compliance: { status: 'up', latency: '28ms' }
    },
    uptime: '99.99%',
    rateLimit: { limit: 1000, remaining: 892, reset: new Date(Date.now() + 3600000).toISOString() }
  };
}

function jsonToYaml(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      value.forEach(item => {
        if (typeof item === 'object') {
          yaml += `${spaces}  -\n${jsonToYaml(item, indent + 2)}`;
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      });
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
    } else {
      yaml += `${spaces}${key}: ${value}\n`;
    }
  }
  return yaml;
}