import { Router } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import Lead from '../models/Lead.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import { requireAdmin, JWT_SECRET } from '../middleware/auth.js'
import cloudinary, { cloudinaryEnabled } from '../config/cloudinary.js'

const router = Router()

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'dsk@2025'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)
    cb(ok ? null : new Error('Only JPEG, PNG, WebP and GIF images are allowed'), ok)
  },
})

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '24h' })
    return res.json({ token })
  }
  res.status(401).json({ error: 'Invalid username or password' })
})

// Everything below requires admin JWT
router.use(requireAdmin)

// POST /api/admin/upload — Cloudinary image upload
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' })
    if (!cloudinaryEnabled) {
      // Fallback: return a data URL so admin can still preview/save in dev
      const b64 = req.file.buffer.toString('base64')
      return res.json({ url: `data:${req.file.mimetype};base64,${b64}`, provider: 'inline' })
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'dskprinters',
          transformation: [{ width: 800, height: 800, crop: 'limit' }, { quality: 'auto' }],
        },
        (err, out) => (err ? reject(err) : resolve(out))
      )
      stream.end(req.file.buffer)
    })
    res.json({ url: result.secure_url, publicId: result.public_id, provider: 'cloudinary' })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const [totalLeads, todayLeads, newLeads, products, categories] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: startOfDay } }),
      Lead.countDocuments({ status: 'new' }),
      Product.countDocuments(),
      Category.countDocuments(),
    ])
    res.json({ totalLeads, todayLeads, newLeads, products, categories })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/leads?status=all&page=1
router.get('/leads', async (req, res, next) => {
  try {
    const status = req.query.status || 'all'
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = 50
    const filter = status !== 'all' ? { status } : {}
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ])
    res.json({ leads, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/leads/export?status=all — CSV with BOM
router.get('/leads/export', async (req, res, next) => {
  try {
    const status = req.query.status || 'all'
    const filter = status !== 'all' ? { status } : {}
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean()
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const header = ['Name', 'Phone', 'Email', 'Product', 'Quantity', 'Message', 'Source', 'Status', 'Notes', 'Date']
    const rows = leads.map((l) =>
      [l.name, l.phone, l.email, l.product, l.quantity, l.message, l.source, l.status, l.notes, new Date(l.createdAt).toLocaleString('en-IN')].map(esc).join(',')
    )
    const csv = '\uFEFF' + header.map(esc).join(',') + '\n' + rows.join('\n')
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="dsk-leads-${Date.now()}.csv"`)
    res.send(csv)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/leads/:id
router.patch('/leads/:id', async (req, res, next) => {
  try {
    const { status, notes } = req.body || {}
    const update = {}
    if (status && ['new', 'contacted', 'quoted', 'converted', 'lost'].includes(status)) update.status = status
    if (typeof notes === 'string') update.notes = notes.slice(0, 2000)
    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    res.json(lead)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/leads/:id
router.delete('/leads/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// --- Products CRUD ---

router.post('/products', async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
})

router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    // Delete Cloudinary image if applicable
    if (cloudinaryEnabled && product.image && product.image.includes('res.cloudinary.com')) {
      try {
        const match = product.image.match(/dskprinters\/[^./]+/)
        if (match) await cloudinary.uploader.destroy(match[0])
      } catch {}
    }
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// --- Categories CRUD ---

router.post('/categories', async (req, res, next) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
})

router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json(category)
  } catch (err) {
    next(err)
  }
})

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
