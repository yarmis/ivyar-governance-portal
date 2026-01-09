const { Client } = require('pg');
require('dotenv').config();

async function checkUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('📊 Checking users table...\n');
    
    // Table structure
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('🔧 Table Structure:');
    structure.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : ''}`);
    });
    
    // Count users
    const count = await client.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Total users: ${count.rows[0].count}`);
    
    // List users (without passwords)
    if (parseInt(count.rows[0].count) > 0) {
      const users = await client.query('SELECT id, email, role, created_at FROM users LIMIT 10');
      console.log('\n📋 Users:');
      users.rows.forEach(u => {
        console.log(`   ${u.id}. ${u.email} (${u.role || 'no role'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();
