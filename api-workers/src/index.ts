import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('/*', cors())

app.get('/api/hbs/autopilot/status', (c) => {
  return c.json({
    v8Enabled: true,
    rolloutPercentage: 45,
    last24Hours: { total: 847, v7: 382, v8: 465 },
    avgSimilarity: 0.89,
    comparisons: 847
  })
})

export default app
