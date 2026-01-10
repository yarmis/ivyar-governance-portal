import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bearerAuth } from 'hono/bearer-auth'

type Bindings = {
  DB: D1Database
  API_SECRET: string
  AUDIT_LOG: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS
app.use('/*', cors({
  origin: ['https://ivyar.org', 'http://localhost:3000'],
  credentials: true
}))

// Authentication middleware
app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token || token !== c.env.API_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  await next()
})

// Audit logging helper
async function logAction(env: Bindings, action: string, data: any) {
  const timestamp = new Date().toISOString()
  const key = `audit:${timestamp}:${action}`
  await env.AUDIT_LOG.put(key, JSON.stringify({
    timestamp,
    action,
    data
  }))
}

// Get autopilot status
app.get('/api/hbs/autopilot/status', async (c) => {
  const db = c.env.DB
  
  const result = await db.prepare(`
    SELECT * FROM autopilot_config ORDER BY created_at DESC LIMIT 1
  `).first()
  
  return c.json(result || {
    v8Enabled: false,
    rolloutPercentage: 0,
    last24Hours: { total: 0, v7: 0, v8: 0 },
    avgSimilarity: 0,
    comparisons: 0
  })
})

// Enable rollout (with audit log)
app.post('/api/hbs/autopilot/flags/enable', async (c) => {
  const { percentage } = await c.req.json()
  
  await logAction(c.env, 'ROLLOUT_CHANGE', { percentage })
  
  await c.env.DB.prepare(`
    INSERT INTO autopilot_config (v8_enabled, rollout_percentage, created_at)
    VALUES (true, ?, datetime('now'))
  `).bind(percentage).run()
  
  return c.json({ success: true })
})

// Disable autopilot (with audit log)
app.post('/api/hbs/autopilot/flags/disable', async (c) => {
  await logAction(c.env, 'AUTOPILOT_DISABLED', {})
  
  await c.env.DB.prepare(`
    INSERT INTO autopilot_config (v8_enabled, rollout_percentage, created_at)
    VALUES (false, 0, datetime('now'))
  `).run()
  
  return c.json({ success: true })
})

// Emergency stop (with audit log)
app.post('/api/hbs/autopilot/emergency-stop', async (c) => {
  await logAction(c.env, 'EMERGENCY_STOP', {})
  
  await c.env.DB.prepare(`
    INSERT INTO autopilot_config (v8_enabled, rollout_percentage, created_at)
    VALUES (false, 0, datetime('now'))
  `).run()
  
  return c.json({ success: true, message: 'Emergency stop activated' })
})

// Get audit logs
app.get('/api/hbs/autopilot/audit-logs', async (c) => {
  const list = await c.env.AUDIT_LOG.list()
  const logs = []
  
  for (const key of list.keys) {
    const value = await c.env.AUDIT_LOG.get(key.name)
    if (value) logs.push(JSON.parse(value))
  }
  
  return c.json({ logs: logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)) })
})

export default app
