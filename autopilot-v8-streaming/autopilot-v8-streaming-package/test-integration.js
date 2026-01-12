#!/usr/bin/env node

/**
 * AUTOPILOT V8 - INTEGRATION TESTS
 * Tests streaming API and cache functionality
 */

const API_URL = process.env.API_URL || 'http://localhost:8787';

// Test colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test data
const testDocument = {
  documentType: 'procurement',
  scenario: 'under_threshold',
  data: {
    company_name: 'Тестова Компанія',
    edrpou: '12345678',
    contract_value: 150000,
    delivery_terms: '30 днів',
    payment_terms: 'передоплата 50%'
  }
};

// Test suite
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  log('\n🧪 AUTOPILOT V8 - INTEGRATION TESTS', 'blue');
  log('====================================\n', 'blue');
  log(`API URL: ${API_URL}\n`);

  for (const { name, fn } of tests) {
    try {
      log(`Testing: ${name}...`, 'yellow');
      await fn();
      log(`✓ ${name}`, 'green');
      passed++;
    } catch (error) {
      log(`✗ ${name}`, 'red');
      log(`  Error: ${error.message}`, 'red');
      failed++;
    }
    console.log();
  }

  // Summary
  log('====================================', 'blue');
  log(`Tests: ${passed + failed}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log('====================================\n', 'blue');

  process.exit(failed > 0 ? 1 : 0);
}

// ============================================================================
// TEST CASES
// ============================================================================

test('Health endpoint', async () => {
  const response = await fetch(`${API_URL}/autopilot/health`);
  const data = await response.json();
  
  if (response.status !== 200) {
    throw new Error(`Expected 200, got ${response.status}`);
  }
  
  if (data.status !== 'healthy') {
    throw new Error(`Expected healthy status, got ${data.status}`);
  }
  
  if (data.version !== 'v8') {
    throw new Error(`Expected v8, got ${data.version}`);
  }
});

test('Standard evaluation (cache miss)', async () => {
  const start = Date.now();
  
  const response = await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testDocument)
  });
  
  const elapsed = Date.now() - start;
  const data = await response.json();
  const cacheStatus = response.headers.get('X-Cache');
  
  if (response.status !== 200) {
    throw new Error(`Expected 200, got ${response.status}`);
  }
  
  if (!data.decision) {
    throw new Error('No decision in response');
  }
  
  if (!data.risk_level) {
    throw new Error('No risk_level in response');
  }
  
  log(`  Time: ${elapsed}ms`, 'yellow');
  log(`  Cache: ${cacheStatus}`, 'yellow');
  log(`  Decision: ${data.decision}`, 'yellow');
  log(`  Risk: ${data.risk_level}`, 'yellow');
});

test('Standard evaluation (cache hit)', async () => {
  // First request to populate cache
  await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testDocument)
  });
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Second request should hit cache
  const start = Date.now();
  
  const response = await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testDocument)
  });
  
  const elapsed = Date.now() - start;
  const cacheStatus = response.headers.get('X-Cache');
  
  if (cacheStatus !== 'HIT') {
    throw new Error(`Expected cache HIT, got ${cacheStatus}`);
  }
  
  if (elapsed > 500) {
    throw new Error(`Cache hit took too long: ${elapsed}ms (expected <500ms)`);
  }
  
  log(`  Time: ${elapsed}ms (should be <100ms)`, 'yellow');
  log(`  Cache: ${cacheStatus}`, 'yellow');
});

test('Streaming endpoint', async () => {
  const start = Date.now();
  let firstChunkTime = null;
  let chunks = 0;
  
  const response = await fetch(`${API_URL}/autopilot/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testDocument)
  });
  
  if (!response.body) {
    throw new Error('No response body');
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      if (!firstChunkTime) {
        firstChunkTime = Date.now() - start;
      }
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          chunks++;
          const data = JSON.parse(line.slice(6));
          
          if (data.type === 'complete') {
            completed = true;
            if (!data.data.decision) {
              throw new Error('No decision in complete chunk');
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  
  if (!completed) {
    throw new Error('Stream did not complete');
  }
  
  if (chunks === 0) {
    throw new Error('No chunks received');
  }
  
  const totalTime = Date.now() - start;
  
  log(`  First chunk: ${firstChunkTime}ms (target <400ms)`, 'yellow');
  log(`  Total time: ${totalTime}ms`, 'yellow');
  log(`  Chunks: ${chunks}`, 'yellow');
});

test('Cache invalidation', async () => {
  // Populate cache
  await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testDocument)
  });
  
  // Invalidate
  const response = await fetch(`${API_URL}/autopilot/cache/invalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pattern: 'procurement' })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error('Invalidation failed');
  }
  
  log(`  Deleted keys: ${data.deleted_keys}`, 'yellow');
  
  // Verify cache is empty
  const verifyResponse = await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testDocument)
  });
  
  const cacheStatus = verifyResponse.headers.get('X-Cache');
  
  if (cacheStatus === 'HIT') {
    throw new Error('Cache still contains data after invalidation');
  }
});

test('Cache disabled option', async () => {
  const docWithNoCache = {
    ...testDocument,
    options: { cacheEnabled: false }
  };
  
  const response = await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docWithNoCache)
  });
  
  const cacheStatus = response.headers.get('X-Cache');
  
  if (cacheStatus === 'HIT') {
    throw new Error('Cache was used despite cacheEnabled: false');
  }
});

test('Error handling - invalid request', async () => {
  const response = await fetch(`${API_URL}/autopilot/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invalid: 'data' })
  });
  
  // Should handle gracefully, not crash
  if (response.status === 200) {
    const data = await response.json();
    // Should return a refer decision or error
    if (!data.decision && !data.error) {
      throw new Error('No decision or error in response');
    }
  }
});

test('CORS headers', async () => {
  const response = await fetch(`${API_URL}/autopilot/health`, {
    method: 'OPTIONS'
  });
  
  const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
  const corsMethods = response.headers.get('Access-Control-Allow-Methods');
  
  if (!corsOrigin) {
    throw new Error('Missing CORS origin header');
  }
  
  if (!corsMethods) {
    throw new Error('Missing CORS methods header');
  }
  
  log(`  Origin: ${corsOrigin}`, 'yellow');
  log(`  Methods: ${corsMethods}`, 'yellow');
});

// ============================================================================
// RUN TESTS
// ============================================================================

runTests().catch(error => {
  log(`\n❌ Test runner error: ${error.message}`, 'red');
  process.exit(1);
});
