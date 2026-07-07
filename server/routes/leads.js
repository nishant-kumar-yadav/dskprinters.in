import { Router } from 'express'
import Lead from '../models/Lead.js'

const router = Router()

const PHONE_RE = /^[+\d][\d\s-]{7,14}$/

// POST /api/leads — submit new lead
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, source, product, quantity, message, website } = req.body || {}

    // Honeypot: real users never fill the hidden "website" field
    if (website) return res.json({ ok: true })

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }
    if (!phone || !PHONE_RE.test(String(phone).trim())) {
      return res.status(400).json({ error: 'A valid phone number is required' })
    }

    // Duplicate check: same phone + product in last 10 minutes
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000)
    const dup = await Lead.findOne({
      phone: String(phone).trim(),
      product: product || '',
      createdAt: { $gte: tenMinAgo },
    })
    if (dup) {
      return res.json({ ok: true, message: 'We already received your request. We will contact you shortly.' })
    }

    const lead = await Lead.create({
      name: String(name).trim().slice(0, 100),
      phone: String(phone).trim().slice(0, 15),
      email: email ? String(email).trim().slice(0, 100) : '',
      source: ['quote_modal', 'contact_form', 'navbar_cta'].includes(source) ? source : 'contact_form',
      product: product ? String(product).slice(0, 200) : '',
      quantity: quantity ? String(quantity).slice(0, 50) : '',
      message: message ? String(message).slice(0, 1000) : '',
    })

    res.status(201).json({ ok: true, id: lead._id })
  } catch (err) {
    next(err)
  }
})

export default router
