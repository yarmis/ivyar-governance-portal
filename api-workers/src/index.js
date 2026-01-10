import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors({
  origin: ['https://ivyar.org', 'http://localhost:3000'],
  credentials: true
}))

// Auth middleware
app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token || token !== c.env.API_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})

// Get status
app.get('/api/hbs/autopilot/status', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM autopilot_config ORDER BY created_at DESC LIMIT 1'
  ).first()
  
  return c.json(result || {
    v8Enabled: false,
    rolloutPercentage: 0,
    last24Hours: { total: 0, v7: 0, v8: 0 },
    avgSimilarity: 0,
    comparisons: 0
  })
})

// Enable rollout
app.post('/api/hbs/autopilot/flags/enable', async (c) => {
  const { percentage } = await c.req.json()
  await c.env.DB.prepare(
    'INSERT INTO autopilot_config (v8_enabled, rollout_percentage) VALUES (true, ?)'
  ).bind(percentage).run()
  return c.json({ success: true })
})

// Disable
app.post('/api/hbs/autopilot/flags/disable', async (c) => {
  await c.env.DB.prepare(
    'INSERT INTO autopilot_config (v8_enabled, rollout_percentage) VALUES (false, 0)'
  ).run()
  return c.json({ success: true })
})

export default app
