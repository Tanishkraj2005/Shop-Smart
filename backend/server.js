require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initDb } = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Initialize database then load routes and listen
initDb().then(() => {
  // ─── Routes (only loaded after database is ready) ───────────────────────────
  app.use('/api/auth',    require('./routes/auth'))
  app.use('/api/orders',  require('./routes/orders'))
  app.use('/api/reviews', require('./routes/reviews'))
  app.use('/api/admin',   require('./routes/admin'))

  // ─── Health Check ─────────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // ─── 404 ─────────────────────────────────────────────────────────────────────
  app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))

  // ─── Global Error Handler ─────────────────────────────────────────────────────
  app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal server error.' })
  })

  app.listen(PORT, () => {
    console.log(`\n🚀 ShopSmart API running at http://localhost:${PORT}`)
    console.log(`   Health: http://localhost:${PORT}/api/health\n`)
  })
}).catch(err => {
  console.error('❌ Failed to initialize database:', err)
  process.exit(1)
})
