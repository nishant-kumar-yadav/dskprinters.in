import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import { mongoSanitize } from './middleware/sanitize.js'
import productRoutes from './routes/products.js'
import leadRoutes from './routes/leads.js'
import adminRoutes from './routes/admin.js'
import { seedDatabase } from './seedData.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(
  cors({
    origin: [
      'https://dskprinters.in',
      'https://www.dskprinters.in',
      /\.vercel\.app$/,
      /\.vusercontent\.net$/,
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(mongoSanitize)

// Rate limiters
const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true })

app.get('/', (req, res) => res.json({ status: 'DSK Printers API running', version: '1.0.0' }))

app.use('/api/products', productRoutes)
app.use('/api/leads', leadLimiter, leadRoutes)
app.use('/api/admin/login', loginLimiter)
app.use('/api/admin', adminRoutes)

// 404 handler for API
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error('[server] error:', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

async function connectDB() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('[server] Connected to MongoDB (MONGO_URI)')
    return
  }
  // Development / preview fallback: in-memory MongoDB with auto-seed
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const mem = await MongoMemoryServer.create()
  await mongoose.connect(mem.getUri('dskprinters'))
  console.log('[server] Connected to in-memory MongoDB (no MONGO_URI set)')
  await seedDatabase()
  console.log('[server] Seeded in-memory database')
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] DSK Printers API listening on port ${PORT}`)
      // Keep-alive self-ping for Render free tier
      const SELF_URL = process.env.RENDER_EXTERNAL_URL
      if (SELF_URL) {
        setInterval(async () => {
          try {
            await fetch(`${SELF_URL}/`)
          } catch {}
        }, 14 * 60 * 1000)
      }
    })
  })
  .catch((err) => {
    console.error('[server] Failed to start:', err)
    process.exit(1)
  })
