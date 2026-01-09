#!/usr/bin/env node

/**
 * Seed demo users with new RBAC system
 * Roles: USER, OPERATOR, ADMIN, ADMIN_MAX
 * Categories: CIVIL, OPS, ADM, ROOT
 */

const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DEMO_USERS = [
  {
    email: 'admin@ivyar.org',
    password: 'admin123',
    role: 'ADMIN_MAX',
    category: 'ROOT',
    first_name: 'Root',
    last_name: 'Administrator',
    organization: 'IVYAR Government',
    mfa_enabled: true
  },
  {
    email: 'manager@ivyar.org',
    password: 'manager123',
    role: 'ADMIN',
    category: 'ADM',
    first_name: 'System',
    last_name: 'Administrator',
    organization: 'IVYAR Operations',
    mfa_enabled: true
  },
  {
    email: 'operator@ivyar.org',
    password: 'operator123',
    role: 'OPERATOR',
    category: 'OPS',
    first_name: 'Claims',
    last_name: 'Processor',
    organization: 'IVYAR Operations',
    mfa_enabled: true
  },
  {
    email: 'user@ivyar.org',
    password: 'user123',
    role: 'USER',
    category: 'CIVIL',
    first_name: 'John',
    last_name: 'Citizen',
    organization: 'Public',
    mfa_enabled: false
  }
];

async function seedUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('🔐 IVYAR Access Control - Seeding Demo Users\n');
    console.log('============================================\n');
    
    for (const user of DEMO_USERS) {
      try {
        // Hash password
        const password_hash = await bcrypt.hash(user.password, 10);
        
        // Insert or update user
        const result = await client.query(`
          INSERT INTO users (
            email,
            password_hash,
            role,
            category,
            status,
            first_name,
            last_name,
            organization,
            mfa_enabled,
            violations,
            risk_score,
            inactive_days,
            created_at,
            updated_at
          ) VALUES (
            $1, $2, $3::user_role, $4::access_category, 'ACTIVE'::user_status,
            $5, $6, $7, $8,
            0, 0, 0,
            NOW(), NOW()
          )
          ON CONFLICT (email) DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            category = EXCLUDED.category,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            organization = EXCLUDED.organization,
            mfa_enabled = EXCLUDED.mfa_enabled,
            updated_at = NOW()
          RETURNING id
        `, [
          user.email,
          password_hash,
          user.role,
          user.category,
          user.first_name,
          user.last_name,
          user.organization,
          user.mfa_enabled
        ]);
        
        const userId = result.rows[0].id;
        
        console.log(`✓ ${user.role.padEnd(10)} | ${user.category.padEnd(6)} | ${user.email.padEnd(25)} | ${user.first_name} ${user.last_name}`);
        console.log(`  Password: ${user.password}`);
        console.log(`  MFA: ${user.mfa_enabled ? 'Enabled' : 'Disabled'}`);
        console.log(`  ID: ${userId}\n`);
        
      } catch (error) {
        console.error(`✗ Failed to seed ${user.email}:`, error.message);
      }
    }
    
    // Summary
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    console.log('============================================');
    console.log(`✅ Seeding complete!`);
    console.log(`📊 Total users in database: ${userCount.rows[0].count}\n`);
    
    console.log('🎯 Test Accounts:');
    console.log('------------------------------------------');
    console.log('CIVIL Access:');
    console.log('  user@ivyar.org / user123');
    console.log('\nOPS Access:');
    console.log('  operator@ivyar.org / operator123 (requires MFA)');
    console.log('\nADM Access:');
    console.log('  manager@ivyar.org / manager123 (requires MFA)');
    console.log('\nROOT Access:');
    console.log('  admin@ivyar.org / admin123 (requires MFA)\n');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedUsers();
