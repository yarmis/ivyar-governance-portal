#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing PostgreSQL Connection...\n');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ ERROR: DATABASE_URL not found in .env');
    process.exit(1);
  }
  
  const maskedUrl = connectionString.replace(/:[^@]+@/, ':****@');
  console.log('📡 Connection string:', maskedUrl);
  console.log('');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    // PostgreSQL version
    const versionResult = await client.query('SELECT version()');
    console.log('🔬 PostgreSQL Version:', versionResult.rows[0].version.split(',')[0]);
    
    // List tables
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    
    console.log('\n🔬 Tables:', tablesResult.rows.length || 'No tables (fresh DB)');
    tablesResult.rows.forEach(r => console.log('   -', r.table_name));
    
    console.log('\n✅ ALL TESTS PASSED!');
    
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
