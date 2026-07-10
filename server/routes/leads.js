import { Router } from 'express'
import Lead from '../models/Lead.js'
import { sendAdminNotification } from '../services/mailService.js'

const router = Router()

const PHONE_RE = /^[+\d][\d\s-]{7,14}$/

const VALID_SOURCES = [
  'quote_modal', 'contact_form', 'navbar_cta',
  'product_detail', 'product_card', 'bulk_pricing',
  'mobile_sticky_bar', 'hero_carousel', 'home_cta_band',
  'products_cta_band', 'cta_band', 'bottom_nav',
  'search_page_cta', 'seo_landing'
]

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
      source: VALID_SOURCES.includes(source) ? source : 'contact_form',
      product: product ? String(product).slice(0, 200) : '',
      productLink: req.body.productLink ? String(req.body.productLink).slice(0, 500) : '',
      productImage: req.body.productImage ? String(req.body.productImage).slice(0, 500) : '',
      quantity: quantity ? String(quantity).slice(0, 50) : '',
      message: message ? String(message).slice(0, 1000) : '',
    })

    // Fire and forget notification
    sendAdminNotification(lead).catch(console.error)

    res.status(201).set('Location', `/api/leads/${lead._id}`).json({ ok: true, id: lead._id })
  } catch (err) {
    next(err)
  }
})

export default router
